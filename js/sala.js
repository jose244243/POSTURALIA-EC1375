/* ============================================================================
   POSTURALIA · sala.js — Sala de evidencias (como sala-evidencias.js de
   Paideia, 18-sep-2026)

   La sesión grabada con el usuario se hace en UNA sala de Zoom fija para
   todos. Para que no se encimen dos candidatos:
     · el equipo publica horarios exclusivos (plantilla semanal),
     · cada candidato reserva uno (nadie más puede tomarlo),
     · el enlace y la clave solo se le entregan a quien reservó y solo
       dentro de su ventana (minutos antes → fin),
     · cambiar o cancelar solo hasta N horas antes.
   Además, la evidencia tiene fecha límite: N días desde que se liberó la
   Alineación (30 por omisión), con aviso en el panel y en Evidencias.

   Este archivo es la parte PURA (fechas, estados, plantilla, calendario y
   HTML); los datos vienen de sala-datos.js (nube o este navegador).
   Horario de México: sin horario de verano desde oct-2022, siempre UTC−6.
   ========================================================================== */

export const TZ = 'America/Mexico_City';
const OFFSET_MX = '-06:00';
const MIN_MS = 60000, DIA_MS = 86400000;
export const CONFIG_SALA = { zoom_url: '', zoom_id: '', zoom_clave: '', dias_limite: 30, minutos_antes: 10, horas_cambio: 24 };

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const esFechaISO = s => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
const aMs = v => esFechaISO(v) ? Date.parse(v + 'T12:00:00' + OFFSET_MX) : Date.parse(v);
export const fechaISO = ms => new Date(ms).toLocaleDateString('en-CA', { timeZone: TZ });
export const fechaLarga = v => new Date(aMs(v)).toLocaleDateString('es-MX', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
export const fechaCorta = v => new Date(aMs(v)).toLocaleDateString('es-MX', { timeZone: TZ, day: 'numeric', month: 'short', year: 'numeric' });
export const hora = v => new Date(v).toLocaleTimeString('es-MX', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
export const horarioTexto = (inicio, fin) => `${hora(inicio)} a ${hora(fin)} h`;
export const mxAIso = (fecha, hhmm) => new Date(`${fecha}T${hhmm}:00${OFFSET_MX}`).toISOString();
export function sumarDias(fecha, n) { const d = new Date(fecha + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
export const diasEntre = (a, b) => Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / DIA_MS);

/* Fecha límite de la evidencia: días desde que se liberó la Alineación */
export function limiteDesde(autorizadoEn, dias) {
  const t = Date.parse(autorizadoEn || '');
  return isNaN(t) ? null : sumarDias(fechaISO(t), Number(dias) || 30);
}
export function limiteInfo(limite, hoy, entregada) {
  if (!esFechaISO(limite)) return null;
  if (entregada) return { clave: 'entregada', dias: null, limite };
  const dias = diasEntre(hoy, limite);
  return { clave: dias < 0 ? 'vencido' : dias <= 7 ? 'pronto' : 'ok', dias, limite };
}
export const esUrlZoom = u => typeof u === 'string' && /^https:\/\/([a-z0-9-]+\.)*zoom\.us\/[^\s"'<>]*$/i.test(u);
/* El enlace /s/ es el de INICIAR como anfitrión; al candidato hay que darle el
   de invitación (/j/). */
/* "09:00, 11:00" → ['09:00','11:00'] (hora de México). La usan la plantilla
   semanal y el borrado por hora, para que la misma escritura valga en los
   dos lados (como Paideia, 23 sep). */
export const horasDeTexto = txt => String(txt || '').split(',').map(t => {
  const m = /^\s*(\d{1,2}):(\d{2})\s*$/.exec(t);
  return m && Number(m[1]) < 24 && Number(m[2]) < 60 ? m[1].padStart(2, '0') + ':' + m[2] : null;
}).filter(Boolean);
export const esEnlaceDeInicio = u => typeof u === 'string' && /^https:\/\/([a-z0-9-]+\.)*zoom\.us\/s\//i.test(u);

export function cuentaRegresiva(ms) {
  if (!(ms > 0)) return 'ya';
  const min = Math.ceil(ms / MIN_MS);
  if (min < 60) return min + ' min';
  const h = Math.floor(min / 60), m = min % 60;
  if (h < 24) return h + ' h' + (m ? ' ' + m + ' min' : '');
  const d = Math.floor(h / 24), hr = h % 24;
  return d + (d === 1 ? ' día' : ' días') + (hr ? ' ' + hr + ' h' : '');
}

/* Estado de la tarjeta. d = { reserva, minutos_antes, sala } (sala solo
   llega dentro de la ventana). */
export function estado(d, ahoraMs) {
  const r = d?.reserva;
  if (!r || r.estado === 'cancelada') return { clave: 'sin_reserva' };
  if (r.estado === 'no_asistio') return { clave: 'no_asistio' };
  const ini = Date.parse(r.inicio), fin = Date.parse(r.fin);
  const abre = ini - (Number(d.minutos_antes) || 0) * MIN_MS;
  if (ahoraMs > fin) return { clave: 'terminada' };
  if (ahoraMs < abre) return { clave: 'antes', abreEnMs: abre - ahoraMs };
  if (d.sala) return { clave: 'abierta', terminaEnMs: fin - ahoraMs };
  return { clave: 'antes', abreEnMs: 0, esperandoServidor: true };
}
export function puedeCambiar(r, horasCambio, ahoraMs) {
  if (!r?.inicio) return false;
  return Date.parse(r.inicio) - ahoraMs >= (Number(horasCambio) || 0) * 60 * MIN_MS;
}
/* ¿La ventana está abierta? (lo decide quien entrega el enlace) */
export function ventanaAbierta(r, minutosAntes, ahoraMs) {
  if (!r || r.estado !== 'reservada') return false;
  return ahoraMs >= Date.parse(r.inicio) - (Number(minutosAntes) || 0) * MIN_MS && ahoraMs <= Date.parse(r.fin);
}

/* ── Plantilla semanal ───────────────────────────────────────────────────
   p = { dias: [0..6, 0 = domingo], horas: ['09:00'], duracion, colchon, desde, hasta } */
const intervalo = h => ({ ini: Date.parse(h.inicio), finC: Date.parse(h.fin) + (Number(h.colchon_min) || 0) * MIN_MS });
const traslapa = (a, b) => a.ini < b.finC && b.ini < a.finC;
export function generarHorarios(p = {}, existentes = [], ahoraMs = Date.now()) {
  const dur = Number(p.duracion), col = Number(p.colchon) || 0;
  if (!(dur > 0) || col < 0 || !esFechaISO(p.desde) || !esFechaISO(p.hasta) || p.hasta < p.desde)
    return { nuevos: [], omitidos: [], error: 'Revisa la duración y el rango de fechas.' };
  const horas = (p.horas || []).filter(h => /^\d{2}:\d{2}$/.test(h)).sort();
  const ocupados = existentes.map(intervalo);
  const nuevos = [], omitidos = [];
  for (let f = p.desde, n = 0; f <= p.hasta && n < 400; f = sumarDias(f, 1), n++) {
    if (!(p.dias || []).includes(new Date(f + 'T00:00:00Z').getUTCDay())) continue;
    horas.forEach(hh => {
      const inicio = mxAIso(f, hh);
      const cand = { inicio, fin: new Date(Date.parse(inicio) + dur * MIN_MS).toISOString(), colchon_min: col };
      const iv = intervalo(cand);
      if (iv.ini <= ahoraMs) { omitidos.push({ inicio, motivo: 'ya pasó' }); return; }
      if (ocupados.some(o => traslapa(iv, o))) { omitidos.push({ inicio, motivo: 'se traslapa con otro horario' }); return; }
      ocupados.push(iv); nuevos.push(cand);
    });
  }
  return { nuevos, omitidos };
}

export function agruparPorDia(horarios = []) {
  const dias = {}, orden = [];
  [...horarios].sort((a, b) => Date.parse(a.inicio) - Date.parse(b.inicio)).forEach(h => {
    const f = fechaISO(Date.parse(h.inicio));
    if (!dias[f]) {
      dias[f] = { fecha: f, etiqueta: new Date(aMs(f)).toLocaleDateString('es-MX', { timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short' }), etiquetaLarga: fechaLarga(f), horarios: [] };
      orden.push(f);
    }
    dias[f].horarios.push({ id: h.id, inicio: h.inicio, fin: h.fin, texto: horarioTexto(h.inicio, h.fin) });
  });
  return orden.map(f => dias[f]);
}

/* ── Calendario del mes (con muchos horarios, una rejilla y no una pared de
   botones) ─────────────────────────────────────────────────────────────── */
const NOMBRE_MES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const DIAS_CORTOS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
export const mesDe = fecha => String(fecha || '').slice(0, 7);
export const nombreMes = mes => NOMBRE_MES[Number(mes.slice(5, 7)) - 1] + ' de ' + mes.slice(0, 4);
export function gridMes(mes) {
  const y = Number(mes.slice(0, 4)), m = Number(mes.slice(5, 7));
  const total = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const offset = (new Date(mes + '-01T00:00:00Z').getUTCDay() + 6) % 7;
  const celdas = Array(offset).fill(null);
  for (let d = 1; d <= total; d++) celdas.push(`${mes}-${String(d).padStart(2, '0')}`);
  while (celdas.length % 7) celdas.push(null);
  return celdas;
}
export const mesesConHorarios = dias => [...new Set((dias || []).map(x => mesDe(x.fecha)))].sort();
export function calendarioHtml(dias, mesSel, diaSel) {
  const meses = mesesConHorarios(dias);
  if (!meses.length) return '';
  const mes = meses.includes(mesSel) ? mesSel : meses.includes(mesDe(diaSel)) ? mesDe(diaSel) : meses[0];
  const i = meses.indexOf(mes);
  const porFecha = Object.fromEntries((dias || []).map(x => [x.fecha, x]));
  return `<div class="sala-cal"><div class="sala-cal-nav">
      <button type="button" class="sala-cal-mov" data-sala-mes="${esc(meses[i - 1] || '')}" ${i > 0 ? '' : 'disabled'} aria-label="Mes anterior">‹</button>
      <strong>${esc(nombreMes(mes))}</strong>
      <button type="button" class="sala-cal-mov" data-sala-mes="${esc(meses[i + 1] || '')}" ${i < meses.length - 1 ? '' : 'disabled'} aria-label="Mes siguiente">›</button></div>
    <div class="sala-cal-grid">${DIAS_CORTOS.map(d => `<span class="sala-cal-dow" aria-hidden="true">${d}</span>`).join('')}
    ${gridMes(mes).map(f => {
      if (!f) return '<span class="sala-cal-vacio"></span>';
      const n = String(Number(f.slice(8))), dia = porFecha[f];
      if (!dia) return `<span class="sala-cal-no">${n}</span>`;
      const on = f === diaSel, k = dia.horarios.length;
      return `<button type="button" class="sala-cal-dia${on ? ' on' : ''}" data-sala-dia="${f}" aria-pressed="${on}" aria-label="${esc(dia.etiquetaLarga)}, ${k} ${k === 1 ? 'horario' : 'horarios'}">${n}<span class="sala-cal-pts">${k}</span></button>`;
    }).join('')}</div></div>`;
}

/* ── HTML ─────────────────────────────────────────────────────────────── */
export const REGLAS = [
  'La sala es individual: entra solo en tu horario.',
  '<strong>Si al entrar ves a otra persona, sal de inmediato y avísanos por WhatsApp.</strong>',
  'No compartas el enlace ni la clave.',
  '<strong>La grabación empieza en cuanto entras</strong>: llega con tu usuario, tu equipo listo y esta página abierta.',
  'Pon tu nombre completo en Zoom (así se identifica tu grabación).',
  'Cámara y micrófono encendidos todo el tiempo.',
  'Al terminar, sal completamente de Zoom ("Salir de la reunión" y cierra la app).',
];
export const reglasHtml = abiertas => `<details class="sala-reglas" ${abiertas ? 'open' : ''}><summary>Reglas de la sala</summary><ol>${REGLAS.map(r => `<li>${r}</li>`).join('')}</ol></details>`;

export function tarjetaHtml(d, est, { whatsapp = '', reglasAbiertas = false } = {}) {
  const r = d?.reserva;
  const cuando = r ? `${esc(fechaLarga(r.inicio))} · ${esc(horarioTexto(r.inicio, r.fin))}` : '';
  const antes = Number(d?.minutos_antes) || 0;
  let h = `<div class="sala-card sala-${est.clave}"><h2>Tu sala de evidencia</h2>`;
  if (est.clave === 'sin_reserva') h += '<p>Aún no tienes horario para grabar tu sesión. Cada horario es para una sola persona.</p><a class="sala-btn" href="plan.html#agenda">Agendar mi horario</a>';
  else if (est.clave === 'antes') h += `<p class="sala-cuando">${cuando}</p>${est.esperandoServidor ? '<p>Abriendo la sala…</p>' : `<p>La sala se abre ${antes ? antes + ' min antes de tu horario' : 'a la hora de tu horario'} · faltan <strong>${esc(cuentaRegresiva(est.abreEnMs))}</strong></p>`}
      <button type="button" class="sala-btn" disabled>Se habilita ${antes ? antes + ' min antes' : 'a tu hora'}</button>`;
  else if (est.clave === 'abierta') {
    const s = d.sala;
    h += `<p class="sala-cuando">${cuando} · <strong>la sala está abierta</strong></p>`
      + (esUrlZoom(s.url) ? `<a class="sala-btn sala-btn-ok" data-sala-entrar href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">Entrar a la sala de Zoom</a>` : '<p class="sala-msg">El enlace de la sala no es válido. Escríbenos por WhatsApp.</p>')
      + `<p class="sala-datos">ID de reunión: <strong>${esc(s.id || '')}</strong>${s.clave ? ` · Clave: <strong>${esc(s.clave)}</strong> <button type="button" class="sala-copiar" data-sala-copiar="${esc(s.clave)}">Copiar</button>` : ''}</p>
         <p class="sala-nota">Tu horario termina a las ${esc(hora(r.fin))} h. Al terminar, sal completamente de Zoom.</p>`;
  } else if (est.clave === 'terminada') h += `<p class="sala-cuando">${cuando}</p><p>¿Ya grabaste? Sigue con tus documentos. Si algo falló, agenda otro horario.</p><a class="sala-btn sala-btn-sec" href="plan.html#agenda">Agendar otro horario</a>`;
  else if (est.clave === 'no_asistio') h += `<p>No se registró tu sesión del ${esc(fechaLarga(r.inicio))}.</p><a class="sala-btn" href="plan.html#agenda">Agendar otro horario</a>`;
  if (est.clave === 'antes' || est.clave === 'abierta') h += reglasHtml(reglasAbiertas);
  return h + (whatsapp ? `<p class="sala-ayuda">¿Algún problema? <a href="https://wa.me/${esc(whatsapp)}" target="_blank" rel="noopener">Escríbenos por WhatsApp</a></p>` : '') + '</div>';
}

export function avisoHtml(info, { whatsapp = '' } = {}) {
  if (!info) return '';
  if (info.clave === 'entregada') return '<div class="sala-aviso sala-aviso-ok">Evidencia entregada.</div>';
  const f = `<strong>${esc(fechaLarga(info.limite))}</strong>`;
  if (info.clave === 'vencido') return `<div class="sala-aviso sala-aviso-bad" role="alert">Tu plazo para entregar tu evidencia venció el ${f}.${whatsapp ? ` <a href="https://wa.me/${esc(whatsapp)}" target="_blank" rel="noopener">Escríbenos por WhatsApp</a>` : ''}</div>`;
  const faltan = info.dias === 0 ? 'hoy es el último día' : `faltan ${info.dias} ${info.dias === 1 ? 'día' : 'días'}`;
  return `<div class="sala-aviso ${info.clave === 'pronto' ? 'sala-aviso-warn' : 'sala-aviso-info'}">Tienes hasta el ${f} para entregar tu evidencia · ${faltan}</div>`;
}

export function selectorHtml(dias, diaSel, mesSel) {
  if (!dias?.length) return '<p class="sala-nota">No hay horarios disponibles por ahora. Escríbenos por WhatsApp para acordar uno.</p>';
  const sel = dias.find(x => x.fecha === diaSel) || null;
  return '<p class="sala-nota">1. Elige el día · 2. Elige la hora</p>' + calendarioHtml(dias, mesSel, sel?.fecha || null)
    + (sel ? `<p class="sala-cal-sel">Horarios del <strong>${esc(sel.etiquetaLarga)}</strong></p><div class="sala-horas" role="group" aria-label="Horarios">${sel.horarios.map(h => `<button type="button" class="sala-hora" data-sala-horario="${esc(h.id)}">${esc(h.texto)}</button>`).join('')}</div>`
      : '<p class="sala-nota">Toca un día con horarios (el número chico es cuántos hay) para ver las horas.</p>');
}

export function reservaHtml(d, ahoraMs, { whatsapp = '' } = {}) {
  const r = d.reserva, cambia = puedeCambiar(r, d.horas_cambio, ahoraMs);
  return `<div class="sala-reservada"><p>Tu horario: <strong>${esc(fechaLarga(r.inicio))} · ${esc(horarioTexto(r.inicio, r.fin))}</strong></p>
    <p class="sala-nota">Ese día entras a la sala desde Documentos de Sesión o el Guion Maestro; el botón se habilita ${Number(d.minutos_antes) || 0} min antes.</p>
    <div class="sala-acciones"><button type="button" class="sala-btn sala-btn-sec" data-sala-cambiar ${cambia ? '' : 'disabled'}>Cambiar horario</button>
      <button type="button" class="sala-btn sala-btn-sec" data-sala-cancelar ${cambia ? '' : 'disabled'}>Cancelar</button></div>
    ${cambia ? '' : `<p class="sala-nota">Faltan menos de ${esc(d.horas_cambio)} h: para cambiarlo ${whatsapp ? `<a href="https://wa.me/${esc(whatsapp)}" target="_blank" rel="noopener">escríbenos por WhatsApp</a>` : 'escríbenos'}.</p>`}</div>`;
}

export const ESTILOS_SALA = `
  .sala-card,.sala-reservada{background:var(--bg);border:1px solid var(--border);border-radius:12px;padding:16px;margin:0 0 18px}
  .sala-card h2{font-size:1.05rem;margin:0 0 8px}.sala-card p,.sala-reservada p{margin:0 0 10px}
  .sala-cuando{font-weight:600}.sala-nota,.sala-ayuda{font-size:.84rem;color:var(--mid)}
  .sala-btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:10px 18px;border-radius:10px;border:0;background:#0d2a6e;color:#fff;font-weight:700;text-decoration:none;cursor:pointer;margin:4px 8px 8px 0;font:inherit;font-weight:700}
  .sala-btn[disabled]{opacity:.55;cursor:not-allowed}.sala-btn-ok{background:#047857}.sala-btn-sec{background:transparent;color:var(--dark);border:1.5px solid var(--border)}
  .sala-copiar,.sala-link{background:none;border:1px solid var(--border);border-radius:6px;padding:2px 8px;cursor:pointer;font-size:.8rem;font:inherit}
  .sala-reglas{margin-top:8px}.sala-reglas summary{cursor:pointer;font-weight:600}.sala-reglas ol{margin:8px 0 0 20px;font-size:.86rem}.sala-reglas li{margin-bottom:4px}
  .sala-aviso{border-radius:10px;padding:12px 14px;margin:0 0 16px;font-size:.9rem;border:1px solid}
  .sala-aviso-info{border-color:#93C5FD;background:#EFF6FF}.sala-aviso-warn{border-color:#FCD34D;background:#FFFBEB}
  .sala-aviso-bad{border-color:#FCA5A5;background:#FEF2F2}.sala-aviso-ok{border-color:#A7F3D0;background:#ECFDF5}
  .sala-cal{margin:0 0 12px;max-width:420px}.sala-cal-nav{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 0 8px}
  .sala-cal-mov{min-width:44px;min-height:44px;border-radius:10px;border:1px solid var(--border);background:transparent;font-size:1.2rem;cursor:pointer}
  .sala-cal-mov[disabled]{opacity:.35;cursor:not-allowed}
  .sala-cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center}
  .sala-cal-dow{font-size:.75rem;color:var(--muted);padding:2px 0}
  .sala-cal-vacio{min-height:44px}.sala-cal-no{min-height:44px;display:flex;align-items:center;justify-content:center;opacity:.35;font-size:.9rem}
  .sala-cal-dia{position:relative;min-height:44px;border-radius:10px;border:1px solid var(--border);background:var(--white);font-weight:700;cursor:pointer;font:inherit;font-weight:700}
  .sala-cal-dia.on{background:#0d2a6e;color:#fff;border-color:transparent}
  .sala-cal-pts{display:block;font-size:.64rem;font-weight:600;opacity:.8}
  .sala-horas{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px}
  .sala-hora{min-height:44px;padding:8px 14px;border-radius:10px;border:1px solid var(--border);background:var(--white);cursor:pointer;font:inherit;font-weight:600}
  .sala-hora:hover,.sala-cal-dia:hover{border-color:#0d2a6e}.sala-msg{font-weight:600}`;
