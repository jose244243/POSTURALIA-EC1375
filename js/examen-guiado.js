/* ============================================================================
   POSTURALIA · examen-guiado.js — Examen de Conocimientos como el de Paideia

   Las 37 preguntas OFICIALES del cuestionario del IEC1375 (reactivos 135 a
   142), con la clave del Anexo 2 del instrumento oficial — sin las cuatro
   claves pendientes de validar del formulario anterior.

   Cómo funciona (igual que estudio.html?modo=examen de Paideia):
     · Una pregunta a la vez; se revisa al instante.
     · Si falla, ve cuál era la correcta, puede «Repasar este tema» y lo
       intenta otra vez. No avanza hasta acertar: todos terminan con 100 %.
     · Es una autoevaluación de práctica, no un juicio de competencia.
   Lo que sí cuenta para el evaluador es el PRIMER intento de cada pregunta:
   se guarda y le llega propuesto al calificar el cuestionario del IEC.

   Formato de respuesta (el mismo del IEC, evaluacion.js):
     opción múltiple  'c)'
     relacionar       'e),c),b)' en el orden de la columna izquierda
     varias letras    'b),c),e) | a),d),f)' (Desinfección vs Sanitización)
   ========================================================================== */
import { CUESTIONARIO, GRUPOS_CUESTIONARIO } from './data-cuestionario-iec.js';

export const BANCO_IEC = 'iec1375-oficial-v2';
export const PREGUNTAS = CUESTIONARIO;
export const TOTAL = CUESTIONARIO.length;

/* Material de la Biblioteca que sustenta cada reactivo de conocimiento */
export const REPASO = {
  135: ['v3-8', 'n-tecnicas'], 136: ['v3-23'], 137: ['v3-24', 'v3-25'], 138: ['v3-60', 'v3-54', 'n-hipotension', 'v3-61'],
  139: ['v3-65', 'v3-66'], 140: ['v3-67', 'v3-68', 'n-cuadrantes'], 141: ['v3-70', 'v3-72'], 142: ['v3-73', 'v3-74', 'v3-75'],
};
export const temaDe = q => GRUPOS_CUESTIONARIO.find(g => g.reactivo === q.reactivo);

const RE_OP = /^\s*([a-iA-I])\)\s*(.*)$/s;
/* Las opciones con su letra aparte; la «d)» vacía del oficial no se muestra */
export const opcionesDe = q => q.opciones.map(o => { const m = RE_OP.exec(String(o)); return m ? { letra: m[1].toLowerCase() + ')', texto: m[2].trim() } : { letra: '', texto: String(o) }; })
  .filter(o => o.letra && o.texto);
export const esMultiple = q => q.tipo === 'relacionar_columnas' && !!q.correcta[0]?.letras;
export const renglonesCorrectos = q => q.correcta.map(c => c.letras ? [...c.letras].sort().join(',') : c.letra);
const limpia = v => String(v || '').split(',').map(x => x.trim()).filter(Boolean).sort().join(',');

/* ¿Es correcta? Para relacionar dice también qué renglones sí */
export function revisar(q, resp) {
  if (q.tipo !== 'relacionar_columnas') return { ok: resp === q.correcta, renglones: null };
  const partes = esMultiple(q) ? String(resp || '').split('|').map(limpia) : String(resp || '').split(',').map(x => x.trim());
  const buenos = renglonesCorrectos(q);
  const renglones = buenos.map((b, i) => (esMultiple(q) ? limpia(partes[i]) : partes[i]) === b);
  return { ok: renglones.every(Boolean), renglones };
}

/* ── Estado ──────────────────────────────────────────────────────────── */
function barajar(a, rnd = Math.random) { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }
export function nuevo({ barajarOpciones = true, rnd = Math.random } = {}) {
  const ordenOpciones = {};
  PREGUNTAS.forEach(q => { const ls = opcionesDe(q).map(o => o.letra); ordenOpciones[q.n] = barajarOpciones && q.tipo !== 'relacionar_columnas' ? barajar(ls, rnd) : ls; });
  return { banco: BANCO_IEC, actual: 0, ordenOpciones, respuestas: {}, primer: {}, fallos: {}, repasados: [], enCurso: true, submitted: false };
}
export const valido = st => !!st && st.banco === BANCO_IEC && st.ordenOpciones && Object.keys(st.ordenOpciones).length === TOTAL;

/* Contestar. Devuelve { ok, renglones }. El primer intento se guarda una sola vez. */
export function responder(st, q, resp) {
  const r = revisar(q, resp);
  if (st.primer[q.n] === undefined) st.primer[q.n] = { resp, ok: r.ok };
  if (r.ok) { st.respuestas[q.n] = resp; delete st.fallos[q.n]; }
  else { st.fallos[q.n] = resp; if (!st.repasados.includes(q.reactivo)) st.repasados.push(q.reactivo); }
  return r;
}
/* Para intentarla otra vez: en relacionar se conservan los renglones buenos */
export function reintentar(st, q) {
  const prev = st.fallos[q.n]; delete st.fallos[q.n];
  if (q.tipo !== 'relacionar_columnas' || !prev) return null;
  const { renglones } = revisar(q, prev);
  const partes = esMultiple(q) ? String(prev).split('|') : String(prev).split(',');
  return partes.map((p, i) => renglones[i] ? p.trim() : '');
}
export const contestada = (st, q) => st.respuestas[q.n] !== undefined;
export const todas = st => PREGUNTAS.every(q => contestada(st, q));

export function resumen(st) {
  const primerOk = PREGUNTAS.filter(q => st.primer[q.n]?.ok).length;
  const porTema = GRUPOS_CUESTIONARIO.map(g => {
    const qs = PREGUNTAS.filter(q => q.reactivo === g.reactivo);
    return { reactivo: g.reactivo, tema: g.tema, total: qs.length, primerOk: qs.filter(q => st.primer[q.n]?.ok).length };
  });
  return { total: TOTAL, primerOk, pctPrimer: Math.round(primerOk / TOTAL * 100), porTema, repasados: [...st.repasados] };
}
/* Lo que se guarda en el expediente al terminar */
export function datosFinales(st, ahora = new Date().toISOString()) {
  const r = resumen(st);
  return {
    banco: BANCO_IEC, submitted: true, enCurso: false, aprobado: true, score: 100, correctas: TOTAL, total: TOTAL,
    primerIntento: Object.fromEntries(Object.entries(st.primer).map(([n, v]) => [n, v.resp])),
    primerOk: r.primerOk, pctPrimerIntento: r.pctPrimer, repasados: r.repasados,
    respuestas: { ...st.respuestas }, fecha: st.fecha || ahora,
  };
}
