/* ============================================================================
   POSTURALIA · portafolio-avance.js — El portafolio, armándose paso a paso
   (v47)

   Fernando: «todo lo que se llene en el portafolio debería de ser el paso a
   paso de la información que la gente va cargando y se va guardando en un
   apartado, y al final se consolida y genera el portafolio… y que se pueda
   ver cómo se va almacenando la información».

   Este módulo dice, sección por sección y en el orden del FORMATO
   PORTAFOLIO-1375-2026, qué ya está guardado, de qué paso salió, cuándo, y
   qué falta y quién lo pone (el candidato o el Centro). Lo pintan «Mi
   portafolio» (candidato) y la tarjeta de Portafolio del Centro, con la
   misma lista: los dos ven lo mismo.
   ========================================================================== */
import { CONFIG } from './config.js';
import { esc } from './seguro.js';
import { cedulaPublicada, firmaValida, PUNTOS_VERIFICACION_N } from './evaluacion.js';

const paso = id => {
  if (id === 'cedula') return { nombre: 'Mi Cédula', archivo: 'cedula.html' };
  const m = [...CONFIG.flujo, ...(CONFIG.consulta || [])].find(x => x.id === id);
  return m ? { nombre: m.nombre, archivo: m.archivo } : null;
};
const fecha = f => {
  if (!f) return '';
  const d = new Date(f);
  return isNaN(d) ? String(f) : d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
};
const lista = v => (Array.isArray(v) ? v : v ? [v] : []).filter(a => a && typeof a === 'object');
const conArchivo = a => !!(a && (a.dato || (a.enAlmacen && a.clave)));
const archivos = v => lista(v).filter(a => !a.liga && !a.generado && !a.enLinea && !a.lleno && !a.firmado);

/* expediente: el de leerRespaldo (candidato) o el del panel (Centro).
   ev: la evaluación del Centro (o lo que el candidato puede ver de ella). */
export function estadoPortafolio(x = {}, ev = {}) {
  const d = m => x?.estado?.[m]?.datos || {};
  const docs = m => d(m).documentos || {};
  const cand = x?.candidato || {};
  const auto = d('autodiagnostico'), plan = d('plan'), enc = d('encuesta'), evid = docs('evidencias'), sesDocs = docs('documentos');
  const items = [];
  const add = (grupo, titulo, estado, { detalle = '', de = null, quien = 'tú' } = {}) =>
    items.push({ grupo, titulo, estado, detalle, paso: de ? paso(de) : null, quien });
  const doc = (v, nombre) => {
    const fs = archivos(v), ok = fs.filter(conArchivo);
    if (!ok.length) return null;
    const pags = ok.reduce((n, a) => n + (a.paginas || 1), 0);
    return `${ok.length > 1 ? ok.length + ' archivos' : (ok[0].nombre || nombre)}${ok.some(a => a.paginas) ? ` · ${pags} pág.` : ''} · ${fecha(ok[ok.length - 1].fecha)}${ok.some(a => a.revision?.nivel === 'aviso') ? ' · ⚠ revisar' : ''}`;
  };

  const G1 = '1. Datos del candidato', G2 = '2. Recopilación de evidencias', G3 = '3. Cierre de la evaluación', G4 = '4. Anexos';
  /* 1 */
  const foto = lista(cand.documentos?.fotoRegistro).some(conArchivo);
  const fichaOk = !!(cand.nombre && cand.curp && foto);
  add(G1, 'Ficha de Registro (SII / RENAP)', fichaOk ? 'listo' : 'falta',
    { de: 'autodiagnostico', detalle: fichaOk ? `${cand.nombre} · ${cand.curp}` : `Falta: ${[!cand.nombre && 'nombre', !cand.curp && 'CURP', !foto && 'foto'].filter(Boolean).join(', ')}` });
  const curp = doc(evid.curp, 'CURP');
  add(G1, 'CURP', curp ? 'listo' : 'falta', { de: 'evidencias', detalle: curp || 'Sube el PDF de gob.mx o una foto' });
  const ine = doc(evid.ine, 'INE');
  add(G1, 'INE (frente y reverso)', ine ? 'listo' : 'falta', { de: 'evidencias', detalle: ine || 'Sube el frente y el reverso' });
  const nAuto = Object.keys(auto.respuestas || auto.answers || {}).length;
  add(G1, 'Autodiagnóstico (formato CONOCER)', auto.completado ? 'listo' : 'falta',
    { de: 'autodiagnostico', detalle: auto.completado ? `Contestado${auto.porcentaje != null ? ` · ${Math.round(auto.porcentaje)}%` : ''}` : nAuto ? `${nAuto} de 142 reactivos` : 'Sin contestar' });
  add(G1, 'Tríptico de Derechos y Obligaciones', auto.triptico?.firma ? 'listo' : 'falta',
    { de: 'autodiagnostico', detalle: auto.triptico?.firma ? `Firmado · ${fecha(auto.triptico.fecha)}` : 'Falta tu firma de recibido' });

  /* 2 */
  const acuse = plan.documentos?.acusePlanEvaluacion;
  add(G2, 'Plan de Evaluación', acuse ? (firmaValida(ev.firmas?.plan) ? 'listo' : 'centro') : 'falta',
    { de: 'plan', detalle: acuse ? (firmaValida(ev.firmas?.plan) ? 'Acordado y firmado por los dos' : 'Tú ya firmaste · falta la firma del Centro') : 'Falta acordarlo y firmar el acuse' });
  add(G2, 'Instrumento de Evaluación (IEC)', ev.iec?.completo ? 'listo' : 'centro',
    { quien: 'Centro', detalle: ev.iec?.completo ? 'Calificado por tu evaluador(a)' : 'Lo califica tu evaluador(a) con tu grabación' });
  const sesion = !!d('documentos').sesionGenerada;
  const PROD = [['ficha', 'DOC 1'], ['consentimiento', 'DOC 2'], ['plan_sesion', 'DOC 3'], ['plan_seguimiento', 'DOC 4'], ['encuesta_usuario', 'DOC 5']];
  const prodOk = PROD.filter(([k]) => sesDocs[k] || archivos(sesDocs[`firmado_${k}`]).some(conArchivo));
  const firmados = PROD.filter(([k]) => archivos(sesDocs[`firmado_${k}`]).some(conArchivo)).map(([, n]) => n);
  add(G2, 'Productos DOC 1–5', prodOk.length === 5 ? 'listo' : 'falta',
    { de: 'documentos', detalle: `${prodOk.length} de 5${sesion ? ' · llenos en línea' : ''}${firmados.length ? ` · firmados: ${firmados.join(', ')}` : ''}${prodOk.length < 5 ? ` · faltan ${PROD.filter(p => !prodOk.includes(p)).map(p => p[1]).join(', ')}` : ''}` });
  const video = lista(evid.video)[0]?.liga || (typeof evid.video === 'string' ? evid.video : '') || ev.video?.liga;
  add(G2, 'Liga de la grabación de tu sesión', video ? 'listo' : 'falta', { de: 'evidencias', detalle: video ? 'Guardada' : 'Pega la liga de tu video' });

  /* 3 */
  const ced = cedulaPublicada(ev);
  add(G3, 'Cédula de Evaluación', ced ? (firmaValida(ev.firma_candidato) ? 'listo' : 'falta') : 'centro',
    { quien: ced ? 'tú' : 'Centro', de: ced ? 'cedula' : null, detalle: ced ? (firmaValida(ev.firma_candidato) ? `${ced.juicio || ''} · firmada` : 'Publicada · falta tu firma') : 'La publica tu evaluador(a) al calificar' });
  add(G3, 'Encuesta de Satisfacción', enc.completado ? 'listo' : 'falta', { de: 'encuesta', detalle: enc.completado ? `Contestada · ${fecha(enc.fecha)}` : 'Sin contestar' });
  const v = ev.verificacion || {}, nv = PUNTOS_VERIFICACION_N.filter(n => v[n] === 'si' || v[n] === 'no').length;
  add(G3, 'Verificación Interna', nv === PUNTOS_VERIFICACION_N.length ? 'listo' : 'centro', { quien: 'Centro', detalle: nv ? `${nv} de 14 puntos` : 'La llena el Centro antes de enviar' });
  add(G3, 'Cédula de Evaluación del Servicio', enc.servicio?.medio ? 'listo' : 'falta', { de: 'encuesta', detalle: enc.servicio?.medio ? 'Contestada' : 'Va en tu Encuesta' });
  add(G3, 'Formato de Atención a Usuarios', enc.atencion?.medio ? 'listo' : 'falta', { de: 'encuesta', detalle: enc.atencion?.medio ? 'Contestado' : 'Va en tu Encuesta' });

  /* 4 */
  const acuses = [auto.triptico?.firma && 'tríptico', acuse && 'plan', firmaValida(ev.firma_candidato) && 'cédula'].filter(Boolean);
  add(G4, 'Acuses de recibido (tríptico, plan y cédula)', acuses.length === 3 ? 'listo' : 'falta', { detalle: `${acuses.length} de 3${acuses.length ? ': ' + acuses.join(', ') : ''}` });
  const firmaCand = !!(x?.firma?.dato || x?.firma?.dataUrl);
  add(G4, 'Autorización de firma electrónica', firmaCand ? 'listo' : 'falta', { de: 'evidencias', detalle: firmaCand ? 'Con tu firma guardada' : 'Falta guardar tu firma' });
  const fd = doc(evid.fotoDiploma, 'Foto');
  add(G4, 'Foto para el diploma', fd ? 'listo' : 'falta', { de: 'evidencias', detalle: fd || 'De frente, fondo blanco' });
  const certs = [...archivos(evid.certificados), ...Object.entries(cand.documentos || {}).filter(([k]) => k.startsWith('cert_')).flatMap(([, a]) => archivos(a))].filter(conArchivo);
  add(G4, 'Certificados / diplomas de formación', certs.length ? 'listo' : 'opcional', { de: 'evidencias', detalle: certs.length ? `${certs.length} archivo${certs.length > 1 ? 's' : ''}` : 'Opcional' });

  const cuentan = items.filter(i => i.estado !== 'opcional');
  return { items, listos: cuentan.filter(i => i.estado === 'listo').length, total: cuentan.length,
    tuyos: cuentan.filter(i => i.estado === 'falta').length, delCentro: cuentan.filter(i => i.estado === 'centro').length };
}

const ICONO = { listo: '✓', falta: '○', centro: '⏳', opcional: '·' };
const ETIQ = { listo: 'Guardado', falta: 'Falta', centro: 'Lo pone el Centro', opcional: 'Opcional' };

/* La lista, agrupada como el índice oficial. `enlaces`: liga al paso de
   donde sale cada sección (vista del candidato). */
export function htmlAvance(r, { enlaces = true } = {}) {
  const grupos = [...new Set(r.items.map(i => i.grupo))];
  const pct = r.total ? Math.round((r.listos / r.total) * 100) : 0;
  return `<div class="pfa">
    <div class="pfa-res"><div class="pfa-barra"><span style="width:${pct}%"></span></div>
      <p><b>${r.listos} de ${r.total}</b> secciones guardadas · ${pct}%${r.tuyos ? ` · <span class="pfa-tu">${r.tuyos} por llenar</span>` : ''}${r.delCentro ? ` · ${r.delCentro} del Centro` : ''}</p></div>
    ${grupos.map(g => `<h3 class="pfa-g">${esc(g)}</h3><ul class="pfa-l">${r.items.filter(i => i.grupo === g).map(i => `
      <li class="pfa-i pfa-${i.estado}" data-seccion="${esc(i.titulo)}">
        <span class="pfa-ico" aria-hidden="true">${ICONO[i.estado]}</span>
        <span class="pfa-t"><b>${esc(i.titulo)}</b><small>${esc(i.detalle)}</small></span>
        <span class="pfa-e">${ETIQ[i.estado]}${enlaces && i.estado === 'falta' && i.paso ? ` · <a href="${esc(i.paso.archivo)}">${esc(i.paso.nombre)} →</a>` : ''}</span>
      </li>`).join('')}</ul>`).join('')}
  </div>`;
}

export const CSS_AVANCE = `
.pfa-res p{margin:6px 0 0;font-size:.88rem;color:var(--muted,#64748b)}
.pfa-barra{height:10px;background:var(--border,#e2e8f0);border-radius:6px;overflow:hidden}
.pfa-barra span{display:block;height:100%;background:var(--spoke,#10b981)}
.pfa-g{font-size:.92rem;margin:16px 0 6px}
.pfa-l{list-style:none;margin:0;padding:0;display:grid;gap:6px}
.pfa-i{display:grid;grid-template-columns:28px 1fr auto;gap:10px;align-items:center;padding:8px 10px;border:1px solid var(--border,#e2e8f0);border-radius:10px;background:var(--white,#fff)}
.pfa-t b{display:block;font-size:.9rem}.pfa-t small{color:var(--muted,#64748b);font-size:.8rem}
.pfa-e{font-size:.78rem;font-weight:600;text-align:right}
.pfa-ico{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-weight:800;font-size:.85rem}
.pfa-listo .pfa-ico{background:#d1fae5;color:#047857}.pfa-listo .pfa-e{color:#047857}
.pfa-falta .pfa-ico{background:#fef3c7;color:#b45309}.pfa-falta .pfa-e{color:#b45309}
.pfa-centro .pfa-ico{background:#e0e7ff;color:#4338ca}.pfa-centro .pfa-e{color:#4338ca}
.pfa-opcional{opacity:.75}
.pfa-tu{color:#b45309;font-weight:700}
@media (max-width:560px){.pfa-i{grid-template-columns:24px 1fr}.pfa-e{grid-column:2;text-align:left}}
:root[data-tema="oscuro"] .pfa-i{background:#0f172a;border-color:#334155}
`;
