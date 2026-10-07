/* ============================================================================
   POSTURALIA · pagos.js — Cómo paga el candidato cada fase (como Paideia)

   En las pantallas de una fase que todavía no está pagada aparece la caja de
   pago de Paideia:
     ① elige cómo pagar · ② paga el monto completo · ③ manda tu comprobante
     · Mercado Pago: el «link de pago» de esa fase (se crea gratis en la app
       de Mercado Pago; no requiere servidor).
     · Transferencia: banco, titular, cuenta y CLABE, con «Copiar CLABE» y
       «Enviar comprobante por WhatsApp».
   El Centro confirma el pago y libera la fase en Precios y pagos.

   Los datos los captura el equipo en Precios y pagos → «Datos de pago»; no
   viven en el código. Con Supabase salen de la tabla config_pagos (la leen
   los candidatos con sesión; la escribe solo el equipo).
   ========================================================================== */
import { CONFIG } from './config.js';

const CLAVE_EQUIPO = 'posturalia.evaluador.v1';
const enNube = () => !!(CONFIG.supabase?.url && CONFIG.supabase?.anonKey);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const FASES_PAGO = CONFIG.fases.filter(f => f.id !== 'registro').map(f => f.id);
const etiquetaFase = f => (CONFIG.fases.find(x => x.id === f) || {}).label || f;
export const QUE_INCLUYE = {
  alineacion: 'Con el pago de Alineación se abre tu sesión con instructor y su grabación.',
  evaluacion: 'Con el pago de Evaluación se abre tu Plan de Evaluación y tu sesión de evidencias.',
  entrega: 'Con el pago de Entrega procesamos tu certificado ante la SEP (duración aproximada de 90 días) y te lo hacemos llegar.',
};

/* ── Validación ──────────────────────────────────────────────────────── */
/* CLABE: 18 dígitos; el último es dígito verificador (pesos 3,7,1) */
export function clabeValida(c) {
  const d = String(c || '').replace(/\s/g, '');
  if (!/^\d{18}$/.test(d)) return false;
  const pesos = [3, 7, 1];
  const suma = [...d.slice(0, 17)].reduce((s, x, i) => s + (Number(x) * pesos[i % 3]) % 10, 0);
  return (10 - (suma % 10)) % 10 === Number(d[17]);
}
const RE_MP = /^https:\/\/([a-z0-9-]+\.)*(mercadopago\.com(\.mx)?|mpago\.la|mpago\.li)\//i;
export function validarDatosPago(v = {}) {
  const errores = [];
  const clabe = String(v.clabe || '').replace(/\s/g, '');
  if (clabe && !clabeValida(clabe)) errores.push('La CLABE no es válida: son 18 dígitos y el último es de verificación. Cópiala tal cual de tu banca.');
  if (clabe && !String(v.titular || '').trim()) errores.push('Falta el titular de la cuenta.');
  const links = {};
  FASES_PAGO.forEach(f => {
    const u = String(v.links?.[f] || '').trim();
    if (!u) return;
    if (!RE_MP.test(u)) errores.push(`El link de ${etiquetaFase(f)} no parece de Mercado Pago (debe empezar con https://mpago.la/ o https://link.mercadopago.com.mx/…).`);
    else links[f] = u;
  });
  const montos = {};
  FASES_PAGO.forEach(f => { const n = Math.round(Number(String(v.montos?.[f] ?? '').replace(/[$,\s]/g, ''))); if (n > 0) montos[f] = n; });
  return { ok: !errores.length, errores, valor: { banco: String(v.banco || '').trim(), titular: String(v.titular || '').trim(), cuenta: String(v.cuenta || '').replace(/\s/g, ''),
    clabe, links, montos, nota: String(v.nota || '').trim().slice(0, 300) } };
}

/* ── Datos ───────────────────────────────────────────────────────────── */
const leerEquipo = () => { try { return JSON.parse(localStorage.getItem(CLAVE_EQUIPO)) || {}; } catch { return {}; } };
export async function datosPago() {
  let cfg = null;
  if (enNube()) {
    try { const { clienteNube } = await import('./nube.js'); const { data } = await (await clienteNube()).from('config_pagos').select('*').eq('id', 1).maybeSingle(); if (data) cfg = data; } catch {}
  }
  cfg = cfg || leerEquipo().pagosConfig || null;
  return conRespaldo(cfg);
}
/* Sin cuenta capturada en «Datos de pago», la de respaldo (config.js): así
   nunca queda una fase cerrada sin decirle al candidato cómo pagarla. */
export function conRespaldo(cfg) {
  const r = CONFIG.pagosRespaldo || {};
  if (cfg?.clabe || cfg?.cuenta || !(r.clabe || r.cuenta)) return cfg;
  return { ...(cfg || {}), banco: r.banco || '', titular: r.titular || '', cuenta: r.cuenta || '', clabe: r.clabe || '' };
}
export async function guardarDatosPago(entrada) {
  const r = validarDatosPago(entrada);
  if (!r.ok) throw new Error(r.errores.join(' '));
  if (enNube()) {
    const { clienteNube } = await import('./nube.js');
    const { error } = await (await clienteNube()).from('config_pagos').upsert({ id: 1, ...r.valor, updated_at: new Date().toISOString() });
    if (error) throw new Error('Hay que correr la parte «Datos de pago» de supabase.sql (' + (error.message || error) + ')');
    return r.valor;
  }
  const d = leerEquipo(); d.pagosConfig = { ...r.valor, updated_at: new Date().toISOString() };
  localStorage.setItem(CLAVE_EQUIPO, JSON.stringify(d));
  return r.valor;
}
/* Monto de ESTE candidato: el acordado con él (Precios y pagos) o el base */
export function montoPara(correo, fase, cfg) {
  const pr = (leerEquipo().precio || {})[String(correo || '').toLowerCase()];
  const n = Number(pr?.['monto_' + fase]);
  return n > 0 ? n : (Number(cfg?.montos?.[fase]) > 0 ? Number(cfg.montos[fase]) : null);
}

/* ── Caja de pago ────────────────────────────────────────────────────── */
export const pesos = n => '$' + Number(n).toLocaleString('es-MX') + ' MXN';
export function htmlPago(fase, cfg, { monto = null, nombre = '' } = {}) {
  const f = etiquetaFase(fase), link = cfg?.links?.[fase], hayTrans = !!(cfg?.clabe || cfg?.cuenta);
  const wa = CONFIG.marca?.whatsapp || '';
  const msj = encodeURIComponent(`Hola, ya hice mi pago${monto ? ' de ' + pesos(monto) : ''} de ${f} EC1375.${nombre ? '\nNombre: ' + nombre : ''}\nAquí está mi comprobante:`);
  return `<div class="pg-caja" data-pago="${esc(fase)}">
    <div class="pg-t"><b>Pagar ${esc(f)}</b>${monto ? `<span class="pg-monto">${pesos(monto)}</span>` : ''}</div>
    <p class="pg-p">${esc(QUE_INCLUYE[fase] || '')}</p>
    <ol class="pg-pasos"><li><b>Elige cómo pagar:</b> ${link ? 'Mercado Pago o ' : ''}transferencia bancaria.</li><li><b>Paga el monto completo</b>${monto ? ' (' + pesos(monto) + ')' : ''}.</li>
      <li><b>Manda tu comprobante</b> por WhatsApp: el Centro confirma tu pago y habilita tu fase.</li></ol>
    ${link ? `<a class="btn-plat btn-plat--primario pg-mp" href="${esc(link)}" target="_blank" rel="noopener">Pagar con Mercado Pago</a>` : ''}
    ${hayTrans ? `<div class="pg-trans"><div class="pg-st">Transferencia bancaria</div>
      ${cfg.banco ? `<div><span>Banco</span><b>${esc(cfg.banco)}</b></div>` : ''}${cfg.titular ? `<div><span>Titular</span><b>${esc(cfg.titular)}</b></div>` : ''}
      ${cfg.cuenta ? `<div><span>Cuenta</span><b>${esc(cfg.cuenta)}</b></div>` : ''}${cfg.clabe ? `<div><span>CLABE</span><b class="pg-clabe">${esc(cfg.clabe)}</b></div>` : ''}
      ${cfg.clabe ? '<button type="button" class="btn-plat btn-plat--secundario pg-copiar">Copiar CLABE</button>' : ''}</div>` : ''}
    ${!link && !hayTrans ? '<p class="pg-p">Tu Centro Evaluador te comparte los datos de pago por WhatsApp.</p>' : ''}
    ${cfg?.nota ? `<p class="pg-p" style="font-size:.84rem">${esc(cfg.nota)}</p>` : ''}
    ${wa ? `<a class="btn-plat pg-wa" href="https://wa.me/${esc(wa)}?text=${msj}" target="_blank" rel="noopener">Enviar comprobante por WhatsApp</a>
      <p class="pg-p" style="font-size:.78rem;margin-top:6px"><b>Importante:</b> sin comprobante no podemos confirmar tu pago. Se abre WhatsApp: ahí adjunta la foto o el PDF.</p>` : ''}
  </div>`;
}
export const ESTILOS_PAGO = `
  .pg-caja { border:1px solid var(--border); border-left:4px solid #D97706; border-radius:12px; padding:16px 18px; background:var(--white); margin:0 0 16px }
  .pg-t { display:flex; justify-content:space-between; align-items:baseline; gap:10px; flex-wrap:wrap; font-size:1.05rem } .pg-monto { font-size:1.35rem; font-weight:800; color:var(--spoke-deep) }
  .pg-p { color:var(--mid); font-size:.9rem; line-height:1.6; margin:6px 0 }
  .pg-pasos { margin:8px 0 12px; padding-left:20px; font-size:.88rem; line-height:1.7; color:var(--dark) }
  .pg-mp { display:inline-block; margin:0 0 10px }
  .pg-trans { background:var(--bg); border-radius:10px; padding:12px 14px; margin:4px 0 10px; font-size:.9rem }
  .pg-trans > div { display:flex; justify-content:space-between; gap:10px; padding:3px 0 } .pg-trans span { color:var(--muted) } .pg-trans b { text-align:right; word-break:break-all }
  .pg-st { font-weight:700; margin-bottom:4px } .pg-copiar { margin-top:8px }
  .pg-wa { background:#25D366 !important; color:#fff !important; border-color:#25D366 !important; display:inline-block }`;
export function montarPago(el, fase, cfg, opciones = {}) {
  if (!document.getElementById('pgEstilos')) { const st = document.createElement('style'); st.id = 'pgEstilos'; st.textContent = ESTILOS_PAGO; document.head.appendChild(st); }
  el.innerHTML = htmlPago(fase, cfg, opciones);
  const b = el.querySelector('.pg-copiar');
  if (b) b.onclick = async () => {
    try { await navigator.clipboard.writeText(cfg.clabe); b.textContent = '✓ CLABE copiada'; } catch { b.textContent = 'Cópiala a mano'; }
    setTimeout(() => { b.textContent = 'Copiar CLABE'; }, 2500);
  };
}
