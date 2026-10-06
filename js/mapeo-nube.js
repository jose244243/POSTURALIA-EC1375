/* ============================================================================
   POSTURALIA · Plataforma de Certificación
   mapeo-nube.js — Traducción entre nuestros módulos y las columnas de Paideia

   El CRM de Paideia guarda UNA fila por candidato con una columna JSONB por
   bloque del proceso. Usamos exactamente esos nombres de columna para que un
   expediente se pueda mover entre los dos sistemas sin convertir nada.

   Paideia agrupa reforzamiento, alineación y práctica en `ruta_estudio_data`;
   nosotros los manejamos como módulos separados, así que ahí los anidamos y
   los volvemos a separar al leer.
   ========================================================================== */

import { limpiarExpediente } from './seguro.js';

/* módulo nuestro → columna de Paideia */
export const COLUMNA = {
  autodiagnostico: 'autodiagnostico_data',
  plan:            'plan_evaluacion_data',
  documentos:      'documentos_sesion_data',
  encuesta:        'encuesta_data',
  evidencias:      'evidencias_data',
  examen:          'examen_conocimientos_data',
};

/* Los tres que viven dentro de ruta_estudio_data */
/* biblioteca: lo que el candidato lleva leído del material. Antes se guardaba
   dentro de `alineacion` —y la cerraba—; ahora tiene su propia llave y viaja
   junto a las otras de estudio. */
export const EN_RUTA = ['reforzamiento', 'alineacion', 'practica', 'biblioteca'];

/* ── Lo que no es un módulo del flujo pero igual hay que llevarse ─────────
   Esto faltaba, y el modo de falla era el peor posible: silencioso y en el
   peor momento. `aFila()` solo copiaba lo que estuviera en COLUMNA o en
   EN_RUTA, así que la firma del candidato, su nombre y su fecha límite
   simplemente no subían. Nadie se enteraría hasta el día que se encendiera
   Supabase: el candidato abriría la plataforma en otra computadora, su
   expediente estaría ahí… y su firma no, y tendría que volver a firmar los
   acuerdos que ya había firmado.

   La firma va dentro de autodiagnostico_data porque es donde la captura
   Paideia —ahí ofrece "¿usar la misma firma de tu Autodiagnóstico?"—, así
   que un expediente sigue siendo legible desde los dos sistemas.

   El nombre y la fecha límite van en ruta_estudio_data, junto a las
   autorizaciones, que es el precedente que ya existía para lo que no cabe
   en una columna propia.                                                  */
export const ANIDADOS = {
  firma:           ['autodiagnostico_data', 'firma'],
  candidato:       ['ruta_estudio_data',    'candidato'],
  __limite:        ['ruta_estudio_data',    'limite'],
  __autorizaciones:['ruta_estudio_data',    'autorizaciones'],
  entrega:         ['ruta_estudio_data',    'entrega'],
};

/* Nada de lo que el candidato guarde debe quedar fuera sin que alguien lo
   decida a propósito. Esta función lista lo que NO viajaría, y una prueba la
   usa para que agregar un módulo nuevo no repita el descuido de la firma. */
export function sinMapear(modulos) {
  const cubiertos = new Set([
    ...Object.keys(COLUMNA), ...EN_RUTA, ...Object.keys(ANIDADOS),
  ]);
  return Object.keys(modulos || {}).filter(k => !cubiertos.has(k));
}

/* ── Qué columna toca cada módulo ─────────────────────────────────────────
   ruta_estudio_data y autodiagnostico_data guardan VARIOS módulos en una
   sola columna JSONB. Un upsert reemplaza la columna completa, así que
   escribir un módulo suelto de esas columnas borraba a sus hermanos: subir
   la práctica dejaba ruta_estudio_data sin reforzamiento, alineación,
   nombre ni fecha límite; subir la firma dejaba autodiagnostico_data sin
   las 142 respuestas. nube.js usa esto para mandar la columna entera. */
export function columnaDe(mod) {
  if (COLUMNA[mod]) return COLUMNA[mod];
  if (EN_RUTA.includes(mod)) return 'ruta_estudio_data';
  if (ANIDADOS[mod]) return ANIDADOS[mod][0];
  return null;
}

/* Todo lo que viaja, para que una sincronización completa suba también lo
   que no es un paso del flujo (firma, nombre, biblioteca, fecha límite).
   Las autorizaciones no: esas solo las escribe el Centro. */
export const MODULOS_NUBE = [...new Set([
  ...Object.keys(COLUMNA), ...EN_RUTA, ...Object.keys(ANIDADOS),
])].filter(m => m !== '__autorizaciones');

export const COLUMNAS = [...new Set([...Object.values(COLUMNA), 'ruta_estudio_data'])];

/* ── De nuestros módulos a una fila de Paideia ─────────────────────────── */
export function aFila(modulos, extra = {}) {
  const fila = { updated_at: new Date().toISOString(), ...extra };

  Object.entries(COLUMNA).forEach(([mod, col]) => {
    if (modulos[mod]) fila[col] = modulos[mod];
  });

  const ruta = {};
  EN_RUTA.forEach(m => { if (modulos[m]) ruta[m] = modulos[m]; });

  Object.entries(ANIDADOS).forEach(([mod, [col, llave]]) => {
    if (!modulos[mod]) return;
    if (col === 'ruta_estudio_data') ruta[llave] = modulos[mod];
    else fila[col] = { ...(fila[col] || {}), [llave]: modulos[mod] };
  });

  if (Object.keys(ruta).length) fila.ruta_estudio_data = ruta;

  // El nombre sale del Plan de Evaluación, igual que en Paideia
  const pd = modulos.plan || {};
  if (pd.fCandidato) fila.nombre = pd.fCandidato;

  return fila;
}

/* ── De una fila de Paideia a nuestros módulos ─────────────────────────── */
export function aModulos(fila) {
  if (!fila) return {};
  /* Lo que baja de la nube es la otra puerta por la que entran datos que no
     escribió este navegador. Pasa por el mismo filtro que un respaldo. */
  fila = limpiarExpediente(fila).limpio;
  const out = {};

  Object.entries(COLUMNA).forEach(([mod, col]) => {
    if (fila[col]) out[mod] = fila[col];
  });

  const ruta = fila.ruta_estudio_data || {};
  EN_RUTA.forEach(m => { if (ruta[m]) out[m] = ruta[m]; });

  Object.entries(ANIDADOS).forEach(([mod, [col, llave]]) => {
    const fuente = col === 'ruta_estudio_data' ? ruta : (fila[col] || {});
    if (fuente[llave]) out[mod] = fuente[llave];
  });

  /* La firma se anida DENTRO de autodiagnostico_data, así que al desanidarla
     hay que sacarla de la copia del módulo: si no, el autodiagnóstico
     arrastraría la firma dentro de sus datos y se duplicaría en cada vuelta
     de sincronización, creciendo el expediente sin que nadie lo note. */
  if (out.autodiagnostico?.firma) {
    const { firma, ...resto } = out.autodiagnostico;
    out.autodiagnostico = resto;
  }

  return out;
}
