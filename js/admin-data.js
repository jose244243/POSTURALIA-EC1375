/* ============================================================================
   POSTURALIA · Panel del Centro Evaluador
   admin-data.js — Modelo de datos del panel

   Sigue la forma del panel de Paideia (admin-data.js) para que los dos
   sistemas hablen el mismo idioma, con dos diferencias deliberadas:

     · Los socios NO están fijos en el código. Ahí venían escritos a mano;
       aquí se agregan, se quitan y se les reparte el porcentaje desde la
       propia interfaz.
     · Todo vive en localStorage mientras no haya Supabase. Las funciones ya
       están separadas de la vista para que el cambio no toque las pantallas.
   ========================================================================== */

import { hoyLocal } from './fechas.js';
import { CONFIG } from './config.js';
import { dictamenDe } from './evaluacion.js';
import { limiteDesde, limiteInfo, fechaISO as fechaMx, fechaLarga, CONFIG_SALA } from './sala.js';
/* Estático, no dinámico: lo que se captura se anota en la cola en el mismo
   instante, antes de que una recarga pueda interrumpir nada. */
import { subirCambios as subirCambiosCentro } from './centro-nube.js';

const CLAVE = 'posturalia.evaluador.v1';

export const FASES = CONFIG.fases.map(f => f.id);
export const FASE_LABEL = Object.fromEntries(CONFIG.fases.map(f => [f.id, f.label]));

export const ESTADOS_CANDIDATO = [
  { id: 'activo',       label: 'Activo' },
  { id: 'desistio',     label: 'Desistió' },
  { id: 'cambio_lote',  label: 'Cambió de lote' },
  { id: 'administrador',label: 'Administrador (equipo)' },   // no cuenta en los KPIs; da acceso al panel (como Paideia)
];

const VACIO = {
  expedientes: [],      // lo que sube el evaluador desde los respaldos
  precio:      {},      // email → { lote, estado, motivo, total_acordado, monto_<fase> }
  pagos:       [],      // { email, fase, monto, origen, autorizado_en }
  repartoPorLote: {},   // lote → { socios: [{id,label,pct}], notas }
  pagosSocios: [],      // { lote, socio, monto, fecha, nota }
  sesiones:    [],      // { id, fecha, horaIni, horaFin, instructor, liga, cupo, descripcion, inscritos[] }
  gastos:      [],      // { id, lote|null, concepto, tipo:'por_certificado'|'fijo', fase|null, para:'real'|<socioId>, monto }
  evaluaciones: {},     // correo → { etapas, iec, cedula, cedulas_anteriores, firma_candidato, firmas, video, verificacion }
};

/* ── Evaluación de un candidato (Centro Evaluador) ─────────────────────── */
export const evaluacionDe = (datos, email) => (datos.evaluaciones || {})[email] || {};
export function guardarEvaluacion(email, cambios) {
  const r = actualizar(d => {
    d.evaluaciones ||= {};
    d.evaluaciones[email] = { ...(d.evaluaciones[email] || {}), ...cambios, actualizado_at: new Date().toISOString() };
  });
  subirEvaluacion(email, r.evaluaciones[email]);
  return r;
}

/* ── Evaluaciones en la nube (como Paideia) ───────────────────────────────
   Con Supabase, la evaluación sube a la tabla `evaluaciones` para que el
   candidato vea y firme su Cédula desde su propio dispositivo. Se escribe
   primero aquí y luego se sube; si la red falla queda pendiente y se
   reintenta al sincronizar. Sin Supabase no se hace nada.              */
const enNube = () => !!(CONFIG.supabase?.url && CONFIG.supabase?.anonKey);
function subirEvaluacion(email, ev) {
  if (!enNube() || !email) return Promise.resolve(false);
  return import('./nube.js').then(({ Evaluaciones }) => Evaluaciones.subir(email, ev))
    .then(datos => {
      actualizar(d => {
        if (datos?.firma_candidato && !d.evaluaciones?.[email]?.firma_candidato) d.evaluaciones[email].firma_candidato = datos.firma_candidato;
        if (d.evaluacionesPendientes) delete d.evaluacionesPendientes[email];
      });
      return true;
    })
    .catch(() => { actualizar(d => { (d.evaluacionesPendientes ||= {})[email] = true; }); return false; });
}
export async function sincronizarEvaluaciones() {
  if (!enNube()) return { ok: false, motivo: 'local' };
  const { Evaluaciones } = await import('./nube.js');
  const { combinarEvaluaciones } = await import('./evaluacion.js');
  let remotas;
  try { remotas = await Evaluaciones.todas(); } catch (e) { return { ok: false, motivo: String(e?.message || e) }; }
  let cambios = 0;
  const r = actualizar(d => {
    d.evaluaciones ||= {};
    Object.entries(remotas).forEach(([k, rem]) => {
      const antes = JSON.stringify(d.evaluaciones[k] || null);
      d.evaluaciones[k] = combinarEvaluaciones(d.evaluaciones[k], rem);
      if (JSON.stringify(d.evaluaciones[k]) !== antes) cambios++;
    });
  });
  const pendientes = Object.keys(r.evaluacionesPendientes || {});
  for (const k of pendientes) await subirEvaluacion(k, r.evaluaciones[k]);
  return { ok: true, cambios, subidas: pendientes.length };
}

/* ── Persistencia ─────────────────────────────────────────────────────── */
export function cargar() {
  let d;
  try { d = JSON.parse(localStorage.getItem(CLAVE)); } catch { d = null; }
  if (!d) return structuredClone(VACIO);
  const datos = { ...structuredClone(VACIO), ...d };

  /* Migración: antes los socios eran una sola lista para todo. Resultó que
     el reparto cambia de lote a lote —en uno entra un socio que en el otro
     no—, así que ahora cada lote lleva el suyo. Lo viejo se copia a todos
     los lotes que existan para no perder lo ya capturado. */
  if (Array.isArray(d.socios) && d.socios.length) {
    lotes(datos).forEach(l => {
      const r = datos.repartoPorLote[l];
      if (!r || !Array.isArray(r.socios) || !r.socios.length) {
        datos.repartoPorLote[l] = {
          notas: r?.notas || '',
          socios: d.socios.map(s => ({ ...s })),
        };
      }
    });
    delete datos.socios;
  }
  return datos;
}

export function guardar(datos) {
  try { localStorage.setItem(CLAVE, JSON.stringify(datos)); return true; }
  catch (e) {
    /* Casi siempre es la cuota del navegador. Se distingue porque lo que
       sigue —avisarle al evaluador— tiene que decir algo accionable, y
       "se llenó el navegador" y "el JSON está corrupto" no se arreglan
       igual. */
    ultimoError = /quota|exceeded|storage/i.test(e?.name + ' ' + e?.message)
      ? 'cuota' : 'desconocido';
    return false;
  }
}

let ultimoError = null;
export const errorDeGuardado = () => ultimoError;

/* ── Actualizar ───────────────────────────────────────────────────────────
   Devuelve si se GUARDÓ, no solo los datos.

   Antes ignoraba el `false` de guardar() y disparaba `admin:cambio` igual.
   El efecto, con expedientes que ahora traen fotos adentro: el evaluador
   arrastraba doce candidatos, los doce aparecían en la tabla, y al recargar
   quedaba uno. La pantalla le decía que sí a algo que no había pasado — que
   es peor que un error, porque un error se atiende y esto no se ve.       */
export function actualizar(fn) {
  const d = cargar();
  const sesionesAntes = enNube() ? JSON.stringify(d.sesiones || []) : null;
  const centroAntes = enNube() ? structuredClone(d) : null;
  fn(d);
  asegurarIdsPagosSocios(d);
  ultimoError = null;
  const ok = guardar(d);
  /* Con Supabase, lo comercial (precios, fases liberadas, reparto, costos,
     pagos a socios, altas a mano) sube a `centro_datos`: solo lo que cambió.
     Registrar un pago ahí es lo que abre la fase al candidato. */
  if (ok && centroAntes) subirCambiosCentro(centroAntes, d).catch(() => {});   // se anota al instante; se manda en fila
  /* Con Supabase, lo que el equipo cambie en las sesiones de Alineación sube
     a la nube (solo la diferencia: así no se borra la inscripción que un
     candidato acaba de hacer desde su casa). */
  if (ok && enNube() && sesionesAntes !== JSON.stringify(d.sesiones || []))
    subirCambiosSesiones(JSON.parse(sesionesAntes), d.sesiones || []).catch(() => {});
  window.dispatchEvent(new CustomEvent('admin:cambio', {
    detail: { guardado: ok, error: ultimoError },
  }));
  return Object.assign(d, { __guardado: ok, __error: ultimoError });
}

/* Los pagos a socios no traían id; en la nube hace falta para borrar el
   correcto. Se les pone uno al guardar (también en local: no estorba). */
function asegurarIdsPagosSocios(d) {
  (d.pagosSocios || []).forEach(p => { if (!p.id) p.id = 'ps-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); });
}

/* ── El panel compartido en la nube (v43) ────────────────────────────────
   Baja lo comercial de `centro_datos` (la nube manda) y trae a la lista a
   los candidatos que se registraron por su cuenta, con su avance. Lo llama
   admin-shell al abrir cualquier página del panel. Sin Supabase no hace
   nada. Devuelve { ok, cambios }.                                        */
let sincronizandoCentro = null;
export function sincronizarCentro() {
  if (!enNube()) return Promise.resolve({ ok: false, motivo: 'local' });
  sincronizandoCentro ||= (async () => {
    const m = await import('./centro-nube.js');
    const antes = JSON.stringify(cargar());
    const r = await m.bajarCentro();
    if (!r.ok) return r;
    const d = cargar();
    m.mezclar(d, r.colecciones);
    guardar(d);                       // sin actualizar(): no se vuelve a subir lo que se acaba de bajar
    const cands = await m.respaldosDeLaNube();
    /* Quien es del equipo pudo haber entrado a la lista antes de este
       filtro (llegó de la nube como «nube-correo»): se quita. Solo lo que
       vino de la nube; un expediente que el Centro dio de alta a mano se
       respeta. */
    if (cands.ok && cands.equipoCorreos?.length) {
      const fuera = new Set(cands.equipoCorreos);
      const d2 = cargar();
      const antesN = d2.expedientes.length;
      d2.expedientes = d2.expedientes.filter(x => !(fuera.has((x.correo || '').toLowerCase()) && /^nube-/.test(x.archivo || '')));
      if (d2.expedientes.length !== antesN) guardar(d2);
    }
    if (cands.ok && cands.respaldos.length) {
      const { incorporarRespaldos } = await import('./incorporar.js');
      await incorporarRespaldos(cands.respaldos.map(x => ({ nombre: `nube-${x.candidato.correo}.json`, texto: JSON.stringify(x) })));
    }
    const cambios = antes !== JSON.stringify(cargar());
    if (cambios) window.dispatchEvent(new CustomEvent('admin:cambio', { detail: { guardado: true, origen: 'nube' } }));
    return { ok: true, cambios, candidatos: cands.ok ? cands.respaldos.length : 0, motivo: cands.ok ? '' : cands.motivo };
  })().finally(() => { sincronizandoCentro = null; });
  return sincronizandoCentro;
}

/* ── Sesiones de Alineación en la nube (v38) ─────────────────────────── */
const filaSesion = s => ({ id: s.id, fecha: s.fecha, hora_ini: s.horaIni || null, hora_fin: s.horaFin || null, instructor: s.instructor || null,
  liga: s.liga || null, cupo: Number(s.cupo) || 0, descripcion: s.descripcion || null, updated_at: new Date().toISOString() });
async function subirCambiosSesiones(antes = [], despues = []) {
  const { clienteNube } = await import('./nube.js'); const c = await clienteNube();
  const A = Object.fromEntries(antes.map(s => [s.id, s])), D = Object.fromEntries(despues.map(s => [s.id, s]));
  const cambiadas = despues.filter(s => { const x = A[s.id]; return !x || JSON.stringify(filaSesion({ ...x })) .replace(/"updated_at":"[^"]*"/, '') !== JSON.stringify(filaSesion({ ...s })).replace(/"updated_at":"[^"]*"/, ''); });
  if (cambiadas.length) await c.from('sesiones_alineacion').upsert(cambiadas.map(filaSesion));
  const borradas = antes.filter(s => !D[s.id]).map(s => s.id);
  if (borradas.length) await c.from('sesiones_alineacion').delete().in('id', borradas);
  for (const s of despues) {
    const prev = new Set((A[s.id]?.inscritos || []).map(e => String(e).toLowerCase())), ahora = new Set((s.inscritos || []).map(e => String(e).toLowerCase()));
    const nuevos = [...ahora].filter(e => !prev.has(e)), fuera = [...prev].filter(e => !ahora.has(e));
    if (nuevos.length) await c.from('inscripciones_alineacion').upsert(nuevos.map(email => ({ sesion_id: s.id, email })));
    if (fuera.length) await c.from('inscripciones_alineacion').delete().eq('sesion_id', s.id).in('email', fuera);
  }
}
/* Trae de la nube las sesiones y quién se inscribió (el candidato se inscribe
   desde su propio dispositivo). Lo local que aún no subió se conserva. */
export async function sincronizarSesiones() {
  if (!enNube()) return { ok: false, motivo: 'local' };
  const { clienteNube } = await import('./nube.js'); const c = await clienteNube();
  const [s, i] = await Promise.all([c.from('sesiones_alineacion').select('*'), c.from('inscripciones_alineacion').select('sesion_id,email')]);
  if (s.error || i.error) return { ok: false, motivo: String((s.error || i.error).message || 'error') };
  const porSesion = {}; (i.data || []).forEach(r => { (porSesion[r.sesion_id] ||= []).push(String(r.email).toLowerCase()); });
  const d = cargar();
  const locales = Object.fromEntries((d.sesiones || []).map(x => [x.id, x]));
  const remotas = (s.data || []).map(r => ({ ...(locales[r.id] || {}), id: r.id, fecha: String(r.fecha).slice(0, 10), horaIni: r.hora_ini || '', horaFin: r.hora_fin || '',
    instructor: r.instructor || '', liga: r.liga || '', cupo: r.cupo, descripcion: r.descripcion || '', inscritos: porSesion[r.id] || [] }));
  const ids = new Set(remotas.map(r => r.id));
  d.sesiones = [...remotas, ...(d.sesiones || []).filter(x => !ids.has(x.id))];
  guardar(d);
  return { ok: true, sesiones: d.sesiones.length };
}

/* ── Candidatos ───────────────────────────────────────────────────────── */
const claveDe = x => (x.correo || x.nombre || '').toLowerCase().trim();

export function precioDe(datos, email) {
  return datos.precio[email] || { lote: 1, estado: 'activo', motivo: '', total_acordado: 0 };
}

/* Alta a mano: hay quien paga antes de tocar la plataforma, y hasta que sube
   su primer respaldo no existiría en el panel. Sin esto, el dinero cobrado
   no aparecería en ningún lado hasta semanas después. */
export function altaManual({ correo, nombre = '', lote = 1, estado = 'activo',
                             montos = {}, motivo = '' }) {
  const email = String(correo || '').toLowerCase().trim();
  if (!email) return null;

  actualizar(d => {
    const previo = d.precio[email] || {};
    const fila = { ...previo, lote: Number(lote) || 1, estado, motivo };
    FASES.forEach(f => { if (montos[f] != null) fila['monto_' + f] = Number(montos[f]) || 0; });
    fila.total_acordado = FASES.reduce((s, f) => s + (fila['monto_' + f] || 0), 0);
    d.precio[email] = fila;

    /* Un expediente mínimo para que aparezca en las listas aunque todavía no
       haya subido nada. Se reemplaza solo en cuanto cargue su respaldo. */
    if (!d.expedientes.some(x => (x.correo || '').toLowerCase() === email)) {
      d.expedientes.push({
        id: email, correo: email, nombre: nombre.trim() || email,
        manual: true, estado: {}, completos: 0,
        total: CONFIG.flujo.filter(m => m.listo).length,
        avance: 0, metricas: {}, alertas: [], respaldadoEl: '',
      });
    } else if (nombre.trim()) {
      const x = d.expedientes.find(y => (y.correo || '').toLowerCase() === email);
      if (x.manual) x.nombre = nombre.trim();
    }
  });
  return email;
}

/* Importar una lista ya interpretada (js/importar.js). Da de alta a quien no
   existe, actualiza nombre/lote/estado/precios de quien sí, y registra las
   fases pagadas. Nunca quita un pago que ya estaba: si la lista dice «no»
   y aquí está pagado, se respeta lo de aquí (se revoca a mano). */
export function importarCandidatos(registros) {
  const total = CONFIG.flujo.filter(m => m.listo).length;
  let nuevos = 0, actualizados = 0, pagos = 0;
  const r = actualizar(d => {
    registros.forEach(x => {
      const email = x.correo;
      const previo = d.precio[email] || { lote: 1, estado: 'activo', motivo: '', total_acordado: 0 };
      const fila = { ...previo };
      if (x.lote) fila.lote = x.lote;
      if (x.estado) fila.estado = x.estado;
      if (x.motivo) fila.motivo = x.motivo;
      FASES.forEach(f => { if (x.montos?.[f] != null) fila['monto_' + f] = x.montos[f]; });
      fila.total_acordado = FASES.reduce((s, f) => s + (fila['monto_' + f] || 0), 0);
      d.precio[email] = fila;

      let e = d.expedientes.find(y => (y.correo || '').toLowerCase() === email);
      if (!e) {
        nuevos++;
        e = { id: email, correo: email, nombre: x.nombre || email, manual: true, importado: true, estado: {}, completos: 0,
          total, avance: 0, metricas: {}, alertas: [], respaldadoEl: '' };
        d.expedientes.push(e);
      } else actualizados++;
      if (e.manual && x.nombre) e.nombre = x.nombre;
      if (x.telefono || x.curp) e.candidato = { ...(e.candidato || {}), nombre: e.candidato?.nombre || x.nombre || '', email,
        ...(x.telefono ? { telefonoCelular: x.telefono } : {}), ...(x.curp ? { curp: x.curp } : {}) };

      Object.entries(x.pagos || {}).forEach(([fase, p]) => {
        if (!FASES.includes(fase)) return;
        const ya = d.pagos.find(q => q.email === email && q.fase === fase);
        const monto = p.monto != null ? p.monto : (fila['monto_' + fase] || 0);
        if (ya) { if (!(Number(ya.monto) > 0) && monto > 0) ya.monto = monto; if (p.fecha && ya.origen === 'importado') ya.autorizado_en = p.fecha; return; }
        d.pagos.push({ email, fase, origen: 'importado', monto, autorizado_en: p.fecha || new Date().toISOString() });
        pagos++;
      });
    });
  });
  return { nuevos, actualizados, pagos, guardado: r.__guardado !== false, error: r.__error };
}

/* Borrar del todo: expediente, precio, pagos, evaluación, horario de sala,
   plazo e inscripciones a sesiones. Los archivos del expediente (IndexedDB)
   los borra la pantalla con borrarDeExpediente. No toca al equipo. */
export function borrarCandidatos(correos) {
  const set = new Set(correos.map(c => String(c || '').toLowerCase().trim()).filter(Boolean));
  const ids = [];
  const r = actualizar(d => {
    d.expedientes = d.expedientes.filter(x => {
      const k = claveDe(x);
      if (set.has(k) || set.has(String(x.id).toLowerCase())) { ids.push(x.id); return false; }
      return true;
    });
    set.forEach(k => { delete d.precio[k]; if (d.evaluaciones) delete d.evaluaciones[k]; if (d.evaluacionesPendientes) delete d.evaluacionesPendientes[k]; if (d.limitesEvidencia) delete d.limitesEvidencia[k]; });
    d.pagos = d.pagos.filter(p => !set.has(p.email));
    if (d.reservasEvidencia) d.reservasEvidencia = d.reservasEvidencia.filter(x => !set.has(x.email));
    (d.sesiones || []).forEach(s => { if (Array.isArray(s.inscritos)) s.inscritos = s.inscritos.filter(i => !set.has(String(i?.email || i).toLowerCase())); });
  });
  return { ids, guardado: r.__guardado !== false };
}

export function fijarDatosComerciales(email, cambios) {
  /* Un precio negativo restaba ingresos y un lote 2.5 no existe: el input
     trae min="0" y step="1", pero eso solo guía a las flechas, no a lo que
     se teclea o se pega. */
  const c = { ...cambios };
  for (const k of Object.keys(c)) {
    if (k.startsWith('monto_')) c[k] = Math.max(0, Math.round(Number(c[k]) || 0));
    if (k === 'lote') c[k] = Math.max(1, Math.floor(Number(c[k]) || 1));
  }
  return actualizar(d => {
    const fila = d.precio[email] ||= { lote: 1, estado: 'activo', motivo: '', total_acordado: 0 };
    Object.assign(fila, c);
    fila.total_acordado = FASES.reduce((s, f) => s + (fila['monto_' + f] || 0), 0);
  });
}

/* Liberar o revocar una fase. Liberarla es lo que se la habilita al
   candidato, así que revocarla tiene que borrar el pago, no marcarlo. */
export function alternarFase(email, fase, origen = 'manual') {
  return actualizar(d => {
    const i = d.pagos.findIndex(p => p.email === email && p.fase === fase);
    if (i >= 0) { d.pagos.splice(i, 1); return; }
    d.pagos.push({
      email, fase, origen,
      monto: (d.precio[email] || {})['monto_' + fase] || 0,
      autorizado_en: new Date().toISOString(),
    });
  });
}

/* ── Lo que se cobró de verdad ─────────────────────────────────────────────
   Antes lo cobrado se calculaba con el precio ACTUAL de cada fase pagada, y
   el pago guardaba su monto pero nadie lo leía. Cambiar un precio después de
   cobrar reescribía el pasado: si Alineación se cobró a $2,000 y luego se
   ajustaba a $1,500 para el lote siguiente, ese candidato "había pagado"
   $1,500, los ingresos del lote bajaban y el reparto entre socios —que se
   calcula sobre esos ingresos— salía pagado de más sin que nadie hubiera
   tocado un peso.

   Ahora manda el monto registrado en el pago. Solo si el pago se registró
   sin monto (se liberó la fase antes de capturar el precio) se usa el
   precio acordado, y en cuanto se captura se sella en el pago. */
export function pagoDe(datos, email, fase) {
  return datos.pagos.find(p => p.email === email && p.fase === fase) || null;
}

/* Lo que de verdad entró en esa fase. Si el equipo capturó lo cobrado
   (anticipo, pago parcial, beca en $0) manda eso, aunque sea 0: antes una
   beca de $0 contaba como cobro completo e inflaba ingresos y reparto (como
   montoCobrado() de Paideia). Si no se capturó, manda el monto sellado al
   liberar la fase y, sin él, el precio acordado. */
export const cobradoCapturado = p => !!p && p.cobrado !== undefined && p.cobrado !== null && p.cobrado !== '';
export function montoCobrado(datos, email, fase) {
  const p = pagoDe(datos, email, fase);
  if (!p) return 0;
  if (cobradoCapturado(p)) return Math.max(0, Number(p.cobrado) || 0);
  const n = Number(p.monto);
  return n > 0 ? n : (precioDe(datos, email)['monto_' + fase] || 0);
}

/* Capturar lo cobrado de una fase ya liberada. Vacío = volver a «lo mismo
   que el precio». Solo existe si la fase está liberada: cobrar sin liberar
   no le abre nada al candidato y se prestaría a confusión. */
export function fijarCobrado(email, fase, valor) {
  return actualizar(d => {
    const p = d.pagos.find(x => x.email === email && x.fase === fase);
    if (!p) return;
    if (valor === '' || valor === null || valor === undefined) delete p.cobrado;
    else p.cobrado = Math.max(0, Math.round(Number(String(valor).replace(/[$,\s]/g, '')) || 0));
  });
}

/* Pagos registrados en $0 que ya tienen precio: se sella el precio en el
   pago. Se llama al terminar de capturar (change), no en cada tecla: si no,
   al teclear 2000 quedaría sellado el 2. */
export function sellarMontosPendientes(email) {
  return actualizar(d => {
    const pr = d.precio[email] || {};
    d.pagos.forEach(p => {
      if (p.email !== email || Number(p.monto) > 0) return;
      const m = pr['monto_' + p.fase] || 0;
      if (m > 0) p.monto = m;
    });
  });
}

export function pagoHecho(datos, email, fase) {
  return datos.pagos.some(p => p.email === email && p.fase === fase);
}

export function fasesPagadas(datos, email) {
  return Object.fromEntries(FASES.map(f => [f, pagoHecho(datos, email, f)]));
}

/* La fase más avanzada que ya pagó: define hasta dónde puede llegar hoy */
export function faseMasAlta(datos, email) {
  let ultima = null;
  FASES.forEach(f => { if (pagoHecho(datos, email, f)) ultima = f; });
  return ultima;
}

export function candidatos(datos) {
  return datos.expedientes.map(x => {
    const email = claveDe(x);
    const pr = precioDe(datos, email);
    const fases = fasesPagadas(datos, email);
    const cobradoPorFase = Object.fromEntries(FASES.map(f => [f, montoCobrado(datos, email, f)]));
    const cobrado = FASES.reduce((s, f) => s + cobradoPorFase[f], 0);
    /* Lo que falta es el precio de las fases SIN pagar, más el saldo de las
       pagadas con un anticipo capturado (cobrado menor que el precio).
       Restar lo cobrado del total acordado mezclaba precios de hoy con
       cobros de ayer. */
    const saldoDe = f => {
      const pre = pr['monto_' + f] || 0;
      if (!fases[f]) return pre;
      const p = pagoDe(datos, email, f);
      return cobradoCapturado(p) ? Math.max(0, pre - (Number(p.cobrado) || 0)) : 0;
    };
    const saldoPorFase = Object.fromEntries(FASES.map(f => [f, saldoDe(f)]));
    const porCobrar = FASES.reduce((s, f) => s + saldoPorFase[f], 0);

    /* Prospecto (como Paideia): se registró o subió su respaldo, pero el
       equipo no le ha capturado lote, precio ni pago. No cuenta como activo
       en los KPIs ni en lo proyectado hasta que alguien lo dé de alta. */
    const sinAlta = !datos.precio[email] && !FASES.some(f => fases[f]);
    return {
      ...x,
      email,
      sinAlta,
      lote: pr.lote || 1,
      estadoComercial: sinAlta ? 'prospecto' : (pr.estado || 'activo'),
      totalAcordado: pr.total_acordado || 0,
      fases,
      fasePagada: faseMasAlta(datos, email),
      cobrado,
      cobradoPorFase,
      saldoPorFase,
      porCobrar,
    };
  });
}

/* Los que cuentan para métricas: las cuentas internas no son candidatos */
export const contables = lista => lista.filter(c => c.estadoComercial !== 'administrador');
export const activos   = lista => contables(lista).filter(c => c.estadoComercial === 'activo');

/* ── KPIs ─────────────────────────────────────────────────────────────── */
export function kpis(datos, lote = null) {
  let lista = contables(candidatos(datos));
  if (lote) lista = lista.filter(c => c.lote === lote);
  const act = lista.filter(c => c.estadoComercial === 'activo');

  /* Dos poblaciones distintas, cada una para lo suyo:

       porFase   solo ACTIVOS. Es el embudo: cuánta gente sigue en el proceso.
       pagaron   TODOS los que pagaron esa fase, incluidos los que desistieron
                 después. Es el precio: lo que de verdad se cobra por cabeza.

     Antes el promedio dividía los ingresos de TODOS entre el conteo de
     ACTIVOS. Con un candidato que pagó $2,000 y luego desistió, y dos activos
     con 50% de descuento, el promedio salía $2,000 —precio completo— cuando
     lo real era $1,500. Y ese promedio existe justamente para delatar un
     descuento que se volvió costumbre: escondía lo que se hizo para mostrar. */
  const porFase = {}, ingresosPorFase = {}, pagaron = {};
  FASES.forEach(f => {
    porFase[f] = act.filter(c => c.fases[f]).length;
    pagaron[f] = lista.filter(c => c.fases[f]).length;
    ingresosPorFase[f] = lista.reduce((s, c) => s + (c.cobradoPorFase?.[f] || 0), 0);
  });

  const inscritos = act.length;
  const pct = (a, b) => (b > 0 ? Math.round((a / b) * 100) : 0);

  /* Una fila por fase, ya calculada: cuánta gente la tiene liberada, cuánto
     se cobró ahí y cuánto salió en promedio por cabeza. El promedio es lo
     que delata un descuento que se volvió costumbre. */
  const fases = CONFIG.fases.map(f => ({
    id: f.id, label: f.label, peso: f.peso,
    candidatos: porFase[f.id],
    ingresos: ingresosPorFase[f.id],
    pagaron: pagaron[f.id],
    promedio: pagaron[f.id] ? Math.round(ingresosPorFase[f.id] / pagaron[f.id]) : null,
    pct: pct(porFase[f.id], inscritos),
  }));

  return {
    fases,
    inscritos,
    registrados: lista.length,
    desistieron: lista.filter(c => c.estadoComercial === 'desistio').length,
    cambioLote:  lista.filter(c => c.estadoComercial === 'cambio_lote').length,
    completados: porFase.entrega,
    porFase,
    ingresosPorFase,
    ingresosTotales: FASES.reduce((a, f) => a + ingresosPorFase[f], 0),
    proyectado: act.reduce((s, c) => s + c.totalAcordado, 0),
    /* Conversión de cada fase respecto a la anterior: donde se cae la gente */
    conv: {
      registro:   pct(porFase.registro,   inscritos),
      alineacion: pct(porFase.alineacion, porFase.registro),
      evaluacion: pct(porFase.evaluacion, porFase.alineacion),
      entrega:    pct(porFase.entrega,    porFase.evaluacion),
    },
    avanceMedio: act.length
      ? Math.round(act.reduce((s, c) => s + (c.avance || 0), 0) / act.length) : 0,
  };
}

export function lotes(datos) {
  const set = new Set([1]);
  Object.values(datos.precio || {}).forEach(p => set.add(Number(p.lote) || 1));
  (datos.pagosSocios || []).forEach(p => set.add(Number(p.lote) || 1));
  Object.keys(datos.repartoPorLote || {}).forEach(l => set.add(Number(l) || 1));
  return [...set].sort((a, b) => a - b);
}

export function crearLote(datos) {
  const nuevo = Math.max(...lotes(datos)) + 1;
  actualizar(d => { d.repartoPorLote[nuevo] ||= { socios: [], notas: '' }; });
  return nuevo;
}

/* ── Socios y reparto ─────────────────────────────────────────────────────
   El reparto es POR LOTE, no uno solo para todo: en un lote puede entrar un
   socio que en el otro no, y entonces los porcentajes de los demás cambian.
   Guardarlo global obligaría a reescribir el reparto del lote viejo cada vez
   que entra alguien nuevo, y con eso se perdería el histórico de cómo se
   repartió lo ya cobrado.

   Los socios son editables desde la pantalla. El total no se fuerza a 100:
   si no suma, se avisa y lo que falta queda señalado, porque a veces se
   reparte solo una parte.                                                */
const idDeSocio = nombre =>
  nombre.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'socio';

export function repartoDe(datos, lote) {
  const r = datos.repartoPorLote[lote] || {};
  return { socios: Array.isArray(r.socios) ? r.socios : [], notas: r.notas || '' };
}

function conReparto(d, lote, fn) {
  const r = d.repartoPorLote[lote] ||= { socios: [], notas: '' };
  if (!Array.isArray(r.socios)) r.socios = [];
  fn(r);
}

export function agregarSocio(lote, nombre, pct = 0) {
  const limpio = String(nombre || '').trim();
  if (!limpio) return cargar();
  const id = idDeSocio(limpio);
  return actualizar(d => conReparto(d, lote, r => {
    if (r.socios.some(s => s.id === id)) return;
    r.socios.push({ id, label: limpio, pct: Number(pct) || 0 });
  }));
}

export function quitarSocio(lote, id) {
  return actualizar(d => conReparto(d, lote, r => {
    r.socios = r.socios.filter(s => s.id !== id);
  }));
}

export function fijarPorcentaje(lote, id, pct) {
  return actualizar(d => conReparto(d, lote, r => {
    const s = r.socios.find(x => x.id === id);
    if (s) s.pct = Math.max(0, Math.min(100, Number(pct) || 0));
  }));
}

export function fijarNotas(lote, texto) {
  return actualizar(d => conReparto(d, lote, r => { r.notas = String(texto || ''); }));
}

/* Copiar el reparto de otro lote: casi siempre el nuevo arranca igual que
   el anterior y solo cambia un socio. */
export function copiarReparto(desde, hacia) {
  return actualizar(d => {
    const origen = d.repartoPorLote[desde];
    if (!origen?.socios?.length) return;
    conReparto(d, hacia, r => { r.socios = origen.socios.map(s => ({ ...s })); });
  });
}

export function ingresosDeLote(datos, lote) {
  return contables(candidatos(datos))
    .filter(c => c.lote === lote)
    .reduce((s, c) => s + c.cobrado, 0);
}

/* ── Costos del lote (como gastos_utilidades de Paideia) ──────────────────
   Se descuentan ANTES de repartir.
     tipo 'por_certificado' = monto × candidatos: si trae fase, los que
       pagaron esa fase (activos o no: ese costo ya se generó); sin fase, los
       ACTIVOS del lote (quien desistió no recibe certificado).
     tipo 'fijo' = monto único.
     lote null = aplica a todos los lotes.
     para 'real' = lo que de verdad cobra el Centro Evaluador / la ECE: reduce
       el total a repartir. para <socioId> = costos con los que se calcula la
       base de un socio EXTERNO (en Paideia, Christherapy): su % sale de
       (ingresos − sus costos), no del neto real.                           */
export function gastosLote(datos, lote) {
  const lista = contables(candidatos(datos)).filter(c => c.lote === lote);
  const certificados = lista.filter(c => c.estadoComercial === 'activo').length;
  const pagaron = Object.fromEntries(FASES.map(f => [f, lista.filter(c => c.fases[f]).length]));
  const items = (datos.gastos || [])
    .filter(g => g.lote == null || Number(g.lote) === Number(lote))
    .map(g => {
      const monto = Number(g.monto) || 0;
      const porCand = g.tipo === 'por_certificado';
      const fase = FASES.includes(g.fase) ? g.fase : null;
      const cantidad = !porCand ? 1 : (fase ? pagaron[fase] : certificados);
      return { ...g, lote: g.lote == null ? null : Number(g.lote), monto, fase: porCand ? fase : null,
               para: g.para || 'real', cantidad, total: monto * cantidad };
    });
  const suma = l => l.reduce((a, g) => a + g.total, 0);
  const reales = items.filter(g => g.para === 'real');
  return { items, reales, certificados, pagaron, total: suma(reales),
           de: id => { const l = items.filter(g => g.para === id); return { items: l, total: suma(l) }; } };
}

export function agregarGasto(g) {
  return actualizar(d => {
    d.gastos ||= [];
    const id = Math.max(0, ...d.gastos.map(x => Number(x.id) || 0)) + 1;
    d.gastos.push({ id, lote: g.lote == null || g.lote === '' ? null : Number(g.lote),
      concepto: String(g.concepto || '').trim() || 'Costo', tipo: g.tipo === 'fijo' ? 'fijo' : 'por_certificado',
      fase: FASES.includes(g.fase) ? g.fase : null, para: g.para || 'real',
      monto: Math.max(0, Number(String(g.monto).replace(/[$\s,]/g, '')) || 0) });
  });
}
/* Corregir un costo sin borrarlo y volverlo a capturar (como Paideia). */
export function editarGasto(id, cambios = {}) {
  return actualizar(d => {
    const g = (d.gastos || []).find(x => Number(x.id) === Number(id));
    if (!g) return;
    if ('monto' in cambios) g.monto = Math.max(0, Number(String(cambios.monto).replace(/[$\s,]/g, '')) || 0);
    if ('concepto' in cambios) g.concepto = String(cambios.concepto || '').trim() || g.concepto;
    if ('fase' in cambios && g.tipo !== 'fijo') g.fase = FASES.includes(cambios.fase) ? cambios.fase : null;
  });
}

/* El lote por fase (como porFaseLote de Paideia): cuántos pagaron cada
   fase, cuánto entró y cuánto costó esa fase — lo real y lo que cuenta
   para la base de cada socio externo. */
export function porFaseLote(datos, lote) {
  const lista = contables(candidatos(datos)).filter(c => c.lote === lote);
  const g = gastosLote(datos, lote);
  return FASES.map(f => {
    const deFase = g.items.filter(x => x.fase === f);
    return { fase: f, label: FASE_LABEL[f],
      pagaron: lista.filter(c => c.fases[f]).length,
      ingresos: lista.reduce((a, c) => a + (c.cobradoPorFase?.[f] || 0), 0),
      saldo: lista.filter(c => c.estadoComercial === 'activo').reduce((a, c) => a + (c.saldoPorFase?.[f] || 0), 0),
      costoReal: deFase.filter(x => x.para === 'real').reduce((a, x) => a + x.total, 0),
      costoExterno: deFase.filter(x => x.para !== 'real').reduce((a, x) => a + x.total, 0) };
  });
}

export function quitarGasto(id) {
  return actualizar(d => { d.gastos = (d.gastos || []).filter(g => Number(g.id) !== Number(id)); });
}
export function fijarExterno(lote, id, externo) {
  return actualizar(d => conReparto(d, lote, r => {
    const s = r.socios.find(x => x.id === id); if (s) s.externo = !!externo;
  }));
}

export function utilidades(datos, lote) {
  const ingresos = ingresosDeLote(datos, lote);
  const gastos = gastosLote(datos, lote);
  /* Total a repartir = cobrado − costos reales (nunca negativo) */
  const base = Math.max(0, ingresos - gastos.total);
  const pagados = datos.pagosSocios.filter(p => Number(p.lote) === Number(lote));
  const { socios: lista, notas } = repartoDe(datos, lote);

  /* ── Lo que se le debe a cada socio, y lo que se le pagó de más ─────────
     Antes: `pendiente: Math.max(0, aRepartir - pagado)`. El Math.max
     convertía cualquier pago de más en cero. Con los números que hoy
     muestra el panel de Paideia para su Lote 1 —entran $5,500, a un socio le
     tocan $1,833 y se le pagaron $3,000— el panel decía "$0 pendiente", como
     si todo cuadrara, cuando se habían repartido $1,166 más de lo que entró.

     Puede haber una buena razón —un adelanto, un gasto que ese socio pagó de
     su bolsa, una comisión acordada—, pero eso se decide entre los socios,
     no lo decide un Math.max. Un libro de socios que esconde un descuadre es
     justo lo que termina mal entre socios, aunque el descuadre sea legítimo.

     Ahora `saldo` puede ser negativo, y se separa en dos cifras que no se
     compensan entre sí: lo que falta pagarle a unos no borra lo que se le
     pagó de más a otro.                                                    */
  /* Socios externos (Paideia: Christherapy): su % de (cobrado − SUS costos,
     o los reales si no tiene propios), con tope en el total a repartir.
     Los demás: si hay externos, se reparten lo que queda en proporción a
     sus %; si no, cada uno su % del total a repartir (sin costos = igual que
     antes: su % de lo cobrado). */
  const externos = lista.filter(s => s.externo);
  const montoExt = {};
  let restante = base;
  externos.forEach(s => {
    const propios = gastos.de(s.id);
    const costo = propios.items.length ? propios.total : gastos.total;
    const m = Math.min(restante, Math.round(Math.max(0, ingresos - costo) * (Number(s.pct) || 0) / 100));
    montoExt[s.id] = m; restante -= m;
  });
  const internos = lista.filter(s => !s.externo);
  const pesoInt = internos.reduce((a, s) => a + (Number(s.pct) || 0), 0);
  const socios = lista.map(s => {
    const aRepartir = s.externo ? montoExt[s.id]
      : externos.length ? (pesoInt > 0 ? Math.round(restante * (Number(s.pct) || 0) / pesoInt) : 0)
      : Math.round((base * (Number(s.pct) || 0)) / 100);
    const pagado = pagados.filter(p => p.socio === s.id)
                          .reduce((a, p) => a + (Number(p.monto) || 0), 0);
    const saldo = aRepartir - pagado;
    return {
      ...s, aRepartir, pagado, saldo,
      pendiente:     Math.max(0, saldo),
      pagadoDeMas:   Math.max(0, -saldo),
    };
  });

  const sumaPct = lista.reduce((a, s) => a + (Number(s.pct) || 0), 0);
  const pagado = socios.reduce((a, s) => a + s.pagado, 0);

  return {
    lote, ingresos, gastos, costos: gastos.total, neto: ingresos - gastos.total, base,
    socios, sumaPct, notas, pagos: pagados,
    sinRepartir: externos.length ? 0 : Math.round((base * Math.max(0, 100 - sumaPct)) / 100),
    aRepartir: socios.reduce((a, s) => a + s.aRepartir, 0),
    pagado,
    pendiente:   socios.reduce((a, s) => a + s.pendiente, 0),
    pagadoDeMas: socios.reduce((a, s) => a + s.pagadoDeMas, 0),
    /* Lo más grave: repartir más dinero del que entró al lote. */
    excedido:    Math.max(0, pagado - ingresos),
    /* Porcentajes que suman más de 100 reparten dinero que no existe. */
    sobreasignado: !externos.length && sumaPct > 100.005,
  };
}

export function utilidadesGlobal(datos) {
  const porLote = lotes(datos).map(l => utilidades(datos, l));
  return {
    porLote,
    ingresos:  porLote.reduce((a, u) => a + u.ingresos, 0),
    costos:    porLote.reduce((a, u) => a + u.costos, 0),
    aRepartir: porLote.reduce((a, u) => a + u.aRepartir, 0),
    pagado:    porLote.reduce((a, u) => a + u.pagado, 0),
    pendiente: porLote.reduce((a, u) => a + u.pendiente, 0),
    pagadoDeMas: porLote.reduce((a, u) => a + u.pagadoDeMas, 0),
    excedido:  porLote.reduce((a, u) => a + u.excedido, 0),
  };
}

/* ── Requieren atención ───────────────────────────────────────────────────
   Lo que el panel debe gritar sin que nadie vaya a buscarlo. La lista de
   candidatos dice quién existe; esto dice a quién hay que llamarle hoy.
   Cada alerta nombra a la persona y dice qué pasó, no un código.         */
const PRIMER_MODULO = Object.fromEntries(
  CONFIG.fases.map(f => [f.id, CONFIG.flujo.find(m => m.fase === f.id && m.listo)?.id])
);

const DIA_MS = 86400000;
export const DIAS_ESTANCADO = 30;
/* A dónde lleva cada alerta (como Paideia): a la ficha del candidato, a
   capturar su precio o a su evaluación. */
const ligaFicha = email => `admin-candidatos.html?q=${encodeURIComponent(email)}`;
const ligaEval = email => `admin-evaluacion.html?email=${encodeURIComponent(email)}`;

export function atencion(datos, ahora = Date.now()) {
  const out = [];
  const lista = contables(candidatos(datos));

  /* Se registraron y nadie les ha capturado lote ni precio: no cuentan en
     los KPIs hasta que se den de alta. */
  const prospectos = lista.filter(c => c.sinAlta);
  if (prospectos.length) out.push({
    nivel: 'medio', tipo: 'sin_alta', href: `admin-precios.html?alta=${encodeURIComponent(prospectos[0].email)}`,
    txt: prospectos.length === 1
      ? `${prospectos[0].nombre} se registró y no tiene lote ni precio: dalo de alta en Precios y pagos`
      : `${prospectos.length} personas se registraron y no tienen lote ni precio (${prospectos.slice(0, 3).map(c => c.nombre).join(', ')}${prospectos.length > 3 ? '…' : ''}): no cuentan en los KPIs hasta darlas de alta`,
  });

  /* Estancados: activos que llevan un mes sin avanzar (su último respaldo). */
  lista.filter(c => c.estadoComercial === 'activo' && !c.estado?.entrega?.completado && c.respaldadoEl).forEach(c => {
    const t = Date.parse(c.respaldadoEl);
    if (!Number.isFinite(t)) return;
    const dias = Math.floor((ahora - t) / DIA_MS);
    if (dias >= DIAS_ESTANCADO) out.push({ nivel: 'medio', email: c.email, tipo: 'estancado', href: ligaFicha(c.email),
      txt: `${c.nombre} lleva ${dias} días sin avanzar` });
  });

  lista.filter(c => c.estadoComercial === 'activo').forEach(c => {
    /* Pagó una fase y ni la abrió: es dinero cobrado sin servicio prestado */
    FASES.forEach(f => {
      const primero = PRIMER_MODULO[f];
      if (!c.fases[f] || !primero) return;
      if (f === 'entrega') return;                 // la entrega la cierra el Centro
      const st = c.estado?.[primero];
      /* Solo si ese módulo ya le toca: quien pagó Alineación por adelantado
         pero sigue en Reforzamiento no "dejó de iniciar" nada (Paideia solo
         avisa cuando el paso ya está abierto). */
      const previos = CONFIG.flujo.filter(m => m.listo).slice(0, CONFIG.flujo.filter(m => m.listo).findIndex(m => m.id === primero));
      const leToca = previos.every(m => c.estado?.[m.id]?.completado);
      if (!st?.iniciado && leToca) {
        out.push({
          nivel: 'alto', email: c.email, href: ligaFicha(c.email),
          txt: `${c.nombre} pagó ${FASE_LABEL[f]} y no ha iniciado su ${
                 CONFIG.flujo.find(m => m.id === primero)?.nombre}`,
        });
      }
    });

    /* Terminó lo suyo y nadie le ha cerrado el expediente */
    const suyos = CONFIG.flujo.filter(m => m.listo && m.requiere !== 'evaluador');
    /* Lo que sigue depende del dictamen: antes decía «espera que el Centro
       registre la entrega» también a quien ya tenía Cédula publicada, y con
       varios COMPETENTES en trámite la alerta dejaba de significar algo. */
    if (suyos.length && suyos.every(m => c.estado?.[m.id]?.completado)
        && !c.estado?.entrega?.completado) {
      const dic = dictamenDe(evaluacionDe(datos, c.email));
      if (!dic) out.push({ nivel: 'alto', email: c.email, tipo: 'evaluador', href: ligaEval(c.email),
        txt: `${c.nombre} terminó todos sus módulos y espera su dictamen` });
      else if (dic === 'competente' && !c.fases.entrega) out.push({ nivel: 'medio', email: c.email, tipo: 'pago_entrega',
        href: `admin-precios.html?q=${encodeURIComponent(c.email)}`,
        txt: `${c.nombre} es COMPETENTE y falta que pague la Entrega de su certificado` });
      else if (dic === 'no_competente') out.push({ nivel: 'bajo', email: c.email, tipo: 'reevaluacion', href: ligaEval(c.email),
        txt: `${c.nombre} salió TODAVÍA NO COMPETENTE: acuerda con él o ella su reevaluación` });
    }

    /* Cobrado de más: pagó una fase que aún no le toca por la anterior */
    const orden = FASES;
    for (let i = 1; i < orden.length; i++) {
      if (c.fases[orden[i]] && !c.fases[orden[i - 1]]) {
        out.push({
          nivel: 'medio', email: c.email, href: `admin-precios.html?q=${encodeURIComponent(c.email)}`,
          txt: `${c.nombre} tiene ${FASE_LABEL[orden[i]]} liberada sin ${FASE_LABEL[orden[i - 1]]}`,
        });
      }
    }
  });

  /* Un reparto que no suma 100 deja dinero sin dueño */
  lotes(datos).forEach(l => {
    const u = utilidades(datos, l);

    /* Repartir más de lo que entró va primero y va en alto. Antes el cálculo
       lo convertía en "$0 pendiente" y el panel lo daba por cuadrado. No se
       juzga por qué pasó —puede ser un adelanto o un reembolso—: se pide que
       quede anotado, que es lo que evita un malentendido entre socios. */
    if (u.excedido) {
      out.push({
        nivel: 'alto', lote: l, href: `admin-utilidades.html?lote=${l}`,
        txt: `En el Lote ${l} se repartieron ${pesos(u.excedido)} más de lo que entró ` +
             `(${pesos(u.pagado)} pagados contra ${pesos(u.ingresos)} cobrados)` +
             (u.notas?.trim() ? '' : ' — y no hay nota que lo explique'),
      });
    } else if (u.pagadoDeMas) {
      const quienes = u.socios.filter(x => x.pagadoDeMas);
      out.push({
        nivel: 'medio', lote: l, href: `admin-utilidades.html?lote=${l}`,
        txt: `En el Lote ${l}, a ${quienes.map(x => x.label || x.nombre).join(' y ')} ` +
             `se le pagaron ${pesos(u.pagadoDeMas)} por encima de su parte` +
             (u.notas?.trim() ? '' : ' — sin nota que lo explique'),
      });
    }

    if (!u.ingresos || !u.socios.length) return;
    if (Math.round(u.sumaPct) !== 100) {
      out.push({
        nivel: 'medio', lote: l, href: `admin-utilidades.html?lote=${l}`,
        txt: `El reparto del Lote ${l} suma ${u.sumaPct.toFixed(2)}%, no 100% — ${
               pesos(u.sinRepartir)} sin asignar`,
      });
    }
  });

  /* Sala de evidencias (como Paideia): plazo de la evidencia y grabación
     que no se ha ligado al expediente */
  const cfgSala = { ...CONFIG_SALA, ...(datos.salaConfig || {}) };
  const hoyMx = fechaMx(Date.now());
  lista.filter(c => c.estadoComercial === 'activo' && !c.estado?.evidencias?.completado).forEach(c => {
    const pago = (datos.pagos || []).find(p => p.email === c.email && p.fase === 'alineacion');
    const limite = (datos.limitesEvidencia || {})[c.email] || limiteDesde(pago?.autorizado_en, cfgSala.dias_limite);
    const info = limiteInfo(limite, hoyMx, false);
    if (info?.clave === 'vencido') out.push({ nivel: 'alto', email: c.email, tipo: 'plazo_vencido', href: ligaFicha(c.email), txt: `A ${c.nombre} se le venció el plazo de su evidencia (${fechaLarga(limite)})` });
    else if (info?.clave === 'pronto') out.push({ nivel: 'medio', email: c.email, tipo: 'plazo_pronto', href: ligaFicha(c.email), txt: `A ${c.nombre} le ${info.dias === 1 ? 'queda 1 día' : `quedan ${info.dias} días`} para entregar su evidencia (${fechaLarga(limite)})` });
  });
  (datos.reservasEvidencia || []).filter(r => ['reservada', 'asistio'].includes(r.estado) && Date.parse(r.fin) < Date.now()).forEach(r => {
    const ev = (datos.evaluaciones || {})[r.email] || {};
    if (ev.video?.liga) return;
    const c = lista.find(x => x.email === r.email);
    out.push({ nivel: 'medio', email: r.email, tipo: 'sin_grabacion', href: ligaEval(r.email), txt: `${c?.nombre || r.email} grabó en la sala el ${fechaLarga(r.inicio)} y falta ligar la grabación a su expediente` });
  });

  /* Una sesión sin liga es una sesión a la que nadie va a poder entrar */
  const hoy = hoyLocal();
  (datos.sesiones || []).filter(s => s.fecha >= hoy).forEach(s => {
    if (!s.liga) out.push({ nivel: 'medio', href: 'admin-sesiones.html', txt: `La sesión del ${fechaLarga(s.fecha)} no tiene liga de Zoom` });
    else if (!(s.inscritos || []).length)
      out.push({ nivel: 'bajo', href: 'admin-sesiones.html', txt: `La sesión del ${fechaLarga(s.fecha)} no tiene inscritos` });
  });

  const peso = { alto: 0, medio: 1, bajo: 2 };
  return out.sort((a, b) => peso[a.nivel] - peso[b.nivel]);
}

/* ── Sala de evidencias: quién agendó (como Paideia, 7-oct-2026) ─────────
   De los candidatos activos con Alineación pagada: quién ya tiene horario
   reservado para grabar su sesión (o ya asistió) y quién todavía no. Quien
   no asistió vuelve a «sin agendar», porque tiene que reservar otro.
   `reservas` trae { email, estado, horario_id, inicio?, fin? }: las de la
   nube llegan sin fecha y `horarios` la completa. */
export function salaAgenda(datos, reservas = [], horarios = []) {
  const hor = Object.fromEntries((horarios || []).map(h => [h.id, h]));
  const porEmail = {};
  (reservas || []).forEach(r => {
    if (!r || !['reservada', 'asistio'].includes(r.estado)) return;
    const email = String(r.email || '').trim().toLowerCase();
    if (!email) return;
    const h = hor[r.horario_id] || {};
    const inicio = r.inicio || h.inicio || null, fin = r.fin || h.fin || null;
    const antes = porEmail[email];
    if (!antes || (Date.parse(inicio) || 0) > (Date.parse(antes.inicio) || 0)) porEmail[email] = { estado: r.estado, inicio, fin };
  });
  const agendaron = [], faltan = [];
  activos(candidatos(datos)).filter(c => pagoHecho(datos, c.email, 'alineacion')).forEach(c => {
    const r = porEmail[String(c.email).trim().toLowerCase()];
    if (r) agendaron.push({ email: c.email, nombre: c.nombre, ...r });
    else faltan.push({ email: c.email, nombre: c.nombre });
  });
  agendaron.sort((a, b) => (Date.parse(a.inicio) || 0) - (Date.parse(b.inicio) || 0));
  faltan.sort((a, b) => String(a.nombre || a.email).localeCompare(String(b.nombre || b.email), 'es'));
  return { agendaron, faltan };
}

/* ── Formato ──────────────────────────────────────────────────────────── */
export const pesos = n => new Intl.NumberFormat('es-MX', {
  style: 'currency', currency: 'MXN', maximumFractionDigits: 0,
}).format(Number(n) || 0);
