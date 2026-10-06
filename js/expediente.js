/* ============================================================================
   POSTURALIA · Plataforma de Certificación
   expediente.js — Lee un respaldo de candidato y lo convierte en un expediente

   El panel del evaluador NO lee datos en vivo: cada candidato guarda su avance
   en su propio navegador y descarga un respaldo .json que le manda al Centro.
   Este módulo toma ese archivo y saca de él un resumen comparable entre
   candidatos. Cuando exista backend (Supabase), la misma forma de expediente
   se llenará desde la nube y el panel no cambia.
   ========================================================================== */

import { CONFIG, NS } from './config.js';
import { limpiarExpediente, textoSeguro } from './seguro.js';
import { completoSegunDatos } from './flow.js';
import { avanceDeReforzamiento } from './brechas.js';

/* Módulos que cuentan para el avance, en el orden del flujo */
export const MODULOS = CONFIG.flujo.filter(m => m.listo);

const num = v => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const limpio = v => (typeof v === 'string' ? v.trim() : '');

/* ── Validación ───────────────────────────────────────────────────────────
   Un archivo que no es de esta plataforma se rechaza con un motivo legible,
   nunca con una excepción: el evaluador va a soltar carpetas enteras aquí. */
export function leerRespaldo(texto, nombreArchivo = '') {
  let obj;
  try {
    obj = JSON.parse(texto);
  } catch {
    return { ok: false, archivo: nombreArchivo, motivo: 'No es un archivo JSON válido.' };
  }

  if (!obj || typeof obj !== 'object') {
    return { ok: false, archivo: nombreArchivo, motivo: 'El archivo está vacío o mal formado.' };
  }

  if (obj._ns !== NS) {
    return {
      ok: false,
      archivo: nombreArchivo,
      motivo: obj._ns
        ? `Es un respaldo de otro sistema (${obj._ns}), no de esta plataforma.`
        : 'No parece un respaldo de esta plataforma.',
    };
  }

  /* Todo lo que trae el archivo se limpia ANTES de convertirse en
     expediente. De aquí en adelante ninguna pantalla del panel tiene que
     acordarse de escapar nada que haya venido de un respaldo: ya viene
     limpio. Ver seguro.js para el porqué — un .json con HTML en el nombre
     ejecutaba código en el navegador del evaluador. */
  const { limpio, quitados } = limpiarExpediente(obj);
  const exp = aExpediente(limpio, textoSeguro(nombreArchivo));
  if (quitados) exp.saneado = quitados;

  return { ok: true, expediente: exp };
}

/* ── Normalización ──────────────────────────────────────────────────────── */
function aExpediente(obj, nombreArchivo) {
  const mods = obj.modulos || {};
  const plan = mods.plan || {};

  /* Los respaldos versión 1 no traían cabecera de candidato: caemos al Plan,
     y si tampoco hay nada, al nombre del archivo, para no perder el registro. */
  const cab = obj.candidato || {};
  const nombre = limpio(cab.nombre) || limpio(plan.fCandidato)
               || nombreArchivo.replace(/\.json$/i, '') || 'Sin nombre';

  const estado = {};
  MODULOS.forEach(m => {
    const d = mods[m.id];
    estado[m.id] = {
      /* La misma regla que ve el candidato (flow.js). Solo la Entrega, que
         cierra el propio Centro, se lee tal cual. El pago de cada fase lo
         lleva el panel en sus propios registros. */
      completado: m.requiere === 'evaluador' ? d?.completado === true : completoSegunDatos(m, d, mods),
      iniciado:   !!d && Object.keys(d).length > 0,
      datos:      d || null,
    };
  });

  const completos = MODULOS.filter(m => estado[m.id].completado).length;

  return {
    id: `${nombre.toLowerCase()}|${limpio(cab.evaluador) || limpio(plan.fEvaluador)}`,
    correo: limpio(cab.correo) || limpio(mods.candidato?.email) || undefined,
    archivo: nombreArchivo,
    nombre,
    evaluador: limpio(cab.evaluador) || limpio(plan.fEvaluador),
    fechaEvaluacion: cab.fecha || plan.fFecha || '',
    lugar: limpio(cab.lugar) || limpio(plan.fLugar),
    respaldadoEl: obj._fecha || '',
    estado,
    completos,
    total: MODULOS.length,
    avance: Math.round((completos / MODULOS.length) * 100),
    metricas: metricas(mods),
    alertas: alertas(mods, estado),
    /* Datos generales (Ficha de Registro) y firma del candidato: el
       portafolio oficial los necesita y no son módulos del flujo. */
    candidato: mods.candidato || null,
    firma: mods.firma || null,
  };
}

/* ── Métricas comparables entre candidatos ────────────────────────────────

   Dos de estas venían leyendo campos que ningún módulo escribe, y el efecto
   era grave y silencioso:

     · El examen guarda su calificación en `score`; aquí se buscaba en
       `porcentaje`. La calificación llegaba siempre vacía, así que la alerta
       de "reprobó el examen" NUNCA se disparaba. Un candidato con 40% se veía
       igual de bien que uno con 95%.

     · Las evidencias se contaban de `mods.entrega.marcadas`, pero las marca
       el módulo `evidencias` y las guarda como `documentos`. Siempre daba 0,
       de modo que la alerta de evidencias faltantes salía hasta para quien ya
       las tenía todas — y esas alertas, cuando siempre mienten, se dejan de
       leer.

   Se aceptan los dos nombres donde puede haber respaldos viejos en circulación:
   un evaluador tiene .json guardados de hace semanas y no debería perderlos.  */
function primerNum(...valores) {
  for (const v of valores) { const n = num(v); if (n != null) return n; }
  return null;
}

/* Cuántos documentos lleva entregados un módulo documental */
function docsEntregados(mod, datosDelModulo) {
  const d = datosDelModulo?.documentos || {};
  return (mod.docs || []).filter(k => {
    const v = d[k];
    return Array.isArray(v) ? v.length > 0 : !!v;
  }).length;
}

const MOD_EVIDENCIAS = CONFIG.flujo.find(m => m.id === 'evidencias');
export const EVIDENCIAS_PEDIDAS = MOD_EVIDENCIAS?.docs?.length || 0;

function metricas(mods) {
  const a = mods.autodiagnostico || {};
  const e = mods.examen || {};
  const p = mods.practica || {};
  const r = mods.reforzamiento || {};

  return {
    autodiagnostico: primerNum(a.porcentaje, a.score),
    examen:          primerNum(e.score, e.porcentaje),
    examenAprobado:  e.aprobado === true,
    /* Cuántas veces lo presentó. Desde que reprobar obliga a repetir, es de
       lo más útil que puede ver el evaluador: aprobado a la primera y
       aprobado al cuarto intento no son el mismo candidato. */
    examenIntentos:  Array.isArray(e.intentos) ? e.intentos.length
                   : (e.score != null ? 1 : 0),
    practica:        primerNum(p.porcentaje, p.score),
    /* `repasados` era un número hasta que se volvió la lista de temas (el
       número pisaba la lista al terminar: ver brechas.js). Se cuenta contra
       las brechas vigentes del autodiagnóstico, igual que el candidato. */
    ...(() => {
      if (!Object.keys(r).length) return { brechas: null, brechasRepasadas: null };
      const av = avanceDeReforzamiento(a, r);
      return { brechas: av.temas, brechasRepasadas: av.repasados };
    })(),
    encuestaHecha:   mods.encuesta?.completado === true,
    planAcordado:    mods.plan?.acuerdo === true,
    evidencias:      MOD_EVIDENCIAS ? docsEntregados(MOD_EVIDENCIAS, mods.evidencias) : 0,
    evidenciasPedidas: EVIDENCIAS_PEDIDAS,
  };
}

/* ── Alertas: lo que el evaluador necesita ver sin abrir el expediente ──── */
function alertas(mods, estado) {
  const out = [];
  const m = metricas(mods);
  const umbralA = CONFIG.reglas.umbralAutodiagnostico;
  const umbralE = CONFIG.reglas.umbralExamen;

  if (m.examen != null && m.examen < umbralE) {
    out.push({ nivel: 'alto', txt: `Examen en ${m.examen}%, por debajo del ${umbralE}% para aprobar` });
  }
  if (m.autodiagnostico != null && m.autodiagnostico < umbralA) {
    out.push({ nivel: 'medio', txt: `Autodiagnóstico en ${m.autodiagnostico}%, bajo el ${umbralA}% recomendado` });
  }
  if (m.brechas != null && m.brechas > 0 && m.brechasRepasadas < m.brechas) {
    out.push({ nivel: 'medio', txt: `${m.brechas - m.brechasRepasadas} de ${m.brechas} brechas sin repasar` });
  }
  if (estado.plan?.iniciado && !m.planAcordado) {
    out.push({ nivel: 'alto', txt: 'Plan de Evaluación sin acordar (falta la confirmación firmada)' });
  }
  /* El "5" venía escrito a mano y el módulo pide ${EVIDENCIAS_PEDIDAS}: si
     mañana se agrega una evidencia al flujo, este aviso tiene que seguirla
     solo, no quedarse contando contra una cifra vieja. */
  if (estado.evidencias?.iniciado && m.evidencias < EVIDENCIAS_PEDIDAS) {
    out.push({
      nivel: 'medio',
      txt: `Faltan evidencias obligatorias (${m.evidencias} de ${EVIDENCIAS_PEDIDAS} entregadas)`,
    });
  }

  /* Terminó todo y espera el cierre del Centro. No es un problema del
     candidato: es una tarea del evaluador que si nadie ve, no se hace. */
  const cerrables = MODULOS.filter(x => x.requiere !== 'evaluador');
  if (cerrables.every(x => estado[x.id]?.completado) && !estado.entrega?.completado) {
    out.push({ nivel: 'alto', txt: 'Terminó todo su proceso y espera que el Centro cierre la Entrega' });
  }

  return out;
}

/* ── Vista de conjunto ──────────────────────────────────────────────────── */
export function resumenCohorte(expedientes) {
  const n = expedientes.length;
  if (!n) return null;

  const umbralE = CONFIG.reglas.umbralExamen;
  const conExamen = expedientes.filter(x => x.metricas.examen != null);

  return {
    total: n,
    listos:      expedientes.filter(x => x.completos === x.total).length,
    enProceso:   expedientes.filter(x => x.completos > 0 && x.completos < x.total).length,
    sinEmpezar:  expedientes.filter(x => x.completos === 0).length,
    conAlertas:  expedientes.filter(x => x.alertas.some(a => a.nivel === 'alto')).length,
    avanceMedio: Math.round(expedientes.reduce((s, x) => s + x.avance, 0) / n),
    examenMedio: conExamen.length
      ? Math.round(conExamen.reduce((s, x) => s + x.metricas.examen, 0) / conExamen.length)
      : null,
    aprobarian: conExamen.filter(x => x.metricas.examen >= umbralE).length,
    conExamen: conExamen.length,
  };
}

/* ── Cuello de botella: en qué módulo se atoran más ─────────────────────── */
export function cuelloDeBotella(expedientes) {
  return MODULOS.map(m => {
    const completado = expedientes.filter(x => x.estado[m.id]?.completado).length;
    const iniciado   = expedientes.filter(x => x.estado[m.id]?.iniciado && !x.estado[m.id]?.completado).length;
    return {
      ...m,
      completado,
      iniciado,
      sinEmpezar: expedientes.length - completado - iniciado,
      pct: expedientes.length ? Math.round((completado / expedientes.length) * 100) : 0,
    };
  });
}
