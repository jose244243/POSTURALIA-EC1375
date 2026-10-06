/* ============================================================================
   POSTURALIA · sesiones-alineacion.js — El candidato se inscribe a su sesión
   (como sesiones-alineacion-component.js de Paideia)

   · «Tus sesiones confirmadas» arriba, con «Unirme a Zoom» (o «Link de Zoom
     pendiente — te avisamos por WhatsApp»).
   · La grilla de sesiones próximas: «Inscribirse», «Sesión llena» o
     «Inscrito ✓». Inscribirse requiere la Alineación liberada.
   · Una sola sesión futura por persona: inscribirse a otra cambia la fecha.
   · La liga de Zoom solo la ve quien está inscrito.

   Local: el almacén del Centro (posturalia.evaluador.v1 → sesiones[].inscritos),
   el mismo que usa Sesiones de Alineación. Nube: RPCs de supabase.sql.
   ========================================================================== */
import { CONFIG } from './config.js';
import { hoyLocal } from './fechas.js';

const CLAVE_EQUIPO = 'posturalia.evaluador.v1';
const enNube = () => !!(CONFIG.supabase?.url && CONFIG.supabase?.anonKey);
const leer = () => { try { return JSON.parse(localStorage.getItem(CLAVE_EQUIPO)) || {}; } catch { return {}; } };
const escribir = d => localStorage.setItem(CLAVE_EQUIPO, JSON.stringify(d));
const correoDe = x => String(x?.email || x || '').toLowerCase().trim();
async function rpc(fn, args) {
  const { clienteNube } = await import('./nube.js');
  const { data, error } = await (await clienteNube()).rpc(fn, args);
  if (error) throw new Error(error.message || String(error));
  return data;
}

/* Las sesiones de hoy en adelante, desde los ojos de `yo` */
export function vistaSesiones(sesiones = [], yo = '', hoy = hoyLocal()) {
  const me = correoDe(yo);
  return sesiones.filter(s => (s.fecha || '') >= hoy)
    .sort((a, b) => String(a.fecha + (a.horaIni || '')).localeCompare(String(b.fecha + (b.horaIni || ''))))
    .map(s => {
      const inscritos = (s.inscritos || []).map(correoDe);
      const mia = !!me && inscritos.includes(me);
      const cupo = Number(s.cupo) || 0;
      return { id: s.id, fecha: s.fecha, horaIni: s.horaIni || '', horaFin: s.horaFin || '', instructor: s.instructor || '', descripcion: s.descripcion || '',
        cupo, ocupados: inscritos.length, libres: Math.max(0, cupo - inscritos.length), llena: cupo > 0 && inscritos.length >= cupo && !mia, mia,
        liga: mia ? (s.liga || '') : '' };
    });
}

export async function misSesiones(yo) {
  if (enNube()) { try { return await rpc('sesiones_alineacion_para_mi'); } catch { return []; } }
  return vistaSesiones(leer().sesiones || [], yo);
}
/* La sesión confirmada del candidato, copiada a su expediente
   (Store 'alineacion'.sesion), que es lo que leen el panel («Sesión de
   Alineación», el aviso de reservar) y su respaldo. Antes la inscripción
   (v38) vivía solo en la lista del Centro y el panel seguía diciendo
   «Sin reservar». Devuelve la sesión o null. */
export async function sincronizarMiSesion(yo, lista = null) {
  const { Store } = await import('./store.js');
  lista = lista || await misSesiones(yo);
  const mia = (lista || []).find(s => s.mia) || null;
  const nueva = mia ? { id: mia.id, fecha: mia.fecha, hora: mia.horaIni ? `${mia.horaIni}${mia.horaFin ? '–' + mia.horaFin : ''}` : '',
    instructor: mia.instructor || '', enlace: ligaOk(mia.liga) ? mia.liga : '' } : null;
  const previa = (Store.get('alineacion', {}) || {}).sesion || null;
  /* Una sesión capturada a mano (sin id de la agenda) no se borra */
  if (!nueva && previa && !previa.id) return previa;
  if (!Store.soloLectura && JSON.stringify(previa) !== JSON.stringify(nueva)) Store.merge('alineacion', { sesion: nueva });
  return nueva;
}

export async function inscribirme(id, yo, { liberada = false } = {}) {
  if (enNube()) return await rpc('inscribirme_sesion_alineacion', { p_sesion: id });
  if (!liberada) throw new Error('La inscripción se habilita cuando tu Centro confirma el pago de tu Alineación.');
  const me = correoDe(yo); if (!me) throw new Error('Falta tu correo en tus datos generales.');
  const d = leer(), hoy = hoyLocal();
  const s = (d.sesiones || []).find(x => x.id === id);
  if (!s || (s.fecha || '') < hoy) throw new Error('Esa sesión ya no está disponible.');
  s.inscritos = (s.inscritos || []).map(correoDe);
  if (s.inscritos.includes(me)) return true;
  if ((Number(s.cupo) || 0) > 0 && s.inscritos.length >= Number(s.cupo)) throw new Error('Esa sesión se acaba de llenar. Elige otra.');
  /* Una sola sesión futura: la anterior se libera */
  (d.sesiones || []).forEach(x => { if (x.id !== id && (x.fecha || '') >= hoy) x.inscritos = (x.inscritos || []).filter(e => correoDe(e) !== me); });
  s.inscritos.push(me);
  escribir(d);
  return true;
}
export async function cancelarInscripcion(id, yo) {
  if (enNube()) return await rpc('cancelar_mi_sesion_alineacion', { p_sesion: id });
  const me = correoDe(yo), d = leer();
  const s = (d.sesiones || []).find(x => x.id === id); if (!s) return false;
  s.inscritos = (s.inscritos || []).filter(e => correoDe(e) !== me);
  escribir(d);
  return true;
}

/* ── Pintar ──────────────────────────────────────────────────────────── */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const enLetra = f => { try { return new Date(f + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' }); } catch { return f; } };
const horario = s => s.horaIni ? `${s.horaIni}${s.horaFin ? ' a ' + s.horaFin : ''} h` : '';
const ligaOk = u => /^https:\/\/[^\s"'<>]+$/i.test(String(u || ''));

export function htmlSesiones(lista, { liberada = false, whatsapp = '' } = {}) {
  const mias = lista.filter(s => s.mia), otras = lista.filter(s => !s.mia);
  const confirmadas = mias.length ? `<div class="sa-mias"><div class="sa-t">Tus sesiones confirmadas</div>
    ${mias.map(s => `<div class="sa-mia" data-sesion="${esc(s.id)}"><div><b>${esc(enLetra(s.fecha))}</b>${horario(s) ? ` · ${esc(horario(s))}` : ''}${s.instructor ? `<br><span>Instructor: ${esc(s.instructor)}</span>` : ''}
      <div class="sa-ok">✓ Inscripción confirmada</div></div>
      <div class="sa-acc">${ligaOk(s.liga) ? `<a class="btn-plat btn-plat--primario" href="${esc(s.liga)}" target="_blank" rel="noopener">Unirme a Zoom</a>` : '<span class="sa-pend">Link de Zoom pendiente — te avisamos por WhatsApp</span>'}
        <button type="button" class="btn-plat btn-plat--secundario" data-cancelar="${esc(s.id)}">Cancelar mi lugar</button></div></div>`).join('')}</div>` : '';
  const grilla = otras.length ? `<div class="sa-t">${mias.length ? 'Cambiar a otra fecha' : 'Elige tu sesión'}</div><div class="sa-grid">${otras.map(s => `
    <div class="sa-card${s.llena ? ' llena' : ''}" data-sesion="${esc(s.id)}"><div class="sa-f">${esc(enLetra(s.fecha))}</div>
      ${horario(s) ? `<div>${esc(horario(s))}</div>` : ''}${s.instructor ? `<div class="sa-i">Instructor: ${esc(s.instructor)}</div>` : ''}${s.descripcion ? `<div class="sa-d">${esc(s.descripcion)}</div>` : ''}
      <div class="sa-cupo">${s.cupo ? `${s.libres} lugar${s.libres === 1 ? '' : 'es'} de ${s.cupo}` : ''}</div>
      ${s.llena ? '<button class="btn-plat btn-plat--secundario" disabled>Sesión llena</button>'
        : `<button class="btn-plat btn-plat--primario" data-inscribir="${esc(s.id)}" ${liberada ? '' : 'disabled title="Se habilita al pagar tu Alineación"'}>${mias.length ? 'Cambiar a esta' : 'Inscribirse'}</button>`}</div>`).join('')}</div>
    ${liberada ? '' : '<p class="sa-nota">La inscripción se habilita cuando tu Centro confirma el pago de tu Alineación.</p>'}` : '';
  if (!confirmadas && !grilla) return `<p class="sa-nota">No hay sesiones disponibles en este momento.${whatsapp ? ` <a href="https://wa.me/${esc(whatsapp)}" target="_blank" rel="noopener">Escríbenos por WhatsApp</a> para conocer próximas fechas.` : ''}</p>`;
  return confirmadas + grilla;
}
export const ESTILOS_SESIONES = `
  .sa-t { font-weight:700; font-size:.9rem; margin:4px 0 8px }
  .sa-mias { margin-bottom:16px } .sa-mia { display:flex; gap:12px; justify-content:space-between; align-items:center; flex-wrap:wrap; border:1px solid #A7F3D0; background:#ECFDF5; border-radius:12px; padding:12px 14px; margin-bottom:8px }
  .sa-mia span { color:var(--mid); font-size:.86rem } .sa-ok { color:#065F46; font-weight:700; font-size:.84rem; margin-top:4px } .sa-acc { display:flex; gap:8px; flex-wrap:wrap; align-items:center }
  .sa-pend { font-size:.84rem; color:#92400E }
  .sa-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:10px }
  .sa-card { border:1px solid var(--border); border-radius:12px; padding:12px 14px; display:flex; flex-direction:column; gap:4px; font-size:.88rem; background:var(--white) }
  .sa-card.llena { opacity:.6 } .sa-f { font-weight:700; text-transform:capitalize } .sa-i, .sa-d { color:var(--mid); font-size:.84rem } .sa-cupo { color:var(--muted); font-size:.8rem; margin:2px 0 6px }
  .sa-nota { color:var(--mid); font-size:.88rem; line-height:1.6; margin:10px 0 0 }`;
