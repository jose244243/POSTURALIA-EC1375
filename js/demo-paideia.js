/* ============================================================================
   POSTURALIA · demo-paideia.js — Datos de prueba con los KPIs reales de Paideia

   Réplica de las CIFRAS del panel del equipo de Paideia al 23-sep-2026, para
   probar el panel del evaluador con números reales:
     19 registrados · 14 activos · 4 desistieron · 1 cambió de lote
     cobrado $82,000 (Registro $37,000 · Alineación $45,000)
     proyectado $195,647 · conversión 100% → 79% → 0% → 0%
     lotes 1/2/3 con ingresos $5,500 / $70,500 / $6,000
     reparto por lote, costos (gastos_utilidades) y utilidades pagadas
     candidatos por paso: Autodiagnóstico 2 · Reforzamiento 6 · Plan 5 · Sin iniciar 1

   Las PERSONAS son ficticias ("Candidato de prueba 01…"): no se copia ningún
   nombre, CURP, correo ni teléfono real. Solo se reproducen las cantidades,
   para que cada KPI, embudo y reparto cuadre con el de Paideia.
   Todo lo que se carga lleva `demo: true` y se quita con quitarDemo().
   ========================================================================== */
import { CONFIG } from './config.js';
import { actualizar } from './admin-data.js';
import { fechaISO, sumarDias, mxAIso } from './sala.js';

const MODULOS = CONFIG.flujo.filter(m => m.listo);
const FECHA_CORTE = '2026-09-23';

/* paso actual → módulos ya completos antes de él */
const HECHOS = {
  sin_iniciar:     [],
  autodiagnostico: [],
  reforzamiento:   ['autodiagnostico'],
  plan:            ['autodiagnostico', 'reforzamiento', 'alineacion'],
};

function expediente(n, paso, fechaIso) {
  const id = String(n).padStart(2, '0');
  const correo = `prueba${id}@demo.posturalia.mx`;
  const hechos = HECHOS[paso] || [];
  const estado = {};
  MODULOS.forEach(m => {
    const completado = hechos.includes(m.id);
    estado[m.id] = { completado, iniciado: completado || m.id === paso, datos: null };
  });
  const completos = MODULOS.filter(m => estado[m.id].completado).length;
  return {
    id: correo, correo, nombre: `Candidato de prueba ${id}`, demo: true, manual: true,
    estado, completos, total: MODULOS.length,
    avance: Math.round((completos / MODULOS.length) * 100),
    metricas: {}, alertas: [], respaldadoEl: fechaIso,
  };
}

/* [lote, estado, paso, pagos {fase: monto}] — cuadra con los totales de Paideia */
const FILAS = [
  // Lote 1 — ingresos $5,500
  [1, 'activo',      'plan',            { registro: 2000, alineacion: 1500 }],
  [1, 'desistio',    'autodiagnostico', { registro: 2000 }],
  // Lote 2 — ingresos $70,500
  ...Array.from({ length: 6 }, () => [2, 'activo', 'reforzamiento', { registro: 2000, alineacion: 4250 }]),
  ...Array.from({ length: 4 }, () => [2, 'activo', 'plan',          { registro: 2000, alineacion: 4500 }]),
  [2, 'desistio',    'reforzamiento',   { registro: 2000 }],
  [2, 'desistio',    'reforzamiento',   { registro: 2000 }],
  [2, 'desistio',    'autodiagnostico', { registro: 2000 }],
  [2, 'cambio_lote', 'autodiagnostico', { registro: 1000 }],
  // Lote 3 — ingresos $6,000
  [3, 'activo',      'autodiagnostico', { registro: 2000 }],
  [3, 'activo',      'autodiagnostico', { registro: 2000 }],
  [3, 'activo',      'sin_iniciar',     { registro: 2000 }],
];

export function cargarDemoPaideia() {
  return actualizar(d => {
    quitarDemoDe(d);
    let activos = 0;
    FILAS.forEach(([lote, estado, paso, pagos], i) => {
      const dia = String(1 + (i % 22)).padStart(2, '0');
      const fechaIso = `2026-09-${dia}T16:00:00.000Z`;
      const x = expediente(i + 1, paso, fechaIso);
      d.expedientes.push(x);
      /* Proyectado $195,647 = 13 × $13,975 + $13,972 (solo cuentan activos) */
      const total = estado === 'activo' ? (++activos === 14 ? 13972 : 13975) : 13975;
      const monto_alineacion = pagos.alineacion || 4250;
      d.precio[x.correo] = {
        lote, estado, motivo: '', demo: true, total_acordado: total,
        monto_registro: pagos.registro === 1000 ? 1000 : 2000, monto_alineacion,
        monto_evaluacion: 4000, monto_entrega: total - 2000 - monto_alineacion - 4000,
      };
      Object.entries(pagos).forEach(([fase, monto]) => d.pagos.push({
        email: x.correo, fase, monto, origen: fase === 'registro' ? 'transferencia' : (i % 3 ? 'transferencia' : 'mercado_pago'),
        autorizado_en: fechaIso, demo: true,
      }));
    });

    /* Reparto por lote (Paideia: Lote 1 sin Christherapy, 33.33% c/u;
       Lotes 2 y 3 con Christherapy como socio externo al 50%). */
    const tres = [{ id: 'fernando', label: 'Fernando', pct: 33.33 }, { id: 'lot', label: 'Lot', pct: 33.33 }, { id: 'diego', label: 'Diego', pct: 33.33 }];
    const conChris = [{ id: 'christherapy', label: 'Christherapy', pct: 50, externo: true },
      { id: 'fernando', label: 'Fernando', pct: 16.67 }, { id: 'lot', label: 'Lot', pct: 16.67 }, { id: 'diego', label: 'Diego', pct: 16.67 }];
    d.repartoPorLote[1] = { socios: tres.map(s => ({ ...s })), notas: 'Datos de prueba (réplica de Paideia).', demo: true };
    d.repartoPorLote[2] = { socios: conChris.map(s => ({ ...s })), notas: 'Datos de prueba (réplica de Paideia).', demo: true };
    d.repartoPorLote[3] = { socios: conChris.map(s => ({ ...s })), notas: 'Datos de prueba (réplica de Paideia).', demo: true };

    /* Costos de Paideia (gastos_utilidades), aplican a todos los lotes */
    d.gastos ||= [];
    const base = Math.max(0, ...d.gastos.map(g => Number(g.id) || 0));
    [
      { concepto: 'Certificado (Centro Evaluador)', tipo: 'por_certificado', fase: 'entrega',    para: 'real',         monto: 1200 },
      { concepto: 'Centro 1 · gastos administrativos', tipo: 'por_certificado', fase: 'alineacion', para: 'christherapy', monto: 1250 },
      { concepto: 'Centro 2 · gastos administrativos', tipo: 'por_certificado', fase: 'evaluacion', para: 'christherapy', monto: 1250 },
      { concepto: 'Certificado',                     tipo: 'por_certificado', fase: 'entrega',    para: 'christherapy', monto: 1500 },
    ].forEach((g, k) => d.gastos.push({ id: base + k + 1, lote: null, demo: true, ...g }));

    /* Utilidades ya pagadas a socios, como en Paideia */
    [[1, 'fernando', 3000], [1, 'lot', 1833], [1, 'diego', 1833],
     [2, 'christherapy', 28824], [2, 'fernando', 14000], [2, 'lot', 13775], [2, 'diego', 13775]]
      .forEach(([lote, socio, monto]) => d.pagosSocios.push({ lote, socio, monto, fecha: `${FECHA_CORTE}T12:00:00.000Z`, nota: 'Datos de prueba', demo: true }));
    d.demo = { cargadoEl: new Date().toISOString(), fuente: `KPIs de Paideia al ${FECHA_CORTE}` };
  });
}

function quitarDemoDe(d) {
  const correos = new Set(d.expedientes.filter(x => x.demo).map(x => x.correo));
  Object.keys(d.precio).forEach(c => { if (/@demo\.posturalia\.mx$/.test(c) || d.precio[c]?.demo) correos.add(c); });
  /* Lo que el escenario completo agrega además de expedientes y pagos */
  Object.keys(d.evaluaciones || {}).forEach(c => { if (d.evaluaciones[c]?.demo) delete d.evaluaciones[c]; });
  d.sesiones = (d.sesiones || []).filter(s => !s.demo);
  d.reservasEvidencia = (d.reservasEvidencia || []).filter(r => !r.demo);
  d.horariosEvidencia = (d.horariosEvidencia || []).filter(h => !h.demo);
  correos.forEach(c => { if (d.limitesEvidencia?.[c]) delete d.limitesEvidencia[c]; });
  d.expedientes = d.expedientes.filter(x => !x.demo);
  correos.forEach(c => delete d.precio[c]);
  d.pagos = d.pagos.filter(p => !p.demo && !correos.has(p.email) && !/@demo\.posturalia\.mx$/.test(p.email || ''));
  d.pagosSocios = d.pagosSocios.filter(p => !p.demo);
  d.gastos = (d.gastos || []).filter(g => !g.demo);
  Object.keys(d.repartoPorLote).forEach(l => { if (d.repartoPorLote[l]?.demo) delete d.repartoPorLote[l]; });
  delete d.demo;
}

export const quitarDemo = () => actualizar(quitarDemoDe);

/* ============================================================================
   Escenario completo: una persona de prueba por cada categoría que maneja el
   Centro, para recorrer TODAS las pantallas del panel con algo que ver:
   prospecto sin alta, cada paso del proceso, beca en $0, anticipo, estancado,
   plazo de evidencia vencido, grabación sin ligar, esperando evaluador,
   COMPETENTE en trámite, TODAVÍA NO COMPETENTE, certificado entregado,
   desistió, cambió de lote y fase liberada sin la anterior. Más sesiones de
   Alineación (con y sin Zoom), reparto, un costo y un pago a socio.

   Nombres y correos ficticios (@demo.posturalia.mx). La excepción es la
   cuenta de prueba que el propio Fernando pidió usar como candidato
   (CORREO_PRUEBA): entra al Lote 1 con Registro y Alineación liberados y
   una sesión reservada, para que al entrar con ese correo a la vista del
   candidato vea su proceso abierto. Todo lleva `demo: true` y se quita con
   «Quitar datos de prueba».
   ========================================================================== */
export const CORREO_PRUEBA = 'posturalia.d817@gmail.com';
const PRECIOS = { registro: 2000, alineacion: 4500, evaluacion: 4000, entrega: 3500 };
const ORDEN = MODULOS.map(m => m.id);
const PROPIOS = MODULOS.filter(m => m.requiere !== 'evaluador').map(m => m.id);

const dia = n => { const d = new Date(); d.setDate(d.getDate() + n); return d; };
const iso = n => dia(n).toISOString();
const fechaDe = n => { const d = dia(n); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

/* hasta: módulo en el que va (los anteriores quedan completos) · 'todo' =
   todos los suyos completos · 'fin' = también la Entrega · null = nada */
function estadoHasta(hasta) {
  const estado = {};
  const i = hasta === 'todo' ? PROPIOS.length : hasta === 'fin' ? ORDEN.length : hasta ? ORDEN.indexOf(hasta) : -1;
  ORDEN.forEach((id, k) => {
    const completado = hasta === 'todo' ? PROPIOS.includes(id) : k < i;
    estado[id] = { completado, iniciado: completado || (k === i && hasta !== 'todo' && hasta !== 'fin'), datos: null };
  });
  return estado;
}

/* [clave, nombre, lote, estado comercial | null (prospecto), hasta, pagos, extra]
   pagos: { fase: díasAtrás } o { fase: [díasAtrás, cobrado] } */
const ESCENARIO = [
  ['prueba',      'Fernando (cuenta de prueba)',               1, 'activo',      null,              { registro: 2, alineacion: 1 }, { sesion: true }],
  ['prospecto',   'Prueba · Prospecto sin dar de alta',        1, null,          'autodiagnostico', {}],
  ['sin-iniciar', 'Prueba · Pagó Registro, sin iniciar',       1, 'activo',      null,              { registro: 3 }],
  ['autodiag',    'Prueba · En Autodiagnóstico',               1, 'activo',      'autodiagnostico', { registro: 6 }],
  ['estancado',   'Prueba · Estancado (40 días sin avanzar)',  1, 'activo',      'reforzamiento',   { registro: 45 }, { dias: 40 }],
  ['sin-abrir',   'Prueba · Pagó Alineación y no la abre',     1, 'activo',      'alineacion',      { registro: 12, alineacion: 5 }, { sesion: true, sinIniciar: true }],
  ['beca',        'Prueba · Beca de Alineación ($0)',          1, 'activo',      'plan',            { registro: 14, alineacion: [8, 0] }],
  ['anticipo',    'Prueba · Anticipo de Alineación',           1, 'activo',      'documentos',      { registro: 15, alineacion: [9, 1500] }, { sesion: true }],
  ['practica',    'Prueba · En Práctica',                      1, 'activo',      'practica',        { registro: 16, alineacion: 10, evaluacion: 4 }],
  ['examen',      'Prueba · En Examen',                        1, 'activo',      'examen',          { registro: 17, alineacion: 11, evaluacion: 5 }],
  ['vencido',     'Prueba · Plazo de evidencia vencido',       1, 'activo',      'evidencias',      { registro: 60, alineacion: 45, evaluacion: 20 }],
  ['esperando',   'Prueba · Esperando al evaluador',           1, 'activo',      'todo',            { registro: 20, alineacion: 14, evaluacion: 8 }, { grabo: true }],
  ['competente',  'Prueba · COMPETENTE, certificado en trámite', 1, 'activo',    'todo',            { registro: 30, alineacion: 25, evaluacion: 18, entrega: 6 }, { dictamen: 'COMPETENTE' }],
  ['no-comp',     'Prueba · TODAVÍA NO COMPETENTE',            1, 'activo',      'todo',            { registro: 28, alineacion: 24, evaluacion: 16 }, { dictamen: 'TODAVÍA NO COMPETENTE' }],
  ['entregado',   'Prueba · Certificado entregado',            1, 'activo',      'fin',             { registro: 90, alineacion: 85, evaluacion: 70, entrega: 40 }, { dictamen: 'COMPETENTE', entregado: true }],
  ['desistio',    'Prueba · Desistió',                         1, 'desistio',    'reforzamiento',   { registro: 25 }],
  ['cambio',      'Prueba · Cambió al Lote 2',                 2, 'cambio_lote', 'autodiagnostico', { registro: 22 }],
  ['lote2',       'Prueba · Lote 2 al corriente',              2, 'activo',      'reforzamiento',   { registro: 7 }],
  ['salto',       'Prueba · Entrega liberada sin Evaluación',  2, 'activo',      'plan',            { registro: 18, alineacion: 12, entrega: 2 }],
];

/* Horarios libres en la Sala de evidencias, como la demo de Paideia (29 sep):
   los próximos 14 días a las 09:00, 11:00, 16:00 y 18:00 (hora de México),
   solo los que faltan más de 2 h, de 90 min. Así la cuenta de prueba puede
   apartar su horario sin que el equipo tenga que crear horarios a mano, y
   «Quitar datos de prueba» los borra. */
export function horariosDePrueba(ahora = Date.now()) {
  const HORAS = ['09:00', '11:00', '16:00', '18:00'];
  const hoy = fechaISO(ahora), minimo = ahora + 2 * 3600000, lista = [];
  for (let k = 0; k < 14; k++) {
    const fecha = sumarDias(hoy, k);
    HORAS.forEach(h => {
      const inicio = mxAIso(fecha, h);
      if (Date.parse(inicio) <= minimo) return;
      lista.push({ id: `demo-hor-${fecha}-${h.replace(':', '')}`, inicio, fin: new Date(Date.parse(inicio) + 90 * 60000).toISOString(), colchon_min: 0, demo: true });
    });
  }
  return lista;
}

export function cargarEscenarioCompleto() {
  return actualizar(d => {
    quitarDemoDe(d);
    d.evaluaciones ||= {}; d.sesiones ||= []; d.reservasEvidencia ||= []; d.limitesEvidencia ||= {}; d.gastos ||= [];
    const inscritos = [];
    ESCENARIO.forEach(([clave, nombre, lote, estado, hasta, pagos, extra = {}]) => {
      const correo = clave === 'prueba' ? CORREO_PRUEBA : `escenario-${clave}@demo.posturalia.mx`;
      const est = estadoHasta(hasta);
      if (extra.sinIniciar && est.alineacion) est.alineacion.iniciado = false;
      const completos = MODULOS.filter(m => est[m.id].completado).length;
      d.expedientes = d.expedientes.filter(x => (x.correo || '').toLowerCase() !== correo);
      d.expedientes.push({ id: correo, correo, nombre, demo: true, manual: true, estado: est, completos, total: MODULOS.length,
        avance: Math.round((completos / MODULOS.length) * 100), metricas: {}, alertas: [],
        respaldadoEl: iso(-(extra.dias ?? 1)) });
      if (estado) {
        d.precio[correo] = { lote, estado, motivo: estado === 'desistio' ? 'Datos de prueba: dejó el proceso' : '', demo: true,
          ...Object.fromEntries(Object.entries(PRECIOS).map(([f, m]) => ['monto_' + f, m])),
          total_acordado: Object.values(PRECIOS).reduce((a, b) => a + b, 0) };
      }
      Object.entries(pagos).forEach(([fase, v]) => {
        const [atras, cobrado] = Array.isArray(v) ? v : [v, undefined];
        d.pagos = d.pagos.filter(p => !(p.email === correo && p.fase === fase));
        d.pagos.push({ email: correo, fase, monto: PRECIOS[fase], origen: fase === 'alineacion' ? 'mercado_pago' : 'transferencia',
          autorizado_en: iso(-atras), demo: true, ...(cobrado !== undefined ? { cobrado } : {}) });
      });
      if (extra.sesion) inscritos.push(correo);
      if (extra.grabo) d.reservasEvidencia.push({ id: 'demo-res-' + clave, horario_id: 'demo', email: correo,
        inicio: iso(-3), fin: new Date(dia(-3).getTime() + 3600000).toISOString(), estado: 'asistio', creada: iso(-6), demo: true });
      if (clave === 'vencido') d.limitesEvidencia[correo] = fechaDe(-4);
      if (extra.dictamen) {
        const marcas = extra.dictamen === 'COMPETENTE'
          ? ['revision', 'registro_sep', 'portafolio_sep', 'tramite', ...(extra.entregado ? ['recibido', 'entregado'] : [])]
          : ['revision', 'registro_sep'];
        d.evaluaciones[correo] = { demo: true, actualizado_at: iso(-2),
          etapas: Object.fromEntries(marcas.map((m, k) => [m, { fecha: iso(-20 + k) }])),
          video: { liga: 'https://zoom.us/rec/share/demo' },
          cedula: { juicio: extra.dictamen, borrador: false, evaluadora: 'Evaluador(a) de prueba', fecha: fechaDe(-10), publicada_at: iso(-10),
            observacionesCandidato: extra.dictamen === 'COMPETENTE'
              ? 'Datos de prueba: muy buen manejo de la valoración postural.'
              : 'Datos de prueba: repasa el Plan de Seguimiento y vuelve a presentar la evidencia.' } };
      }
    });

    /* Sesiones de Alineación: próxima con Zoom e inscritos, otra sin liga
       (sale en «Requieren atención») y una que ya pasó. */
    d.sesiones = d.sesiones.filter(s => !s.demo);
    d.sesiones.push(
      { id: 'demo-ses-1', demo: true, titulo: 'Alineación EC1375 · Grupo de prueba', fecha: fechaDe(3), horaIni: '10:00', horaFin: '13:00',
        instructor: 'Instructor de prueba', liga: 'https://zoom.us/j/1234567890', cupo: 12, descripcion: 'Sesión de prueba (se quita con los datos de prueba).', inscritos },
      { id: 'demo-ses-2', demo: true, titulo: 'Alineación EC1375 · Sin liga todavía', fecha: fechaDe(10), horaIni: '17:00', horaFin: '20:00',
        instructor: 'Instructor de prueba', liga: '', cupo: 12, descripcion: '', inscritos: [] },
      { id: 'demo-ses-0', demo: true, titulo: 'Alineación EC1375 · Ya pasó', fecha: fechaDe(-12), horaIni: '10:00', horaFin: '13:00',
        instructor: 'Instructor de prueba', liga: 'https://zoom.us/j/1111111111', cupo: 12, descripcion: '',
        inscritos: ['escenario-beca@demo.posturalia.mx', 'escenario-practica@demo.posturalia.mx'] });

    /* Reparto y costos para Utilidades */
    const socios = [{ id: 'fernando', label: 'Fernando', pct: 33.34 }, { id: 'socio-b', label: 'Socio B', pct: 33.33 }, { id: 'socio-c', label: 'Socio C', pct: 33.33 }];
    [1, 2].forEach(l => { d.repartoPorLote[l] = { socios: socios.map(s => ({ ...s })), notas: 'Datos de prueba (escenario completo).', demo: true }; });
    const base = Math.max(0, ...d.gastos.map(g => Number(g.id) || 0));
    d.gastos.push({ id: base + 1, lote: null, demo: true, concepto: 'Certificado (Centro Evaluador)', tipo: 'por_certificado', fase: 'entrega', para: 'real', monto: 1200 },
                  { id: base + 2, lote: null, demo: true, concepto: 'Zoom Pro (prueba)', tipo: 'fijo', fase: null, para: 'real', monto: 300 });
    d.pagosSocios.push({ lote: 1, socio: 'fernando', monto: 3000, fecha: iso(-5), nota: 'Datos de prueba', demo: true });
    d.horariosEvidencia ||= [];
    d.horariosEvidencia.push(...horariosDePrueba());
    d.demo = { cargadoEl: new Date().toISOString(), fuente: `Escenario completo: ${ESCENARIO.length} personas de prueba, una por categoría (tu cuenta de prueba: ${CORREO_PRUEBA})` };
  });
}
