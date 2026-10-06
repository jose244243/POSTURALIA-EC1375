/* ============================================================================
   POSTURALIA · Plataforma de Certificación
   flow.js — Estado del flujo y avance del candidato
   ========================================================================== */

import { CONFIG } from './config.js';
import { Store }  from './store.js';
import { avanceDeReforzamiento } from './brechas.js';
import { ENCUESTA } from './data-portafolio.js';

export const ESTADO = {
  BLOQUEADO:  'bloqueado',    // falta el paso anterior
  DISPONIBLE: 'disponible',   // se puede entrar
  EN_CURSO:   'en_curso',     // empezado, sin terminar
  COMPLETADO: 'completado',   // terminado
  PENDIENTE:  'pendiente',    // aún no construido en esta versión
  ESPERANDO:  'esperando',    // depende del Centro Evaluador, no del candidato
  SIN_PAGO:   'sin_pago',     // la fase todavía no está autorizada
};

/* Nombre visible de cada estado. Vive aquí y no en cada página: cuando se
   agregó un estado nuevo, la copia suelta de index.html quedó desactualizada
   y las tarjetas mostraban "undefined". */
export const ETIQUETA = {
  [ESTADO.COMPLETADO]: 'Completado',
  [ESTADO.EN_CURSO]:   'En curso',
  [ESTADO.DISPONIBLE]: 'Disponible',
  [ESTADO.BLOQUEADO]:  'Bloqueado',
  [ESTADO.PENDIENTE]:  'Próximamente',
  [ESTADO.ESPERANDO]:  'Con tu evaluador',
  [ESTADO.SIN_PAGO]:   'Por habilitar',
};

export const MOTIVO = {
  [ESTADO.BLOQUEADO]: 'Se abre al terminar el paso anterior',
  [ESTADO.ESPERANDO]: 'Lo marca tu evaluador, no tú',
  [ESTADO.SIN_PAGO]:  'Tu Centro Evaluador habilita esta fase',
  [ESTADO.PENDIENTE]: 'Aún no disponible',
};

/* ── Autorizaciones del Centro ────────────────────────────────────────────
   Un candidato no puede declararse certificado a sí mismo, ni abrirse una
   fase que todavía no le autorizan. Estas marcas las escribe el Centro
   Evaluador (hoy, al importar; con backend, desde el panel).             */
export function faseAutorizada(faseId) {
  const auth = Store.get('__autorizaciones', {});
  return auth[faseId] === true || pagadaEnEsteNavegador(faseId);
}

/* Sin nube, el panel del Centro y el proceso del candidato solo comparten
   navegador cuando se prueba la plataforma (o el Centro atiende a alguien
   en su propio equipo). Antes, liberar la fase en «Precios y pagos» no le
   abría nada al candidato: las dos mitades no se hablaban y no había forma
   de probar el recorrido completo sin Supabase. Ahora, si en ESTE navegador
   el Centro registró el pago de esa fase para el correo de quien tiene la
   sesión (o el de su Ficha), la fase se abre. Con Supabase manda la nube;
   en el espejo del evaluador, solo lo que trae el expediente. */
function pagadaEnEsteNavegador(faseId) {
  if (CONFIG.supabase?.url && CONFIG.supabase?.anonKey) return false;
  if (Store.soloLectura) return false;
  try {
    const d = JSON.parse(localStorage.getItem('posturalia.evaluador.v1') || 'null');
    if (!Array.isArray(d?.pagos) || !d.pagos.length) return false;
    const leerSesion = st => { try { return JSON.parse(st.getItem('posturalia.sesion.v1') || 'null'); } catch { return null; } };
    const s = leerSesion(localStorage) || leerSesion(sessionStorage);
    const mios = [s?.correo, Store.get('candidato', {}).email]
      .map(x => String(x || '').toLowerCase().trim()).filter(Boolean);
    return mios.length > 0 && d.pagos.some(p => p.fase === faseId && mios.includes(String(p.email || '').toLowerCase().trim()));
  } catch { return false; }
}

export function autorizarFase(faseId, valor = true) {
  Store.merge('__autorizaciones', { [faseId]: valor });
}

/* ── ¿Un módulo está terminado? ───────────────────────────────────────────
   Para los módulos documentales no basta con haberlos abierto: cuentan los
   archivos efectivamente entregados.                                      */
export function estaCompleto(id) {
  const mod = CONFIG.flujo.find(m => m.id === id);
  const d = Store.get(id);

  if (mod?.requiere === 'evaluador') return faseAutorizada('entrega');

  /* Un módulo que espera el pago de su fase no puede darse por terminado
     mientras esa fase no esté liberada, aunque el dato guardado diga que sí.

     Importa porque estadoDelFlujo() pregunta primero si está completo y solo
     después si falta el pago: un `completado:true` que haya quedado de una
     versión anterior, de un respaldo importado o de una edición a mano se
     leería como Alineación terminada sin que el Centro la haya cobrado. */
  if (mod?.requiere === 'pago' && !faseAutorizada(mod.fase)) return false;

  return completoSegunDatos(mod, d, {
    autodiagnostico: Store.get('autodiagnostico', {}), [id]: d,
  });
}

/* ── La regla, sin depender de dónde viven los datos ──────────────────────
   El candidato la aplica sobre su navegador; el panel del evaluador, sobre
   el expediente que importó. Antes el panel tenía su propia versión —
   `completado === true` y nada más— y los dos se contradecían:

     · Un examen reprobado salía "✓ Completo" en la ficha del evaluador,
       porque el examen guarda `completado` al terminar, apruebe o no.
     · Plan y Evidencias nunca escriben `completado` (se cierran por sus
       documentos), así que en el panel salían "En curso" para siempre, y la
       alerta "terminó todo y espera que el Centro cierre" no se disparaba
       nunca — que es justo la que le dice al Centro que tiene trabajo.

   Lo que depende de autorizaciones (pago, cierre del evaluador) se queda en
   estaCompleto(): el panel tiene sus propios registros de cobro.         */
export function completoSegunDatos(mod, d = {}, mods = {}) {
  d = d || {};

  /* Hay módulos que no se cierran por haberlos contestado, sino por haberlos
     aprobado. El Examen guardaba `completado: true` en cuanto el candidato
     terminaba de responder, aprobara o no: con 62% sobre un umbral de 80% la
     plataforma le pintaba palomita verde, lo sumaba al avance y lo dejaba
     pasar al paso siguiente. */
  if (mod?.aprueba && d.aprobado !== true) return false;

  /* Reforzamiento se cierra contra las brechas VIGENTES del autodiagnóstico,
     no contra la foto de cuando se marcó terminado. Si el candidato rehace el
     autodiagnóstico y aparecen temas nuevos, el paso se reabre solo. */
  if (mod?.id === 'reforzamiento' && d.completado === true)
    return d.vobo === true || avanceDeReforzamiento(mods.autodiagnostico || {}, d, mods.practica || {}).pendientes === 0;

  /* Alineación se cierra cuando el candidato confirma que tomó la sesión, y
     esa confirmación deja fecha. Un `completado` sin fecha lo escribía la
     Biblioteca al terminar de leer los críticos: estudiar no es asistir. */
  if (mod?.id === 'alineacion') return d.completado === true && !!d.tomadaEl;

  if (mod?.docs?.length) {
    const entregados = d.documentos || {};
    return mod.docs.every(k => {
      const v = entregados[k];
      return Array.isArray(v) ? v.length > 0 : !!v;
    });
  }

  return d.completado === true;
}

function fueIniciado(id) {
  const d = Store.get(id);
  return Object.keys(d).length > 0 && !estaCompleto(id);
}

/* ── Estado de cada módulo, en orden ────────────────────────────────────── */
export function estadoDelFlujo() {
  let anteriorCompleto = true;

  return CONFIG.flujo.map(mod => {
    let estado;
    let porPrevio = false;

    if (!mod.listo) {
      estado = ESTADO.PENDIENTE;
    } else if (estaCompleto(mod.id)) {
      estado = ESTADO.COMPLETADO;
    } else if (mod.requiere === 'evaluador') {
      estado = ESTADO.ESPERANDO;
    } else if (mod.requiere === 'pago' && !faseAutorizada(mod.fase)) {
      estado = ESTADO.SIN_PAGO;
    } else if (fueIniciado(mod.id)) {
      /* Ojo con el orden: "ya lo empezó" va ANTES que "está bloqueado".
         Al principio era al revés, y con el Examen reprobado salía a la luz:
         reprobarlo lo deja sin cerrar, con lo cual el módulo siguiente nunca
         se abre, con lo cual la fila se rompe y el propio Examen volvía a
         pintarse con candado y el texto "se abre al terminar el paso
         anterior". O sea: le poníamos llave justo al examen que acababa de
         contestar y que tiene todo el derecho de repetir.

         Un módulo con datos adentro ya estuvo abierto alguna vez. Puede
         estar sin terminar, pero bloqueado no está. */
      estado = ESTADO.EN_CURSO;
    } else if (!anteriorCompleto && !mod.libre) {
      estado = ESTADO.BLOQUEADO;
    } else if (mod.previos?.some(p => !estaCompleto(p))) {
      /* Requisitos explícitos además del orden: el Examen exige la Práctica
         completa aunque la Práctica sea "libre" y no frene la fila. */
      estado = ESTADO.BLOQUEADO;
      porPrevio = true;
    } else {
      estado = ESTADO.DISPONIBLE;
    }

    // Ni los módulos de consulta ni los que dependen del Centro frenan la fila
    if (mod.listo && !mod.libre && mod.requiere !== 'evaluador') {
      anteriorCompleto = estaCompleto(mod.id);
    }

    /* Un examen contestado y reprobado se queda EN_CURSO. "En curso" a secas
       no explica nada; aquí sí se dice por qué sigue abierto. */
    let motivo = MOTIVO[estado] || null;
    const previoFalta = mod.previos?.find(p => !estaCompleto(p));
    if (estado === ESTADO.BLOQUEADO && porPrevio && previoFalta) {
      const nom = CONFIG.flujo.find(x => x.id === previoFalta)?.nombre || previoFalta;
      motivo = `Se abre al terminar ${nom}`;
    }
    if (mod.aprueba && estado === ESTADO.EN_CURSO && Store.get(mod.id).aprobado === false) {
      motivo = `Contestado, pero sin alcanzar el ${CONFIG.reglas.umbralExamen}% · se puede repetir`;
    }

    return { ...mod, estado, motivo };
  });
}

export const navegable = e =>
  e !== ESTADO.BLOQUEADO && e !== ESTADO.PENDIENTE && e !== ESTADO.ESPERANDO;

/* ── Avance ponderado por fase ────────────────────────────────────────────
   Cada fase vale lo que vale (15/30/40/15) y adentro reparte parejo entre
   sus módulos. Contar "módulos hechos / módulos totales" diría que un
   candidato que solo hizo el autodiagnóstico va al 10%, cuando en realidad
   apenas arrancó el Registro.                                             */
/* ── Avance DENTRO de un módulo que no se ha cerrado ──────────────────────
   Antes un módulo solo aportaba al cerrarse: con 84 de 142 reactivos
   contestados el panel decía "Tu avance 0%", y el candidato sentía que no
   se le reconocía nada. Ahora cada módulo abierto aporta lo que lleva, con
   tope de 90% para que "casi terminado" nunca se lea como terminado.
   Solo se leen datos que el propio módulo ya guarda.                     */
const TOTAL_AUTODIAGNOSTICO = 142;   // reactivos oficiales
const TOTAL_PRACTICA        = 20;    // temas (objetivos) de la práctica, como Paideia
const TOTAL_EXAMEN          = 37;    // reactivos oficiales del examen
const TOTAL_ENCUESTA        = ENCUESTA.preguntas.length;     // preguntas de la encuesta CONOCER (8 en el formato 2026)

export function avanceDeModulo(mod, estado) {
  if (estado === ESTADO.COMPLETADO) return 1;
  if (!mod?.listo || estado === ESTADO.BLOQUEADO || estado === ESTADO.PENDIENTE) return 0;
  const d = Store.get(mod.id, {}) || {};
  const n = o => (o && typeof o === 'object') ? Object.keys(o).length : 0;
  let x = 0;
  switch (mod.id) {
    case 'autodiagnostico': x = d.instrumento ? n(d.answers) / TOTAL_AUTODIAGNOSTICO : 0; break;
    case 'reforzamiento':   x = d.vobo ? 1 : d.temas ? (d.repasados_n || 0) / d.temas * 0.9 : 0; break;
    case 'alineacion': {
      const b = Store.get('biblioteca', {}) || {};
      x = b.criticosTotal ? 0.5 * (b.criticos || 0) / b.criticosTotal : 0; break;   // llegar preparado
    }
    case 'practica':        x = (d.temas ? Object.values(d.temas).filter(t => t && t.ok).length : 0) / TOTAL_PRACTICA; break;
    case 'examen':          x = d.enCurso ? 0.8 * n(d.answers) / TOTAL_EXAMEN : (d.intentos?.length ? 0.5 : 0); break;
    case 'encuesta':        x = n(d.respuestas) / TOTAL_ENCUESTA; break;
    default:
      if (mod.docs?.length) {
        const ent = d.documentos || {};
        x = mod.docs.filter(k => Array.isArray(ent[k]) ? ent[k].length : !!ent[k]).length / mod.docs.length;
      }
  }
  return Math.max(0, Math.min(0.9, x || 0));
}

export function avancePorFase() {
  const flujo = estadoDelFlujo();

  return CONFIG.fases.map(f => {
    const suyos = flujo.filter(m => m.fase === f.id && m.listo);
    const hechos = suyos.filter(m => m.estado === ESTADO.COMPLETADO).length;
    const suma = suyos.reduce((s, m) => s + avanceDeModulo(m, m.estado), 0);
    const pct = suyos.length ? Math.round((suma / suyos.length) * 100) : 0;
    return { ...f, modulos: suyos.length, hechos, pct, aporta: (pct / 100) * f.peso };
  });
}

export function avanceGlobal() {
  return Math.round(avancePorFase().reduce((s, f) => s + f.aporta, 0));
}

export function siguientePaso() {
  return estadoDelFlujo().find(m =>
    m.estado === ESTADO.DISPONIBLE || m.estado === ESTADO.EN_CURSO) || null;
}

/* ── Marcar terminado ─────────────────────────────────────────────────────
   Un módulo reservado al Centro Evaluador no se puede cerrar desde aquí:
   si la app lo intenta, se ignora en vez de falsear el expediente.        */
export function completar(modulo, datos = {}) {
  if (Store.soloLectura) return false;   // el evaluador está mirando en espejo
  const mod = CONFIG.flujo.find(m => m.id === modulo);
  if (mod?.requiere === 'evaluador') return false;

  Store.merge(modulo, { ...datos, completado: true });
  window.dispatchEvent(new CustomEvent('flujo:cambio', { detail: { modulo } }));
  return true;
}

/* Registra un documento entregado en un módulo documental */
export function registrarDocumento(modulo, clave, valor = true) {
  if (Store.soloLectura) return;
  const d = Store.get(modulo);
  Store.merge(modulo, { documentos: { ...(d.documentos || {}), [clave]: valor } });
  window.dispatchEvent(new CustomEvent('flujo:cambio', { detail: { modulo } }));
}

/* ── Barra de pasos (se conserva por compatibilidad) ─────────────────────── */
export function pintarBarraFlujo(contenedor, actual) {
  if (!contenedor) return;
  contenedor.innerHTML = estadoDelFlujo().map(m => {
    const clases = ['paso', `paso--${m.estado}`, m.id === actual ? 'paso--actual' : '']
      .filter(Boolean).join(' ');
    /* Sin emojis: el candado y la palomita salían de distinto tamaño y color
       en cada sistema, y en la barra superior —que es tipografía pequeña—
       se notaba como un defecto. El estado ya lo dice la clase CSS. */
    return navegable(m.estado)
      ? `<a class="${clases}" href="${m.archivo}">${m.nombre}</a>`
      : `<span class="${clases}" title="${m.motivo || ''}">${m.nombre}</span>`;
  }).join('');
}
