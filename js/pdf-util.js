/* ============================================================================
   POSTURALIA · pdf-util.js — Leer los PDF que entregan los candidatos (v47)

   La CURP que baja de gob.mx es un PDF. El INE escaneado casi siempre es un
   PDF. Los certificados de formación, también. Hasta v46 la plataforma solo
   sabía guardar fotos: de un PDF se quedaba con el nombre y el peso, y el
   Centro armaba el portafolio con hojas que decían «pendiente».

   Con pdf.js (Mozilla, licencia Apache 2.0, servido desde nuestro propio
   sitio, sin CDN) la plataforma ahora:
     · abre el PDF y sabe si está dañado o protegido con contraseña,
     · cuenta sus páginas,
     · lee su texto (para comprobar que la CURP del documento es la del
       candidato),
     · y convierte cada página en imagen para que entre al portafolio
       integrado, en su lugar, como una hoja más.

   Se carga solo cuando hace falta (al subir un PDF o al armar el
   portafolio): pesa ~1.8 MB y nadie más lo necesita.
   ========================================================================== */

const BASE = new URL('./vendor/pdfjs/', import.meta.url).href;
let cargando = null;

export function pdfjs() {
  if (cargando) return cargando;
  cargando = import('./vendor/pdfjs/pdf.min.mjs').then(lib => {
    lib.GlobalWorkerOptions.workerSrc = BASE + 'pdf.worker.min.mjs';
    return lib;
  }).catch(e => { cargando = null; throw e; });
  return cargando;
}

export const esPdf = (tipo, nombre = '') =>
  tipo === 'application/pdf' || /\.pdf$/i.test(nombre || '');

/* data URL o ArrayBuffer → bytes */
export function bytesDe(origen) {
  if (origen instanceof Uint8Array) return origen;
  if (origen instanceof ArrayBuffer) return new Uint8Array(origen);
  const s = String(origen || '');
  const b64 = s.slice(s.indexOf(',') + 1);
  const bin = atob(b64);
  const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return u;
}

/* ¿Empieza como PDF? Un .pdf que en realidad es una foto renombrada o un
   archivo cortado a la mitad se detecta aquí, antes de cargar nada. */
export const parecePdf = bytes =>
  bytes.length > 8 && String.fromCharCode(...bytes.slice(0, 5)) === '%PDF-';

async function abrir(origen) {
  const lib = await pdfjs();
  const data = bytesDe(origen).slice();          // pdf.js se queda con el búfer
  return lib.getDocument({
    data,
    standardFontDataUrl: BASE + 'standard_fonts/',
    isEvalSupported: false,                      // nada de eval() con PDFs ajenos
    disableAutoFetch: true,
  }).promise;
}

/* Revisa un PDF: páginas, texto de las primeras hojas y si se pudo abrir.
   { ok, paginas, texto, motivo: 'contrasena' | 'danado' } */
export async function revisarPdf(origen, { paginasTexto = 3 } = {}) {
  let doc;
  try {
    const bytes = bytesDe(origen);
    if (!parecePdf(bytes)) return { ok: false, motivo: 'danado' };
    doc = await abrir(bytes);
  } catch (e) {
    const n = String(e?.name || '') + ' ' + String(e?.message || '');
    return { ok: false, motivo: /Password/i.test(n) ? 'contrasena' : 'danado' };
  }
  let texto = '';
  try {
    for (let i = 1; i <= Math.min(doc.numPages, paginasTexto); i++) {
      const pg = await doc.getPage(i);
      const tc = await pg.getTextContent();
      texto += tc.items.map(t => t.str).join(' ') + '\n';
    }
  } catch {}
  const paginas = doc.numPages;
  try { await doc.destroy(); } catch {}
  return { ok: true, paginas, texto };
}

/* Cada página como JPEG. `ancho` es el lado horizontal en píxeles: 1400
   deja legible una CURP o un INE al imprimir a carta. `max` evita que un
   PDF de 200 páginas congele el panel. */
export async function paginasComoImagenes(origen, { ancho = 1400, calidad = 0.85, max = 40 } = {}) {
  const doc = await abrir(origen);
  const salida = [];
  try {
    for (let i = 1; i <= Math.min(doc.numPages, max); i++) {
      const pg = await doc.getPage(i);
      const v1 = pg.getViewport({ scale: 1 });
      const vp = pg.getViewport({ scale: ancho / v1.width });
      const c = document.createElement('canvas');
      c.width = Math.round(vp.width); c.height = Math.round(vp.height);
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
      await pg.render({ canvasContext: ctx, viewport: vp }).promise;
      salida.push(c.toDataURL('image/jpeg', calidad));
      c.width = c.height = 0;
    }
  } finally { try { await doc.destroy(); } catch {} }
  return salida;
}

/* Miniatura de la primera página, para la tarjeta del candidato */
export async function miniaturaPdf(origen) {
  try { return (await paginasComoImagenes(origen, { ancho: 260, calidad: 0.6, max: 1 }))[0] || null; }
  catch { return null; }
}
