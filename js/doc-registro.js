/* ============================================================================
   POSTURALIA · doc-registro.js — «Tus documentos de Registro» (como Paideia)

   Lo que el candidato firmó al registrarse, en el formato oficial del Centro
   y listo para descargar como PDF (Imprimir → Guardar como PDF):
     · Autodiagnóstico EC1375 (formato CONOCER con sus 142 respuestas)
     · Ficha de Registro (SII / RENAP, con su foto y su firma)
     · Acuse de recibido — Tríptico de Derechos y Obligaciones
     · Acuerdo de Confidencialidad (NDA)
   Son las mismas hojas que el Centro mete al portafolio (doc-portafolio-
   oficial.js), así que el candidato ve exactamente lo que se entrega. La
   copia del candidato no lleva la firma del evaluador: esa la pone el
   Centro en la suya.

   Sin DOM ni red: la página junta los datos (ctx) y abre el HTML.
   ctx = { auto, cand, firma, foto, ndaHtml }
     auto    Store 'autodiagnostico' (answers, triptico, nda…)
     cand    Store 'candidato' (datos generales del registro)
     firma   firma guardada del candidato ({ dato }) o null
     foto    dataURL de la foto de la Ficha de Registro, o ''
     ndaHtml el texto del acuerdo tal como lo firmó (autodiagnostico.html)
   ========================================================================== */
import { hoja, envolverOficial, fechaFormato, escOficial as esc } from './doc-plan-oficial.js';
import { firmaHtml } from './firma-simple.js';
import { estilosPortafolioOficial, autodiagnosticoOficial, fichaRenap, triptico, acuse, cedulaServicio, formatoAtencion } from './doc-portafolio-oficial.js';
import { encuesta as hojaEncuesta } from './doc-portafolio.js';
import { CONFIG } from './config.js';

export const DOCS_REGISTRO = [
  { id: 'autodiagnostico', titulo: 'Autodiagnóstico EC1375', desc: 'Formato CONOCER con tus 142 respuestas, la valoración y tu firma.' },
  { id: 'ficha',           titulo: 'Ficha de Registro',      desc: 'Formato del SII / RENAP con tus datos, tu foto y tu firma.' },
  { id: 'acuseTriptico',   titulo: 'Acuse de recibido — Tríptico', desc: 'El Tríptico de Derechos y Obligaciones y tu acuse firmado.' },
  { id: 'nda',             titulo: 'Acuerdo de Confidencialidad (NDA)', desc: 'El acuerdo que firmaste con el Centro Evaluador.' },
];

const firmaDe = f => (f?.dato ? { mode: 'draw', dataUrl: f.dato } : null);
const firmaDeSello = s => (s?.firma ? { mode: 'draw', dataUrl: s.firma } : null);
const hoyIso = () => new Date().toISOString().slice(0, 10);

/* Qué falta para que un documento salga completo (no para abrirlo: se
   puede ver aunque falte algo, y lo que falta se le dice). */
export function faltaEnDocumento(id, { auto = {}, cand = {}, firma = null, foto = '' } = {}) {
  const f = [];
  if (id === 'autodiagnostico') {
    if (!auto.completado) f.push('terminar el autodiagnóstico');
    if (!firma) f.push('tu firma');
  }
  if (id === 'ficha') {
    if (!cand.nombre || !cand.curp) f.push('tus datos generales');
    if (!foto) f.push('tu foto');
    if (!firma) f.push('tu firma');
  }
  if (id === 'acuseTriptico' && !auto.triptico?.firma) f.push('firmar de recibido el Tríptico');
  if (id === 'nda' && !auto.nda?.firma) f.push('firmar el acuerdo');
  return f;
}

function hojaNda({ auto = {}, cand = {}, ndaHtml = '' }) {
  const s = auto.nda || {};
  const quien = cand.nombre ? `${cand.nombre}${cand.curp ? ` (CURP ${String(cand.curp).toUpperCase()})` : ''}` : 'el/la candidato/a';
  /* El texto es el que se firmó; solo se pone el nombre donde dice
     «el/la candidato/a». */
  const cuerpo = String(ndaHtml || '').replace(/<b class="nda-parte">[^<]*<\/b>/, `<b>${esc(quien)}</b>`);
  return hoja('ACUERDO DE CONFIDENCIALIDAD (NDA) — CANDIDATO/A EC1375', `
    <div class="just" style="font-size:10pt;line-height:1.45">${cuerpo}</div>
    <div style="width:95mm;margin:10mm auto 0;text-align:center">
      <div style="height:50px;display:flex;align-items:flex-end;justify-content:center">${firmaHtml(firmaDeSello(s), 46)}</div>
      <p style="border-top:1px solid #000;margin:0;padding-top:1mm;font-size:9pt">${esc(cand.nombre || '')}<br>Firma del candidato/a${s.fecha ? ' · ' + esc(fechaFormato(String(s.fecha).slice(0, 10))) : ''}</p></div>`);
}

function hojas(id, ctx) {
  const { auto = {}, cand = {}, firma = null, foto = '' } = ctx;
  const f = firmaDe(firma);
  const ce = CONFIG.centroEvaluacion || {};
  if (id === 'autodiagnostico') return autodiagnosticoOficial(auto, cand, { firmaCandidato: f, firmaEvaluador: null, evaluador: '', decision: '' });
  if (id === 'ficha') return fichaRenap({ ...cand, fechaAplicacion: cand.fechaAplicacion || fechaFormato(hoyIso()) }, { foto, firma: f });
  if (id === 'acuseTriptico') {
    const s = auto.triptico || {};
    return triptico(cand, { firma: firmaDeSello(s), fecha: s.fecha })
      + acuse('triptico', { evaluador: ce.evaluadora || '', candidato: cand.nombre || '', fecha: s.fecha, firma: firmaDeSello(s) });
  }
  if (id === 'nda') return hojaNda(ctx);
  return '';
}

export function documentoRegistro(id, ctx = {}) {
  const d = DOCS_REGISTRO.find(x => x.id === id);
  if (!d) return '';
  return envolverOficial(`${d.titulo} — ${ctx.cand?.nombre || ''}`, `<style>${estilosPortafolioOficial()}</style>` + hojas(id, ctx));
}

export function todosDocsRegistro(ctx = {}) {
  return envolverOficial(`Documentos de Registro — ${ctx.cand?.nombre || ''}`,
    `<style>${estilosPortafolioOficial()}</style>` + DOCS_REGISTRO.map(d => hojas(d.id, ctx)).join(''));
}

/* ── Tu Encuesta en formato oficial (como Paideia) ────────────────────────
   Las tres hojas que contesta el candidato y que van al Cierre de su
   portafolio: la Encuesta de Satisfacción, la Cédula de Evaluación del
   Servicio y el Formato de Atención a Usuarios. */
export function documentoEncuesta({ enc = {}, cand = {}, firma = null } = {}) {
  const ce = CONFIG.centroEvaluacion || {};
  const f = firmaDeSello(enc.sello) || firmaDe(firma);
  const evaluador = ce.evaluadora || '';
  return envolverOficial(`Encuesta de Satisfacción — ${cand.nombre || ''}`, `<style>${estilosPortafolioOficial()}</style>`
    + hojaEncuesta(enc, { candidato: cand.nombre || '', firma: f })
    + cedulaServicio(enc, cand, { evaluador: `${evaluador}${ce.nombre ? ' · ' + ce.nombre : ''}`, firmaCandidato: f })
    + formatoAtencion(enc, cand, { lugar: CONFIG.marca?.ciudad || '', evaluador, firmaCandidato: f, firmaEvaluador: null }));
}

/* ── Comprobante de entrega de evidencias (como Paideia) ──────────────────
   Aviso interno para el candidato: qué entregó y cuándo, con su declaración
   de autenticidad y su firma. NO forma parte del Portafolio de Evidencias
   (lo dice en la hoja), por eso no lleva formato del CONOCER ni folio.
   evidencias = [{ titulo, requerido, entregada, fecha }] */
export function comprobanteEvidencias({ cand = {}, evidencias = [], declaracion = null, firma = null, ahora = new Date() } = {}) {
  const f = firmaDeSello(declaracion) || firmaDe(firma);
  const fecha = d => (d ? new Date(d).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }) : '');
  const esp = (cand.certificados || []).map(c => c?.nombre).filter(Boolean);
  return envolverOficial(`Comprobante de entrega de evidencias — ${cand.nombre || ''}`, hoja('COMPROBANTE DE ENTREGA DE EVIDENCIAS', `
    <p style="text-align:center;font-style:italic;font-size:9pt;margin:0 0 4mm">(Este comprobante es solo un aviso interno — no forma parte de tu Portafolio de Evidencias)</p>
    <table class="t datos"><tr><td>Candidato/a:</td><td>${esc(cand.nombre || '')}</td></tr>
      ${esp.length ? `<tr><td>Especialidades:</td><td>${esc(esp.join(', '))}</td></tr>` : ''}
      <tr><td>Fecha del comprobante:</td><td>${esc(fecha(ahora))}</td></tr></table>
    <p style="margin:5mm 0 2mm"><b>EVIDENCIAS</b></p>
    <table class="t"><tr class="gris"><td class="cen">Evidencia</td><td class="cen" style="width:24mm">Requerida</td><td class="cen" style="width:48mm">Estado</td></tr>
      ${evidencias.map(e => `<tr><td>${esc(e.titulo)}</td><td class="cen">${e.requerido ? 'Sí' : 'Opcional'}</td><td class="cen">${e.entregada ? 'Entregada' + (e.fecha ? ' · ' + esc(fecha(e.fecha)) : '') : 'Pendiente'}</td></tr>`).join('')}</table>
    <p class="just" style="font-size:9.5pt;margin-top:5mm">Con mi firma confirmo que subí las evidencias obligatorias solicitadas para completar mi Portafolio de Evidencias EC1375, y que la información proporcionada es verdadera.</p>
    ${declaracion?.acepto ? `<p class="just" style="font-size:9pt"><b>Declaración de autenticidad</b> (aceptada el ${esc(fecha(declaracion.fecha))}): ${esc(declaracion.acepto)}</p>` : ''}
    <div style="width:80mm;margin:8mm 0 0"><div style="height:50px;display:flex;align-items:flex-end">${firmaHtml(f, 46)}</div>
      <p style="border-top:1px solid #000;margin:0;padding-top:1mm;font-size:9pt">Firma del candidato/a</p></div>`));
}
