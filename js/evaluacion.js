/* ============================================================================
   POSTURALIA · evaluacion.js — Circuito del Centro Evaluador

   Puerto de evaluacion.js + iec.js de Paideia (18–22 sep 2026), sin red:
     · ETAPAS después de Evidencias (revisión, registro en la SEP, dictamen,
       pago de Entrega, portafolio a la SEP, trámite, recibido, entregado).
     · Cédula de Evaluación: juicio, comentarios, firma del evaluador; al
       publicar, la anterior pasa al historial y el candidato vuelve a firmar.
     · IEC: califica los 142 reactivos con las reglas del propio instrumento
       (AHV al revés; COMPETENTE = 97.64 y un reactivo cumplido por cada
       criterio de producto/desempeño; sin "No aplica").
     · Plan del portafolio: el orden de assemble_expediente.py de Paideia.

   Dónde se guarda: en el panel (admin-data.js → datos.evaluaciones[correo]).
   En modo local la Cédula la firma el candidato en persona, en el mismo
   dispositivo del evaluador; con la nube, desde su propio panel.
   ========================================================================== */
import { REACTIVOS, CUESTIONARIO, UMBRAL, TOTAL, ELEMENTOS, TIPOS } from './data-iec.js';
import { GRUPOS_CUESTIONARIO } from './data-cuestionario-iec.js';

export const ETAPAS = [
  { clave: 'evidencias',     label: 'Evidencias recibidas',                 manual: false },
  { clave: 'revision',       label: 'En revisión del evaluador',            manual: true  },
  { clave: 'registro_sep',   label: 'Registrado en el portal de la SEP',    manual: true  },
  { clave: 'dictamen',       label: 'Dictamen de la evaluación',            manual: false },
  { clave: 'pago_entrega',   label: 'Pago de Entrega',                      manual: false },
  { clave: 'portafolio_sep', label: 'Portafolio enviado a la SEP',          manual: true  },
  { clave: 'tramite',        label: 'Certificado en trámite (unos 90 días)',manual: true  },
  { clave: 'recibido',       label: 'Certificado recibido',                 manual: true  },
  { clave: 'entregado',      label: 'Certificado entregado',                manual: true  },
];
/* El instrumento imprime "TODAVÍA NO COMPETENTE" (IEC, pág. 74) y así lo
   dice el expediente aprobado; "NO COMPETENTE" se sigue aceptando para las
   Cédulas guardadas antes del cambio, y al imprimirse sale con el texto
   oficial (como Paideia, 23 sep). */
export const NO_COMPETENTE = 'TODAVÍA NO COMPETENTE';
export const JUICIOS = ['COMPETENTE', NO_COMPETENTE];
export const JUICIOS_ACEPTADOS = [...JUICIOS, 'NO COMPETENTE'];
export const juicioOficial = j => (j === 'NO COMPETENTE' ? NO_COMPETENTE : (j || ''));
export const CAMPOS_CEDULA = [
  { id: 'mejoresPracticas',     label: 'Mejores prácticas' },
  { id: 'areasOportunidad',     label: 'Áreas de oportunidad' },
  { id: 'criteriosNoCubiertos', label: 'Criterios de Evaluación que no se cubrieron' },
  { id: 'recomendaciones',      label: 'Recomendaciones' },
];
export const TEXTO_ACUERDO = 'Estoy de acuerdo con el juicio de evaluación y satisfecho con los comentarios emitidos.';

const texto = v => (typeof v === 'string' ? v.trim() : '');
const redondear = n => Math.round(n * 100) / 100;

export function cedulaPublicada(ev) {
  const c = ev?.cedula;
  return c && !c.borrador && JUICIOS_ACEPTADOS.includes(c.juicio) ? c : null;
}
export function dictamenDe(ev) {
  const c = cedulaPublicada(ev);
  return c ? (c.juicio === 'COMPETENTE' ? 'competente' : 'no_competente') : null;
}

/* ctx = { evaluacion, evidenciasHechas, entregaPagada }. Las etapas manuales
   solo cuentan si el equipo las marcó; con TODAVÍA NO COMPETENTE lo que sigue al
   dictamen queda bloqueado. */
export function lineaDeTiempo(ctx = {}) {
  const ev = ctx.evaluacion || {};
  const marcadas = ev.etapas || {};
  const ced = cedulaPublicada(ev);
  const dictamen = dictamenDe(ev);
  const noComp = dictamen === 'no_competente';
  const iD = ETAPAS.findIndex(e => e.clave === 'dictamen');
  const etapas = ETAPAS.map((e, i) => {
    let hecha = false, fecha = null;
    if (e.clave === 'evidencias') hecha = !!ctx.evidenciasHechas;
    else if (e.clave === 'dictamen') { hecha = !!ced; fecha = ced?.publicada_at || null; }
    else if (e.clave === 'pago_entrega') hecha = !!ctx.entregaPagada;
    else if (marcadas[e.clave]) { hecha = true; fecha = marcadas[e.clave].fecha || null; }
    const bloqueada = noComp && i > iD;
    if (bloqueada) { hecha = false; fecha = null; }
    return { ...e, hecha, fecha, bloqueada };
  });
  const actual = noComp ? 'dictamen' : (etapas.find(e => !e.hecha)?.clave || null);
  return { etapas, actual, dictamen };
}

/* ── Nube: lo que ve el candidato y cómo se juntan dos copias ────────────
   El candidato solo recibe su Cédula publicada, las etapas y su firma (el
   IEC y las notas internas no salen del equipo). */
export function paraCandidato(ev = {}) {
  const ced = cedulaPublicada(ev);
  return { cedula: ced ? { ...ced, firmaEvaluador: ced.firmaEvaluador || null } : null, etapas: ev.etapas || {},
           firma_candidato: ced ? (ev.firma_candidato || null) : null, actualizado_at: ev.actualizado_at || null };
}
/* Dos copias de la misma evaluación (este navegador y la nube): gana la más
   reciente, pero la firma del candidato no se pierde si firmó la MISMA
   Cédula que sigue publicada (la firma entra por su lado, con el RPC). */
export function combinarEvaluaciones(local, remota) {
  if (!remota) return local || {};
  if (!local) return remota;
  const t = x => Date.parse(x?.actualizado_at || 0) || 0;
  const base = t(remota) > t(local) ? { ...local, ...remota } : { ...remota, ...local };
  const misma = (a, b) => !!(a?.cedula?.publicada_at && a.cedula.publicada_at === b?.cedula?.publicada_at);
  /* Una firma solo vale para la Cédula que se firmó: si se volvió a
     publicar, ninguna de las dos copias trae firma de ESA Cédula. */
  base.firma_candidato = [local, remota].find(x => x?.firma_candidato && misma(x, base))?.firma_candidato || null;
  return base;
}

export function firmaValida(f) {
  if (!f || typeof f !== 'object') return false;
  if (f.mode === 'draw') return typeof f.dataUrl === 'string' && /^data:image\//.test(f.dataUrl);
  if (f.mode === 'type') return texto(f.typedName).length >= 3;
  return false;
}

export function validarCedula(c = {}) {
  const falta = [];
  if (!texto(c.evaluadora)) falta.push('Nombre del evaluador(a)');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto(c.fecha))) falta.push('Fecha');
  if (!JUICIOS_ACEPTADOS.includes(c.juicio)) falta.push('Juicio (COMPETENTE / TODAVÍA NO COMPETENTE)');
  if (!CAMPOS_CEDULA.some(k => texto(c[k.id]))) falta.push('Al menos un comentario del resultado');
  if (!firmaValida(c.firmaEvaluador)) falta.push('Firma del evaluador(a)');
  return falta;
}

export function publicarCedula(ev = {}, datos, { ahora = new Date().toISOString(), por = '' } = {}) {
  const actual = ev.cedula, anteriores = ev.cedulas_anteriores || [];
  const archivar = actual && !actual.borrador;
  return {
    cedula: { ...datos, borrador: false, publicada_at: ahora, por },
    cedulas_anteriores: archivar ? [...anteriores, { ...actual, firma_candidato: ev.firma_candidato || null, archivada_at: ahora }] : anteriores,
    firma_candidato: null,
  };
}
export function guardarBorrador(ev = {}, datos, { por = '' } = {}) {
  return { cedula: { ...datos, borrador: true, por }, firma_candidato: ev.firma_candidato || null };
}

/* ── IEC ─────────────────────────────────────────────────────────────── */
export function criteriosIec() {
  const vistos = {}, lista = [];
  REACTIVOS.forEach(r => {
    if (!vistos[r.crit]) { vistos[r.crit] = { clave: r.crit, tipo: r.tipo, elem: r.elem, reactivos: [] }; lista.push(vistos[r.crit]); }
    vistos[r.crit].reactivos.push(r.n);
  });
  return lista;
}

export function calificarIec(respuestas = {}) {
  let puntos = 0, penalizacion = 0;
  const sinContestar = [], cumplido = {};
  REACTIVOS.forEach(r => {
    const v = respuestas[r.n];
    if (v !== 'si' && v !== 'no') { sinContestar.push(r.n); return; }
    if (v === 'si') { cumplido[r.crit] = true; if (r.tipo !== 'AHV') puntos += r.peso; }
    else if (r.tipo === 'AHV') penalizacion += r.peso;
  });
  puntos = redondear(puntos); penalizacion = redondear(penalizacion);
  const total = redondear(puntos - penalizacion);
  const criteriosSinCumplir = criteriosIec().filter(c => (c.tipo === 'D' || c.tipo === 'P') && !cumplido[c.clave]).map(c => c.clave);
  return {
    puntos, penalizacion, total, umbral: UMBRAL, maximo: TOTAL, alcanzaPuntaje: total >= UMBRAL,
    criteriosSinCumplir, sinContestar, contestados: REACTIVOS.length - sinContestar.length, reactivos: REACTIVOS.length,
    completo: sinContestar.length === 0,
    juicio: total >= UMBRAL && !criteriosSinCumplir.length ? 'COMPETENTE' : NO_COMPETENTE,
  };
}

export const faltanCuestionario = (c = {}) => CUESTIONARIO.filter(q => !texto(c[q.n])).map(q => q.n);

/* ── Cuestionario oficial (reactivos 135–142) ─────────────────────────────
   La respuesta se guarda como letras: 'c)' · relacionar 'e),c),b)' en el
   orden de la columna izquierda · Desinfección 'b),c),e) | a),d),f)'.
   Las respuestas guardadas antes (texto completo de la opción, p. ej.
   «a) Masaje Zapoteca») se leen por su letra. */
const LETRA = /^\s*\(?([a-z])\)/i;
export function letraDe(v) { const m = LETRA.exec(String(v ?? '')); return m ? m[1].toLowerCase() + ')' : ''; }
export function normalizarRespuesta(q, v) {
  const t = texto(v); if (!t) return '';
  if (q.tipo !== 'relacionar_columnas') return letraDe(t) || t;
  return t;
}
/* Respuesta correcta como se imprime en el Anexo 2 */
export function correctaTexto(q) {
  if (typeof q.correcta === 'string') return q.correcta;
  return q.correcta.map(c => c.letras ? c.letras.join(',') : c.letra).join(q.correcta[0]?.letras ? ' | ' : ',');
}
const partes = v => String(v || '').split(/\s*[,|]\s*/).map(letraDe).filter(Boolean);
export function esCorrecta(q, v) {
  const r = normalizarRespuesta(q, v); if (!r) return null;
  if (typeof q.correcta === 'string') return r === q.correcta;
  if (q.correcta[0]?.letras) {
    const grupos = String(r).split('|').map(g => partes(g).sort().join(','));
    return q.correcta.every((c, i) => grupos[i] === [...c.letras].sort().join(','));
  }
  const l = partes(r);
  return l.length === q.correcta.length && q.correcta.every((c, i) => l[i] === c.letra);
}
/* SÍ/No de cada reactivo de conocimiento según el Anexo 2: SÍ si todas las
   preguntas de su grupo están bien; null mientras falte alguna. */
export function calificarCuestionario(cuest = {}) {
  const out = {};
  GRUPOS_CUESTIONARIO.forEach(g => {
    const qs = CUESTIONARIO.filter(q => q.reactivo === g.reactivo);
    const res = qs.map(q => esCorrecta(q, cuest[q.n]));
    out[g.reactivo] = res.some(x => x === null) ? null : (res.every(Boolean) ? 'si' : 'no');
  });
  return out;
}

export function validarIec(iec = {}) {
  const faltan = [];
  const c = calificarIec(iec.respuestas);
  if (!c.completo) faltan.push(`Contestar los ${c.sinContestar.length} reactivos que faltan (el IEC no admite "No aplica")`);
  const q = faltanCuestionario(iec.cuestionario);
  if (q.length) faltan.push(`Anotar la respuesta del candidato en ${q.length} pregunta${q.length > 1 ? 's' : ''} del cuestionario`);
  if (!texto(iec.fecha)) faltan.push('Fecha de aplicación');
  return faltan;
}

/* Sugerencias con respaldo documental en el expediente de POSTURALIA:
   examen aprobado → conocimientos; productos cuyo documento se entregó.
   Desempeños y actitudes salen del video: los marca el evaluador. */
const PRODUCTO_DOC = { P1E2: 'ficha', P1E3: 'consentimiento', P1E4: 'plan_seguimiento', P2E4: 'plan_sesion' };
export function sugerenciasIec(expediente) {
  const mods = Object.fromEntries(Object.entries(expediente?.estado || {}).map(([k, v]) => [k, v?.datos || {}]));
  const out = {}, fuentes = {};
  const ex = mods.examen || {};
  if (ex.aprobado === true || (ex.score != null && ex.score >= 80)) REACTIVOS.forEach(r => {
    if (r.tipo === 'C') { out[r.n] = 'si'; fuentes[r.n] = 'Examen de Conocimientos aprobado'; }
  });
  const docs = mods.documentos?.documentos || {};
  REACTIVOS.forEach(r => {
    const k = PRODUCTO_DOC[r.crit];
    if (k && docs[k]) { out[r.n] = 'si'; fuentes[r.n] = 'El documento está en el expediente'; }
  });
  /* Con el examen aprobado se proponen también las 37 respuestas del
     cuestionario con la clave del Anexo 2 (como Paideia). Siguen siendo una
     propuesta: el evaluador las ve marcadas y cambia la que no corresponda. */
  const cuestionario = {}, fuentesCuestionario = {};
  if (ex.banco === 'iec1375-oficial-v2' && ex.primerIntento && Object.keys(ex.primerIntento).length) {
    /* El examen guiado ES el cuestionario oficial: se propone lo que el
       candidato contestó la PRIMERA vez (después ya vio la correcta), y el
       Sí/No de cada reactivo de conocimiento sale de ahí con el Anexo 2. */
    CUESTIONARIO.forEach(q => { const v = ex.primerIntento[q.n]; if (texto(v)) { cuestionario[q.n] = v; fuentesCuestionario[q.n] = 'Su primera respuesta en el Examen de Conocimientos'; } });
    const c = calificarCuestionario(cuestionario);
    REACTIVOS.filter(r => r.tipo === 'C').forEach(r => {
      if (c[r.n]) { out[r.n] = c[r.n]; fuentes[r.n] = c[r.n] === 'si' ? 'Acertó al primer intento en el Examen' : 'Falló al primer intento en el Examen'; }
      else { delete out[r.n]; delete fuentes[r.n]; }
    });
  } else if (ex.aprobado === true || (ex.score != null && ex.score >= 80)) CUESTIONARIO.forEach(q => {
    const c = correctaTexto(q); if (c) { cuestionario[q.n] = c; fuentesCuestionario[q.n] = 'Examen de Conocimientos aprobado'; }
  });
  return { respuestas: out, fuentes, cuestionario, fuentesCuestionario };
}

/* ── «Calificar el IEC» (como admin-iec.html de Paideia) ───────────────────
   El candado es la grabación: los 81 desempeños y las 5 actitudes se
   califican viéndola; sin video no hay con qué. */
export const ESTADOS_IEC = {
  listo:      { etiqueta: 'Listo para calificar', orden: 0 },
  empezado:   { etiqueta: 'A medias', orden: 1 },
  calificado: { etiqueta: 'Calificado', orden: 2 },
  sin_video:  { etiqueta: 'Falta su grabación', orden: 3 },
};
export function ligaVideoDe(ev = {}, expediente = {}) {
  const v = ev?.video?.liga;
  const dc = expediente?.estado?.evidencias?.datos?.documentos?.video;
  const liga = texto(v) || texto(typeof dc === 'string' ? dc : dc?.liga);
  return /^https?:\/\//i.test(liga) ? liga : '';
}
export function estadoIec(ev = {}, expediente = {}) {
  const iec = ev?.iec || {};
  const c = calificarIec(iec.respuestas);
  const faltaQ = faltanCuestionario(iec.cuestionario).length;
  const hayVideo = !!ligaVideoDe(ev, expediente);
  const completo = c.completo && !faltaQ;
  const clave = completo ? 'calificado' : !hayVideo ? 'sin_video' : (c.contestados || CUESTIONARIO.length - faltaQ) ? 'empezado' : 'listo';
  return { clave, ...ESTADOS_IEC[clave], puedeCalificar: hayVideo, hayVideo, contestados: c.contestados, reactivos: c.reactivos,
    cuestionarioHechas: CUESTIONARIO.length - faltaQ, cuestionario: CUESTIONARIO.length, total: c.total, juicio: c.juicio };
}
/* «Todo Sí» de un grupo: respeta los No ya marcados (son decisión del
   evaluador; borrarlos en silencio cambia el juicio). Devuelve cuántos respetó. */
export function todoSiGrupo(respuestas, observaciones, { elem, tipo, grupo }) {
  const del = REACTIVOS.filter(r => r.elem === elem && r.tipo === tipo && r.grupo === grupo);
  let respetados = 0;
  del.forEach(r => { if (respuestas[r.n] === 'no') { respetados++; return; } respuestas[r.n] = 'si'; delete observaciones[r.n]; });
  return { marcados: del.length - respetados, respetados };
}
/* Sí con observación: en el instrumento la observación es la razón de un No */
export const contradiccionesIec = (respuestas = {}, observaciones = {}) =>
  REACTIVOS.filter(r => respuestas[r.n] === 'si' && texto(observaciones[r.n])).map(r => r.n);

export function guardarIec(prev = {}, d = {}, { por = '' } = {}) {
  const c = calificarIec(d.respuestas);
  const cuest = {};
  CUESTIONARIO.forEach(q => { const v = normalizarRespuesta(q, (d.cuestionario || {})[q.n]); if (v) cuest[q.n] = v; });
  return {
    ...prev, respuestas: d.respuestas || {}, observaciones: d.observaciones || {}, cuestionario: cuest,
    fecha: texto(d.fecha), puntos: c.puntos, penalizacion: c.penalizacion, total: c.total, juicio: c.juicio,
    completo: c.completo && !faltanCuestionario(cuest).length, por: por || prev.por || '',
    actualizado_at: new Date().toISOString(),
  };
}

export function seccionesIec() {
  const out = [], porElem = {};
  REACTIVOS.forEach(r => {
    if (!porElem[r.elem]) { porElem[r.elem] = { elem: r.elem, titulo: ELEMENTOS[r.elem], grupos: [], _g: {} }; out.push(porElem[r.elem]); }
    const e = porElem[r.elem], llave = r.tipo + '|' + r.grupo;
    if (!e._g[llave]) { e._g[llave] = { titulo: r.grupo, tipo: r.tipo, tipoNombre: TIPOS[r.tipo], reactivos: [] }; e.grupos.push(e._g[llave]); }
    e._g[llave].reactivos.push(r);
  });
  out.forEach(e => delete e._g);
  return out.sort((a, b) => a.elem - b.elem);
}

/* ── Portafolio: mismo orden que el FORMATO PORTAFOLIO-1375-2026 y que
   assemble_expediente.py de Paideia ─────────────────────────────────── */
export const SECCIONES_PORTAFOLIO = [
  { id: 'portada',   titulo: 'Portada', generado: true },
  { id: 'indice',    titulo: 'Índice', generado: true },
  { id: 'sep1',      titulo: '1. Datos del Candidato/a', separador: true },
  { id: 'ficha_registro', titulo: 'Ficha de Registro (SII / RENAP)', generado: true },
  { id: 'curp',      titulo: 'CURP', modulo: 'evidencias', doc: 'curp' },
  { id: 'ine',       titulo: 'INE (ambos lados)', modulo: 'evidencias', doc: 'ine' },
  { id: 'autodiag',  titulo: 'Autodiagnóstico (formato CONOCER, 16 hojas)', generado: true },
  { id: 'derechos',  titulo: 'Tríptico de Derechos y Obligaciones', generado: true },
  { id: 'sep2',      titulo: '2. Recopilación de Evidencias', separador: true },
  { id: 'plan',      titulo: 'Plan de Evaluación', generado: true },
  { id: 'iec',       titulo: 'Instrumento de Evaluación de Competencia (IEC completo, foliado)', generado: true },
  { id: 'productos', titulo: 'Productos DOC 1–5: ficha de registro, consentimiento, plan de sesión, plan de seguimiento y encuesta del usuario', modulo: 'documentos', docs: ['ficha', 'consentimiento', 'plan_sesion', 'plan_seguimiento', 'encuesta_usuario'] },
  { id: 'video',     titulo: 'Liga de la grabación de la sesión', generado: true },
  { id: 'sep3',      titulo: '3. Cierre de Evaluación', separador: true },
  { id: 'cedula',    titulo: 'Cédula de Evaluación', generado: true },
  { id: 'encuesta',  titulo: 'Encuesta de Satisfacción del Proceso de Evaluación', modulo: 'encuesta', doc: 'encuesta' },
  { id: 'verificacion', titulo: 'Verificación Interna del Proceso de Evaluación', generado: true },
  { id: 'cedula_servicio', titulo: 'Cédula de Evaluación del Servicio a usuarios', generado: true },
  { id: 'atencion',  titulo: 'Formato de Atención a Usuarios', generado: true },
  { id: 'sep4',      titulo: '4. Anexos', separador: true },
  { id: 'acuses',    titulo: 'Acuses de recibido: tríptico, cédula y plan', generado: true },
  { id: 'acuse_plan',titulo: 'Acuse de recibido — Plan de Evaluación', modulo: 'plan', doc: 'acusePlanEvaluacion' },
  { id: 'firma_electronica', titulo: 'Autorización de firma electrónica', generado: true },
  /* Como Paideia (22 sep): la foto para el diploma y los certificados de
     formación van al final, en su propio bloque de Anexos. Los certificados
     son opcionales, así que solo la foto genera aviso. */
  { id: 'foto_certificados', titulo: 'Foto para el diploma y certificados de formación', modulo: 'evidencias', doc: 'fotoDiploma' },
  { id: 'contraportada', titulo: 'Contraportada', generado: true },
];

/* Los 14 puntos numerados de la Verificación Interna (página 41 del
   formato); el texto de cada uno vive en doc-portafolio.js. */
export const PUNTOS_VERIFICACION_N = Array.from({ length: 14 }, (_, i) => i + 1);

/* Qué le falta al portafolio de un expediente para poder armarse */
export function avisosPortafolio(expediente, ev = {}) {
  const avisos = [];
  const datosDe = m => expediente?.estado?.[m]?.datos || {};
  SECCIONES_PORTAFOLIO.forEach(s => {
    if (!s.modulo) return;
    const docs = datosDe(s.modulo).documentos || {};
    const faltan = (s.docs || [s.doc]).filter(k => !docs[k] && !docs[`firmado_${k}`]);
    if (faltan.length) avisos.push(`Falta «${s.titulo}» (el candidato todavía no lo entrega)`);
  });
  /* La portada oficial lleva el lote (como sellosPortafolio de Paideia): un
     prospecto sin alta saldría con el Lote 1 que se le supone por defecto. */
  if (expediente && (expediente.sinAlta || !expediente.lote)) avisos.push('El candidato no tiene lote asignado (va en la portada): dalo de alta en Precios y pagos');
  /* v47: cada archivo entregado, revisado. Uno que llegó solo con su ficha
     (nombre y peso, sin el archivo) saldría como hoja «pendiente»; uno con
     aviso de la revisión (la CURP del PDF no es la del registro) hay que
     verlo antes de mandar el portafolio a la SEP. */
  const NOMBRES = { curp: 'CURP', ine: 'INE', fotoDiploma: 'Foto para el diploma', certificados: 'Certificados', zoom: 'Capturas de la sesión', fotoRegistro: 'Foto de la Ficha de Registro' };
  const fuentes = [['candidato', expediente?.candidato?.documentos || {}], ...Object.keys(expediente?.estado || {}).map(m => [m, datosDe(m).documentos || {}])];
  for (const [, docs] of fuentes) for (const [k, v] of Object.entries(docs)) {
    if (!v || typeof v !== 'object') continue;
    /* Lo que la plataforma genera (formatos llenos en línea, la Encuesta)
       no es un archivo subido: no se revisa aquí. */
    const archivos = (Array.isArray(v) ? v : [v]).filter(a => a && typeof a === 'object' && !a.liga && !a.generado && !a.enLinea && !a.lleno && !a.firmado);
    const nombre = NOMBRES[k] || (k.startsWith('cert_') ? 'Certificado de la Ficha de Registro' : k.startsWith('firmado_') ? `Formato firmado (${k.slice(8)})` : k);
    archivos.forEach(a => {
      if (a.perdido || !(a.dato || a.enAlmacen))
        avisos.push(`«${nombre}» (${a.nombre || 'archivo'}) no llegó completo: pídeselo al candidato y que lo vuelva a subir`);
      else if (a.revision?.nivel === 'aviso')
        avisos.push(`«${nombre}»: ${(a.revision.notas || []).filter(t => !/^(PDF de|Foto de)/.test(t)).join(' ')}`);
    });
    if (k === 'ine' && archivos.length === 1 && !(archivos[0].paginas >= 2))
      avisos.push('INE: llegó un solo archivo de una página. Revisa que traiga frente y reverso');
  }
  if (!ev.video?.liga) avisos.push('Falta ligar la grabación de la sesión');
  if (!cedulaPublicada(ev)) avisos.push('Falta publicar la Cédula de Evaluación');
  if (!ev.iec?.completo) avisos.push('Falta terminar de calificar el IEC');
  const choques = contradiccionesIec(ev.iec?.respuestas || {}, ev.iec?.observaciones || {});
  if (choques.length) avisos.push(`El IEC trae ${choques.length} reactivo${choques.length > 1 ? 's' : ''} en Sí con observación (${choques.join(', ')}): revísalo${choques.length > 1 ? 's' : ''} en «Calificar el IEC» antes de entregar`);
  const v = ev.verificacion || {};
  const sinContestar = PUNTOS_VERIFICACION_N.filter(n => v[n] !== 'si' && v[n] !== 'no').length;
  if (sinContestar === PUNTOS_VERIFICACION_N.length) avisos.push('La Verificación Interna va en blanco: llénala en «Verificación Interna»');
  else if (sinContestar) avisos.push(`La Verificación Interna está incompleta: faltan ${sinContestar} punto${sinContestar > 1 ? 's' : ''} por contestar`);
  if (sinContestar < PUNTOS_VERIFICACION_N.length && !texto(v.verificador)) avisos.push('Falta el nombre de quien verifica el proceso (Verificación Interna)');
  const enc = datosDe('encuesta');
  if (enc.completado && (!enc.atencion?.medio || !enc.servicio?.medio))
    avisos.push('Falta que el candidato conteste el Formato de Atención a Usuarios y la Cédula del Servicio (en su Encuesta: «Cambiar mis respuestas»)');
  if (!datosDe('autodiagnostico').triptico?.firma) avisos.push('Falta el acuse firmado del Tríptico de Derechos y Obligaciones');
  if (!firmaValida(ev.firmas?.diagnostico)) avisos.push('Falta la firma del evaluador en el Resultado del Autodiagnóstico');
  if (!firmaValida(ev.firmas?.plan)) avisos.push('Falta la firma del evaluador en el Plan de Evaluación');
  if (!firmaValida(ev.firmas?.iec)) avisos.push('Falta la rúbrica del evaluador en el IEC');
  if (!firmaValida(ev.firmas?.cierre)) avisos.push('Falta la firma del evaluador en la Verificación Interna');
  return avisos;
}

/* Mensajes de WhatsApp por etapa (Paideia) */
export function mensajeWhatsApp(clave, { nombre = '', dictamen = null, liga = '' } = {}) {
  const hola = `Hola ${nombre}, `;
  const m = {
    revision: hola + 'tu evaluador(a) ya está revisando tus evidencias de la certificación EC1375. Sigue tu avance en tu panel: ',
    registro_sep: hola + 'ya quedaste registrado(a) en el portal de la SEP para tu certificación EC1375. Sigue tu avance en tu panel: ',
    portafolio_sep: hola + 'tu portafolio de evidencias ya se envió a la SEP. Sigue tu avance en tu panel: ',
    tramite: hola + 'tu certificado EC1375 ya está en trámite ante la SEP (unos 90 días). Te avisamos cuando llegue. Tu panel: ',
    recibido: hola + '¡ya recibimos tu certificado EC1375! Te contactamos para coordinar la entrega. Tu panel: ',
    entregado: hola + 'tu certificado EC1375 quedó entregado. ¡Felicidades y gracias por tu confianza! Tu panel: ',
  };
  if (clave === 'dictamen') return dictamen === 'competente'
    ? `¡Felicidades ${nombre}! Tu resultado de evaluación EC1375 es COMPETENTE. Entra a tu panel para leer tu Cédula de Evaluación y firmarla: ${liga}`
    : hola + `ya está tu Cédula de Evaluación EC1375. Entra a tu panel para leer los comentarios de tu evaluador(a): ${liga}`;
  return (m[clave] || hola + 'hay novedades en tu proceso EC1375. Revisa tu panel: ') + liga;
}
export function telefonoWhatsApp(t) {
  const d = String(t || '').replace(/\D/g, '');
  if (!d) return null;
  return d.length === 10 ? '52' + d : d;
}

export { GRUPOS_CUESTIONARIO };
export { REACTIVOS as REACTIVOS_IEC, CUESTIONARIO as CUESTIONARIO_IEC, UMBRAL as UMBRAL_IEC, ELEMENTOS as ELEMENTOS_IEC, TIPOS as TIPOS_IEC };
