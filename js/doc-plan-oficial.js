/* ============================================================================
   POSTURALIA · doc-plan-oficial.js — Plan de Evaluación en formato oficial

   Genera el Plan de Evaluación EXACTAMENTE con el formato del portafolio
   que se sube a SEP-CONOCER (FORMATO PORTAFOLIO-1375-2026, págs. 22–34):
   encabezado con los tres logos y "Plan de Evaluación" en cada hoja, tabla
   de datos, Resultado del Diagnóstico, la tabla No. / Actividades y forma a
   desarrollar / Técnicas e instrumentos / Fecha por Elemento, requerimientos,
   criterios de juicio, acuerdos, notas, firmas y acuse; pie del Centro
   Evaluador en cada hoja.

   Se abre en el visor de la plataforma (abrirDocumento) con «Descargar PDF»
   e «Imprimir», en tamaño carta. Al imprimir, el encabezado y el pie se
   repiten solos en cada hoja (thead/tfoot).
   ========================================================================== */
import { CONFIG } from './config.js';
import { firmaHtml } from './firma-simple.js';
import { ELEMENTOS_PLAN, REQUERIMIENTOS_PLAN, NOTA_PLAN, CONFIRMO_PLAN, NOTAS_FINALES_PLAN } from './data-plan-oficial.js';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* 2026-08-23 → 23-08-2026, como en el formato */
export const fechaFormato = iso => {
  if (!iso) return '';
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : String(iso);
};

const abs = p => new URL(p, location.href).href;
export { esc as escOficial };

function bloque(b) {
  if (b[0] === 'h') return `<div class="h">${b[1]}</div>`;
  if (b[0] === 'p') return `<p>${b[1]}</p>`;
  return `<p>${b[1]}</p><ul>${b[2].map(v => `<li>${v}</li>`).join('')}</ul>`;
}

/* ── Piezas del formato oficial ────────────────────────────────────────────
   estilosOficiales(): el CSS común (Arial, carta, tablas grises del formato).
   hoja(titulo, cuerpo): una sección con encabezado de logos + título y pie
     del Centro Evaluador, que se repiten en cada hoja impresa (thead/tfoot).
   envolverOficial(titulo, hojas): el documento completo con la barra de
     "Imprimir / Guardar PDF". Varias hojas = un solo PDF (el portafolio). */
export function estilosOficiales() {
  return `
  @page { size: letter; margin: 12mm 16mm 12mm 16mm }
  * { box-sizing: border-box }
  body { margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 11pt; color: #000; background: #fff }
  .hoja { width: 100%; border-collapse: collapse; break-before: page }
  .hoja:first-of-type { break-before: auto }
  .hoja > thead td, .hoja > tfoot td { padding: 0 }
  .enc { text-align: center; padding-bottom: 4px; border-bottom: 1px solid #000; margin-bottom: 10px }
  .logos { display: flex; justify-content: space-around; align-items: center; height: 70px }
  .logos img { max-height: 66px; max-width: 150px; object-fit: contain }
  .enc h1 { font-size: 13pt; margin: 2px 0 0; font-weight: bold }
  .pie { text-align: center; font-size: 8.5pt; padding-top: 10px; line-height: 1.35 }
  .pie b { font-family: 'Times New Roman', serif }
  table.t { width: 100%; border-collapse: collapse; margin: 0 0 12px }
  table.t td, table.t th { border: 1px solid #000; padding: 1px 5px; vertical-align: top }
  .gris { background: #c9c9c9; font-weight: bold }
  .der { text-align: right } .cen { text-align: center; vertical-align: middle !important }
  .datos td:first-child { width: 150px; text-align: right; font-weight: bold; background: #c9c9c9 }
  .just { text-align: justify }
  .act td { font-size: 11pt }
  .act p { margin: 0 0 2px; text-align: justify }
  .act .h { font-weight: bold; margin: 8px 0 1px }
  .act ul { margin: 0 0 4px 24px; padding: 0 } .act li { text-align: justify }
  .act tr { break-inside: auto }
  .elem td { background: #c9c9c9; font-weight: bold; text-align: center }
  .firmas { display: flex; justify-content: space-between; gap: 40px; margin: 60px 0 40px }
  .firmas div { flex: 1; text-align: center; font-size: 10pt }
  .firmas .l { border-top: 1px solid #000; padding-top: 2px; font-weight: bold }
  .firmas img { max-height: 60px; display: block; margin: 0 auto -8px }
  .x { font-weight: bold; text-align: center }
  .nota { background: #c9c9c9; border: 1px solid #000; padding: 6px 8px; font-family: 'Times New Roman', serif; font-size: 11pt; text-align: justify; margin: 16px 0 }
  .bloque-gris { background: #a6a6a6; color: #000; min-height: 200mm; padding: 16mm 12mm; font-family: 'Times New Roman', serif; font-size: 16pt; line-height: 1.5 }
  .bloque-gris .tit { background: #d9d9d9; color: #fff; font-size: 26pt; font-weight: bold; text-align: center; padding: 10px; margin: -6mm -2mm 18mm }
  .separador { background: #a6a6a6; min-height: 200mm; display: flex; align-items: center; justify-content: center; font-family: 'Times New Roman', serif; font-size: 20pt; color: #fff }
  .barra { position: sticky; top: 0; background: #0d2a6e; color: #fff; padding: 10px 16px; font: 600 14px system-ui, sans-serif; display: flex; gap: 12px; align-items: center; justify-content: space-between; z-index: 5 }
  .barra button { font: inherit; padding: 8px 16px; border-radius: 8px; border: 0; background: #FFD700; color: #0a1f52; cursor: pointer }
  .papel { max-width: 216mm; margin: 16px auto; background: #fff; padding: 12mm 16mm; box-shadow: 0 4px 24px rgba(0,0,0,.18) }
  @media screen { body { background: #e5e7eb } .hoja { margin-bottom: 18mm } }
  @media print { .barra { display: none } .papel { margin: 0; padding: 0; box-shadow: none; max-width: none } body { background: #fff } }`;
}

export function hoja(titulo, cuerpo, { sinTitulo = false } = {}) {
  const ce = CONFIG.centroEvaluacion || {};
  const L = ce.logos || {};
  return `<table class="hoja">
  <thead><tr><td><div class="enc">
    <div class="logos">
      ${L.izq ? `<img src="${abs(L.izq)}" alt="">` : ''}${L.centro ? `<img src="${abs(L.centro)}" alt="">` : ''}${L.der ? `<img src="${abs(L.der)}" alt="">` : ''}
    </div>
    ${sinTitulo ? '' : `<h1>${esc(titulo)}</h1>`}</div></td></tr></thead>
  <tfoot><tr><td><div class="pie">SUC . CENTRO EVALUADOR <b>${esc(ce.clave || '')}</b> ${esc(ce.nombre || '')}<br>
    ${esc(ce.direccion || '')} ${esc(ce.telefono || '')}</div></td></tr></tfoot>
  <tbody><tr><td>${cuerpo}</td></tr></tbody>
</table>`;
}

export function envolverOficial(titulo, hojas) {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">
<title>${esc(titulo)}</title><style>${estilosOficiales()}</style></head><body>
<div class="barra"><span>${esc(titulo)} · formato oficial SEP-CONOCER · tamaño carta</span>
  <button onclick="window.print()">Imprimir / Guardar PDF</button></div>
<div class="papel">${hojas}</div></body></html>`;
}

/* Compatibilidad: un documento de una sola sección */
export function hojaOficial(titulo, cuerpo) { return envolverOficial(titulo, hoja(titulo, cuerpo)); }

/* d = { evaluadora, centro, fechaPlan, candidato, resultadoDiagnostico,
         sugirioCapacitacion (bool), procede (bool), fechaEvaluacion,
         lugar, horario, lugarResultados, fechaResultados, horarioResultados,
         proporcionaMaterial, firmaCandidato (dataURL), acuse: 'si'|'no'|'' } */
export function htmlPlanOficial(d = {}) {
  const ce = CONFIG.centroEvaluacion || {};
  const std = `<b>${esc(CONFIG.marca.estandar)}</b> - ${esc(CONFIG.marca.estandarNombre)}.`;
  const fEval = fechaFormato(d.fechaEvaluacion);
  const sn = (v, si) => v === si ? 'X' : '';

  const filas = ELEMENTOS_PLAN.map(e => `
    <tr class="elem"><td colspan="4">ELEMENTO ${e.n}</td></tr>
    ${e.filas.map(f => `<tr>
      <td class="cen" style="width:34px">${f.no}</td>
      <td style="width:55%">${f.b.map(bloque).join('')}</td>
      <td class="cen">${esc(f.instr)}</td>
      <td class="cen" style="width:92px"><b>${esc(fEval)}</b></td></tr>`).join('')}`).join('');

  const cuerpo = `
  <table class="t datos">
    <tr><td>Evaluadora:</td><td>${esc(d.evaluadora || ce.evaluadora || '')}</td></tr>
    <tr><td>Centro de Evaluación:</td><td>${esc(d.centro || ce.clave || '')}</td></tr>
    <tr><td>Fecha:</td><td><b>${esc(fechaFormato(d.fechaPlan))}</b></td></tr>
    <tr><td>Estándar de Competencia:</td><td class="just">${std}</td></tr>
    <tr><td>Candidata/o:</td><td><b>${esc((d.candidato || '').toUpperCase())}</b></td></tr>
  </table>

  <table class="t">
    <tr><td class="gris cen" style="width:47%">Resultado del Diagnóstico</td><td colspan="4">${esc(d.resultadoDiagnostico || '')}</td></tr>
    <tr><td class="gris cen">Se sugirió capacitación</td><td class="gris cen" style="width:6%">Sí</td><td class="x">${sn(d.sugirioCapacitacion, true)}</td>
        <td class="gris cen" style="width:6%">No</td><td class="x">${sn(d.sugirioCapacitacion, false)}</td></tr>
    <tr><td class="gris cen">Procede a evaluación</td><td class="gris cen">Sí</td><td class="x">${sn(d.procede, true)}</td>
        <td class="gris cen">No</td><td class="x">${sn(d.procede, false)}</td></tr>
  </table>

  <table class="t act">
    <thead><tr class="gris"><th class="cen">No.</th><th class="cen">Actividades y forma a desarrollar</th>
      <th class="cen">Técnicas e instrumentos de evaluación</th><th class="cen">Fecha</th></tr></thead>
    <tbody>${filas}</tbody>
  </table>

  <!-- La columna Cantidad lleva 1 en cada requerimiento, como el formato del
       Centro (incluidas las sillas): la Verificación Interna revisa que el Plan
       vaya "sin espacios en blanco" (punto 5). -->
  <table class="t">
    <tr class="gris"><td colspan="2" class="cen">Requerimientos para el desarrollo de la evaluación</td></tr>
    <tr class="gris"><td class="cen" style="width:90px">Cantidad</td><td class="cen">Requerimiento</td></tr>
    ${REQUERIMIENTOS_PLAN.map(r => `<tr><td class="cen">1</td><td>${esc(r)}</td></tr>`).join('')}
    <tr><td class="gris">Proporciona el material:</td><td>${esc(d.proporcionaMaterial || '')}</td></tr>
  </table>

  <table class="t" style="margin-top:22px">
    <tr class="gris"><td colspan="2" class="cen">Criterios para obtener juicio de competente</td></tr>
    <tr><td class="gris der" style="width:70px">Primer criterio:</td><td class="just">La suma total del peso relativo a los reactivos del IEC que se aplique sea igual o mayor a: <b>${esc(String(ce.umbral ?? 97.64))}</b></td></tr>
    <tr><td class="gris der">Segundo criterio:</td><td class="just">Existe al menos un reactivo cumplido para cada criterio de evaluación, aplica para reactivos de producto y desempeño.</td></tr>
  </table>

  ${['Acuerdo para el desarrollo de la evaluación', 'Acuerdo para la presentación de los resultados de la evaluación'].map((t, k) => {
    const v = k ? [d.lugarResultados, fechaFormato(d.fechaResultados), d.horarioResultados] : [d.lugar, fEval, d.horario];
    return `<table class="t">
      <tr class="gris"><td colspan="3" class="cen">${t}</td></tr>
      <tr class="gris"><td class="cen">Lugar</td><td class="cen">Fecha</td><td class="cen">Horario</td></tr>
      <tr style="height:48px"><td class="cen">${esc(v[0] || '')}</td><td class="cen">${esc(v[1] || '')}</td><td class="cen">${esc(v[2] || '')}</td></tr></table>`;
  }).join('')}

  <div class="nota"><b style="font-family:Arial">Nota:</b><br>${esc(NOTA_PLAN)}</div>

  <div style="font-size:10pt">Con la firma del presente confirmo que:
    <ul style="margin:6px 0 14px 22px;padding:0">${CONFIRMO_PLAN.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>

  <div style="font-size:10pt;break-before:page"><u>Notas:</u>
    <ul style="margin:4px 0 0 22px;padding:0">${NOTAS_FINALES_PLAN.map(t => `<li>${t}</li>`).join('')}</ul></div>

  <div class="firmas">
    <div>${d.firmaEvaluador ? firmaHtml(d.firmaEvaluador, 58) : '<div style="height:62px"></div>'}<div class="l">${esc(d.evaluadora || ce.evaluadora || '')}<br>Nombre del Evaluador</div></div>
    <div>${d.firmaCandidato ? `<img src="${d.firmaCandidato}" alt="Firma">` : '<div style="height:62px"></div>'}
      <div class="l">${esc(d.candidato || '')}<br>Nombre del Candidato</div><div>Estoy de acuerdo</div></div>
  </div>

  <table class="t" style="width:92%;margin:30px auto">
    <tr style="height:52px"><td style="width:26%;vertical-align:bottom"><b>Recibí copia del Plan de Evaluación (ACUSE)</b></td>
      <td class="cen" style="width:7%"><b>Si</b><br>${d.acuse === 'si' ? 'X' : ''}</td>
      <td class="cen" style="width:7%"><b>No</b><br>${d.acuse === 'no' ? 'X' : ''}</td>
      <td class="cen" style="vertical-align:bottom">${d.acuse === 'si' && d.firmaCandidato ? `<img src="${d.firmaCandidato}" style="max-height:44px;display:block;margin:0 auto">` : ''}
        <span style="color:#bbb;font-size:9pt">${d.acuse === 'si' ? esc(d.candidato || '') : 'Nombre y firma'}</span></td></tr>
  </table>`;

  return hojaOficial('Plan de Evaluación', cuerpo);
}

/* Solo la sección (para meterla al portafolio) */
export function hojaPlanOficial(d = {}) {
  const html = htmlPlanOficial(d);
  return html.slice(html.indexOf('<table class="hoja">'), html.lastIndexOf('</div></body>'));
}

/* ── Visor de documentos (v50) ────────────────────────────────────────────
   Antes el documento se abría en otra pestaña (una dirección blob:) sin
   forma de volver: en el celular o con la plataforma instalada como app se
   quedaba uno ahí. Ahora se abre ENCIMA de la plataforma, con
   «← Regresar a la plataforma», «Descargar PDF» (un archivo .pdf de verdad,
   como los de Paideia) e «Imprimir». El botón «atrás» del celular y Esc
   también cierran el visor. */
const VISOR_CSS = `
  #docVisor { position:fixed; inset:0; z-index:2147483600; display:flex; flex-direction:column; background:#e5e7eb }
  #docVisor .dv-barra { display:flex; align-items:center; gap:10px; flex-wrap:wrap; padding:10px 14px; background:#0d2a6e; color:#fff;
    font:600 14px system-ui,-apple-system,'Segoe UI',sans-serif }
  #docVisor .dv-t { flex:1 1 200px; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; opacity:.92 }
  #docVisor button { font:inherit; padding:9px 16px; border-radius:9px; border:0; cursor:pointer }
  #docVisor .dv-volver { background:#fff; color:#0d2a6e }
  #docVisor .dv-pdf { background:#FFD700; color:#0a1f52 }
  #docVisor .dv-imp { background:transparent; color:#fff; border:1px solid rgba(255,255,255,.55) }
  #docVisor button:disabled { opacity:.6; cursor:wait }
  #docVisor .dv-acc { display:flex; gap:8px; flex-wrap:wrap }
  #docVisor iframe { flex:1; width:100%; border:0; background:#e5e7eb }
  #docVisor .dv-estado { position:absolute; left:50%; bottom:20px; transform:translateX(-50%); background:#0F172A; color:#fff;
    padding:10px 16px; border-radius:10px; font:500 14px system-ui,sans-serif; box-shadow:0 10px 30px rgba(0,0,0,.3); max-width:calc(100vw - 32px) }
  @media (max-width:560px) { #docVisor .dv-t { display:none } #docVisor .dv-barra { justify-content:space-between } #docVisor button { padding:9px 12px } }`;

const nombreArchivo = t => (String(t || 'Documento').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^\w\s.-]+/g, ' ').replace(/\s+/g, '_').replace(/^_+|_+$/g, '').slice(0, 90) || 'Documento') + '.pdf';

export function abrirDocumento(html, { nombre = '' } = {}) {
  const titulo = ((String(html).match(/<title>([^<]*)<\/title>/i) || [])[1] || 'Documento')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  document.getElementById('docVisor')?.remove();
  const v = document.createElement('div');
  v.id = 'docVisor';
  v.setAttribute('role', 'dialog'); v.setAttribute('aria-modal', 'true'); v.setAttribute('aria-label', titulo);
  v.innerHTML = `<style>${VISOR_CSS}</style>
    <div class="dv-barra">
      <button type="button" class="dv-volver">← Regresar a la plataforma</button>
      <span class="dv-t">${esc(titulo)}</span>
      <div class="dv-acc"><button type="button" class="dv-pdf">Descargar PDF</button><button type="button" class="dv-imp">Imprimir</button></div>
    </div>
    <iframe class="dv-marco" title="${esc(titulo)}"></iframe>
    <div class="dv-estado" hidden></div>`;
  document.body.appendChild(v);
  const overflowAntes = document.documentElement.style.overflow;
  document.documentElement.style.overflow = 'hidden';
  const fr = v.querySelector('iframe');
  /* La barra propia del documento sobra: el visor ya trae la suya. */
  fr.srcdoc = String(html).replace(/<\/head>/i, '<style>.barra{display:none!important}</style></head>');

  let abierto = true, conHistoria = false;
  const cerrar = (desdeAtras = false) => {
    if (!abierto) return; abierto = false;
    removeEventListener('popstate', alAtras); removeEventListener('keydown', alTecla, true);
    v.remove(); document.documentElement.style.overflow = overflowAntes;
    if (conHistoria && !desdeAtras) history.back();
  };
  const alAtras = () => cerrar(true);
  const alTecla = e => { if (e.key === 'Escape') { e.preventDefault(); cerrar(); } };
  try { history.pushState({ docVisor: 1 }, ''); conHistoria = true; addEventListener('popstate', alAtras); } catch {}
  addEventListener('keydown', alTecla, true);
  fr.addEventListener('load', () => { try { fr.contentWindow.addEventListener('keydown', alTecla, true); } catch {} });

  v.querySelector('.dv-volver').onclick = () => cerrar();
  v.querySelector('.dv-imp').onclick = () => { try { fr.contentWindow.focus(); fr.contentWindow.print(); } catch { window.print(); } };
  const bPdf = v.querySelector('.dv-pdf'), estado = v.querySelector('.dv-estado');
  const avisar = (txt, ms) => { estado.textContent = txt; estado.hidden = !txt; if (ms) setTimeout(() => { estado.hidden = true; }, ms); };
  bPdf.onclick = async () => {
    bPdf.disabled = true; const txt = bPdf.textContent; bPdf.textContent = 'Preparando PDF…';
    avisar('Armando tu PDF en tamaño carta. Tarda unos segundos…');
    try {
      await descargarPdf(fr, nombreArchivo(nombre ? `${titulo} ${nombre}` : titulo));
      avisar('✓ PDF descargado. Lo encuentras en tus Descargas.', 4000);
    } catch (e) {
      console.warn('PDF:', e);
      avisar('No se pudo armar el PDF aquí. Se abre «Imprimir»: elige «Guardar como PDF».', 6000);
      try { fr.contentWindow.focus(); fr.contentWindow.print(); } catch {}
    } finally { bPdf.disabled = false; bPdf.textContent = txt; }
  };
  return { cerrar, marco: fr };
}

/* ── PDF de verdad ─────────────────────────────────────────────────────────
   jsPDF + html2canvas (licencia MIT) se cargan solo al tocar «Descargar
   PDF». Cada sección (.hoja) se pinta a tamaño carta y se corta en hojas
   por renglones completos: nunca a la mitad de una línea. */
const LIBS = [
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
];
function cargarScript(doc, src) {
  return new Promise((ok, mal) => {
    const sc = doc.createElement('script'); sc.src = src; sc.crossOrigin = 'anonymous';
    sc.onload = ok; sc.onerror = () => mal(new Error('No cargó ' + src));
    doc.head.appendChild(sc);
  });
}
async function descargarPdf(fr, archivo) {
  const w = fr.contentWindow, doc = fr.contentDocument;
  if (!doc?.body) throw new Error('Documento sin cargar');
  if (!w.html2canvas || !w.jspdf) for (const src of LIBS) await cargarScript(doc, src);
  /* Ancho carta para que el PDF salga igual en el celular que en la compu */
  const st = doc.createElement('style');
  st.textContent = '.papel{width:216mm!important;max-width:none!important;margin:0!important;box-shadow:none!important}.hoja{margin-bottom:0!important}body{min-width:216mm!important;background:#fff!important}';
  doc.head.appendChild(st);
  try {
    await Promise.all([...doc.images].map(im => im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r; })));
    const { jsPDF } = w.jspdf;
    /* En puntos: las hojas del SII (Ficha A4, IEC carta) se dibujan con las
       coordenadas exactas del PDF del SII (sii-pdf.js); las del Centro van
       como antes, en carta con sus márgenes. */
    const PT = 72 / 25.4;
    const bloques0 = [...doc.querySelectorAll('.papel > .hoja, .papel > .sii-hoja')];
    const bloques = bloques0.length ? bloques0 : [doc.querySelector('.papel') || doc.body];
    const sii = bloques.some(b => b.classList.contains('sii-hoja')) ? await import('./sii-pdf.js') : null;
    const primerTam = sii && bloques[0].classList.contains('sii-hoja') ? sii.tamanoSii(bloques[0]) : [612, 792];
    const pdf = new jsPDF({ unit: 'pt', format: primerTam, orientation: 'portrait', compress: true });
    const MX = 16, MY = 12, ANCHO = 215.9 - 2 * MX, ALTO = 279.4 - 2 * MY;
    let primera = true;
    const nuevaHoja = tam => { if (!primera) pdf.addPage(tam, 'portrait'); primera = false; };
    for (const h of bloques) {
      if (h.classList.contains('sii-hoja')) {
        nuevaHoja(sii.tamanoSii(h));
        await sii.hojaSiiAPdf(pdf, h, w);
        continue;
      }
      const r = h.getBoundingClientRect();
      const pxMm = r.width / ANCHO, altoPag = ALTO * pxMm;
      /* Dónde se puede cortar: al final de cada renglón o bloque */
      const cortes = [...h.querySelectorAll('tr, p, li, h1, h2, h3, .firmas, .nota, img, .enc, .pie')]
        .map(el => el.getBoundingClientRect().bottom - r.top).filter(y => y > 0).sort((a, b) => a - b);
      let escala = 2;
      while (escala > 1 && (r.height * escala > 30000 || r.width * r.height * escala * escala > 16e6)) escala -= 0.25;
      const lienzo = await w.html2canvas(h, { scale: escala, backgroundColor: '#ffffff', useCORS: true, logging: false,
        windowWidth: Math.max(900, doc.documentElement.scrollWidth) });
      const k = lienzo.width / r.width;
      let y0 = 0;
      while (y0 < r.height - 2) {
        let y1 = Math.min(r.height, y0 + altoPag);
        if (y1 < r.height) { const c = cortes.filter(y => y > y0 + altoPag * 0.35 && y <= y1).pop(); if (c) y1 = c; }
        const trozo = doc.createElement('canvas');
        trozo.width = lienzo.width; trozo.height = Math.max(1, Math.round((y1 - y0) * k));
        const cx = trozo.getContext('2d'); cx.fillStyle = '#fff'; cx.fillRect(0, 0, trozo.width, trozo.height);
        cx.drawImage(lienzo, 0, Math.round(y0 * k), lienzo.width, trozo.height, 0, 0, trozo.width, trozo.height);
        nuevaHoja([612, 792]);
        pdf.addImage(trozo.toDataURL('image/jpeg', 0.92), 'JPEG', MX * PT, MY * PT, ANCHO * PT, (y1 - y0) / pxMm * PT, undefined, 'FAST');
        y0 = y1;
      }
    }
    pdf.save(archivo);
  } finally { st.remove(); }
}
