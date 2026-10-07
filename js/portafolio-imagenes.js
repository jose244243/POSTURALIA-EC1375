/* ============================================================================
   POSTURALIA · portafolio-imagenes.js — Los archivos del expediente, listos
   para entrar al portafolio (v47)

   Junta todo lo que el candidato subió —fotos y PDF, estén en el avance
   (localStorage) o en IndexedDB de este equipo— y lo deja como imágenes:
   las fotos tal cual y cada página de cada PDF convertida con pdf.js. Lo
   usan el panel del Centro (admin-evaluacion) y «Mi portafolio» del
   candidato, para que los dos vean exactamente el mismo portafolio.
   ========================================================================== */
import { recuperar } from './almacen-grande.js';

export async function imagenesDe(c, avance = () => {}) {
  const out = {};
  const pares = [['candidato', c.candidato?.documentos || {}], ...Object.entries(c.estado || {}).map(([m, v]) => [m, v?.datos?.documentos || {}])];
  let pdfjs = null;
  for (const [m, docs] of pares) for (const [k, v] of Object.entries(docs)) {
    /* Todas las imágenes del documento (INE por ambos lados, productos de
       varias hojas). v47: los PDF entregados (CURP de gob.mx, INE escaneado,
       diplomas) se abren con pdf.js y cada página entra como hoja del
       portafolio, en su lugar: el portafolio sale integrado. */
    const lista = (Array.isArray(v) ? v : [v]).filter(a => a && typeof a === 'object');
    const srcs = [];
    for (const a of lista) {
      let src = a.dato || '';
      if (!src && (a.enAlmacen || a.nube)) { try { const g = await recuperar(a); src = g?.dato || ''; } catch {} }
      if (!src) src = /^data:image\//.test(a.miniatura || '') && !a.paginas ? a.miniatura : '';
      if (/^data:image\//.test(src)) srcs.push(src);
      else if (/^data:application\/pdf/.test(src)) {
        avance(`Abriendo ${a.nombre || 'PDF'}…`);
        try {
          pdfjs ||= await import('./pdf-util.js');
          (await pdfjs.paginasComoImagenes(src, { ancho: 1400, max: 40 })).forEach(p => srcs.push({ src: p, pagina: true }));
        } catch { /* un PDF que no abre se queda como hoja pendiente */ }
      }
    }
    if (srcs.length) out[`${m}.${k}`] = srcs;
  }
  return out;
}
