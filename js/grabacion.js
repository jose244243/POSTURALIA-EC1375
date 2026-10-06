/* ============================================================================
   POSTURALIA · grabacion.js — Grabación de la sesión de Alineación

   Como el bloque «alineacion:video» de Paideia: el equipo pega el enlace de
   la grabación (Zoom con código de acceso, o YouTube, Vimeo o un mp4) y el
   candidato con la Alineación liberada la ve en su página de Alineación.
     · Zoom: botón que abre la grabación en pestaña nueva + código con
       «Copiar código» (las grabaciones de Zoom no se incrustan bien).
     · YouTube / Vimeo / mp4: reproductor dentro de la página.
   Con Supabase el enlace sale de mi_grabacion_alineacion() (solo a quien
   tiene la fase); en modo local, del almacén del Centro en este navegador.
   ========================================================================== */
import { CONFIG } from './config.js';
import { ligaSegura } from './seguro.js';

const CLAVE_EQUIPO = 'posturalia.evaluador.v1';
const enNube = () => !!(CONFIG.supabase?.url && CONFIG.supabase?.anonKey);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const PLATAFORMAS = [['zoom', 'Zoom (grabación en la nube, con código)'], ['youtube', 'YouTube (no listado)'], ['vimeo', 'Vimeo'], ['mp4', 'Archivo mp4 (enlace directo)'], ['otra', 'Otra página (se abre aparte)']];

/* Quién es: se deduce del enlace si no lo dicen */
export function plataformaDe(url, dicha = '') {
  if (dicha && PLATAFORMAS.some(([k]) => k === dicha)) return dicha;
  const u = String(url || '').toLowerCase();
  if (/zoom\.us\/rec\//.test(u) || /zoom\.us/.test(u)) return 'zoom';
  if (/youtu\.?be/.test(u)) return 'youtube';
  if (/vimeo\.com/.test(u)) return 'vimeo';
  if (/\.mp4($|\?)/.test(u)) return 'mp4';
  return 'otra';
}
/* Enlace para incrustar (solo YouTube y Vimeo; lo demás se abre aparte) */
export function enlaceIncrustable(url, plataforma) {
  const u = ligaSegura(url); if (!u) return '';
  if (plataforma === 'youtube') {
    const m = u.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/|\/live\/)([A-Za-z0-9_-]{11})/);
    return m ? `https://www.youtube-nocookie.com/embed/${m[1]}?rel=0` : '';
  }
  if (plataforma === 'vimeo') {
    const m = u.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([A-Za-z0-9]+))?/);
    return m ? `https://player.vimeo.com/video/${m[1]}${m[2] ? '?h=' + m[2] : ''}` : '';
  }
  return '';
}
/* Revisa lo que captura el equipo. Devuelve { ok, error, valor } */
export function validarGrabacion({ url = '', codigo = '', plataforma = '', titulo = '' } = {}) {
  const u = String(url || '').trim();
  if (!u) return { ok: true, valor: { url: '', codigo: '', plataforma: 'zoom', titulo: '' } };   // vaciarla
  if (!/^https:\/\//i.test(u) || !ligaSegura(u)) return { ok: false, error: 'El enlace debe empezar con https:// y no llevar espacios.' };
  const p = plataformaDe(u, plataforma);
  if (p === 'youtube' || p === 'vimeo') { if (!enlaceIncrustable(u, p)) return { ok: false, error: `No reconozco ese enlace de ${p === 'youtube' ? 'YouTube' : 'Vimeo'}. Copia el de «Compartir».` }; }
  if (p === 'zoom' && /zoom\.us\/(j|s)\//i.test(u)) return { ok: false, error: 'Ese es el enlace de una reunión, no de la grabación. En Zoom: Grabaciones → Compartir → copia el enlace.' };
  return { ok: true, valor: { url: u, codigo: String(codigo || '').trim().slice(0, 60), plataforma: p, titulo: String(titulo || '').trim().slice(0, 120) } };
}

/* ── Datos ───────────────────────────────────────────────────────────── */
const leerEquipo = () => { try { return JSON.parse(localStorage.getItem(CLAVE_EQUIPO)) || {}; } catch { return {}; } };
async function rpc(fn) {
  const { clienteNube } = await import('./nube.js');
  const { data, error } = await (await clienteNube()).rpc(fn);
  if (error) throw new Error(error.message || String(error));
  return data;
}
/* Para el candidato: null si no hay o si no tiene la fase */
export async function miGrabacion({ liberada = false } = {}) {
  if (enNube()) { try { return await rpc('mi_grabacion_alineacion'); } catch { return null; } }
  if (!liberada) return null;
  const g = leerEquipo().grabacionAlineacion;
  return g?.url ? g : null;
}
/* Para el equipo */
export async function grabacionEquipo() {
  if (enNube()) {
    const { clienteNube } = await import('./nube.js');
    const { data, error } = await (await clienteNube()).from('grabacion_alineacion').select('url,codigo,plataforma,titulo,updated_at').eq('id', 1).maybeSingle();
    if (error) return { error: 'Hay que correr la parte «Grabación de la sesión de Alineación» de supabase.sql (' + (error.message || error) + ')', valor: null };
    return { error: '', valor: data || null };
  }
  return { error: '', valor: leerEquipo().grabacionAlineacion || null };
}
export async function guardarGrabacion(entrada) {
  const r = validarGrabacion(entrada);
  if (!r.ok) throw new Error(r.error);
  const v = { ...r.valor, updated_at: new Date().toISOString() };
  if (enNube()) {
    const { clienteNube } = await import('./nube.js');
    const { error } = await (await clienteNube()).from('grabacion_alineacion').upsert({ id: 1, ...v, url: v.url || null });
    if (error) throw new Error(error.message || String(error));
    return v;
  }
  const d = leerEquipo();
  if (v.url) d.grabacionAlineacion = v; else delete d.grabacionAlineacion;
  localStorage.setItem(CLAVE_EQUIPO, JSON.stringify(d));
  return v;
}

/* ── Pintar (candidato) ──────────────────────────────────────────────── */
export function htmlGrabacion(g) {
  if (!g?.url || !ligaSegura(g.url)) return `<p style="color:var(--muted);font-size:.9rem;margin:0">La grabación de tu sesión estará disponible pronto. Te avisamos por WhatsApp en cuanto esté lista.</p>`;
  const p = plataformaDe(g.url, g.plataforma), url = ligaSegura(g.url);
  const titulo = g.titulo ? `<p style="font-weight:600;margin:0 0 10px">${esc(g.titulo)}</p>` : '';
  const codigo = g.codigo ? `<div class="gb-codigo"><span>Código de acceso: <code id="gbCodigo">${esc(g.codigo)}</code></span>
      <button type="button" class="btn-plat btn-plat--secundario" id="gbCopiar">Copiar código</button></div>` : '';
  const inc = enlaceIncrustable(url, p);
  if (inc) return titulo + `<div class="gb-video"><iframe src="${esc(inc)}" title="Grabación de la sesión de Alineación" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>${codigo}`;
  if (p === 'mp4') return titulo + `<video class="gb-mp4" controls preload="metadata" src="${esc(url)}"></video>`;
  return titulo + codigo + `<a class="btn-plat btn-plat--primario" id="gbAbrir" href="${esc(url)}" target="_blank" rel="noopener">▶ Ver la grabación${p === 'zoom' ? ' en Zoom' : ''}</a>
    <p style="color:var(--muted);font-size:.84rem;margin:8px 0 0">Se abre en una pestaña nueva.${g.codigo && p === 'zoom' ? ' Zoom te pide el código de acceso: pégalo y oprime «Ver grabación».' : ''}</p>`;
}
export const ESTILOS_GRABACION = `
  .gb-video { position:relative; padding-top:56.25%; border-radius:10px; overflow:hidden; background:#000; margin:0 0 12px }
  .gb-video iframe { position:absolute; inset:0; width:100%; height:100%; border:0 }
  .gb-mp4 { width:100%; max-height:420px; border-radius:10px; background:#000 }
  .gb-codigo { display:flex; flex-wrap:wrap; gap:10px; align-items:center; justify-content:space-between; background:var(--bg); border-radius:8px; padding:10px 12px; margin:0 0 12px }
  .gb-codigo code { font-size:1.05rem; font-weight:700; letter-spacing:.04em }`;
export function montarGrabacion(el, g) {
  el.innerHTML = htmlGrabacion(g);
  const b = el.querySelector('#gbCopiar');
  if (b) b.onclick = async () => {
    try { await navigator.clipboard.writeText(g.codigo); b.textContent = '✓ Copiado'; } catch { b.textContent = 'Cópialo a mano'; }
    setTimeout(() => { b.textContent = 'Copiar código'; }, 2500);
  };
}
