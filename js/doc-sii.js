/* ============================================================================
   POSTURALIA · doc-sii.js — Ficha de Registro e Instrumento de Evaluación
   (IEC1375, formato N-FO-03 v2.0) idénticos a los que emite el SII

   Las hojas no se «diseñan»: data-sii.js trae, página por página, los trazos,
   los textos con su posición exacta (en puntos PDF) y las imágenes de los
   PDF que el SII le entrega al evaluador (Ficha A4 de 1 página; IEC carta de
   83 páginas). Aquí solo se dibujan tal cual en SVG y se rellenan los campos
   que cambian por candidato:
     Ficha · fecha, consentimiento RENAP (X en SI/NO), nombre, lugar de
             nacimiento, nacionalidad, CURP, género, fecha de nacimiento,
             domicilio, correo, teléfonos y foto.
     IEC   · evaluador y candidato (portada y pie de las 83 hojas), fecha de
             aplicación, palomita SÍ/NO de los 142 reactivos, respuesta elegida
             de las 37 preguntas, peso obtenido de los reactivos 135–142,
             cuantificación (V) y juicio de competencia (VI).
   Todo lo demás (textos, erratas, «Página X de 83», cortes de página,
   tablas, logos) sale idéntico al del SII porque ES el del SII.

   Tipografías: Helvetica como en el SII (sin incrustar: cada equipo usa la
   misma que usa para ver el PDF del SII — Arial en Windows) y DejaVu Serif,
   que el SII sí incrusta, servida desde formatos/sii-dejavuserif.ttf.

   Firmas: el SII entrega las hojas sin firma; si el candidato o el
   evaluador ya firmaron en la plataforma, su firma se pone encima de la
   línea, donde se rubrica a mano. Sin firmas, la hoja es igual a la del SII.
   ========================================================================== */
import { SII } from './data-sii.js';
import { CUESTIONARIO, GRUPOS_CUESTIONARIO } from './data-cuestionario-iec.js';
import { REACTIVOS } from './data-iec.js';
import { calificarIec } from './evaluacion.js';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const abs = p => new URL('../' + p, import.meta.url).href;
const FAMILIA = ['Helvetica,Arial,&quot;Liberation Sans&quot;,&quot;TeX Gyre Heros&quot;,sans-serif',
  'Helvetica,Arial,&quot;Liberation Sans&quot;,&quot;TeX Gyre Heros&quot;,sans-serif',
  '&quot;SII DejaVu Serif&quot;,&quot;DejaVu Serif&quot;,serif'];
const CAP = ['butt', 'round', 'square'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const mayus = s => String(s || '').trim().replace(/\s+/g, ' ').toLocaleUpperCase('es-MX');
const peso = n => (Math.round(Number(n || 0) * 100) / 100).toFixed(2);

/* 2026-10-05 → «octubre 05 2026», como lo imprime el SII */
export const fechaSii = iso => {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${MESES[+m[2] - 1]} ${m[3]} ${m[1]}` : '';
};

export function estilosSii() {
  return `
  @font-face { font-family: "SII DejaVu Serif"; src: url("${abs('formatos/sii-dejavuserif.ttf')}") format("truetype"); }
  @page sii-carta { size: 612pt 792pt; margin: 0 }
  @page sii-a4 { size: 595pt 842pt; margin: 0 }
  .sii-hoja { display: block; position: relative; background: #fff; margin: 0 auto; overflow: hidden; break-inside: avoid; page-break-inside: avoid }
  .sii-hoja.carta { width: 612pt; height: 792pt } .sii-hoja.a4 { width: 595pt; height: 842pt }
  .sii-hoja > svg { position: absolute; left: 0; top: 0 }   /* un SVG en el flujo, más alto que la hoja carta, hace que Chrome ignore el tamaño A4 */
  .sii-hoja { break-before: page; page-break-before: always; break-after: page; page-break-after: always }
  .sii-hoja.carta { page: sii-carta } .sii-hoja.a4 { page: sii-a4 }
  .sii-hoja text { font-kerning: none; text-rendering: geometricPrecision; white-space: pre }
  @media screen { .sii-hoja { box-shadow: 0 1px 6px rgba(0,0,0,.18); margin: 0 auto 14px } }`;
}

/* ── Dibujo de una página ─────────────────────────────────────────────── */
function texto(f, z, y, xs, palabras, extra = '') {
  return `<text font-family="${FAMILIA[f]}"${f === 1 ? ' font-weight="bold"' : ''} font-size="${z}" y="${y}"${extra}>`
    + palabras.map((w, i) => `<tspan x="${xs[i]}">${esc(w)}</tspan>`).join('') + '</text>';
}
function campoTexto(c, valor) {
  const v = String(valor ?? '').trim();
  if (!v) return '';
  const pos = c.cx != null ? ` x="${c.cx}" text-anchor="middle"` : ` x="${c.x}"`;
  return `<text font-family="${FAMILIA[c.f]}"${c.f === 1 ? ' font-weight="bold"' : ''} font-size="${c.z}" y="${c.y}"${pos}>${esc(v)}</text>`;
}
const imagen = (src, x, y, w, h, ajuste = 'none') =>
  `<image href="${esc(src)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="${ajuste}"/>`;

function pagina(p, valores, { clase = 'carta', extra = '' } = {}) {
  const [W, H] = p.s;
  let s = `<div class="sii-hoja ${clase}"><svg xmlns="http://www.w3.org/2000/svg" width="${W}pt" height="${H}pt" viewBox="0 0 ${W} ${H}">`;
  s += `<rect width="${W}" height="${H}" fill="#fff"/>`;
  /* En el orden en que el SII pinta: un relleno blanco posterior tapa lo de abajo */
  for (const e of p.e) {
    if (e[0] === 'g') {
      const [f, st, w, cap] = SII.estilos[e[1]];
      s += `<path d="${e[2]}" fill="${f || 'none'}"${st ? ` stroke="${st}" stroke-width="${w}" stroke-linecap="${CAP[cap || 0]}" stroke-miterlimit="10"` : ''}/>`;
    } else if (e[0] === 't') s += texto(e[1], e[2], e[3], e[4], e[5]);
    else if (e[0] === 'i') s += imagen(abs(SII.imagenes[e[1]]), e[2], e[3], e[4], e[5]);
    else if (e[0] === 'v') s += valores(e[1], e[2]) || '';
  }
  return s + extra + '</svg></div>';
}

/* ── Ficha de Registro ────────────────────────────────────────────────── */
const ENTIDADES = { AS: 'Aguascalientes', BC: 'Baja California', BS: 'Baja California Sur', CC: 'Campeche', CL: 'Coahuila', CM: 'Colima', CS: 'Chiapas', CH: 'Chihuahua',
  DF: 'Ciudad de México', DG: 'Durango', GT: 'Guanajuato', GR: 'Guerrero', HG: 'Hidalgo', JC: 'Jalisco', MC: 'Estado de México', MN: 'Michoacán', MS: 'Morelos',
  NT: 'Nayarit', NL: 'Nuevo León', OC: 'Oaxaca', PL: 'Puebla', QT: 'Querétaro', QR: 'Quintana Roo', SP: 'San Luis Potosí', SL: 'Sinaloa', SR: 'Sonora',
  TC: 'Tabasco', TS: 'Tamaulipas', TL: 'Tlaxcala', VZ: 'Veracruz', YN: 'Yucatán', ZS: 'Zacatecas', NE: 'Nacido en el extranjero' };

/* «28/09/2026», «2026-09-28T…» → «2026-09-28» */
const fechaIso = v => {
  const t = String(v || '').trim();
  let m = t.match(/^(\d{4})-(\d{2})-(\d{2})/); if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  return t;
};

/* Los datos del candidato como los imprime el SII (lugar en mayúsculas,
   nacionalidad «México», género Masculino/Femenino, fechas AAAA-MM-DD). */
export function datosFichaSii(c = {}) {
  const curp = String(c.curp || '').toUpperCase().trim();
  const ent = curp.slice(11, 13);
  let fnac = String(c.fechaNacimiento || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fnac) && /^[A-Z]{4}\d{6}/.test(curp)) {
    const aa = curp.slice(4, 6), siglo = /[A-Z]/.test(curp[16] || '') ? '20' : '19';
    fnac = `${siglo}${aa}-${curp.slice(6, 8)}-${curp.slice(8, 10)}`;
  }
  const g = String(c.genero || '').toLowerCase();
  const genero = /^(h|masc|hombre)/.test(g) || (!g && curp[10] === 'H') ? 'Masculino'
    : /^(m|fem|mujer)/.test(g) || (!g && curp[10] === 'M') ? 'Femenino' : (c.genero || '');
  const cp = c.cp || (String(c.domicilio || '').match(/\b\d{5}\b/) || [''])[0];
  return {
    fecha: fechaIso(c.fechaRegistroSii || c.fechaAplicacion || c.registradoEl),
    renap: c.renapAutorizado === true ? 'si' : c.renapAutorizado === false ? 'no' : '',
    nombre: mayus(c.nombre),
    lugar: mayus(c.lugarNacimiento || ENTIDADES[ent] || ''),
    nacionalidad: c.nacionalidad || (ent && ent !== 'NE' ? 'México' : ''),
    curp, genero, fnac,
    calle: c.domicilio || '', cp, colonia: c.colonia || '',
    ciudad: c.ciudad || c.municipio || '', entidad: c.estado || ENTIDADES[ent] || '',
    email: c.email || '', tel: c.telefonoCasa || '', cel: c.telefonoCelular || '',
  };
}

export function hojaFichaSii(c = {}, { foto = '', firma = null } = {}) {
  const d = datosFichaSii(c);
  const p = SII.ficha[0];
  /* La firma va sobre la línea de «Firma» (x 40–203, y 473.5), a la derecha
     de la palabra «Firma» (x 96–124) para no taparla, como se firma a mano */
  const firmaSvg = firma?.dataUrl ? imagen(firma.dataUrl, 127, 446, 77, 30, 'xMidYMax meet') : '';
  return pagina(p, (tipo, k) => {
    if (tipo === 't') return campoTexto(k, d[k.k]);
    if (tipo === 'x') return d.renap ? campoTexto({ ...k, x: d.renap === 'no' ? k.no : k.si }, 'X') : '';
    if (tipo === 'foto' && foto) return imagen(foto, k.x, k.y, k.w, k.h, 'xMinYMin meet');
    return '';
  }, { clase: 'a4', extra: firmaSvg });
}

/* ── Instrumento de Evaluación (N-FO-03) ──────────────────────────────── */
/* Respuesta elegida como la imprime el SII: «c)» o «e),c),b)» sin espacios */
const respuestaSii = v => String(v ?? '').replace(/\s*\|\s*/g, ',').replace(/\s+/g, '').replace(/,+/g, ',').replace(/^,|,$/g, '');

export function hojasIecSii(ev = {}, { candidato = '', evaluador = '' } = {}) {
  const d = ev.iec || {}, resp = d.respuestas || {}, cuest = d.cuestionario || {};
  const c = calificarIec(resp);
  const pesoDe = Object.fromEntries([...REACTIVOS.map(r => [r.n, r.peso]), ...GRUPOS_CUESTIONARIO.map(g => [g.reactivo, g.peso])]);
  const val = {
    ev: mayus(evaluador), ca: mayus(candidato), fecha: fechaSii(d.fecha),
    v1: c.completo ? peso(c.puntos) : '', v2: c.completo ? peso(c.penalizacion) : '', v3: c.completo ? peso(c.total) : '',
  };
  CUESTIONARIO.forEach(q => { val['r' + q.n] = respuestaSii(cuest[q.n]); });
  GRUPOS_CUESTIONARIO.forEach(g => {
    const v = resp[g.reactivo];
    val['o' + g.reactivo] = v === 'si' ? peso(g.peso) : v === 'no' ? peso(0) : '';
  });
  const fe = ev.firmas?.iec?.dataUrl ? ev.firmas.iec : null;
  const fc = ev.firma_candidato?.dataUrl ? ev.firma_candidato : null;
  /* Rúbricas encima de su línea (evaluador 68–268 · y 734; candidato 355–555 · y 733), a la derecha de «Rubrica» */
  const rubricas = (fe ? imagen(fe.dataUrl, 110, 708, 150, 25, 'xMidYMax meet') : '')
    + (fc ? imagen(fc.dataUrl, 397, 707, 150, 25, 'xMidYMax meet') : '');
  const check = abs(SII.imagenes[SII.check]);
  return SII.iec.map(p => pagina(p, (tipo, k) => {
    if (tipo === 't') return campoTexto(k, val[k.k]);
    if (tipo === 'c') {
      const v = resp[k.n];
      const x = v === 'si' ? k.si : v === 'no' ? k.no : null;
      return x == null ? '' : imagen(check, x, k.y, k.w, k.h);
    }
    if (tipo === 'x') {
      if (!c.completo) return '';
      return campoTexto({ ...k, x: c.juicio === 'COMPETENTE' ? k.si : k.no }, 'X');
    }
    return '';
  }, { clase: 'carta', extra: rubricas }));
}

/* Fragmentos listos para el portafolio */
export const htmlFichaSii = (c, op) => `<style>${estilosSii()}</style>${hojaFichaSii(c, op)}`;
export const htmlIecSii = (ev, op) => `<style>${estilosSii()}</style>${hojasIecSii(ev, op).join('')}`;
