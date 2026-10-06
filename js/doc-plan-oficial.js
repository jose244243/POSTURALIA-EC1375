/* ============================================================================
   POSTURALIA · doc-plan-oficial.js — Plan de Evaluación en formato oficial

   Genera el Plan de Evaluación EXACTAMENTE con el formato del portafolio
   que se sube a SEP-CONOCER (FORMATO PORTAFOLIO-1375-2026, págs. 22–34):
   encabezado con los tres logos y "Plan de Evaluación" en cada hoja, tabla
   de datos, Resultado del Diagnóstico, la tabla No. / Actividades y forma a
   desarrollar / Técnicas e instrumentos / Fecha por Elemento, requerimientos,
   criterios de juicio, acuerdos, notas, firmas y acuse; pie del Centro
   Evaluador en cada hoja.

   Se abre en una pestaña lista para "Imprimir → Guardar como PDF" en tamaño
   carta. El encabezado y el pie se repiten solos en cada hoja (thead/tfoot).
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

/* Abre el documento en una pestaña nueva (desde un clic, para que el
   navegador no la bloquee). */
export function abrirDocumento(html) {
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  const w = window.open(url, '_blank');
  if (!w) location.href = url;
  setTimeout(() => URL.revokeObjectURL(url), 60000);
  return w;
}
