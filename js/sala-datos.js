/* ============================================================================
   POSTURALIA · sala-datos.js — De dónde salen los datos de la Sala

   La misma interfaz en los dos modos:
     · Con Supabase (como Paideia): el candidato solo usa RPCs —
       mi_sala_evidencia(), horarios_evidencia_disponibles(),
       reservar_horario_evidencia(), cancelar_mi_horario_evidencia()—; el
       enlace y la clave de Zoom nunca viajan fuera de su ventana. El equipo
       lee y escribe las tablas (ver supabase.sql).
     · En modo local: todo vive en el almacén del Centro en este navegador
       (posturalia.evaluador.v1). Sirve para el equipo y para el candidato
       que agenda en el equipo del Centro; en otro dispositivo no hay de
       dónde leer, igual que con la Cédula.
   ========================================================================== */
import { CONFIG } from './config.js';
import { cargar, actualizar } from './admin-data.js';
import { miCorreo, enNube } from './resultado.js';
import { CONFIG_SALA, limiteDesde, ventanaAbierta, fechaISO } from './sala.js';

const cfgDe = d => ({ ...CONFIG_SALA, ...(d.salaConfig || {}) });
const reservasActivas = d => (d.reservasEvidencia || []).filter(r => r.estado !== 'cancelada');
const nuevoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const rpc = async (fn, args) => {
  const { clienteNube } = await import('./nube.js');
  const c = await clienteNube();
  const { data, error } = await c.rpc(fn, args);
  if (error) throw new Error(error.message || String(error));
  return data;
};
const tabla = async nombre => { const { clienteNube } = await import('./nube.js'); return (await clienteNube()).from(nombre); };

/* ── Candidato ───────────────────────────────────────────────────────── */
export async function miSala() {
  if (enNube()) { try { return await rpc('mi_sala_evidencia'); } catch { return null; } }
  const d = cargar(), yo = miCorreo(), cfg = cfgDe(d);
  const r = (d.reservasEvidencia || []).filter(x => x.email === yo && x.estado !== 'cancelada')
    .sort((a, b) => Date.parse(b.inicio) - Date.parse(a.inicio))[0] || null;
  const pagoAl = (d.pagos || []).find(p => p.email === yo && p.fase === 'alineacion');
  const extendido = (d.limitesEvidencia || {})[yo];
  const limite = extendido || limiteDesde(pagoAl?.autorizado_en, cfg.dias_limite);
  const abierta = ventanaAbierta(r, cfg.minutos_antes, Date.now());
  return {
    reserva: r ? { id: r.id, inicio: r.inicio, fin: r.fin, estado: r.estado } : null,
    minutos_antes: cfg.minutos_antes, horas_cambio: cfg.horas_cambio,
    sala: abierta && cfg.zoom_url ? { url: cfg.zoom_url, id: cfg.zoom_id, clave: cfg.zoom_clave } : null,
    limite, limite_extendido: !!extendido,
  };
}
export async function disponibles() {
  if (enNube()) return (await rpc('horarios_evidencia_disponibles')) || [];
  const d = cargar(), ocupados = new Set(reservasActivas(d).map(r => r.horario_id)), ahora = Date.now();
  return (d.horariosEvidencia || []).filter(h => Date.parse(h.inicio) > ahora && !ocupados.has(h.id));
}
export async function reservar(horarioId) {
  if (enNube()) return await rpc('reservar_horario_evidencia', { p_horario: horarioId });
  const yo = miCorreo(); let out = null, error = '';
  actualizar(d => {
    const h = (d.horariosEvidencia || []).find(x => x.id === horarioId);
    if (!h || Date.parse(h.inicio) <= Date.now()) { error = 'Ese horario ya no está disponible.'; return; }
    if (reservasActivas(d).some(r => r.horario_id === horarioId)) { error = 'Alguien acaba de tomar ese horario. Elige otro.'; return; }
    d.reservasEvidencia ||= [];
    /* Una sola reserva vigente por persona: al cambiar, la anterior se libera */
    d.reservasEvidencia.forEach(r => { if (r.email === yo && r.estado === 'reservada' && Date.parse(r.fin) > Date.now()) r.estado = 'cancelada'; });
    out = { id: nuevoId(), horario_id: h.id, email: yo, inicio: h.inicio, fin: h.fin, estado: 'reservada', creada: new Date().toISOString() };
    d.reservasEvidencia.push(out);
  });
  if (error) throw new Error(error);
  return { id: out.id, inicio: out.inicio, fin: out.fin, estado: out.estado };
}
export async function cancelar() {
  if (enNube()) return await rpc('cancelar_mi_horario_evidencia');
  const yo = miCorreo(), cfg = cfgDe(cargar());
  let ok = false, error = '';
  actualizar(d => {
    const r = (d.reservasEvidencia || []).find(x => x.email === yo && x.estado === 'reservada' && Date.parse(x.fin) > Date.now());
    if (!r) { error = 'No tienes un horario vigente.'; return; }
    if (Date.parse(r.inicio) - Date.now() < cfg.horas_cambio * 3600000) { error = `Faltan menos de ${cfg.horas_cambio} h: para cambiarlo escríbenos por WhatsApp.`; return; }
    r.estado = 'cancelada'; ok = true;
  });
  if (error) throw new Error(error);
  return ok;
}

/* ── Equipo ──────────────────────────────────────────────────────────── */
export async function cargarEquipo() {
  if (enNube()) {
    const desde = new Date(Date.now() - 14 * 86400000).toISOString();
    const [c, h, r] = await Promise.all([
      (await tabla('sala_evidencias_config')).select('*').eq('id', 1).maybeSingle(),
      (await tabla('horarios_evidencia')).select('id,inicio,fin,colchon_min').gte('inicio', desde).order('inicio'),
      (await tabla('reservas_evidencia')).select('id,horario_id,email,estado').in('estado', ['reservada', 'asistio', 'no_asistio']),
    ]);
    const err = c.error || h.error || r.error;
    return { error: err ? 'Hay que correr la parte «Sala de evidencias» de supabase.sql (' + (err.message || err) + ')' : '',
      cfg: { ...CONFIG_SALA, ...(c.data || {}) }, horarios: h.data || [], reservas: r.data || [] };
  }
  const d = cargar(), desde = Date.now() - 14 * 86400000;
  return { error: '', cfg: cfgDe(d), horarios: (d.horariosEvidencia || []).filter(h => Date.parse(h.inicio) >= desde).sort((a, b) => Date.parse(a.inicio) - Date.parse(b.inicio)),
    reservas: reservasActivas(d) };
}
export async function guardarConfig(cfg) {
  if (enNube()) {
    const { error } = await (await tabla('sala_evidencias_config')).upsert({ id: 1, ...cfg, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message || String(error));
    return true;
  }
  actualizar(d => { d.salaConfig = { ...cfgDe(d), ...cfg }; });
  return true;
}
export async function crearHorarios(nuevos) {
  if (enNube()) {
    const { error } = await (await tabla('horarios_evidencia')).insert(nuevos.map(x => ({ inicio: x.inicio, fin: x.fin, colchon_min: x.colchon_min })));
    if (error) throw new Error(error.code === '23P01' ? 'Algún horario se traslapa con otro creado mientras tanto. Vuelve a generar la vista previa.' : (error.message || String(error)));
    return nuevos.length;
  }
  actualizar(d => { d.horariosEvidencia ||= []; nuevos.forEach(x => d.horariosEvidencia.push({ id: nuevoId(), ...x })); });
  return nuevos.length;
}
export async function borrarHorarios(ids) {
  if (enNube()) {
    const { data, error } = await (await tabla('horarios_evidencia')).delete().in('id', ids).select('id');
    if (error) throw new Error(error.message || String(error));
    return (data || []).length;
  }
  let n = 0;
  actualizar(d => {
    const ocupados = new Set(reservasActivas(d).map(r => r.horario_id));
    const antes = (d.horariosEvidencia || []).length;
    d.horariosEvidencia = (d.horariosEvidencia || []).filter(h => !ids.includes(h.id) || ocupados.has(h.id));
    n = antes - d.horariosEvidencia.length;
  });
  return n;
}
export async function marcarReserva(id, estado) {
  if (enNube()) {
    const { error } = await (await tabla('reservas_evidencia')).update({ estado, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw new Error(error.message || String(error));
    return true;
  }
  actualizar(d => { const r = (d.reservasEvidencia || []).find(x => x.id === id); if (r) r.estado = estado; });
  return true;
}
/* Extender el plazo de un candidato (fecha AAAA-MM-DD) */
export async function extenderLimite(correo, fecha) {
  if (enNube()) return await rpc('extender_limite_evidencia', { p_email: correo, p_limite: fecha });
  actualizar(d => { d.limitesEvidencia ||= {}; if (fecha) d.limitesEvidencia[correo] = fecha; else delete d.limitesEvidencia[correo]; });
  return true;
}
export { enNube, fechaISO };
export const whatsapp = () => CONFIG.marca?.whatsapp || '';
