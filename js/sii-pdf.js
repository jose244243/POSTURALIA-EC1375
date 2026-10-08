/* ============================================================================
   POSTURALIA · sii-pdf.js — Las hojas del SII (Ficha de Registro e IEC) al
   PDF descargado como VECTORES, no como foto

   doc-sii.js dibuja cada hoja en SVG con las mismas coordenadas que el PDF
   del SII. Aquí ese SVG se pasa tal cual a jsPDF: los mismos trazos, el
   texto en Helvetica (fuente estándar del PDF, sin incrustar, igual que el
   SII) y DejaVu Serif incrustada donde el SII la usa. El resultado no es una
   imagen parecida: es un PDF construido igual que el del SII, del tamaño de
   hoja del SII (A4 la Ficha, carta el IEC).

   Solo entiende el SVG que produce doc-sii.js (path M/L/H/V/C/Z, image,
   text con tspans o con text-anchor="middle").
   ========================================================================== */

const NS_PT = { carta: [612, 792], a4: [595, 842] };
export const tamanoSii = div => (div.classList.contains('a4') ? NS_PT.a4 : NS_PT.carta);

let serifB64 = null;
async function fuenteSerif(base) {
  if (serifB64) return serifB64;
  const r = await fetch(new URL('formatos/sii-dejavuserif.ttf', base));
  const b = new Uint8Array(await r.arrayBuffer());
  let s = ''; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000));
  serifB64 = btoa(s);
  return serifB64;
}

const cacheImg = new Map();
async function imagenDe(href, win) {
  if (cacheImg.has(href)) return cacheImg.get(href);
  /* Las figuras del SII son JPEG: se meten tal cual (mismos bytes que el SII) */
  if (/\.jpe?g($|\?)/i.test(href)) {
    const p = (async () => {
      const b = new Uint8Array(await (await fetch(href)).arrayBuffer());
      let s = ''; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000));
      const im = await new Promise((ok, mal) => { const i = new win.Image(); i.onload = () => ok(i); i.onerror = mal; i.src = href; });
      /* como dataURL: jsPDF vive en el iframe y no reconoce un Uint8Array de esta ventana */
      return { data: 'data:image/jpeg;base64,' + btoa(s), fmt: 'JPEG', w: im.naturalWidth, h: im.naturalHeight };
    })();
    cacheImg.set(href, p);
    return p;
  }
  const p = new Promise((ok, mal) => {
    const im = new win.Image();
    im.crossOrigin = 'anonymous';
    im.onload = () => {
      /* PNG con transparencia (palomita, logo, firmas): a dataURL PNG */
      const c = win.document.createElement('canvas');
      c.width = im.naturalWidth; c.height = im.naturalHeight;
      c.getContext('2d').drawImage(im, 0, 0);
      const esJpg = /^data:image\/jpe?g/i.test(href) || /\.jpe?g($|\?)/i.test(href);
      ok({ data: esJpg ? c.toDataURL('image/jpeg', 0.95) : c.toDataURL('image/png'), fmt: esJpg ? 'JPEG' : 'PNG', w: im.naturalWidth, h: im.naturalHeight });
    };
    im.onerror = () => mal(new Error('No cargó la imagen ' + String(href).slice(0, 60)));
    im.src = href;
  });
  cacheImg.set(href, p);
  return p;
}

const num = v => parseFloat(v);
function trazar(pdf, d) {
  const ops = []; let x = 0, y = 0;
  const re = /([MLHVCZ])([^MLHVCZ]*)/g; let m;
  while ((m = re.exec(d))) {
    const a = m[2].trim() ? m[2].trim().split(/[\s,]+/).map(Number) : [];
    switch (m[1]) {
      case 'M': x = a[0]; y = a[1]; ops.push({ op: 'm', c: [x, y] }); break;
      case 'L': x = a[0]; y = a[1]; ops.push({ op: 'l', c: [x, y] }); break;
      case 'H': x = a[0]; ops.push({ op: 'l', c: [x, y] }); break;
      case 'V': y = a[0]; ops.push({ op: 'l', c: [x, y] }); break;
      case 'C': ops.push({ op: 'c', c: a.slice(0, 6) }); x = a[4]; y = a[5]; break;
      case 'Z': ops.push({ op: 'h', c: [] }); break;
    }
  }
  pdf.path(ops);
}
const color = (pdf, fn, hex) => {
  const h = hex.replace('#', '');
  pdf[fn](parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16));
};
const CAPS = { butt: 0, round: 1, square: 2 };

/* Ubica una imagen con preserveAspectRatio (meet) como lo hace el SVG */
function caja(im, x, y, w, h, par) {
  if (!par || par === 'none') return [x, y, w, h];
  const [al] = par.split(' ');
  const k = Math.min(w / im.w, h / im.h), ww = im.w * k, hh = im.h * k;
  const fx = /xMid/.test(al) ? .5 : /xMax/.test(al) ? 1 : 0, fy = /YMid/.test(al) ? .5 : /YMax/.test(al) ? 1 : 0;
  return [x + (w - ww) * fx, y + (h - hh) * fy, ww, hh];
}

/* Dibuja una hoja (.sii-hoja con su SVG) en la página actual de pdf (unidad pt) */
export async function hojaSiiAPdf(pdf, div, win) {
  const svg = div.querySelector('svg');
  const base = new URL('../', import.meta.url);
  if (!pdf.__siiSerif && svg.querySelector('text[font-family*="DejaVu"]')) {
    pdf.addFileToVFS('DejaVuSerif-sii.ttf', await fuenteSerif(base));
    pdf.addFont('DejaVuSerif-sii.ttf', 'DejaVuSerif', 'normal');
    pdf.__siiSerif = true;
  }
  for (const el of svg.children) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'rect') continue;                       // el fondo blanco de la hoja
    if (tag === 'path') {
      const f = el.getAttribute('fill'), s = el.getAttribute('stroke');
      trazar(pdf, el.getAttribute('d'));
      if (f && f !== 'none') color(pdf, 'setFillColor', f);
      if (s) { color(pdf, 'setDrawColor', s); pdf.setLineWidth(num(el.getAttribute('stroke-width'))); pdf.setLineCap(CAPS[el.getAttribute('stroke-linecap')] ?? 0); pdf.setLineJoin(0); }
      if (f && f !== 'none' && s) pdf.fillStroke(); else if (f && f !== 'none') pdf.fill(); else if (s) pdf.stroke();
      else pdf.discardPath?.();
    } else if (tag === 'image') {
      const href = el.getAttribute('href') || el.getAttribute('xlink:href');
      const im = await imagenDe(href, win);
      const [x, y, w, h] = caja(im, num(el.getAttribute('x')), num(el.getAttribute('y')), num(el.getAttribute('width')), num(el.getAttribute('height')), el.getAttribute('preserveAspectRatio'));
      pdf.addImage(im.data, im.fmt, x, y, w, h, href.length < 300 ? href : undefined, 'FAST');
    } else if (tag === 'text') {
      const fam = el.getAttribute('font-family') || '';
      if (/DejaVu/.test(fam)) pdf.setFont('DejaVuSerif', 'normal');
      else pdf.setFont('helvetica', el.getAttribute('font-weight') === 'bold' ? 'bold' : 'normal');
      pdf.setFontSize(num(el.getAttribute('font-size')));
      pdf.setTextColor(0, 0, 0);
      const y = num(el.getAttribute('y'));
      const tsp = el.querySelectorAll('tspan');
      if (tsp.length) tsp.forEach(t => pdf.text(t.textContent, num(t.getAttribute('x')), y));
      else {
        const t = el.textContent; let x = num(el.getAttribute('x'));
        /* Centrado como lo centra el SII: con el ancho que mide el navegador
           (Arial/Liberation, las mismas medidas que usa el SII), no con las
           de Helvetica de jsPDF, que difieren unas décimas de punto. */
        if (el.getAttribute('text-anchor') === 'middle') {
          let ancho = 0; try { ancho = el.getComputedTextLength(); } catch {}
          x -= (ancho > 0 ? ancho : pdf.getTextWidth(t)) / 2;
        }
        pdf.text(t, x, y);
      }
    }
  }
}
