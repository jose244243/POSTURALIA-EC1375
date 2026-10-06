/* ============================================================================
   POSTURALIA · doc-portafolio.js — Portafolio de Evidencias (formato oficial)

   Arma el portafolio que se sube a SEP-CONOCER, en el orden del FORMATO
   PORTAFOLIO-1375-2026 y con el contenido completo del expediente aprobado
   de referencia (143 págs.):
     Portada · Índice · 1. Datos del Candidato/a (Ficha de Registro RENAP,
     CURP, INE, Autodiagnóstico oficial, Tríptico de Derechos y Obligaciones)
     · 2. Recopilación de Evidencias (Plan de Evaluación, IEC completo con
     foliación propia, productos DOC 1–5, liga del video) · 3. Cierre de
     Evaluación (Cédula, Encuesta, Verificación Interna, Cédula del Servicio
     a usuarios, Formato de Atención a Usuarios) · 4. Anexos (acuses del
     tríptico, la cédula y el plan, Autorización de firma electrónica) ·
     Contraportada.
   Cada documento sale también suelto (Cédula, IEC, Verificación…).

   Entrada: el expediente (panel), su evaluación (evaluaciones[correo]) y
   los archivos que el candidato entregó (imágenes recuperadas del almacén).
   ========================================================================== */
import { CONFIG } from './config.js';
import { hoja, envolverOficial, hojaPlanOficial, fechaFormato, escOficial as esc } from './doc-plan-oficial.js';
import { firmaHtml } from './firma-simple.js';
import { htmlIecOficial } from './doc-iec-oficial.js';
import { estilosPortafolioOficial, autodiagnosticoOficial, fichaRenap, triptico, formatoAtencion, cedulaServicio, acuse, contraportada } from './doc-portafolio-oficial.js';
import { CAMPOS_CEDULA, TEXTO_ACUERDO, cedulaPublicada, juicioOficial } from './evaluacion.js';
import { ENCUESTA } from './data-portafolio.js';
import { fichaRegistro, cartaConsentimiento, planSesion, planSeguimiento, verificacionEspacio, estilosSesion } from './doc-sesion.js';
import { domicilioCompleto } from './registro.js';
const GEN_SESION = { ficha: fichaRegistro, consentimiento: cartaConsentimiento, plan_sesion: planSesion, plan_seguimiento: planSeguimiento };

const ce = () => CONFIG.centroEvaluacion || {};
const std = () => `<b>${esc(CONFIG.marca.estandar)}</b> - ${esc(CONFIG.marca.estandarNombre)}.`;
const hoyIso = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' });
const datosMod = (x, m) => x?.estado?.[m]?.datos || {};
const firmaCandidatoDe = x => {
  const f = x?.firma;
  return f?.dato ? { mode: 'draw', dataUrl: f.dato } : null;
};
const firmaDeSello = s => s?.firma ? { mode: 'draw', dataUrl: s.firma } : null;

/* ── Portada, índice y separadores ─────────────────────────────────────── */
export const marcador = palabra => `<div class="marcador-oficial" style="break-before:page;min-height:230mm;display:flex;align-items:center;justify-content:center;font:bold 14pt Arial,sans-serif">${esc(palabra)}</div>`;
export function portada({ candidato = '', evaluador = '', fecha = '', lote = '' } = {}) {
  return hoja('Portafolio de Evidencias', `<div class="bloque-gris">
    <div class="tit">Portafolio de Evidencias</div>
    <p>Candidato/a : <b>${esc(candidato)}</b></p>
    <p>Clave y nombre del estándar ${std()}</p>
    <p>Clave del CE ${esc(String(ce().clave || '').replace(/^CE\s*/, ''))}</p>
    <p>Evaluador : ${esc(evaluador)}</p>
    <p>Fecha: ${esc(fechaFormato(fecha))}</p>
    <p>Lote: ${esc(lote)}</p></div>`, { sinTitulo: true });
}
export function indice() {
  const li = t => `<li style="list-style:'✓  '">${t}</li>`;
  return hoja('Índice', `<div class="bloque-gris" style="font-size:12.5pt">
    <h2 style="font-weight:normal;font-size:18pt">Índice</h2>
    <ol style="line-height:1.75">
      <li>Datos del candidato<ul>${li('Ficha de registro del candidato')}${li('Documentos personales')}${li('Diagnóstico del candidato')}${li('Tríptico de Derechos y Obligaciones')}</ul></li>
      <li>Recopilación de Evidencias<ul>${li('Plan de Evaluación Acordado con el Candidato')}${li('Instrumento de Evaluación Aplicado al Candidato')}${li('Evidencias complementarias (Las que solicite el IEC)')}</ul></li>
      <li>Cierre de la Evaluación<ul>${li('Cédula de Evaluación del Candidato')}${li('Encuesta de satisfacción del candidato')}${li('Verificación interna (evaluador)')}${li('Formato Servicio a Usuarios (formato evaluación)')}${li('Formato atención a usuarios')}</ul></li>
      <li>Anexos<ul>${li('Acuse de recibido de cédula, plan y tríptico')}${li('Autorización firma electrónica')}</ul></li>
    </ol></div>`, { sinTitulo: true });
}
export const separador = (texto, sub = '') => hoja(texto, `<div class="separador" style="flex-direction:column;gap:8mm">${esc(texto)}${sub ? `<b style="font-size:16pt">${esc(sub)}</b>` : ''}</div>`, { sinTitulo: true });

/* ── 1. Ficha de Registro (SII / RENAP): doc-portafolio-oficial.js ──── */

/* Documento que entregó el candidato. `img` puede ser una imagen o varias
   (INE por ambos lados, un producto de varias hojas): dos por hoja. */
const lista = v => (Array.isArray(v) ? v : [v]).filter(Boolean);
/* Carta (279 mm) menos márgenes, encabezado con logos y pie deja ~200 mm
   para el cuerpo: las imágenes se acotan para que cada hoja salga en UNA
   página (antes, a 210–228 mm, la hoja salía en blanco y la imagen en la
   siguiente).
   Cada elemento es una foto (cadena) o una página de PDF ({ src, pagina }).
   Las fotos van de dos en dos (INE frente y reverso en una hoja); cada
   página de un PDF entregado va sola y a hoja completa, como el documento
   original (v47). */
export const documentoAnexo = (titulo, img, nota = '', { etiqueta = '' } = {}) => {
  const items = lista(img).map(x => typeof x === 'string' ? { src: x } : x).filter(x => x?.src);
  const marca = etiqueta ? `<div style="font-weight:bold;font-size:12pt;margin:0 0 2mm">${esc(etiqueta)}</div>` : '';
  if (!items.length) return hoja(titulo, marca + `<div class="separador" style="min-height:120mm;font-size:13pt;background:#eee;color:#555">${esc(titulo)}${nota ? `<br><small>${esc(nota)}</small>` : ''}</div>`);
  const grupos = [];
  for (const it of items) {
    const ult = grupos[grupos.length - 1];
    if (!it.pagina && ult && !ult[0].pagina && ult.length < 2) ult.push(it);
    else grupos.push([it]);
  }
  return grupos.map((g, n) => hoja(titulo, (n === 0 ? marca : '') + `<div style="text-align:center">${g.map(it =>
    `<img src="${it.src}" alt="${esc(titulo)}" style="max-width:100%;max-height:${it.pagina ? 196 : g.length > 1 ? 94 : 190}mm;object-fit:contain;display:block;margin:0 auto ${g.length > 1 ? 3 : 0}mm;break-inside:avoid${it.pagina ? ';border:1px solid #ccc' : ''}">`).join('')}</div>`)).join('');
};

/* Autodiagnóstico y Tríptico: formato oficial en doc-portafolio-oficial.js */

/* ── IEC aplicado ──────────────────────────────────────────────────────── */
/* IEC completo en formato oficial (N-FO-03 v2.0): ver doc-iec-oficial.js */
export function iec(ev = {}, { candidato = '', evaluador = '' } = {}) {
  return htmlIecOficial(ev, { candidato, evaluador });
}

/* ── Productos entregados y liga del video ─────────────────────────────── */
const PRODUCTOS = [['ficha', 'Ficha de registro de atención de condiciones físicas y socioemocionales'], ['consentimiento', 'Carta de consentimiento informado / aceptación del servicio'],
  ['plan_sesion', 'Plan de sesión'], ['plan_seguimiento', 'Plan de seguimiento'], ['encuesta_usuario', 'Encuesta de satisfacción del usuario del servicio']];
/* Si el candidato los llenó con su usuario (sesion.html), entran llenos y
   firmados; si además subió el escaneo, va detrás. */
export function productos(x, imagenes = {}, { firma = null } = {}) {
  const dm = datosMod(x, 'documentos');
  const docs = dm.documentos || {};
  const sesion = dm.sesion && dm.sesionGenerada ? dm.sesion : null;
  const c = x?.candidato || {};
  const cand = { ...c, nombre: c.nombre || x?.nombre || '', domicilioCompleto: domicilioCompleto(c), firma };
  return (sesion ? `<style>${estilosSesion()}</style>` : '') + PRODUCTOS.map(([k, t], i) => {
    const v = docs[k];
    /* v47: el formato firmado que subió el candidato (foto o PDF) */
    const escaneo = imagenes[`documentos.firmado_${k}`] || imagenes[`documentos.${k}`];
    if (sesion && GEN_SESION[k]) return GEN_SESION[k](sesion, cand) + (escaneo ? documentoAnexo(`PRODUCTO · ${t} (firmado)`, escaneo, '', { etiqueta: `DOC ${i + 1}` }) : '');
    return documentoAnexo(`PRODUCTO · ${t}`, escaneo || '', v ? `Entregado${v.fecha ? ' el ' + new Date(v.fecha).toLocaleDateString('es-MX') : ''} · ${v.nombre || ''}` : 'Pendiente de entregar', { etiqueta: `DOC ${i + 1}` });
  }).join('');
}
export const ligaVideo = (ev = {}, x) => {
  const liga = ev.video?.liga || datosMod(x, 'evidencias').documentos?.video?.liga || datosMod(x, 'evidencias').documentos?.video || '';
  return hoja('EVIDENCIA EN VIDEO DE LA SESIÓN DE EVALUACIÓN', `<p style="margin-top:30mm;text-align:center">Liga de la grabación completa del ejercicio práctico:</p>
    <p style="text-align:center;font-size:13pt;word-break:break-all"><b>${esc(typeof liga === 'string' ? liga : '')}</b></p>
    ${ev.video?.clave ? `<p style="text-align:center">Clave de acceso: <b>${esc(ev.video.clave)}</b></p>` : ''}`);
};

/* ── 3. Cédula de Evaluación ───────────────────────────────────────────── */
export function cedula(ev = {}, { candidato = '' } = {}) {
  const c = cedulaPublicada(ev) || ev.cedula || {};
  const fila = (k, v) => `<tr><td class="gris der" style="width:160px">${k}</td><td class="just">${esc(v || '')}</td></tr>`;
  return hoja('CÉDULA DE EVALUACIÓN', `
    <table class="t datos"><tr><td>Evaluadora:</td><td>${esc(c.evaluadora || '')}</td></tr>
      <tr><td>Centro de Evaluación:</td><td>${esc(ce().clave || '')} ${esc(ce().nombre || '')}</td></tr>
      <tr><td>Candidato/a:</td><td><b>${esc(String(candidato).toUpperCase())}</b></td></tr>
      <tr><td>Estándar de Competencia:</td><td class="just">${std()}</td></tr><tr><td>Fecha:</td><td>${esc(fechaFormato(c.fecha))}</td></tr></table>
    <table class="t"><tr class="gris"><td colspan="2" class="cen">RESULTADO DE LA EVALUACIÓN</td></tr>
      ${CAMPOS_CEDULA.map(k => fila(k.label + ':', c[k.id])).join('')}${fila('Incidencias:', c.incidencias)}</table>
    <table class="t"><tr class="gris"><td class="cen">JUICIO DE EVALUACIÓN</td></tr><tr><td class="cen" style="font-size:14pt;height:34px"><b>${esc(juicioOficial(c.juicio))}</b></td></tr></table>
    <table class="t"><tr class="gris"><td class="cen" style="width:50%">Evaluadora</td><td class="cen">Candidata/o</td></tr>
      <tr style="height:90px"><td class="cen">${firmaHtml(c.firmaEvaluador)}</td><td class="cen" style="font-size:9.5pt">${firmaHtml(ev.firma_candidato)}${esc(TEXTO_ACUERDO)}</td></tr>
      <tr class="gris"><td class="cen">Nombre y Firma</td><td class="cen">Nombre y Firma</td></tr></table>
    <div style="font-size:9pt;border:1px solid #000;padding:4px 8px"><b>Notas:</b><ul style="margin:2px 0 0 18px;padding:0">
      <li>El Juicio de Competencia emitido, está sujeto a la ratificación o rectificación del dictamen emitido por la ECE u OC.</li>
      <li>El Candidato pagará el importe establecido para el certificado, sí y solo si su Juicio de Competencia resultara ser competente.</li></ul></div>
    <table class="t" style="margin-top:10px"><tr><td class="gris" style="width:170px">RECIBÍ COPIA DE LA CÉDULA DE EVALUACIÓN (ACUSE)<br>Sí ${ev.firma_candidato ? 'X' : '__'} NO __</td>
      <td class="cen" style="vertical-align:bottom">${firmaHtml(ev.firma_candidato, 40)}<small>NOMBRE Y FIRMA DEL USUARIO</small></td></tr></table>
    <table class="t"><tr><td class="gris" style="width:170px">Observaciones:</td><td>Uso exclusivo para el Candidato.</td></tr></table>`);
}

/* ── Encuesta de satisfacción CONOCER ──────────────────────────────────── */
/* La escala con caras del FORMATO PORTAFOLIO-1375-2026 (pág. 39): roja,
   naranja, amarilla y verde, con su etiqueta del mismo color. */
const CARAS = [['Totalmente en desacuerdo', '#e53935', 'triste'], ['Parcialmente en desacuerdo', '#fb8c00', 'triste'],
  ['De acuerdo', '#fdd835', 'feliz'], ['Muy de acuerdo', '#7cb342', 'feliz']];
const cara = (color, gesto) => `<svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true"><circle cx="15" cy="15" r="13.5" fill="${color}" stroke="#555" stroke-width="1"/>
  <circle cx="10.5" cy="12" r="1.6" fill="#222"/><circle cx="19.5" cy="12" r="1.6" fill="#222"/>
  <path d="${gesto === 'feliz' ? 'M9.5 18.5 Q15 23.5 20.5 18.5' : 'M9.5 21.5 Q15 16.5 20.5 21.5'}" stroke="#222" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>`;

export function encuesta(enc = {}, { candidato = '', firma = null } = {}) {
  const r = enc.respuestas || {};
  /* La escala de la plataforma va de "Muy de acuerdo" (0) a "Totalmente en
     desacuerdo" (3); el formato la imprime al revés. */
  const col = i => (Number.isInteger(r[i]) ? 3 - r[i] : -1);
  return hoja('Encuesta de Satisfacción del Proceso de Evaluación de Competencia', `
    <p style="text-align:center;font-variant:small-caps;margin:0 0 8px">Su opinión es muy importante</p>
    <table class="t"><tr><td class="gris" style="width:120px">Nombre del Candidato:</td><td colspan="2">${esc(candidato)}</td></tr>
      <tr><td class="gris">FECHA</td><td>${esc(fechaFormato(enc.fecha || ''))}</td><td class="cen" style="width:40%">${firmaHtml(firma, 34)}FIRMA</td></tr></table>
    <p class="just" style="font-size:10pt">Conteste las siguientes preguntas marcando con una X la opción que considere adecuada al servicio recibido, conforme a la siguiente escala de evaluación:</p>
    <table class="t"><tr class="gris"><td class="cen" style="width:24px">#</td><td class="cen">Pregunta</td>
      ${CARAS.map(([t, c, g]) => `<td class="cen" style="width:72px;font-size:8.5pt;vertical-align:bottom">${cara(c, g)}<br>${t}</td>`).join('')}</tr>
      ${ENCUESTA.preguntas.map((p, i) => `<tr><td class="cen">${i + 1}.</td><td style="font-size:10pt">${esc(p)}</td>${[0, 1, 2, 3].map(k => `<td class="x">${col(i) === k ? 'X' : ''}</td>`).join('')}</tr>`).join('')}</table>`);
}

/* ── Verificación Interna del Proceso de Evaluación ────────────────────── */
export const PUNTOS_VERIFICACION = [
  ['Integración del portafolio de evidencias:', null],
  ['El índice corresponde al enviado por el CONOCER - Febrero 2018', 1],
  ['Revisión correcta de logotipos e información del CE o EI', 2],
  ['El diagnóstico, Plan de Evaluación, Instrumento de Evaluación, Cédula de Evaluación se encuentran firmados en su totalidad por candidato y evaluador.', 3],
  ['Diagnóstico calificado con tinta negra, sin lápiz, ni espacios en blanco.', 4],
  ['Plan de evaluación calificado con tinta negra, sin lápiz, ni espacios en blanco.', 5],
  ['Verifica las fechas del acuerdo del Plan de Evaluación, desarrollo de la evaluación, evaluación de conocimientos y entrega de resultados corresponden a la notificación enviada y presentada en el SII.', 6],
  ['Verificación del Instrumento de evaluación', null],
  ['Verifica SÍ es el caso el cumplimiento de la aplicación del Instrumento de Evaluación de la Competencia, del ejercicio práctico.', 7],
  ['Verifica la suficiencia de las evidencias recopiladas durante el proceso de la evaluación.', 8],
  ['Verifica la suficiencia de la competencia del candidato en cada uno de los elementos del EC.', 9],
  ['Revisa que el portafolio de evidencias presente todos los registros y la documentación que sustenta el juicio de competencia el cual debe estar ordenado, limpio, sin tachaduras, lápiz o corrector.', 10],
  ['Productos y entrega', null],
  ['Verifica el cumplimiento de productos conforme al EC', 11],
  ['Asegura el cumplimiento de las verificaciones y revisiones realizadas', 12],
  ['Entrega el “Portafolio de Evidencias” al ECE o al CE conforma a sus lineamientos y en un plazo no mayor a cinco días naturales.', 13],
  ['¿Contiene la firma del EI o Director del CE?', 14],
];
export function verificacion(ev = {}, { candidato = '' } = {}) {
  const v = ev.verificacion || {};
  return hoja('Verificación Interna del Proceso de Evaluación', `
    <table class="t datos"><tr><td>Candidat :</td><td>${esc(candidato)}</td></tr><tr><td>Centro Evaluador:</td><td>${esc(ce().clave || '')} ${esc(ce().nombre || '')}</td></tr>
      <tr><td>Fecha:</td><td>${esc(fechaFormato(v.fecha || ''))}</td></tr></table>
    <p>Verifique el proceso de evaluación marcando con una ✓ los criterios descritos:</p>
    <table class="t">${PUNTOS_VERIFICACION.map(([t, n]) => n == null
      ? `<tr><td colspan="4"><b>${esc(t)}</b></td></tr>`
      : `<tr><td class="cen" style="width:26px">${n}</td><td class="just" style="font-size:10pt">${esc(t)}</td>
          <td class="cen" style="width:40px">SÍ ${v[n] === 'si' ? '✓' : ''}</td><td class="cen" style="width:40px">NO ${v[n] === 'no' ? '✓' : ''}</td></tr>`).join('')}</table>
    <p><b>Observaciones:</b> ${esc(v.observaciones || '')}</p>
    <div class="firmas"><div></div><div>${firmaHtml(ev.firmas?.cierre)}<div class="l">${esc(v.verificador || '')}<br>Nombre y firma Verificador/a del proceso</div></div><div></div></div>`);
}

/* ── 4. Anexos: autorización de firma electrónica ──────────────────────── */
export function autorizacionFirma({ candidato = '', evaluador = '', fecha = '', firma = null } = {}) {
  return hoja('AUTORIZACIÓN FIRMA ELECTRÓNICA', `
    <table class="t datos"><tr><td>Centro de Evaluación:</td><td>${esc(ce().clave || '')} ${esc(ce().nombre || '')}</td></tr><tr><td>Evaluador/a:</td><td>${esc(evaluador)}</td></tr>
      <tr><td>Estándar de Competencia:</td><td class="just">${std()}</td></tr><tr><td>Candidata/o</td><td>${esc(candidato)}</td></tr><tr><td>Fecha:</td><td>${esc(fechaFormato(fecha))}</td></tr></table>
    <div class="nota" style="font-family:Arial;font-weight:bold;font-size:10.5pt">CONFIRMO QUE HE LEÍDO EL AVISO DE PRIVACIDAD DE ${esc(String(ce().nombre || 'EL CENTRO DE EVALUACIÓN').toUpperCase())} Y ESTOY DE ACUERDO EN TODO LO ESTIPULADO EN EL DOCUMENTO. ASÍ MISMO AUTORIZO Y PRESTO MI FIRMA DIGITAL PARA SER PLASMADA EXCLUSIVAMENTE EN TODAS LAS FOJAS DEL INSTRUMENTO DE EVALUACIÓN DE COMPETENCIAS DEL EC</div>
    <div style="width:95mm;height:45mm;border:1px solid #000;margin:14mm auto 4px;display:flex;align-items:center;justify-content:center">${firmaHtml(firma, 70)}</div>
    <p style="text-align:center">Firma de la o el candidato/a</p>`);
}

/* ── El portafolio completo ────────────────────────────────────────────── */
/* vistaCandidato (v47, «Mi portafolio»): el candidato ve su portafolio tal
   como se va armando, MENOS el IEC —trae las respuestas correctas del
   cuestionario y firmó confidencialidad del instrumento— y la Verificación
   Interna, que es del Centro. En su lugar va una hoja que lo explica. */
const reservada = titulo => hoja(titulo, `<div class="separador" style="min-height:120mm;font-size:13pt;background:#eee;color:#555">${esc(titulo)}<br><small>Lo integra tu Centro Evaluador. No se muestra en tu vista: es confidencial.</small></div>`);
export function htmlPortafolio({ expediente: x, evaluacion: ev = {}, lote = '', imagenes = {}, plan = null, vistaCandidato = false }) {
  const c = x?.candidato || {};
  const nombre = c.nombre || x?.nombre || '';
  const planDatos = datosMod(x, 'plan');
  const auto = datosMod(x, 'autodiagnostico');
  const enc = datosMod(x, 'encuesta');
  const ced = cedulaPublicada(ev);
  const evaluador = ced?.evaluadora || planDatos.fEvaluadora || planDatos.fEvaluador || ce().evaluadora || '';
  const firmaCand = ev.firma_candidato || firmaCandidatoDe(x);
  const acusePlan = (planDatos.documentos || {}).acusePlanEvaluacion;
  const firmaPlanCand = acusePlan?.firma ? { mode: 'draw', dataUrl: acusePlan.firma } : firmaCand;
  const firmaTrip = firmaDeSello(auto.triptico) || firmaCand;
  const decision = planDatos.fProcede === 'no' ? 'Asesorarme' : (planDatos.fFechaPlan || acusePlan) ? 'Evaluarme' : '';
  const hojas = [
    `<style>${estilosPortafolioOficial()}</style>`,
    portada({ candidato: nombre, evaluador, fecha: ced?.fecha || hoyIso(), lote }),
    indice(),
    separador('1. Datos del Candidato/a', nombre),
    fichaRenap(c, { foto: lista(imagenes['candidato.fotoRegistro'])[0] || '', firma: firmaCand }),
    documentoAnexo('CURP', imagenes['evidencias.curp'] || '', 'Comprobante de CURP entregado por el candidato'),
    documentoAnexo('INE', imagenes['evidencias.ine'] || '', 'Identificación oficial vigente (ambos lados)'),
    autodiagnosticoOficial(auto, c, { firmaCandidato: firmaCand, firmaEvaluador: ev.firmas?.diagnostico || null, evaluador, decision }),
    triptico(c, { firma: firmaTrip, fecha: auto.triptico?.fecha }),
    separador('2. Recopilación de Evidencias'),
    hojaPlanOficial({
      evaluadora: planDatos.fEvaluadora || evaluador, centro: planDatos.fCentro, fechaPlan: planDatos.fFechaPlan,
      candidato: planDatos.fCandidato || nombre, resultadoDiagnostico: planDatos.fResultadoDiag,
      sugirioCapacitacion: planDatos.fSugirio === 'si', procede: planDatos.fProcede !== 'no',
      fechaEvaluacion: planDatos.fFecha, lugar: planDatos.fLugar, horario: planDatos.fHorario,
      lugarResultados: planDatos.fLugarRes, fechaResultados: planDatos.fFechaRes, horarioResultados: planDatos.fHorarioRes,
      proporcionaMaterial: planDatos.fProporciona, firmaCandidato: acusePlan?.firma || '', acuse: acusePlan?.firma ? 'si' : '',
      firmaEvaluador: ev.firmas?.plan || null,
    }),
    /* Las hojas «IEC» y «PRODUCTOS» del formato oficial (págs. 35 y 36):
       una página con la palabra, antes de cada bloque. */
    marcador('IEC'),
    vistaCandidato ? reservada('Instrumento de Evaluación de Competencia (IEC)') : iec(ev, { candidato: nombre, evaluador }),
    marcador('PRODUCTOS'),
    productos(x, imagenes, { firma: firmaCand }),
    ...(datosMod(x, 'documentos').sesionGenerada && datosMod(x, 'documentos').sesion ? [verificacionEspacio(datosMod(x, 'documentos').sesion, { ...c, nombre, domicilioCompleto: domicilioCompleto(c), firma: firmaCand })] : []),
    ligaVideo(ev, x),
    separador('3. Cierre de Evaluación'),
    cedula(ev, { candidato: nombre }),
    encuesta(enc, { candidato: nombre, firma: firmaDeSello(enc.sello) || firmaCand }),
    vistaCandidato ? reservada('Verificación Interna del Proceso de Evaluación') : verificacion(ev, { candidato: nombre }),
    cedulaServicio(enc, c, { evaluador: `${evaluador}${ce().nombre ? ' · ' + ce().nombre : ''}`, firmaCandidato: firmaDeSello(enc.sello) || firmaCand }),
    formatoAtencion(enc, c, { lugar: planDatos.fLugar || CONFIG.marca?.ciudad || '', evaluador, firmaCandidato: firmaDeSello(enc.sello) || firmaCand, firmaEvaluador: ev.firmas?.plan || null }),
    separador('4. ANEXOS'),
    acuse('triptico', { evaluador, candidato: nombre, fecha: auto.triptico?.fecha, firma: firmaTrip }),
    acuse('cedula', { evaluador, candidato: nombre, fecha: ced?.fecha, firma: ev.firma_candidato || null }),
    acuse('plan', { evaluador, candidato: nombre, fecha: planDatos.fFechaPlan || acusePlan?.fecha, firma: acusePlan?.firma ? firmaPlanCand : null }),
    autorizacionFirma({ candidato: nombre, evaluador, fecha: ced?.fecha || hoyIso(), firma: firmaCand }),
    /* Foto para el diploma y certificados de formación, al final de Anexos
       (como Paideia). Los certificados son opcionales: sin ellos no se
       agrega hoja vacía. */
    documentoAnexo('Foto para el diploma', imagenes['evidencias.fotoDiploma'] || '', 'Foto para el diploma (de frente, fondo blanco)', { etiqueta: 'FOTO Y CERTIFICADOS' }),
    /* Los certificados que subió en Evidencias y los de su Ficha de
       Registro (v47: antes estos últimos no llegaban al portafolio). */
    ...(() => {
      const certs = [...lista(imagenes['evidencias.certificados']),
        ...Object.keys(imagenes).filter(k => k.startsWith('candidato.cert_')).sort().flatMap(k => lista(imagenes[k]))];
      return certs.length ? [documentoAnexo('Certificados / diplomas de formación', certs)] : [];
    })(),
    contraportada(),
  ];
  return envolverOficial(`Portafolio de Evidencias — ${nombre}${vistaCandidato ? ' (vista del candidato)' : ''}`, hojas.join(''));
}
