/* ============================================================================
   POSTURALIA · sala-ui.js — Pantallas de la Sala de evidencias

     montarAviso(el)       fecha límite de la evidencia (panel, Evidencias)
     montarTarjeta(el)     «Tu sala de evidencia» (Documentos de Sesión, Guion)
     montarAgenda(el)      calendario para reservar horario (Plan de Evaluación)
     montarAdminSala(el)   pestaña del equipo (admin-sesiones.html)
   ========================================================================== */
import * as S from './sala.js';
import * as D from './sala-datos.js';
import { estaCompleto } from './flow.js';

function estilos() {
  if (document.getElementById('salaCss')) return;
  const st = document.createElement('style'); st.id = 'salaCss'; st.textContent = S.ESTILOS_SALA; document.head.appendChild(st);
}
const leerLS = k => { try { return localStorage.getItem(k); } catch { return null; } };
const escribirLS = (k, v) => { try { localStorage.setItem(k, v); } catch {} };

/* ── Aviso de fecha límite ───────────────────────────────────────────── */
export async function montarAviso(el, d) {
  if (!el) return; estilos();
  if (d === undefined) d = await D.miSala();
  if (!d?.limite) { el.innerHTML = ''; return; }
  el.innerHTML = S.avisoHtml(S.limiteInfo(d.limite, S.fechaISO(Date.now()), estaCompleto('evidencias')), { whatsapp: D.whatsapp() });
}

/* ── Tarjeta de la sala: se repinta cada 30 s (la ventana se abre sola) ── */
export async function montarTarjeta(el, d) {
  if (!el) return; estilos();
  if (d === undefined) d = await D.miSala();
  if (!d) { el.innerHTML = ''; return; }
  /* Sin reserva y sin horarios publicados, la sala no se usa (el Centro
     acuerda la fecha por WhatsApp): no se muestra nada. */
  if (!d.reserva || d.reserva.estado === 'cancelada') {
    let hay = false; try { hay = (await D.disponibles()).length > 0; } catch {}
    if (!hay) { el.innerHTML = ''; return; }
  }
  let ultima = Date.now();
  const vistas = leerLS('posturalia.sala.reglas') === '1';
  const pintar = () => {
    if (!document.body.contains(el)) { clearInterval(timer); return; }
    const ahora = Date.now(), est = S.estado(d, ahora);
    if (est.esperandoServidor && ahora - ultima > 25000) { ultima = ahora; D.miSala().then(n => { if (n) { d = n; pintar(); } }); }
    const det = el.querySelector('details.sala-reglas');
    el.innerHTML = S.tarjetaHtml(d, est, { whatsapp: D.whatsapp(), reglasAbiertas: det ? det.open : !vistas });
    el.querySelector('details.sala-reglas')?.addEventListener('toggle', () => escribirLS('posturalia.sala.reglas', '1'));
    el.querySelectorAll('[data-sala-copiar]').forEach(b => b.onclick = () => {
      const t = b.dataset.salaCopiar;
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => { b.textContent = '¡Copiada!'; }, () => { b.textContent = t; });
    });
  };
  const timer = setInterval(pintar, 30000);
  pintar();
}

/* ── Agenda del Plan de Evaluación ───────────────────────────────────────
   Resuelve { activa, reserva }; activa = false → no hay horarios ni reserva
   y la página conserva el modo de siempre (acordar la fecha por WhatsApp). */
export async function montarAgenda(el, { onCambio = () => {} } = {}) {
  if (!el) return { activa: false, reserva: null }; estilos();
  let d = await D.miSala();
  if (!d) { el.innerHTML = ''; return { activa: false, reserva: null }; }
  let lista = [], diaSel = null, mesSel = null, mensaje = '', modoCambio = false;
  const vigente = () => { const r = d.reserva; return !!(r && r.estado === 'reservada' && Date.parse(r.fin) > Date.now()); };
  const resumen = () => { const r = d.reserva; return r && r.estado !== 'cancelada' ? { fecha: S.fechaISO(Date.parse(r.inicio)), horario: S.horarioTexto(r.inicio, r.fin), inicio: r.inicio, fin: r.fin } : null; };
  const refrescar = async () => { try { lista = S.agruparPorDia(await D.disponibles()); } catch (e) { lista = []; mensaje = 'No pudimos cargar los horarios: ' + (e.message || e); } };
  const pintar = () => {
    let h = mensaje ? `<p class="sala-msg" role="status">${S.esc(mensaje)}</p>` : '';
    if (vigente() && !modoCambio) h += S.reservaHtml(d, Date.now(), { whatsapp: D.whatsapp() });
    else {
      const r = d.reserva;
      if (r && !vigente() && r.estado !== 'cancelada') h += `<p class="sala-nota">Tu sesión anterior fue el ${S.esc(S.fechaLarga(r.inicio))}. Si necesitas grabar de nuevo, elige otro horario.</p>`;
      if (modoCambio) h += '<p class="sala-nota">Elige tu nuevo horario; el anterior se libera al confirmar. <button type="button" class="sala-link" data-sala-volver>Conservar mi horario</button></p>';
      h += S.selectorHtml(lista, diaSel, mesSel);
    }
    el.innerHTML = h;
  };
  el.addEventListener('click', async e => {
    const dia = e.target.closest('[data-sala-dia]'), mes = e.target.closest('[data-sala-mes]'), hor = e.target.closest('[data-sala-horario]');
    if (dia) { diaSel = dia.dataset.salaDia; mesSel = S.mesDe(diaSel); mensaje = ''; return pintar(); }
    if (mes) { if (!mes.dataset.salaMes) return; mesSel = mes.dataset.salaMes; diaSel = null; mensaje = ''; return pintar(); }
    if (hor) {
      let h = null; lista.forEach(x => x.horarios.forEach(y => { if (y.id === hor.dataset.salaHorario) h = y; }));
      if (!h || !confirm(`¿Reservar el ${S.fechaLarga(h.inicio)} de ${S.horarioTexto(h.inicio, h.fin)}?\n\nEse horario queda solo para ti.`)) return;
      try { d.reserva = await D.reservar(h.id); modoCambio = false; mensaje = 'Horario reservado.'; onCambio(resumen()); }
      catch (err) { mensaje = err.message || String(err); await refrescar(); }
      return pintar();
    }
    if (e.target.closest('[data-sala-cambiar]')) { modoCambio = true; mensaje = ''; await refrescar(); return pintar(); }
    if (e.target.closest('[data-sala-volver]')) { modoCambio = false; return pintar(); }
    if (e.target.closest('[data-sala-cancelar]')) {
      if (!confirm('¿Cancelar tu horario? Lo podrá tomar otra persona.')) return;
      try { await D.cancelar(); d.reserva = null; mensaje = 'Tu horario se canceló.'; await refrescar(); onCambio(null); }
      catch (err) { mensaje = err.message || String(err); }
      return pintar();
    }
  });
  if (!vigente()) await refrescar();
  if (!vigente() && !lista.length && !(d.reserva && d.reserva.estado !== 'cancelada')) {
    el.innerHTML = mensaje ? `<p class="sala-msg">${S.esc(mensaje)}</p>` : '';
    return { activa: false, reserva: null };
  }
  pintar();
  return { activa: true, reserva: resumen() };
}

/* ── Pestaña del equipo ──────────────────────────────────────────────── */
const ESTADOS = { reservada: 'Reservada', asistio: 'Asistió', no_asistio: 'No asistió' };
const DIAS = [[1, 'Lun'], [2, 'Mar'], [3, 'Mié'], [4, 'Jue'], [5, 'Vie'], [6, 'Sáb'], [0, 'Dom']];
export async function montarAdminSala(el, { nombres = {} } = {}) {
  if (!el) return; estilos();
  const st = { cfg: {}, horarios: [], reservas: [], error: '', vista: null, msg: '' };
  const cargarTodo = async () => { Object.assign(st, await D.cargarEquipo()); };
  const reservaDe = id => st.reservas.find(x => x.horario_id === id) || null;
  const manana = () => S.sumarDias(S.fechaISO(Date.now()), 1);
  const e = S.esc;
  const html = () => {
    const c = st.cfg, v = st.vista, ahora = Date.now();
    let h = st.error ? `<div class="aviso aviso--warn">${e(st.error)}</div>` : '';
    h += st.msg ? `<p role="status" style="font-weight:600">${e(st.msg)}</p>` : '';
    h += `<h3>Configuración de la sala</h3>
      <p class="pn-nota">El enlace y la clave nunca se le muestran al candidato fuera de su horario. Si cambias la sala en Zoom, actualízala aquí.${D.enNube() ? '' : ' <b>Modo local:</b> los horarios viven en este navegador; el candidato agenda desde el equipo del Centro.'}</p>
      <div class="sala-form">
        <label>Enlace de invitación de Zoom <input type="url" id="saUrl" value="${e(c.zoom_url || '')}" placeholder="https://us06web.zoom.us/j/…"></label>
        <label>ID de reunión <input type="text" id="saId" value="${e(c.zoom_id || '')}"></label>
        <label>Clave de acceso <input type="text" id="saClave" value="${e(c.zoom_clave || '')}"></label>
        <label>Días para entregar la evidencia (desde que se libera la Alineación) <input type="number" id="saDias" min="1" max="365" value="${e(c.dias_limite)}"></label>
        <label>Minutos antes en que se abre la sala <input type="number" id="saAntes" min="0" max="60" value="${e(c.minutos_antes)}"></label>
        <label>Horas mínimas para cambiar o cancelar <input type="number" id="saCambio" min="0" max="168" value="${e(c.horas_cambio)}"></label>
      </div>
      <button type="button" class="btn-a btn-a--pri" id="saGuardar">Guardar configuración</button>
      <h3 style="margin-top:24px">Crear horarios con plantilla semanal</h3>
      <div class="sala-form">
        <div><b>Días</b><div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:4px">${DIAS.map(([n, t]) => `<label style="display:flex;gap:4px;align-items:center"><input type="checkbox" data-sa-dia="${n}"> ${t}</label>`).join('')}</div></div>
        <label>Horas de inicio (hora de México, separadas por coma) <input type="text" id="saHoras" placeholder="09:00, 11:00, 16:00"></label>
        <label>Duración (min) <input type="number" id="saDur" value="90" min="15" max="300"></label>
        <label>Colchón entre sesiones (min) <input type="number" id="saCol" value="15" min="0" max="120"></label>
        <label>Desde <input type="date" id="saDesde" value="${manana()}"></label>
        <label>Hasta <input type="date" id="saHasta" value="${S.sumarDias(manana(), 27)}"></label>
      </div>
      <button type="button" class="btn-a btn-a--sec" id="saVista">Vista previa</button>`;
    if (v) h += v.error ? `<p style="color:#B91C1C">${e(v.error)}</p>`
      : `<p>Se crearán <strong>${v.nuevos.length}</strong> horarios${v.omitidos.length ? ` · se omiten ${v.omitidos.length} (ya pasaron o se traslapan)` : ''}.</p>
         <ul style="max-height:200px;overflow:auto;font-size:.84rem">${v.nuevos.slice(0, 60).map(x => `<li>${e(S.fechaLarga(x.inicio))} · ${e(S.horarioTexto(x.inicio, x.fin))}</li>`).join('')}${v.nuevos.length > 60 ? '<li>…</li>' : ''}</ul>
         ${v.nuevos.length ? `<button type="button" class="btn-a btn-a--pri" id="saCrear">Crear ${v.nuevos.length} horarios</button>` : ''}`;
    const futuros = st.horarios.filter(x => Date.parse(x.fin) >= ahora), pasados = st.horarios.filter(x => Date.parse(x.fin) < ahora).reverse();
    const fila = (x, pasado) => {
      const r = reservaDe(x.id);
      const quien = r ? `${e(nombres[r.email] || r.email)} <span style="opacity:.7">(${e(ESTADOS[r.estado] || r.estado)})</span>` : '<span style="opacity:.7">Libre</span>';
      const acc = !r && !pasado ? `<button type="button" class="btn-a btn-a--sec" data-sa-borrar="${e(x.id)}">Borrar</button>`
        : r && pasado ? `<button type="button" class="btn-a btn-a--sec" data-sa-marcar="${e(r.id)}" data-estado="asistio">Asistió</button> <button type="button" class="btn-a btn-a--sec" data-sa-marcar="${e(r.id)}" data-estado="no_asistio">No asistió</button>` : '';
      return `<tr><td>${e(S.fechaCorta(x.inicio))}</td><td>${e(S.horarioTexto(x.inicio, x.fin))}</td><td>${quien}</td><td>${acc}</td></tr>`;
    };
    const tabla = (l, pasado) => l.length ? `<div style="overflow-x:auto"><table class="sala-t"><thead><tr><th>Fecha</th><th>Horario</th><th>Candidato</th><th></th></tr></thead><tbody>${l.map(x => fila(x, pasado)).join('')}</tbody></table></div>` : '<p style="opacity:.7">Ninguno.</p>';
    h += `<h3 style="margin-top:24px">Borrar horarios libres</h3>
      <p class="pn-nota">Borra de golpe los horarios LIBRES de un rango. Los que ya tienen candidato nunca se tocan.</p>
      <div class="sala-form"><label>Desde <input type="date" id="saBorrarDesde" value="${manana()}"></label><label>Hasta <input type="date" id="saBorrarHasta" value="${S.sumarDias(manana(), 27)}"></label>
        <label>Solo a estas horas (opcional, separadas por coma) <input type="text" id="saBorrarHoras" placeholder="09:00, 16:00"></label></div>
      <button type="button" class="btn-a btn-a--sec" id="saBorrarRango" style="border-color:#B91C1C;color:#B91C1C">Borrar los libres de ese rango</button>
      <h3 style="margin-top:24px">Próximos horarios</h3>${tabla(futuros, false)}
      <h3 style="margin-top:24px">Últimos 14 días</h3>${tabla(pasados, true)}`;
    return h;
  };
  const aviso = m => { st.msg = m; pintar(); };
  const q = s => el.querySelector(s);
  /* Lo tecleado sobrevive al repintado: cualquier aviso vuelve a pintar la
     sección, y antes eso regresaba el rango de fechas, las horas y los días
     a sus valores por omisión (como Paideia, 23 sep). */
  const pintar = () => {
    const antes = {};
    el.querySelectorAll('input[id], input[data-sa-dia]').forEach(i => { antes[i.id || 'dia' + i.dataset.saDia] = i.type === 'checkbox' ? i.checked : i.value; });
    el.innerHTML = html();
    el.querySelectorAll('input[id], input[data-sa-dia]').forEach(i => {
      const k = i.id || 'dia' + i.dataset.saDia;
      if (k in antes) { if (i.type === 'checkbox') i.checked = antes[k]; else i.value = antes[k]; }
    });
  };
  el.addEventListener('click', async ev => {
    const t = ev.target;
    if (t.id === 'saGuardar') {
      const url = q('#saUrl').value.trim();
      if (S.esEnlaceDeInicio(url)) return aviso('Ese es el enlace para INICIAR la reunión como anfitrión (/s/). Usa el de invitación, que lleva /j/ — en Zoom: «Enlace de invitación».');
      if (url && !S.esUrlZoom(url)) return aviso('El enlace debe ser de zoom.us (https://…zoom.us/j/…).');
      const cfg = { zoom_url: url, zoom_id: q('#saId').value.trim(), zoom_clave: q('#saClave').value.trim(), dias_limite: Number(q('#saDias').value) || 30,
        minutos_antes: Math.max(0, Number(q('#saAntes').value) || 0), horas_cambio: Math.max(0, Number(q('#saCambio').value) || 0) };
      try { await D.guardarConfig(cfg); st.cfg = { ...st.cfg, ...cfg }; aviso('Configuración guardada.'); } catch (err) { aviso('No se pudo guardar: ' + err.message); }
      return;
    }
    if (t.id === 'saVista') {
      const dias = [...el.querySelectorAll('[data-sa-dia]:checked')].map(c => Number(c.dataset.saDia));
      const horas = S.horasDeTexto(q('#saHoras').value);
      st.vista = !dias.length || !horas.length ? { error: 'Elige al menos un día y una hora (formato 09:00).', nuevos: [], omitidos: [] }
        : S.generarHorarios({ dias, horas, duracion: Number(q('#saDur').value), colchon: Number(q('#saCol').value), desde: q('#saDesde').value, hasta: q('#saHasta').value }, st.horarios, Date.now());
      st.msg = ''; return pintar();
    }
    if (t.id === 'saCrear') {
      try { const n = await D.crearHorarios(st.vista.nuevos); st.vista = null; await cargarTodo(); aviso(n + ' horarios creados.'); } catch (err) { aviso(err.message); }
      return;
    }
    if (t.id === 'saBorrarRango') {
      const desde = q('#saBorrarDesde').value, hasta = q('#saBorrarHasta').value;
      if (!desde || !hasta || hasta < desde) return aviso('Revisa el rango de fechas.');
      /* Borrado por hora: con horas escritas, solo los horarios que empiezan
         a esas horas (p. ej. quitar el de las 9:00 de todo el mes). */
      const txtHoras = q('#saBorrarHoras').value.trim(), soloHoras = S.horasDeTexto(txtHoras);
      if (txtHoras && !soloHoras.length) return aviso('Escribe las horas como 09:00, 16:00 — o deja el campo vacío para borrar todas.');
      const enRango = x => { const f = S.fechaISO(Date.parse(x.inicio)); return f >= desde && f <= hasta && (!soloHoras.length || soloHoras.includes(S.hora(x.inicio))); };
      const libres = st.horarios.filter(x => enRango(x) && !reservaDe(x.id)), ocupados = st.horarios.filter(x => enRango(x) && reservaDe(x.id)).length;
      if (!libres.length) return aviso('No hay horarios libres en ese rango.');
      if (!confirm(`¿Borrar ${libres.length} horarios libres del ${S.fechaCorta(desde)} al ${S.fechaCorta(hasta)}${soloHoras.length ? ` que empiezan a las ${soloHoras.join(', ')}` : ''}?${ocupados ? `\n\n${ocupados} con candidato NO se tocan.` : ''}\n\nEsto no se puede deshacer.`)) return;
      try { const n = await D.borrarHorarios(libres.map(x => x.id)); await cargarTodo(); aviso(n ? n + ' horarios borrados.' : 'No se borró ninguno (revisa que tu cuenta sea admin).'); } catch (err) { aviso('No se pudieron borrar: ' + err.message); }
      return;
    }
    const b = t.closest('[data-sa-borrar]');
    if (b) { if (!confirm('¿Borrar este horario libre?')) return; try { await D.borrarHorarios([b.dataset.saBorrar]); await cargarTodo(); aviso('Horario borrado.'); } catch (err) { aviso(err.message); } return; }
    const m = t.closest('[data-sa-marcar]');
    if (m) { try { await D.marcarReserva(m.dataset.saMarcar, m.dataset.estado); await cargarTodo(); aviso('Asistencia registrada.'); } catch (err) { aviso(err.message); } }
  });
  if (!document.getElementById('salaAdminCss')) {
    const st2 = document.createElement('style'); st2.id = 'salaAdminCss';
    st2.textContent = `.sala-form{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px 16px;margin:8px 0 12px}
      .sala-form label{display:flex;flex-direction:column;gap:4px;font-size:.84rem;font-weight:600}
      .sala-form div label{flex-direction:row;font-weight:500}
      .sala-form input[type=url],.sala-form input[type=text],.sala-form input[type=number],.sala-form input[type=date]{padding:8px 10px;border:1px solid var(--border);border-radius:8px;font:inherit;font-weight:400}
      .sala-t{width:100%;border-collapse:collapse;font-size:.86rem}.sala-t th,.sala-t td{padding:7px 8px;border-bottom:1px solid var(--border);text-align:left}`;
    document.head.appendChild(st2);
  }
  el.innerHTML = '<p>Cargando…</p>';
  await cargarTodo(); pintar();
}
