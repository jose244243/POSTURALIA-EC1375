/* ============================================================================
   POSTURALIA · toolkit.js — «Tu toolkit profesional» (como Paideia, recursos)

   Formatos en blanco para el consultorio del egresado, con sus datos como
   responsable (encabezado y Aviso de Privacidad): Aviso de Privacidad, Carta
   de Consentimiento Informado, Plan de Sesión, Plan de Seguimiento y — lo que
   en Paideia sigue «Próximamente» — la Hoja terapéutica por paciente.

   Cada formato sale:
     · para imprimir / guardar como PDF (documento HTML tamaño carta), y
     · como Word editable (.doc: HTML que Word abre y deja modificar), sin
       librerías externas ni conexión.
   ========================================================================== */
import { avisoPrivacidadBloques, textoConsentimiento } from './data-sesion.js';

export const FALTANTE = '__________';
export const FORMATOS = [
  { id: 'aviso', titulo: 'Aviso de Privacidad', desc: 'Con tus datos como responsable, listo para que cada paciente firme de enterado.' },
  { id: 'consentimiento', titulo: 'Consentimiento Informado', desc: 'Carta de consentimiento con condiciones del servicio y aviso de privacidad incluido.' },
  { id: 'plan-sesion', titulo: 'Plan de Sesión', desc: 'Registro de cada sesión: signos vitales, técnica, evolución y tareas para casa.' },
  { id: 'plan-seguimiento', titulo: 'Plan de Seguimiento', desc: 'Contacto del paciente y calendario de sesiones programadas.' },
  { id: 'hoja-terapeutica', titulo: 'Hoja terapéutica', desc: 'Registro terapéutico de cada paciente: motivo, valoración, técnica y evolución sesión por sesión.' },
];

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const encabezado = (titulo, r) => {
  const partes = [r.responsable, r.domicilio, r.contacto].filter(Boolean);
  return [{ t: 'titulo', x: titulo }, { t: 'sub', x: partes.length ? partes.join(' · ') : 'Responsable: ' + FALTANTE }];
};
const PIE = { t: 'pie', x: 'Formato elaborado conforme al Estándar de Competencia EC1375.' };
const avisoSinTitulo = r => avisoPrivacidadBloques({ responsable: r.responsable || FALTANTE, domicilio: r.domicilio || FALTANTE, contacto: r.contacto || FALTANTE }, { evaluacion: false }).slice(1);

export function bloques(id, r = {}) {
  const prestador = 'Nombre y firma de quien brinda el servicio' + (r.responsable ? ` (${r.responsable})` : '');
  if (id === 'aviso') return [...encabezado('AVISO DE PRIVACIDAD', r), ...avisoSinTitulo(r),
    { t: 'campos', filas: ['Nombre del usuario', 'Fecha'] }, { t: 'firmas', items: ['Firma de enterado del usuario', prestador] }, PIE];
  if (id === 'consentimiento') return [...encabezado('CARTA DE CONSENTIMIENTO INFORMADO', r),
    { t: 'campos', filas: ['Fecha', 'Nombre del usuario', 'Edad', 'Fecha de nacimiento', 'Domicilio', 'Familiar o responsable a avisar', 'Técnica a aplicar', 'Expediente No.'] },
    { t: 'tabla', cols: ['Condiciones del servicio', 'Detalle'], filas: [['Zonas del cuerpo que se abordarán', ''], ['Vestimenta recomendada', ''], ['Reacciones o sensaciones posibles', ''],
      ['Limitantes de aplicación del servicio', ''], ['Condiciones de preparación', ''], ['Número de sesiones y duración', ''], ['Objetivos y efectos generales', '']] },
    { t: 'h', x: 'Aviso de Privacidad' }, ...avisoSinTitulo(r),
    { t: 'h', x: 'Declaración de consentimiento' }, { t: 'p', x: textoConsentimiento('') }, { t: 'firmas', items: ['Nombre completo y firma del usuario', prestador] }, PIE];
  if (id === 'plan-sesion') return [...encabezado('PLAN DE SESIÓN', r),
    { t: 'p', x: 'Este documento se integra con el Plan de Seguimiento para el control de las sesiones posteriores.' },
    { t: 'campos', filas: ['Usuario', 'Sesión No.', 'Fecha', 'Hora de inicio', 'Hora de término'] },
    { t: 'tabla', cols: ['Signos vitales', 'Valor'], filas: [['Presión arterial', ''], ['Pulso', ''], ['Temperatura', ''], ['Oxigenación (SpO2)', ''], ['Frecuencia respiratoria', '']] },
    { t: 'h', x: 'Descripción de actividades / técnica aplicada' }, { t: 'lineas', n: 4 },
    { t: 'h', x: 'Notas de evolución y pronóstico' }, { t: 'lineas', n: 4 },
    { t: 'h', x: 'Recomendaciones / tareas para casa' }, { t: 'lineas', n: 3 }, { t: 'firmas', items: ['Nombre y firma del usuario', prestador] }, PIE];
  if (id === 'plan-seguimiento') return [...encabezado('PLAN DE SEGUIMIENTO', r),
    { t: 'campos', filas: ['Nombre del usuario', 'Fecha', 'Teléfono móvil', 'Teléfono fijo', 'Correo electrónico', 'Medio de contacto para seguimiento'] },
    { t: 'tabla', cols: ['Sesión No.', 'Fecha', 'Hora', 'Frecuencia', 'Duración'], filas: [1, 2, 3, 4, 5, 6].map(n => [String(n), '', '', '', '']) },
    { t: 'h', x: 'Nota de evolución' }, { t: 'lineas', n: 3 }, { t: 'h', x: 'Pronóstico' }, { t: 'lineas', n: 2 },
    { t: 'h', x: 'Recomendaciones / ejercicios para casa' }, { t: 'lineas', n: 3 }, { t: 'firmas', items: ['Nombre completo y firma del usuario', prestador] }, PIE];
  if (id === 'hoja-terapeutica') return [...encabezado('HOJA TERAPÉUTICA', r),
    { t: 'campos', filas: ['Expediente No.', 'Nombre del usuario', 'Edad', 'Teléfono', 'Fecha de inicio', 'Médico tratante (si aplica)'] },
    { t: 'h', x: 'Motivo de consulta' }, { t: 'lineas', n: 2 },
    { t: 'h', x: 'Valoración inicial' },
    { t: 'tabla', cols: ['Aspecto', 'Hallazgo'], filas: [['Antecedentes relevantes', ''], ['Alergias / contraindicaciones', ''], ['Observación postural', ''], ['Zonas de dolor o tensión (escala 0–10)', ''], ['Limitaciones de movimiento', '']] },
    { t: 'h', x: 'Plan terapéutico' },
    { t: 'tabla', cols: ['Técnica', 'Zonas', 'Número de sesiones', 'Frecuencia'], filas: [['', '', '', ''], ['', '', '', '']] },
    { t: 'h', x: 'Evolución sesión por sesión' },
    { t: 'tabla', cols: ['Sesión', 'Fecha', 'PA / Pulso', 'Técnica y zonas', 'Dolor 0–10', 'Respuesta / observaciones'], filas: [1, 2, 3, 4, 5, 6, 7, 8].map(n => [String(n), '', '', '', '', '']) },
    { t: 'h', x: 'Alta / cierre del tratamiento' }, { t: 'lineas', n: 2 },
    { t: 'firmas', items: ['Nombre y firma del usuario', prestador] }, PIE];
  throw new Error('Formato desconocido: ' + id);
}

const sinAcentos = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '');
export function nombreArchivo(id, r = {}, ext = 'pdf') {
  const f = FORMATOS.find(x => x.id === id);
  return sinAcentos([f ? f.titulo : id, r.responsable].filter(Boolean).join(' ')).replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '') + '.' + ext;
}

/* ── HTML del formato (sirve para imprimir y para Word) ────────────────── */
function cuerpo(id, r) {
  return bloques(id, r).map(b => {
    if (b.t === 'titulo') return `<h1>${esc(b.x)}</h1>`;
    if (b.t === 'sub') return `<p class="sub">${esc(b.x)}</p>`;
    if (b.t === 'h') return `<h2>${esc(b.x)}</h2>`;
    if (b.t === 'p') return `<p>${esc(b.x)}</p>`;
    if (b.t === 'li') return `<ul><li>${esc(b.x)}</li></ul>`;
    if (b.t === 'pie') return `<p class="pie">${esc(b.x)}</p>`;
    if (b.t === 'campos') return `<table class="campos">${b.filas.map(f => `<tr><td class="et">${esc(f)}:</td><td class="ln">&nbsp;</td></tr>`).join('')}</table>`;
    if (b.t === 'tabla') return `<table class="tabla"><tr>${b.cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr>${b.filas.map(f => `<tr>${f.map(c => `<td>${esc(c) || '&nbsp;'}</td>`).join('')}</tr>`).join('')}</table>`;
    if (b.t === 'lineas') return Array.from({ length: b.n }, () => '<p class="linea">&nbsp;</p>').join('');
    if (b.t === 'firmas') return `<table class="firmas"><tr>${b.items.map((it, k) => `${k ? '<td class="hueco"></td>' : ''}<td class="firma">${esc(it)}</td>`).join('')}</tr></table>`;
    return '';
  }).join('\n');
}
const ESTILO = `
  @page { size: letter; margin: 16mm }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 10pt; color: #000; line-height: 1.35 }
  h1 { font-size: 15pt; margin: 0 0 1mm } h2 { font-size: 11pt; margin: 5mm 0 1.5mm; page-break-after: avoid }
  .sub { color: #555; font-size: 9pt; margin: 0 0 5mm } p { margin: 0 0 2mm; text-align: justify } ul { margin: 0 0 1mm 6mm; padding: 0 }
  table { border-collapse: collapse; width: 100%; margin: 0 0 4mm }
  .campos td { padding: 2mm 0 0; vertical-align: bottom } .campos .et { width: 62mm; font-weight: bold } .campos .ln { border-bottom: 1px solid #888 }
  .tabla th, .tabla td { border: 1px solid #888; padding: 1.8mm 2mm; text-align: left; vertical-align: top } .tabla th { background: #EBF1FA } .tabla td { height: 6mm }
  .linea { border-bottom: 1px solid #888; height: 6mm; margin: 0 0 1mm }
  .firmas { margin-top: 18mm } .firmas .firma { border-top: 1px solid #000; text-align: center; font-size: 9pt; padding-top: 1mm } .firmas .hueco { width: 8% }
  .pie { color: #777; font-size: 7.5pt; font-style: italic; margin-top: 6mm }
  .barra { position: sticky; top: 0; background: #0d2a6e; color: #fff; padding: 10px 16px; font: 600 14px system-ui, sans-serif; display: flex; justify-content: space-between; align-items: center }
  .barra button { font: inherit; padding: 8px 16px; border-radius: 8px; border: 0; background: #FFD700; color: #0a1f52; cursor: pointer }
  @media screen { body { max-width: 190mm; margin: 0 auto; padding: 0 12px 24px } } @media print { .barra { display: none } }`;
export function htmlImprimible(id, r = {}) {
  const f = FORMATOS.find(x => x.id === id);
  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>${esc(f.titulo)}${r.responsable ? ' — ' + esc(r.responsable) : ''}</title><style>${ESTILO}</style></head><body>
<div class="barra"><span>${esc(f.titulo)} · tamaño carta</span><button onclick="window.print()">Imprimir / Guardar PDF</button></div>
${cuerpo(id, r)}</body></html>`;
}
/* Word: HTML con el espacio de nombres de Office; Word lo abre como documento editable */
export function htmlWord(id, r = {}) {
  const f = FORMATOS.find(x => x.id === id);
  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>${esc(f.titulo)}</title><!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>${ESTILO.replace(/\.barra[\s\S]*?}\s*\.barra button[^}]*}/, '')}</style></head><body>${cuerpo(id, r)}</body></html>`;
}
export const blobWord = (id, r) => new Blob(['﻿', htmlWord(id, r)], { type: 'application/msword' });
