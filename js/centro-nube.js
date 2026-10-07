/* ============================================================================
   POSTURALIA · centro-nube.js — El panel del Centro, compartido en la nube

   Con Supabase, lo que un socio captura en el panel lo ven los otros dos:
   precios, fases liberadas (pagos), reparto, costos, pagos a socios y altas
   a mano. Y los candidatos que se registran por su cuenta aparecen solos en
   la lista, con su avance.

   Cómo: el panel sigue trabajando sobre su copia local (admin-data.js, igual
   que en modo local) y aquí se reconcilia contra la tabla `centro_datos`:
     · al guardar, se sube SOLO lo que cambió (una fila por cosa), así dos
       socios que capturan cosas distintas al mismo tiempo no se pisan;
     · al abrir cualquier página del panel, se baja lo que hay en la nube y
       reemplaza lo local (la nube manda);
     · lo que no pudo subir por falta de red queda en una cola y se reintenta
       antes de bajar, para no perderlo al reemplazar.

   Registrar un pago aquí es lo que abre la fase al candidato: lo hace un
   disparador en la base (pago_a_autorizacion), no el navegador.

   Los datos de prueba (escenario completo) NO suben: son para probar en un
   navegador, no para la operación compartida.
   ========================================================================== */
import { CONFIG, NS } from './config.js';

const TABLA = 'centro_datos';
const COLA = 'posturalia.centro.cola';
const enNube = () => !!(CONFIG.supabase?.url && CONFIG.supabase?.anonKey);
const esDemo = (x, correo = '') => !!x?.demo || /@demo\.posturalia\.mx$/i.test(correo);

/* ── De los datos del panel a filas (coleccion, clave) → datos ─────────── */
export function aFilas(d) {
  const f = {};
  const poner = (col, clave, datos) => { if (clave) f[`${col}\u0000${clave}`] = { coleccion: col, clave: String(clave), datos }; };
  const demoCorreos = new Set((d.expedientes || []).filter(x => x.demo || esDemo(null, x.correo)).map(x => (x.correo || '').toLowerCase()));
  Object.entries(d.precio || {}).forEach(([email, p]) => { if (!esDemo(p, email) && !demoCorreos.has(email)) poner('precio', email, p); });
  (d.pagos || []).forEach(p => { if (!esDemo(p, p.email) && !demoCorreos.has(p.email)) poner('pagos', `${p.email}|${p.fase}`, p); });
  Object.entries(d.repartoPorLote || {}).forEach(([lote, r]) => { if (!r?.demo) poner('repartoPorLote', lote, r); });
  (d.pagosSocios || []).forEach(p => { if (!esDemo(p)) poner('pagosSocios', p.id, p); });
  (d.gastos || []).forEach(g => { if (!esDemo(g)) poner('gastos', g.id, g); });
  (d.expedientes || []).forEach(x => {
    const correo = (x.correo || '').toLowerCase();
    if (x.manual && correo && !esDemo(x, correo)) poner('altas', correo, { correo, nombre: x.nombre || correo });
  });
  return f;
}

/* Lo que hay que subir y lo que hay que borrar entre dos versiones */
export function diferencias(antes, despues) {
  const a = aFilas(antes), b = aFilas(despues);
  const poner = [], quitar = [];
  for (const [k, fila] of Object.entries(b)) if (!a[k] || JSON.stringify(a[k].datos) !== JSON.stringify(fila.datos)) poner.push(fila);
  for (const [k, fila] of Object.entries(a)) if (!b[k]) quitar.push({ coleccion: fila.coleccion, clave: fila.clave });
  return { poner, quitar };
}

/* Los pagos a socios no traían id: sin él no hay cómo borrar el correcto en
   la nube. Se les pone uno la primera vez que se guardan. */
export function asegurarIds(d) {
  (d.pagosSocios || []).forEach(p => { if (!p.id) p.id = 'ps-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); });
  return d;
}

/* ── Cola de lo que no subió ──────────────────────────────────────────── */
const leerCola = () => { try { return JSON.parse(localStorage.getItem(COLA)) || []; } catch { return []; } };
const escribirCola = c => { try { c.length ? localStorage.setItem(COLA, JSON.stringify(c)) : localStorage.removeItem(COLA); } catch {} };
export const pendientes = () => leerCola().length;

async function cliente() { const { clienteNube } = await import('./nube.js'); return clienteNube(); }

async function aplicar(ops) {
  const c = await cliente(); if (!c) return { ok: false, motivo: 'sin-cliente' };
  const poner = ops.filter(o => o.op === 'poner').map(o => ({ coleccion: o.coleccion, clave: o.clave, datos: o.datos, actualizado_en: new Date().toISOString() }));
  if (poner.length) {
    const { error } = await c.from(TABLA).upsert(poner, { onConflict: 'coleccion,clave' });
    if (error) return { ok: false, motivo: error.message };
  }
  for (const o of ops.filter(o => o.op === 'quitar')) {
    const { error } = await c.from(TABLA).delete().eq('coleccion', o.coleccion).eq('clave', o.clave);
    if (error) return { ok: false, motivo: error.message };
  }
  return { ok: true };
}

/* Se llama desde admin-data.actualizar() con la versión anterior y la nueva.

   Primero se ANOTA en la cola (localStorage) y después se manda: si la
   página se recarga o se cierra a media subida, el navegador cancela la
   petición, pero lo anotado sigue ahí y se manda al volver a abrir el panel
   (bajarCentro lo sube antes de bajar). Sin esto, liberar una fase y que la
   página se recargara justo después la «olvidaba» en este navegador, y como
   las fases se alternan (clic = abrir/cerrar), el siguiente clic la volvía a
   abrir en vez de cerrarla. Encontrado en test-nube-real.mjs.

   Los envíos van en fila: dos cambios seguidos no se cruzan en la red. */
const clave = o => `${o.coleccion}\u0000${o.clave}`;
function anotar(nuevas) {
  const m = new Map(leerCola().map(o => [clave(o), o]));
  nuevas.forEach(o => m.set(clave(o), o));        // si la misma fila cambia dos veces, gana la última
  const cola = [...m.values()];
  escribirCola(cola);
  return cola;
}
function tachar(enviadas) {
  const hechas = new Map(enviadas.map(o => [clave(o), JSON.stringify(o)]));
  escribirCola(leerCola().filter(o => hechas.get(clave(o)) !== JSON.stringify(o)));
}
let fila = Promise.resolve();
async function enviarCola() {
  const lote = leerCola();
  if (!lote.length) return { ok: true, subidos: 0 };
  const r = await aplicar(lote).catch(e => ({ ok: false, motivo: e.message }));
  if (r.ok) tachar(lote);
  window.dispatchEvent(new CustomEvent('centro:nube', { detail: { ok: r.ok, pendientes: leerCola().length, motivo: r.motivo } }));
  return { ...r, subidos: r.ok ? lote.length : 0 };
}
export function subirCambios(antes, despues) {
  if (!enNube()) return Promise.resolve({ ok: true, modo: 'local' });
  const { poner, quitar } = diferencias(antes, despues);
  if (!poner.length && !quitar.length && !leerCola().length) return Promise.resolve({ ok: true, subidos: 0 });
  anotar([...poner.map(f => ({ op: 'poner', ...f })), ...quitar.map(f => ({ op: 'quitar', ...f }))]);
  fila = fila.then(enviarCola, enviarCola);
  return fila;
}
/* Para esperar a que termine lo que se está subiendo (pruebas, recargas) */
export const subidasEnCurso = () => fila;

/* ── Bajar ─────────────────────────────────────────────────────────────
   Devuelve las colecciones como las usa el panel. La nube manda: lo local
   de estas colecciones se reemplaza (menos los datos de prueba, que nunca
   suben y se conservan donde estaban). */
export function deFilas(filas) {
  const d = { precio: {}, pagos: [], repartoPorLote: {}, pagosSocios: [], gastos: [], altas: [] };
  filas.forEach(({ coleccion, clave, datos }) => {
    if (coleccion === 'precio') d.precio[clave] = datos;
    else if (coleccion === 'repartoPorLote') d.repartoPorLote[clave] = datos;
    else if (coleccion === 'altas') d.altas.push(datos);
    else if (d[coleccion]) d[coleccion].push(datos);
  });
  d.gastos.sort((a, b) => Number(a.id) - Number(b.id));
  d.pagosSocios.sort((a, b) => String(a.fecha || '').localeCompare(String(b.fecha || '')));
  return d;
}

export async function bajarCentro() {
  if (!enNube()) return { ok: false, motivo: 'local' };
  /* Primero lo que quedó sin subir (incluido lo que una recarga cortó a
     medias): si no, al reemplazar lo local con la nube se perdería. */
  await fila.catch(() => {});
  if (leerCola().length) {
    const r = await (fila = fila.then(enviarCola, enviarCola));
    if (!r.ok) return { ok: false, motivo: 'Hay cambios sin subir: ' + r.motivo };
  }
  const c = await cliente(); if (!c) return { ok: false, motivo: 'sin-cliente' };
  const { data, error } = await c.from(TABLA).select('coleccion, clave, datos');
  if (error) return { ok: false, motivo: error.message };
  return { ok: true, colecciones: deFilas(data || []) };
}

/* Mezcla lo bajado en los datos del panel (sin tocar lo de prueba) */
export function mezclar(d, nube) {
  const demoCorreos = new Set((d.expedientes || []).filter(x => x.demo || esDemo(null, x.correo)).map(x => (x.correo || '').toLowerCase()));
  const deDemo = (correo) => demoCorreos.has(correo) || esDemo(null, correo);
  d.precio = { ...Object.fromEntries(Object.entries(d.precio || {}).filter(([e, p]) => esDemo(p, e) || deDemo(e))), ...nube.precio };
  d.pagos = [...(d.pagos || []).filter(p => esDemo(p, p.email) || deDemo(p.email)), ...nube.pagos];
  d.repartoPorLote = { ...Object.fromEntries(Object.entries(d.repartoPorLote || {}).filter(([, r]) => r?.demo)), ...nube.repartoPorLote };
  d.pagosSocios = [...(d.pagosSocios || []).filter(p => esDemo(p)), ...nube.pagosSocios];
  d.gastos = [...(d.gastos || []).filter(g => esDemo(g)), ...nube.gastos];
  /* Altas a mano de otro socio: un expediente mínimo para que aparezca */
  const total = CONFIG.flujo.filter(m => m.listo).length;
  nube.altas.forEach(a => {
    const correo = (a.correo || '').toLowerCase();
    const x = d.expedientes.find(y => (y.correo || '').toLowerCase() === correo);
    if (!x) d.expedientes.push({ id: correo, correo, nombre: a.nombre || correo, manual: true, estado: {}, completos: 0, total, avance: 0, metricas: {}, alertas: [], respaldadoEl: '' });
    else if (x.manual && a.nombre) x.nombre = a.nombre;
  });
  /* Un alta a mano que otro socio borró ya no está en la nube */
  const altas = new Set(nube.altas.map(a => (a.correo || '').toLowerCase()));
  d.expedientes = d.expedientes.filter(x => !x.manual || altas.has((x.correo || '').toLowerCase()) || deDemo((x.correo || '').toLowerCase()) || x.demo);
  return d;
}

/* ── Los candidatos que se registraron solos ───────────────────────────
   Arma, por cada candidato de la nube, el mismo «respaldo» que el panel ya
   sabe leer (el de «Importar respaldo» y «Traer el avance»), para que pase
   por la misma limpieza y el mismo manejo de archivos grandes. */
export async function respaldosDeLaNube() {
  if (!enNube()) return { ok: false, motivo: 'local' };
  const c = await cliente(); if (!c) return { ok: false, motivo: 'sin-cliente' };
  const { aModulos } = await import('./mapeo-nube.js');
  const [cands, prog, equipo] = await Promise.all([
    c.from('candidatos').select('usuario_id, correo, nombre, creado_en'),
    c.from('progreso').select('*'),
    c.from('evaluadores').select('usuario_id'),
  ]);
  if (cands.error) return { ok: false, motivo: cands.error.message };
  if (prog.error) return { ok: false, motivo: prog.error.message };
  const porUsuario = new Map((prog.data || []).map(f => [f.user_id, f]));
  /* El equipo (admin y evaluadores) también tiene cuenta, y el alta
     automática lo mete a `candidatos`. No es alumno: se queda fuera de la
     lista, de los conteos y de «Requieren atención». Si la consulta falla,
     no se filtra nada (mejor ver de más que esconder a un candidato). */
  const delEquipo = new Set(equipo.error ? [] : (equipo.data || []).map(e => e.usuario_id));
  const respaldos = (cands.data || []).filter(x => x.correo && !delEquipo.has(x.usuario_id)).map(x => {
    const fila = porUsuario.get(x.usuario_id);
    const modulos = fila ? aModulos(fila) : {};
    delete modulos.__autorizaciones; delete modulos.__limite;
    const cand = modulos.candidato || {};
    return {
      _ns: NS, _version: 2, _origen: 'nube',
      _fecha: fila?.updated_at || x.creado_en || new Date().toISOString(),
      /* Sin nombre todavía (recién registrado): se muestra su correo, no el
         nombre interno del respaldo («nube-correo»). */
      candidato: { nombre: String(cand.nombre || fila?.nombre || x.nombre || x.correo || '').trim(), correo: String(x.correo).toLowerCase() },
      modulos,
    };
  });
  const equipoCorreos = (cands.data || []).filter(x => x.correo && delEquipo.has(x.usuario_id)).map(x => String(x.correo).toLowerCase());
  return { ok: true, respaldos, equipoCorreos };
}
