/* ============================================================================
   POSTURALIA · Plataforma de Certificación
   panel.js — Lo que el candidato necesita saber de un vistazo

   La portada del candidato era una barra de avance y una cuadrícula de
   módulos. Eso contesta "¿cuánto llevo?" pero no contesta las tres
   preguntas con las que la gente realmente abre la plataforma:

     ¿qué sigue?          → siguientePaso(), arriba y en amarillo
     ¿qué me falta?       → el expediente documento por documento
     ¿esto ya está pagado? → pagos por fase, sin tener que preguntar

   Todo sale del mismo Store y del mismo flow.js que ya deciden el estado en
   el resto de la plataforma. Aquí no se reinventa ninguna regla: si este
   archivo y flow.js discrepan alguna vez, el bug está aquí.
   ========================================================================== */

import { CONFIG }   from './config.js';
import { Store }    from './store.js';
import { estadoDelFlujo, faseAutorizada, ESTADO } from './flow.js';
import { avanceDeReforzamiento } from './brechas.js';
import { deFechaLocal } from './fechas.js';

/* ── Nombre del candidato ─────────────────────────────────────────────────
   Se captura en el Plan de Evaluación. Antes de eso no lo sabemos, y
   saludar con "Hola, undefined" es peor que no saludar.                   */
export function candidato() {
  const c = Store.get('candidato', {});
  const plan = Store.get('plan', {});
  const nombre = (c.nombre || plan.nombre || '').trim();
  return {
    nombre,
    tiene: !!nombre,
    iniciales: nombre
      ? nombre.split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase()
      : '··',
    evaluador: c.evaluador || plan.evaluador || '',
  };
}

/* ── Documentos del expediente ────────────────────────────────────────────
   Se recorre el flujo, no una lista aparte: un documento que se agregue
   mañana a CONFIG.flujo aparece aquí solo, sin tocar este archivo.       */
export function documentosDelExpediente() {
  const porFase = new Map(CONFIG.fases.map(f => [f.id, { ...f, docs: [] }]));

  CONFIG.flujo.forEach(mod => {
    if (!mod.docs?.length) return;
    const guardados = Store.get(mod.id).documentos || {};
    const grupo = porFase.get(mod.fase);
    if (!grupo) return;

    mod.docs.forEach(clave => {
      const meta = CONFIG.documentos?.[clave] || {};
      const v = guardados[clave];
      const entregado = Array.isArray(v) ? v.length > 0 : !!v;

      grupo.docs.push({
        clave,
        nombre:  meta.nombre || clave,
        tipo:    meta.tipo || 'sube',
        entregado,
        modulo:  mod.id,
        archivo: mod.archivo,
        /* La palabra importa: "subido" es algo que el candidato hizo,
           "descargado" es algo que solo abrió. Y lo que falta no se llama
           "pendiente" sino lo que hay que hacer con ello. */
        etiqueta: {
          descarga: entregado ? 'Descargado' : 'Descargar',
          firma:    entregado ? 'Firmado'    : 'Firmar',
          sube:     entregado ? 'Subido'     : 'Subir',
        }[meta.tipo || 'sube'],
      });
    });
  });

  return [...porFase.values()].filter(g => g.docs.length);
}

export function conteoDocumentos() {
  const todos = documentosDelExpediente().flatMap(g => g.docs);
  return {
    entregados: todos.filter(d => d.entregado).length,
    total: todos.length,
    faltantes: todos.filter(d => !d.entregado),
  };
}

/* ── Pagos por fase ───────────────────────────────────────────────────────
   El candidato no tiene por qué adivinar por qué un módulo tiene candado.
   Aquí ve, fase por fase, cuál le liberó el Centro y cuánto pesa cada una. */
export function pagosPorFase() {
  return CONFIG.fases.map(f => ({
    ...f,
    pagada: faseAutorizada(f.id),
  }));
}

export function faseMasAltaPagada() {
  const pagadas = pagosPorFase().filter(f => f.pagada);
  return pagadas.length ? pagadas[pagadas.length - 1] : null;
}

/* ── Resumen de pasos ─────────────────────────────────────────────────────
   Tres números, no uno: cuántos cerró, cuántos trae abiertos y cuántos ni
   siquiera puede tocar todavía. El tercero es el que evita el correo de
   "¿por qué no me deja entrar?".                                          */
export function resumenPasos() {
  const flujo = estadoDelFlujo().filter(m => m.listo);
  const es = e => flujo.filter(m => m.estado === e).length;

  const completados = es(ESTADO.COMPLETADO);
  const enCurso     = es(ESTADO.EN_CURSO) + es(ESTADO.DISPONIBLE);
  const cerrados    = es(ESTADO.BLOQUEADO) + es(ESTADO.SIN_PAGO) +
                      es(ESTADO.ESPERANDO) + es(ESTADO.PENDIENTE);

  return { completados, enCurso, porDesbloquear: cerrados, total: flujo.length };
}

/* ── Fecha límite de evidencias ───────────────────────────────────────────
   La marca el Centro. Si no hay fecha, no se inventa ninguna: una cuenta
   regresiva falsa es peor que ninguna. */
export function limiteEntrega() {
  const { fecha } = Store.get('__limite', {});
  if (!fecha) return null;

  const limite = new Date(fecha + 'T23:59:59');
  if (isNaN(limite)) return null;

  /* Los días se cuentan de calendario a calendario, no por milisegundos.
     Midiendo contra las 23:59 del día límite, una fecha a tres días daba
     "faltan 4": sobraban las horas que quedaban de hoy. Para quien lee la
     cinta, la diferencia entre 3 y 4 días es si alcanza el fin de semana. */
  const cero = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
  const dias = Math.round((cero(fecha + 'T00:00:00') - cero(new Date())) / 86400000);

  return {
    fecha: limite,
    dias,
    vencido: dias < 0,
    urgente: dias >= 0 && dias <= 7,
    texto: limite.toLocaleDateString('es-MX',
      { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
  };
}

/* ── Sesión de Alineación ─────────────────────────────────────────────── */
export function sesionAlineacion() {
  const s = Store.get('alineacion', {}).sesion;
  if (!s?.fecha) return null;
  const d = deFechaLocal(s.fecha);   // new Date('AAAA-MM-DD') daba el día anterior en México
  return {
    ...s,
    texto: isNaN(d) ? s.fecha
      : d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' }),
  };
}

/* ── Avisos para el candidato ─────────────────────────────────────────────
   Mismos hechos que ve el evaluador en su panel, redactados al revés: allá
   dice "Faltan evidencias", aquí dice qué tiene que hacer él y a dónde ir.
   Un aviso sin destino es un reproche.                                    */
export function avisos() {
  const out = [];
  const add = (nivel, txt, a = null, cta = null) => out.push({ nivel, txt, a, cta });

  const flujo = estadoDelFlujo();
  const mod   = id => flujo.find(m => m.id === id);

  /* Examen por debajo del umbral */
  const ex = Store.get('examen', {});
  const score = ex.score ?? ex.porcentaje;
  if (score != null && score < CONFIG.reglas.umbralExamen) {
    add('alto',
      `Tu examen quedó en ${score}%. Se aprueba con ${CONFIG.reglas.umbralExamen}%, ` +
      `y lo puedes volver a presentar las veces que haga falta.`,
      'examen.html', 'Repetir el examen');
  }

  /* Brechas detectadas en el autodiagnóstico y sin repasar */
  const r = avanceDeReforzamiento();
  if (r.pendientes > 0) {
    add('medio',
      `Te faltan ${r.pendientes} de ${r.obligatorios} tema${r.obligatorios === 1 ? '' : 's'} obligatorio${r.obligatorios === 1 ? '' : 's'} ` +
      `(puntos eliminatorios) por reforzar.`,
      'reforzamiento.html', 'Ir a Reforzamiento');
  }

  /* Pagó la Alineación y no ha reservado su sesión en vivo (como Paideia) */
  if (faseAutorizada('alineacion') && !sesionAlineacion() && mod('alineacion')?.estado !== ESTADO.COMPLETADO) {
    add('alto', 'Tu Alineación ya está liberada: reserva tu sesión en vivo antes de que se llenen los lugares.',
      'alineacion.html', 'Reservar mi sesión');
  }

  /* Plan de Evaluación abierto pero sin acordar */
  const plan = Store.get('plan', {});
  if (Object.keys(plan).length && plan.acuerdo !== true) {
    add('alto',
      'Tu Plan de Evaluación está capturado pero todavía sin acordar con tu evaluador.',
      'plan.html', 'Abrir el Plan');
  }

  /* Documentos faltantes, dichos como lo que son */
  const { faltantes, total, entregados } = conteoDocumentos();
  const porSubir = faltantes.filter(d => d.tipo === 'sube');
  if (porSubir.length && entregados > 0) {
    add('medio',
      `Te faltan ${porSubir.length} de ${total} documentos del expediente: ` +
      porSubir.slice(0, 3).map(d => d.nombre).join(', ') +
      (porSubir.length > 3 ? '…' : '') + '.',
      porSubir[0].archivo, 'Ver el expediente');
  }

  /* Fase sin liberar que ya está frenando el paso siguiente */
  const frenado = flujo.find(m => m.estado === ESTADO.SIN_PAGO);
  if (frenado) {
    const fase = CONFIG.fases.find(f => f.id === (frenado.pago || frenado.fase));
    /* v50: el aviso lleva a la caja de pago (transferencia o Mercado Pago),
       no a preguntar: el Centro libera la fase al recibir el comprobante. */
    add('medio',
      `${frenado.nombre} se abre con tu pago de ${fase?.label || frenado.fase}. ` +
      'Paga por transferencia y manda tu comprobante por WhatsApp; el Centro lo confirma y se abre.',
      frenado.archivo, `Pagar ${fase?.label || ''}`.trim());
  }

  /* Terminó todo y la pelota está del otro lado */
  const suyos = flujo.filter(m => m.listo && m.requiere !== 'evaluador');
  if (suyos.every(m => m.estado === ESTADO.COMPLETADO) &&
      mod('entrega')?.estado !== ESTADO.COMPLETADO) {
    add('info',
      'Terminaste todo lo que te toca. El Centro Evaluador tiene que cerrar la ' +
      'Entrega para que salga tu certificado.',
      null, null);
  }

  /* Fecha límite encima */
  const lim = limiteEntrega();
  if (lim && !lim.vencido && lim.urgente) {
    add('alto',
      `Quedan ${lim.dias} día${lim.dias === 1 ? '' : 's'} para entregar tu evidencia ` +
      `(hasta el ${lim.texto}).`,
      'evidencias.html', 'Ir a Evidencias');
  }
  if (lim?.vencido) {
    add('alto',
      `La fecha para entregar tu evidencia venció el ${lim.texto}. ` +
      `Habla con tu Centro Evaluador.`,
      `https://wa.me/${CONFIG.marca.whatsapp}`, 'Escribir por WhatsApp');
  }

  return out;
}

/* ── Sincronización ───────────────────────────────────────────────────────
   Sin backend la respuesta honesta no es "sincronizado" sino "esto vive en
   este navegador". Decir "en la nube" cuando no hay nube es exactamente el
   tipo de mentira que hace que alguien pierda su avance confiado.         */
export function estadoDeGuardado() {
  const enNube = !!CONFIG.supabase.url;
  const sello  = Store.selloDeTiempo?.();

  return {
    enNube,
    titulo: enNube ? 'Expediente en la nube' : 'Guardado en este navegador',
    detalle: enNube
      ? (sello ? `Sincronizado ${haceCuanto(sello)}` : 'Sincronizando…')
      : 'Descarga un respaldo si vas a cambiar de equipo',
  };
}

function haceCuanto(iso) {
  const min = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (min < 1)    return 'hace un momento';
  if (min < 60)   return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24)     return `hace ${h} h`;
  const d = Math.floor(h / 24);
  return `hace ${d} día${d === 1 ? '' : 's'}`;
}
