/* ============================================================================
   POSTURALIA · doc-sesion.js — Los productos de la sesión, llenos y firmados

   DOC 1 Ficha de Registro · DOC 2 Carta de Consentimiento · DOC 3 Plan de
   Sesión · DOC 4 Plan de Seguimiento · Verificación del espacio.
   Mismo contenido que los PDF de «Documentos de Sesión» de Paideia, en el
   formato oficial del Centro (logos, título y pie en cada hoja) para que
   entren tal cual al portafolio.

   s    = la sesión guardada ({ campos, sesiones, firmas, prep }).
   cand = datos del candidato ({ nombre, domicilio…, firma }) — firma en el
          formato de firma-simple ({ mode, dataUrl | typedName }).
   ========================================================================== */
import { hoja, fechaFormato, envolverOficial } from './doc-plan-oficial.js';
import { firmaHtml } from './firma-simple.js';
import { NOTA_MEDICO, ENTERADO_AVISO, textoConsentimiento, avisoPrivacidadBloques, datosAviso, tecnicaEfectiva,
  PREP_ITEMS, PREP_PROTOCOLO, PREP_MATERIALES, DOCS_SESION, ENCUESTA_USUARIO } from './data-sesion.js';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const v = x => esc(String(x ?? '').trim()) || '—';
const multi = x => v(x).replace(/\n/g, '<br>');

export function estilosSesion() {
  return `
  .ds-doc { font-size: 8.5pt; margin: 0 0 2mm } .ds-sub { text-align: center; font-size: 9pt; margin: 0 0 3mm }
  table.ds-d { width: 100%; border-collapse: collapse; margin: 0 0 4mm; font-size: 10pt }
  table.ds-d td { padding: 1.2mm 2mm; vertical-align: top; border-bottom: 1px solid #ddd }
  table.ds-d td:first-child { width: 58mm; font-weight: bold }
  table.ds-t { width: 100%; border-collapse: collapse; margin: 0 0 4mm; font-size: 9.5pt }
  table.ds-t th { background: #c9c9c9; border: 1px solid #000; padding: 1.5mm 2mm; text-align: left }
  table.ds-t td { border: 1px solid #000; padding: 1.5mm 2mm; vertical-align: top }
  table.ds-t td:first-child { width: 62mm }
  .ds-h { font-weight: bold; margin: 3mm 0 1mm; font-size: 10pt } .ds-p { margin: 0 0 2mm; text-align: justify; font-size: 10pt; line-height: 1.35 }
  .ds-i { font-style: italic; font-size: 9pt; text-align: justify; margin: 0 0 2mm }
  .ds-aviso { font-size: 9pt; text-align: justify; margin: 0 0 3mm } .ds-aviso .tt { font-weight: bold; font-size: 9.5pt; margin: 0 0 1mm }
  .ds-aviso .hh { font-weight: bold; margin: 2mm 0 .5mm } .ds-aviso p { margin: 0 0 1mm } .ds-aviso ul { margin: 0 0 1mm 6mm; padding: 0 }
  .ds-firmas { display: flex; gap: 14mm; margin: 8mm 0 2mm; break-inside: avoid }
  .ds-firmas > div { flex: 1; text-align: center; font-size: 9pt }
  .ds-firmas .caja { height: 22mm; display: flex; align-items: flex-end; justify-content: center }
  .ds-firmas .l { border-top: 1px solid #000; padding-top: 1mm } .ds-firmas .n { font-weight: bold; text-transform: uppercase }
  .ds-chk td.x { width: 12mm; text-align: center; font-weight: bold }
  .eu-tit { text-align: center; font-weight: bold; font-size: 12pt; margin: 0 0 4mm; line-height: 1.35 }
  table.eu { width: 100%; border-collapse: collapse; font-size: 10pt; margin: 0 0 3mm }
  table.eu td { border: 1px solid #000; padding: .7mm 2mm; vertical-align: top; line-height: 1.25 }
  table.eu .v { background: #b0cf94; font-weight: bold } table.eu .g { background: #a9a9a9 }
  table.eu td.x { text-align: center; font-weight: bold; width: 14% } table.eu td.it { font-weight: bold; width: 30% }
  table.eu .com { height: 11mm }
  .eu-firma .ds-firmas { margin: 3mm 0 0 } .eu-firma .ds-firmas .caja { height: 16mm }`;
}

const datos = filas => `<table class="ds-d">${filas.map(([k, x]) => `<tr><td>${esc(k)}</td><td>${v(x)}</td></tr>`).join('')}</table>`;
const tabla = (cab, filas) => `<table class="ds-t"><thead><tr>${cab.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${filas.map(f => `<tr>${f.map((x, i) => `<td>${i ? multi(x) : esc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const bloqueFirma = (etiqueta, nombre, firma) => `<div><div class="caja">${firmaHtml(firma, 60)}</div><div class="l">${esc(etiqueta)}</div>${nombre ? `<div class="n">${esc(nombre)}</div>` : ''}</div>`;
const firmas = (...b) => `<div class="ds-firmas">${b.join('')}</div>`;
const hoyIso = () => new Date().toISOString().slice(0, 10);
const SIN_LOGOS = { sinLogos: true };   // v53: los DOC del usuario no llevan logos

export function avisoHtml(d, opts) {
  return `<div class="ds-aviso">${avisoPrivacidadBloques(d, opts).map(b => b.t === 'titulo' ? `<div class="tt">${esc(b.x)}</div>`
    : b.t === 'h' ? `<div class="hh">${esc(b.x)}</div>` : b.t === 'li' ? `<ul><li>${esc(b.x)}</li></ul>` : `<p>${esc(b.x)}</p>`).join('')}</div>`;
}

/* DOC 1 · Ficha de Registro de Atención */
export function fichaRegistro(s = {}, cand = {}) {
  const c = s.campos || {};
  return hoja('FICHA DE REGISTRO DE ATENCIÓN', `<p class="ds-doc">DOC 1</p><p class="ds-sub">Condiciones físicas y socioemocionales</p>
    ${datos([['Folio:', c.expedienteNo], ['Nombre completo:', c.usuarioNombre], ['Edad:', c.usuarioEdad], ['Fecha de nacimiento:', fechaFormato(c.usuarioFechaNacimiento)],
      ['Domicilio:', c.usuarioDomicilio], ['Teléfono:', c.usuarioTelefono], ['Correo electrónico:', c.usuarioCorreo], ['Familiar/responsable a avisar:', c.contactoEmergencia]])}
    ${tabla(['Antecedentes', 'Detalle'], [['Fisiológicos', c.fisiologicos], ['Socioemocionales', c.socioemocionales], ['Heredofamiliares', c.heredofamiliares],
      ['Enfermedades crónicas o degenerativas', c.enfermedadesCronicas], ['Alergias', c.alergias], ['Hábitos de alimentación y sueño', c.habitosAlimentacionSueno],
      ['Actividad deportiva', c.deportivos], ['Consumo de sustancias', c.consumoSustancias]])}
    ${tabla(['Signos vitales', 'Valor'], [['Presión arterial', c.presionArterial], ['Pulso', c.pulso], ['Temperatura', c.temperatura], ['Oxigenación (SpO2)', c.oxigenacion],
      ['Peso', c.peso], ['Estatura', c.estatura], ['Observación postural', c.observacionPostural], ['Frecuencia respiratoria', c.frecuenciaRespiratoria]])}
    ${tabla(['Información médica adicional', 'Detalle'], [['Médico tratante / profesional de la salud', c.medicoTratante], ['Información toxicológica', c.informacionToxicologica],
      ['Resumen de resultados de laboratorio y gabinete', c.resultadosLaboratorio]])}
    <p class="ds-h">Síntomas, necesidades o interés para recibir tratamiento:</p><p class="ds-p">${multi(c.sintomasNecesidades)}</p>
    <p class="ds-i">${NOTA_MEDICO}</p><p class="ds-i">${ENTERADO_AVISO}</p>
    ${firmas(bloqueFirma('Nombre completo y firma del usuario', c.usuarioNombre, s.firmas?.usuarioFicha), bloqueFirma('Nombre y firma del candidato/a', cand.nombre, cand.firma))}`, SIN_LOGOS);
}

/* DOC 2 · Carta de Consentimiento Informado (lleva el Aviso completo) */
export function cartaConsentimiento(s = {}, cand = {}) {
  const c = s.campos || {};
  return hoja('CARTA DE CONSENTIMIENTO INFORMADO', `<p class="ds-doc">DOC 2</p>
    ${datos([['Fecha:', fechaFormato(c.fechaConsentimiento)], ['Nombre del usuario:', c.usuarioNombre], ['Edad:', c.usuarioEdad], ['Fecha de nacimiento:', fechaFormato(c.usuarioFechaNacimiento)],
      ['Domicilio:', c.usuarioDomicilio], ['Familiar/responsable a avisar:', c.contactoEmergencia], ['Técnica a aplicar:', tecnicaEfectiva(c)], ['Expediente No.:', c.expedienteNo]])}
    ${tabla(['Condiciones del servicio', 'Detalle'], [['Zonas del cuerpo que se abordarán', c.zonasCuerpo], ['Vestimenta recomendada', c.vestimentaRecomendada],
      ['Reacciones o sensaciones posibles', c.reaccionesFisicas], ['Limitantes de aplicación del servicio', c.limitantesServicio], ['Condiciones de preparación', c.condicionesPreparacion],
      ['Número de sesiones y duración', `${String(c.numeroSesionesPlan || '').trim() || '—'} / ${String(c.duracionSesionPlan || '').trim() || '—'}`], ['Objetivos y efectos generales', c.objetivosEfectos]])}
    ${avisoHtml(datosAviso(c, cand))}
    <p class="ds-p">${esc(textoConsentimiento(String(c.usuarioNombre || '').trim()))}</p>
    ${firmas(bloqueFirma('Nombre completo y firma del usuario', c.usuarioNombre, s.firmas?.usuarioConsentimiento))}`, SIN_LOGOS);
}

/* DOC 3 · Plan de Sesión */
export function planSesion(s = {}) {
  const c = s.campos || {};
  return hoja('PLAN DE SESIÓN', `<p class="ds-doc">DOC 3</p><p class="ds-sub"><i>Este documento se integra con el Plan de Seguimiento para el control de las sesiones posteriores.</i></p>
    ${datos([['Usuario:', c.usuarioNombre], ['Sesión No.:', '1'], ['Fecha:', fechaFormato(c.fechaSesion || hoyIso())], ['Hora de inicio:', c.horaInicio], ['Hora de término:', c.horaTermino]])}
    ${tabla(['Signos vitales', 'Valor'], [['Presión arterial', c.presionArterial], ['Pulso', c.pulso], ['Temperatura', c.temperatura], ['Oxigenación (SpO2)', c.oxigenacion], ['Frecuencia respiratoria', c.frecuenciaRespiratoria]])}
    <p class="ds-h">Descripción de actividades / técnica aplicada</p><p class="ds-p">${v(tecnicaEfectiva(c))}${c.zonasCuerpo ? ' — ' + esc(c.zonasCuerpo) : ''}</p>
    <p class="ds-h">Condiciones de preparación</p><p class="ds-p">${multi(c.condicionesPreparacion)}</p>
    <p class="ds-h">Objetivos y efectos generales</p><p class="ds-p">${multi(c.objetivosEfectos)}</p>
    <p class="ds-h">Notas de evolución y pronóstico</p><p class="ds-p">${multi(c.notaEvolucion)}</p><p class="ds-p">${multi(c.pronostico)}</p>
    <p class="ds-h">Recomendaciones / tareas para casa</p><p class="ds-p">${multi(c.recomendaciones)}</p>`, SIN_LOGOS);
}

/* DOC 4 · Plan de Seguimiento */
export function planSeguimiento(s = {}, cand = {}) {
  const c = s.campos || {};
  const filas = (s.sesiones || []).filter(r => r && (r.frecuencia || r.duracion || r.numero)).map((r, i) => [String(r.numero || i + 1), r.frecuencia, r.duracion]);
  return hoja('PLAN DE SEGUIMIENTO', `<p class="ds-doc">DOC 4</p>
    ${datos([['Nombre del usuario:', c.usuarioNombre], ['Fecha:', fechaFormato(c.fechaSesion || hoyIso())], ['Teléfono móvil:', c.telefonoMovilSeguimiento], ['Teléfono fijo:', c.telefonoFijoSeguimiento],
      ['Correo electrónico:', c.correoSeguimiento], ['Medio de contacto para seguimiento:', c.medioContacto]])}
    <table class="ds-t"><thead><tr><th style="width:30mm">Sesión No.</th><th>Frecuencia</th><th>Duración</th></tr></thead>
      <tbody>${(filas.length ? filas : [['1', '', '']]).map(f => `<tr><td>${esc(f[0])}</td><td>${v(f[1])}</td><td>${v(f[2])}</td></tr>`).join('')}</tbody></table>
    <p class="ds-h">Nota de evolución:</p><p class="ds-p">${multi(c.notaEvolucion)}</p>
    <p class="ds-h">Pronóstico:</p><p class="ds-p">${multi(c.pronostico)}</p>
    <p class="ds-h">Recomendaciones / ejercicios para casa:</p><p class="ds-p">${multi(c.recomendaciones)}</p>
    ${firmas(bloqueFirma('Nombre completo y firma del usuario', c.usuarioNombre, s.firmas?.usuarioSeguimiento), bloqueFirma('Nombre y firma del profesional', cand.nombre, cand.firma))}`, SIN_LOGOS);
}

/* DOC 5 · Formato F-EC1375-05 Encuesta de Satisfacción (v53, formato de
   Humberto): la contesta y firma el usuario al terminar el servicio. */
export function encuestaUsuario(s = {}, cand = {}) {
  const c = s.campos || {}, e = s.encuesta || {}, r = e.r || {}, com = e.comentarios || {};
  const filas = g => g.items.map((t, i) => `<tr><td class="it">${esc(t)}</td>${ENCUESTA_USUARIO.escala.map(n => `<td class="x">${Number(r[`${g.k}-${i}`]) === n ? 'X' : ''}</td>`).join('')}</tr>`).join('');
  const comentario = g => `<tr class="com"><td class="g" colspan="6"><b>COMENTARIOS</b> ${multi(com[g.k] || '').replace(/^—$/, '')}</td></tr>`;
  const [servicio, ...resto] = ENCUESTA_USUARIO.grupos;
  return hoja('Encuesta de Satisfacción', `<p class="ds-doc">DOC 5</p>
    <p class="eu-tit" style="margin-bottom:2mm">Formato ${ENCUESTA_USUARIO.clave}<br>Encuesta de Satisfacción</p>
    <table class="eu"><tr><td class="v" colspan="6" style="font-weight:normal"><b>NOMBRE COMPLETO</b> ${esc(c.usuarioNombre || '')}<br>
      <b>EDAD</b> ${esc(c.usuarioEdad || '')}<br><b>SERVICIO RECIBIDO:</b> ${esc(e.servicioRecibido || tecnicaEfectiva(c))}</td></tr></table>
    <p class="ds-p">Marque con una X la puntuación que considere más acorde con el servicio recibido (1 muy deficiente, 5 excelente) Con escala del 1 al 5.</p>
    <table class="eu"><tr class="v"><td>${servicio.t}</td>${ENCUESTA_USUARIO.escala.map(n => `<td class="x">${n}</td>`).join('')}</tr>
      ${filas(servicio)}${comentario(servicio)}
      ${resto.map(g => `<tr class="v"><td colspan="6">${g.t}</td></tr>${filas(g)}${comentario(g)}`).join('')}</table>
    <div class="eu-firma">${firmas(bloqueFirma('Nombre completo y firma del usuario:', c.usuarioNombre, s.firmas?.usuarioEncuesta))}</div>`, { sinTitulo: true, sinLogos: true });
}

/* Verificación del espacio y las herramientas (E1·P1 y E1·P2) */
export function verificacionEspacio(s = {}, cand = {}) {
  const p = s.prep || {}, c = s.campos || {};
  const fila = (t, ok) => `<tr><td>${esc(t)}</td><td class="x">${ok ? 'SÍ' : 'NO'}</td></tr>`;
  return hoja('VERIFICACIÓN DEL ESPACIO Y LAS HERRAMIENTAS', `
    ${datos([['Prestador del servicio:', cand.nombre], ['Fecha:', fechaFormato(c.fechaSesion || hoyIso())], ['Lugar:', c.avisoDomicilio || cand.domicilioCompleto || cand.domicilio]])}
    <table class="ds-t ds-chk"><thead><tr><th>Preparación del espacio</th><th style="width:12mm">Cumple</th></tr></thead><tbody>${PREP_ITEMS.map((t, i) => fila(t, p['prep-' + i])).join('')}</tbody></table>
    <table class="ds-t ds-chk"><thead><tr><th>Protocolo sanitario</th><th style="width:12mm">Cumple</th></tr></thead><tbody>${PREP_PROTOCOLO.map((t, i) => fila(t, p['proto-' + i])).join('')}</tbody></table>
    <p class="ds-h">Equipo y materiales disponibles</p><p class="ds-p">${PREP_MATERIALES.map(esc).join(' · ')}</p>
    ${firmas(bloqueFirma('Nombre y firma del prestador del servicio', cand.nombre, cand.firma))}`);
}

const GEN = { ficha: fichaRegistro, consentimiento: cartaConsentimiento, plan_sesion: planSesion, plan_seguimiento: planSeguimiento, encuesta_usuario: encuestaUsuario, verificacion_espacio: verificacionEspacio };
export const documentoSesion = (clave, s, cand) => `<style>${estilosSesion()}</style>` + GEN[clave](s, cand);
/* Documento suelto (para abrir, imprimir o guardar como PDF) */
export function documentoSesionSuelto(clave, s, cand) {
  const d = DOCS_SESION.find(x => x.clave === clave);
  return envolverOficial(`${d.titulo}${s?.campos?.usuarioNombre ? ' — ' + s.campos.usuarioNombre : ''}`, documentoSesion(clave, s, cand));
}
/* Todos, en un solo documento */
export function todosLosDocumentos(s, cand) {
  return envolverOficial('Documentos de la sesión', `<style>${estilosSesion()}</style>` + DOCS_SESION.map(d => GEN[d.clave](s, cand)).join(''));
}
