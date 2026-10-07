/* ============================================================================
   POSTURALIA · protege.js — Marca de agua y disuasión de copia en el material
   (como protect.js de Paideia, 15 sep 2026)

   Honestidad técnica, igual que Paideia: en la web NO se puede impedir una
   captura de pantalla (sistema operativo, cámara, extensiones) ni esconder
   el código que el navegador descarga. Esto DISUADE y RASTREA:
     · marca de agua con el correo del candidato y la fecha y hora — si
       alguien filtra una captura, se sabe de quién salió;
     · bloquea seleccionar, copiar, arrastrar y el clic derecho fuera de los
       campos donde el candidato escribe;
     · bloquea los atajos de herramientas de desarrollador, ver código,
       guardar e imprimir, y la vista de impresión.

   Solo va en el MATERIAL (Biblioteca, Alineación, Práctica, Reforzamiento,
   Guion Maestro, Tutoriales). No va en las páginas donde el candidato
   imprime sus propios documentos: ahí la marca de agua saldría encima de
   los formatos oficiales.

   Se activa con sesión iniciada. No se activa para el equipo (admin o
   evaluadora, que usan «Ver como candidato») ni en el espejo del
   evaluador. ?protect=1 en la dirección lo fuerza para probar.

   Uso: <script type="module" src="js/protege.js"></script>
        Con data-imprimir en esa etiqueta se permite imprimir (Guion Maestro).
   Dentro de un visor (iframe) no pinta otra marca: ya la pinta la página que
   lo contiene. Los bloqueos sí aplican adentro.
   ========================================================================== */

import { CONFIG } from './config.js';
import { sesion } from './cuenta.js';
import { esAdmin, enEspejo } from './sesion.js';

const MARCA = CONFIG.marca?.nombre || 'POSTURALIA';
const AVISO = `Contenido protegido · ${MARCA}`;

/* ── Piezas puras (se prueban solas) ─────────────────────────────────── */

export function escXml(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* force (?protect=1) solo puede encender, nunca apagar. */
export function debeActivar({ haySesion, equipo, espejo, forzar } = {}) {
  if (!haySesion) return false;
  if (forzar) return true;
  if (equipo || espejo) return false;
  return true;
}

export function fechaTexto(d = new Date()) {
  const p = n => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/* Mosaico SVG rotado con «correo · fecha hora». */
export function marcaSvg(correo, fecha, color = '#0f1428') {
  const texto = `${escXml(correo)} · ${escXml(fecha)}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="260">` +
    `<text x="10" y="150" font-family="Helvetica,Arial,sans-serif" font-size="15" font-weight="700" fill="${color}" ` +
    `transform="rotate(-28 210 130)">${texto}</text></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

/* Herramientas de desarrollador, ver código, guardar, imprimir. */
export function teclaBloqueada(ev, permitirImprimir) {
  const k = (ev.key || '').toLowerCase();
  const mod = ev.ctrlKey || ev.metaKey;
  if (k === 'f12' || k === 'printscreen') return true;
  if (mod && ev.shiftKey && ['i', 'j', 'c', 'k'].includes(k)) return true;
  if (mod && (k === 'u' || k === 's')) return true;
  if (mod && k === 'p' && !permitirImprimir) return true;
  return false;
}

/* ── En la página ────────────────────────────────────────────────────── */

const CSS = `
body.pt-activo, body.pt-activo * { -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; }
body.pt-activo input, body.pt-activo textarea, body.pt-activo select, body.pt-activo [contenteditable="true"] { -webkit-user-select: text; user-select: text; }
body.pt-activo img, body.pt-activo canvas, body.pt-activo video { -webkit-user-drag: none; }
#ptMarca { position: fixed; inset: 0; z-index: 2147483000; pointer-events: none; opacity: .10; background-repeat: repeat; background-size: 420px 260px; }
html[data-tema="oscuro"] #ptMarca, html[data-theme="dark"] #ptMarca { opacity: .13; }
#ptAviso { position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%); z-index: 2147483001; background: #0f1428; color: #fff; padding: 10px 16px; border-radius: 10px; font: 700 .82rem system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; opacity: 0; transition: opacity .2s; pointer-events: none; }
#ptAviso.si { opacity: 1; }`;
const CSS_SIN_IMPRIMIR = `
@media print { body.pt-activo > * { display: none !important; } body.pt-activo::after { content: "${AVISO} · No disponible para impresión"; display: block; padding: 40px; font: 700 18px sans-serif; } }`;

let reloj = null;
function avisar(msg = AVISO) {
  let t = document.getElementById('ptAviso');
  if (!t) { t = document.createElement('div'); t.id = 'ptAviso'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('si');
  clearTimeout(reloj);
  reloj = setTimeout(() => t.classList.remove('si'), 1800);
}

const oscuro = () => {
  const h = document.documentElement;
  return h.dataset.tema === 'oscuro' || h.dataset.theme === 'dark' || h.classList.contains('oscuro');
};

export function activar(correo, { permitirImprimir = false, conMarca = true } = {}) {
  if (document.body.classList.contains('pt-activo')) return;
  document.body.classList.add('pt-activo');
  const st = document.createElement('style');
  st.id = 'ptEstilo';
  st.textContent = CSS + (permitirImprimir ? '' : CSS_SIN_IMPRIMIR);
  document.head.appendChild(st);

  if (conMarca) {
    const capa = document.createElement('div');
    capa.id = 'ptMarca';
    capa.setAttribute('aria-hidden', 'true');
    const pintar = () => { capa.style.backgroundImage = `url("${marcaSvg(correo, fechaTexto(), oscuro() ? '#ffffff' : '#0f1428')}")`; };
    pintar();
    document.body.appendChild(capa);
    setInterval(pintar, 60000);
    new MutationObserver(pintar).observe(document.documentElement, { attributes: true, attributeFilter: ['data-tema', 'data-theme', 'class'] });
  }

  const esCampo = el => !!el?.closest?.('input, textarea, select, [contenteditable="true"]');
  ['copy', 'cut', 'dragstart', 'contextmenu'].forEach(tipo => document.addEventListener(tipo, ev => {
    if (esCampo(ev.target)) return;
    ev.preventDefault();
    avisar();
  }, true));
  document.addEventListener('keydown', ev => {
    if (!teclaBloqueada(ev, permitirImprimir)) return;
    ev.preventDefault();
    ev.stopPropagation();
    if ((ev.key || '').toLowerCase() === 'printscreen') navigator.clipboard?.writeText?.(`${AVISO} · ${correo}`).catch(() => {});
    avisar();
  }, true);
  if (!permitirImprimir) window.addEventListener('beforeprint', () => avisar('Este material no se puede imprimir'));
}

function arrancar() {
  const s = sesion();
  const forzar = /[?&]protect=1(&|$)/.test(location.search);
  const equipo = !!s && (esAdmin() || ['admin', 'evaluador'].includes(s.rol));
  if (!debeActivar({ haySesion: !!s, equipo, espejo: enEspejo(), forzar })) return;
  const etiqueta = document.querySelector('script[src*="protege.js"]');
  const permitirImprimir = !!etiqueta?.hasAttribute('data-imprimir');
  let enVisor = false;
  try { enVisor = window.top !== window.self; } catch { enVisor = true; }
  activar(s?.correo || 'sesión', { permitirImprimir, conMarca: !enVisor });
}

/* v50 · Las presentaciones completas (Biblioteca de 126 pantallas y Ruta de
   Alineación) se abren con el pago de la Alineación, como en Paideia. Este
   archivo es lo único de la plataforma que cargan, así que el candado vive
   aquí: abiertas solas por su dirección y sin pago, regresan a Alineación,
   donde está la caja de pago. Dentro de Reforzamiento (visor de un tema) y
   para el equipo o el espejo del evaluador, no aplica. */
async function candadoDelMaterial() {
  const pagina = location.pathname.split('/').pop();
  if (!/^(alineacion|biblioteca)-deck\.html$/.test(pagina)) return;
  let enVisor = false;
  try { enVisor = window.top !== window.self; } catch { enVisor = true; }
  if (enVisor || enEspejo()) return;
  const s = sesion();
  if (!s) { location.replace('alineacion.html'); return; }   // ahí pide entrar
  if (esAdmin() || ['admin', 'evaluador'].includes(s.rol)) return;
  const { faseAutorizada } = await import('./flow.js');
  if (!faseAutorizada('alineacion')) location.replace('alineacion.html');
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar); else arrancar();
  candadoDelMaterial().catch(() => {});
}
