/* ============================================================================
   POSTURALIA · que-sigue.js — Qué sigue con cada candidato y Tareas del
   equipo (v65)

   Como Paideia (8 y 11 oct):
   · «Qué sigue» (Centro Evaluador): los pasos que faltan para entregar el
     portafolio, en orden y con quién los hace. El primero pendiente va
     resaltado y cada paso del evaluador lleva a su tarjeta (?ir=).
   · «Tareas del equipo» (Panel del equipo): por candidato con Evidencias
     entregadas, lo que nos toca hacer, cada tarea con UN botón: abrir la
     tarjeta exacta, marcar la etapa ahí mismo o recordarle al candidato por
     WhatsApp lo que le falta.

   Todo sale de lo que ya decide el resto de la plataforma (estadoPortafolio,
   lineaDeTiempo, firmaValida…). Aquí no se inventa ninguna regla nueva.
   ========================================================================== */
import { esc } from './seguro.js';
import { estadoPortafolio } from './portafolio-avance.js';
import { cedulaPublicada, dictamenDe, firmaValida, lineaDeTiempo, telefonoWhatsApp,
         CAMPOS_PROCESO, PUNTOS_VERIFICACION_N } from './evaluacion.js';

/* ?ir=<clave> → id de la tarjeta en admin-evaluacion.html */
export const TARJETA = { fechas: 'fechasProc', iec: 'cardIec', cedula: 'cedula', firmas: 'firmas',
  verificacion: 'verif', etapas: 'etapas', portafolio: 'portafolio', sii: 'sii' };
const FIRMAS = [['diagnostico', 'Autodiagnóstico'], ['plan', 'Plan'], ['iec', 'IEC'], ['cierre', 'Verificación']];
/* Lo que no es «subir un documento» (va como paso aparte o es del Centro) */
const NO_DOC = new Set(['Cédula de Evaluación', 'Cédula de Evaluación del Servicio',
  'Formato de Atención a Usuarios', 'Acuses de recibido (tríptico, plan y cédula)']);
const QUIEN = { evaluador: 'Evaluador', candidato: 'Candidato' };
const ms = f => Date.parse(f || '') || 0;

export const hrefEvaluacion = (email, ir) =>
  `admin-evaluacion.html?email=${encodeURIComponent(email || '')}${ir ? '&ir=' + ir : ''}`;

/* c: candidato de admin-data (expediente + fases + lote); ev: su evaluación */
export function siguientesPasos(c = {}, ev = {}) {
  c = c || {}; ev = ev || {};
  const et = ev.etapas || {}, ced = cedulaPublicada(ev);
  const enc = c.estado?.encuesta?.datos || {};
  const faltanDocs = estadoPortafolio(c, ev).items
    .filter(i => i.estado === 'falta' && i.quien === 'tú' && !NO_DOC.has(i.titulo)).map(i => i.titulo);
  const sinFirmar = FIRMAS.filter(([k]) => !firmaValida(ev.firmas?.[k])).map(([, n]) => n);
  const v = ev.verificacion || {};
  const nv = PUNTOS_VERIFICACION_N.filter(n => v[n] === 'si' || v[n] === 'no').length;
  const faltanFechas = CAMPOS_PROCESO.filter(f => !(ev.fechas || {})[f.id]).map(f => f.label.replace(/^Fecha \d · /, ''));
  /* El portafolio cuenta si se generó sin avisos y después de lo último que
     lo cambia (la Cédula publicada o un PDF del SII). */
  const port = ev.portafolio || null;
  const ultimo = Math.max(ms(ced?.publicada_at), ms(ev.sii?.ficha?.fecha), ms(ev.sii?.iec?.fecha));
  const portOk = !!(port?.generado_at && !port.avisos && ms(port.generado_at) >= ultimo);
  const entrega = !!c.fases?.entrega;
  const noComp = dictamenDe(ev) === 'no_competente';
  const pasos = [
    { clave: 'documentos', quien: 'candidato', titulo: 'Subir todos sus documentos', hecho: !faltanDocs.length,
      ayuda: faltanDocs.length ? 'Falta: ' + faltanDocs.join(', ') + '.' : '', ir: 'portafolio' },
    { clave: 'lote', quien: 'evaluador', titulo: 'Darlo de alta con su lote y precio', hecho: !c.sinAlta,
      ayuda: 'El lote va en la portada del portafolio.', href: `admin-precios.html?alta=${encodeURIComponent(c.email || '')}` },
    { clave: 'fechas', quien: 'evaluador', titulo: 'Capturar las 3 fechas del proceso', hecho: !faltanFechas.length,
      ayuda: faltanFechas.length ? 'Falta: ' + faltanFechas.join(', ') + '.' : '', ir: 'fechas' },
    { clave: 'iec', quien: 'evaluador', titulo: 'Calificar el IEC con la grabación (o subir el del SII)', hecho: !!(ev.iec?.completo || ev.sii?.iec),
      ayuda: ev.iec && !ev.iec.completo ? 'Está en proceso: termínalo.' : '', ir: 'iec' },
    { clave: 'cedula', quien: 'evaluador', titulo: 'Publicar la Cédula de Evaluación', hecho: !!ced,
      ayuda: 'Con el mismo juicio que el IEC.', ir: 'cedula' },
    { clave: 'firma_cedula', quien: 'candidato', titulo: 'Firmar su Cédula', hecho: !!(ced && firmaValida(ev.firma_candidato)),
      ayuda: 'Desde su panel; también es su rúbrica en el IEC.', ir: 'cedula' },
    { clave: 'opinion', quien: 'candidato', titulo: 'Contestar las dos hojas de opinión de su Encuesta', hecho: !!(enc.servicio?.medio && enc.atencion?.medio),
      ayuda: 'Cédula del Servicio y Formato de Atención a Usuarios (en su Encuesta: «Cambiar mis respuestas»).' },
    { clave: 'verificacion', quien: 'evaluador', titulo: 'Llenar la Verificación Interna', hecho: nv === PUNTOS_VERIFICACION_N.length && !!String(v.verificador || '').trim(),
      ayuda: nv ? `${nv} de ${PUNTOS_VERIFICACION_N.length} puntos${String(v.verificador || '').trim() ? '' : ' · falta quién verifica'}.` : '', ir: 'verificacion' },
    { clave: 'firmas', quien: 'evaluador', titulo: 'Firmar Autodiagnóstico, Plan, IEC y Verificación', hecho: !sinFirmar.length,
      ayuda: sinFirmar.length ? 'Falta: ' + sinFirmar.join(', ') + '.' : '', ir: 'firmas' },
    { clave: 'portafolio', quien: 'evaluador', titulo: 'Generar el portafolio', hecho: portOk,
      ayuda: port && !portOk ? (port.avisos ? `El último salió con ${port.avisos} aviso(s): vuelve a generarlo.` : 'El último se generó antes del último cambio: vuelve a generarlo.') : '',
      ir: 'portafolio' },
    ...(noComp ? [] : [{ clave: 'portafolio_sep', quien: 'evaluador', titulo: 'Enviar el portafolio a la SEP', hecho: !!et.portafolio_sep,
      ayuda: entrega ? 'Márcalo cuando lo envíes.' : 'Primero tiene que pagar la Entrega.', ir: 'etapas', espera: !entrega }]),
  ];
  pasos.forEach(p => { p.quienLabel = QUIEN[p.quien]; });
  const pendientes = pasos.filter(p => !p.hecho);
  return { pasos, pendientes, siguiente: pendientes[0] || null, listo: !pendientes.length };
}

/* Mensaje para recordarle al candidato lo que le falta */
export function mensajeRecordatorio(nombre, pendientes, liga = '') {
  return `Hola ${nombre || ''}, para terminar tu portafolio de la certificación EC1375 te falta: ${pendientes.join('; ')}. Entra a tu panel: ${liga}`;
}

const ETAPAS_CERTIFICADO = ['tramite', 'recibido', 'entregado'];
const primeraMinuscula = s => s.charAt(0).toLowerCase() + s.slice(1);

/* lista: candidatos (admin-data); evDe(email) → su evaluación; liga: panel del
   candidato para el WhatsApp. → { grupos: [{ email, nombre, telefono, tareas }], total } */
export function tareasEquipo(lista = [], evDe = () => ({}), { liga = '' } = {}) {
  const grupos = [];
  lista.filter(c => c && c.estadoComercial === 'activo' && c.estado?.evidencias?.completado).forEach(c => {
    const ev = evDe(c.email) || {};
    /* Certificado entregado: ya no hay nada que hacer. Portafolio ya enviado
       a la SEP: solo quedan las etapas del certificado. */
    if (ev.etapas?.entregado) return;
    const enviado = !!ev.etapas?.portafolio_sep;
    const r = siguientesPasos(c, ev);
    const tareas = [];
    if (!enviado) r.pendientes.forEach(p => {
      if (p.quien !== 'evaluador') return;
      const t = { clave: p.clave, titulo: p.titulo, ayuda: p.ayuda || '' };
      if (p.clave === 'portafolio_sep') t.accion = p.espera
        ? { tipo: 'abrir', href: hrefEvaluacion(c.email, 'etapas'), label: 'Ver etapas', espera: 'Primero paga la Entrega' }
        : { tipo: 'marcar', etapa: 'portafolio_sep', label: 'Marcar enviado' };
      else t.accion = { tipo: 'abrir', href: p.href || hrefEvaluacion(c.email, p.ir), label: 'Abrir' };
      tareas.push(t);
    });
    const delCandidato = r.pendientes.filter(p => p.quien === 'candidato').map(p => primeraMinuscula(p.titulo));
    const tel = telefonoWhatsApp(c.candidato?.telefonoCelular || c.telefono);
    if (delCandidato.length && !enviado) tareas.push({
      clave: 'recordar', titulo: 'Recordarle lo que le falta', ayuda: 'Le falta: ' + delCandidato.join('; ') + '.',
      accion: tel ? { tipo: 'whatsapp', label: 'Avisar por WhatsApp',
                      href: `https://wa.me/${tel}?text=${encodeURIComponent(mensajeRecordatorio(String(c.nombre || '').split(' ')[0], delCandidato, liga))}` }
                  : { tipo: 'abrir', href: hrefEvaluacion(c.email, ''), label: 'Ver qué le falta', espera: 'Sin celular registrado' } });
    /* Ya enviado a la SEP: la siguiente etapa del certificado */
    if (ev.etapas?.portafolio_sep) {
      const et = lineaDeTiempo({ evaluacion: ev, evidenciasHechas: true, entregaPagada: !!c.fases?.entrega }).etapas;
      const sig = et.find(e => ETAPAS_CERTIFICADO.includes(e.clave) && !e.hecha && !e.bloqueada);
      if (sig) tareas.push({ clave: sig.clave, titulo: sig.label, ayuda: '', accion: { tipo: 'marcar', etapa: sig.clave, label: 'Marcar hecho' } });
    }
    if (!tareas.length) return;
    tareas.forEach((t, i) => { t.siguiente = i === 0; t.despues = i > 0; });
    grupos.push({ email: c.email, nombre: c.nombre || c.email, telefono: tel, tareas });
  });
  grupos.sort((a, b) => String(a.nombre).localeCompare(String(b.nombre), 'es'));
  return { grupos, total: grupos.reduce((n, g) => n + g.tareas.length, 0) };
}

/* ── HTML ── */
export const CSS_QUE_SIGUE = `
.qs-l{list-style:none;margin:0;padding:0;display:grid;gap:6px}
.qs-p{display:grid;grid-template-columns:26px 1fr auto;gap:10px;align-items:center;padding:8px 10px;border:1px solid var(--border,#e2e8f0);border-radius:10px;background:var(--white,#fff)}
.qs-p.hecho{opacity:.62}.qs-p.sig{border-color:#f59e0b;background:#fffbeb}
.qs-i{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-weight:800;font-size:.8rem;background:#e2e8f0;color:#334155}
.qs-p.hecho .qs-i{background:#d1fae5;color:#047857}.qs-p.sig .qs-i{background:#f59e0b;color:#fff}
.qs-t b{display:block;font-size:.9rem}.qs-t small{color:var(--muted,#64748b);font-size:.8rem}
.qs-q{font-size:.72rem;font-weight:700;padding:2px 8px;border-radius:999px;background:#e0e7ff;color:#3730a3;margin-left:6px}
.qs-q.cand{background:#fef3c7;color:#92400e}
.qs-a{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}
.tq-g{border:1px solid var(--border,#e2e8f0);border-radius:12px;padding:10px 12px;margin-bottom:10px}
.tq-g h3{margin:0 0 6px;font-size:.95rem;display:flex;gap:8px;flex-wrap:wrap;align-items:baseline}
.tq-g h3 a{color:inherit}.tq-g h3 small{color:var(--muted,#64748b);font-weight:500}
.tq-t{display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap;padding:6px 0;border-top:1px dashed var(--border,#e2e8f0)}
.tq-t:first-of-type{border-top:0}.tq-t span{flex:1 1 220px;font-size:.88rem}.tq-t small{display:block;color:var(--muted,#64748b);font-size:.8rem}
.tq-esp{font-size:.78rem;color:#b45309;font-weight:600}
.tq-g details summary{cursor:pointer;font-size:.82rem;color:var(--muted,#64748b);margin-top:4px}
@media (max-width:560px){.qs-p{grid-template-columns:24px 1fr}.qs-a{grid-column:2;justify-content:flex-start}}
:root[data-tema="oscuro"] .qs-p,:root[data-tema="oscuro"] .tq-g{background:#0f172a;border-color:#334155}
:root[data-tema="oscuro"] .qs-p.sig{background:#2a1f05;border-color:#b45309}
`;

export function htmlQueSigue(r, { email = '', telefono = null, nombre = '', liga = '' } = {}) {
  const del = r.pendientes.filter(p => p.quien === 'candidato').map(p => primeraMinuscula(p.titulo));
  const wa = telefono && del.length ? `https://wa.me/${telefono}?text=${encodeURIComponent(mensajeRecordatorio(String(nombre).split(' ')[0], del, liga))}` : '';
  return `<p style="color:var(--muted);font-size:.84rem;margin:0 0 8px">${r.listo ? '<b style="color:#047857">Todo listo: el portafolio ya se envió.</b>'
      : `Faltan <b>${r.pendientes.length}</b> de ${r.pasos.length} pasos para entregar el portafolio. El resaltado es el que sigue.`}</p>
    <ul class="qs-l">${r.pasos.map(p => {
      const sig = r.siguiente && p.clave === r.siguiente.clave;
      const boton = p.hecho ? '' : p.quien === 'evaluador'
        ? (p.href ? `<a class="btn-a btn-a--sec" href="${esc(p.href)}">Abrir</a>` : p.ir ? `<button type="button" class="btn-a btn-a--sec" data-qs-ir="${esc(p.ir)}">Ir</button>` : '')
        : (wa ? `<a class="btn-a btn-a--sec" target="_blank" rel="noopener" href="${esc(wa)}">Recordarle</a>` : '');
      return `<li class="qs-p${p.hecho ? ' hecho' : ''}${sig ? ' sig' : ''}" data-qs="${esc(p.clave)}">
        <span class="qs-i" aria-hidden="true">${p.hecho ? '✓' : '·'}</span>
        <span class="qs-t"><b>${esc(p.titulo)}<span class="qs-q${p.quien === 'candidato' ? ' cand' : ''}">${p.quienLabel}</span></b>${p.ayuda && !p.hecho ? `<small>${esc(p.ayuda)}</small>` : ''}</span>
        <span class="qs-a">${boton}</span></li>`; }).join('')}</ul>`;
}

export function htmlTareas(t) {
  if (!t.grupos.length) return '<p style="color:var(--muted);font-size:.88rem;margin:0">Nada pendiente del equipo con quienes ya entregaron sus evidencias.</p>';
  const tarea = (x, email) => `<div class="tq-t"><span>${esc(x.titulo)}${x.ayuda ? `<small>${esc(x.ayuda)}</small>` : ''}</span>
    ${x.accion.tipo === 'marcar' ? `<button type="button" class="btn-a btn-a--pri" data-tq-marcar="${esc(x.accion.etapa)}" data-tq-email="${esc(email)}">${esc(x.accion.label)}</button>`
      : `<a class="btn-a ${x.siguiente ? 'btn-a--pri' : 'btn-a--sec'}" href="${esc(x.accion.href)}"${x.accion.tipo === 'whatsapp' ? ' target="_blank" rel="noopener"' : ''}>${esc(x.accion.label)}</a>`}
    ${x.accion.espera ? `<span class="tq-esp">${esc(x.accion.espera)}</span>` : ''}</div>`;
  return t.grupos.map(g => {
    const prim = g.tareas.filter(x => !x.despues), resto = g.tareas.filter(x => x.despues);
    return `<div class="tq-g"><h3><a href="${esc(hrefEvaluacion(g.email, ''))}">${esc(g.nombre)}</a><small>${g.tareas.length} ${g.tareas.length === 1 ? 'tarea' : 'tareas'}</small></h3>
      ${prim.map(x => tarea(x, g.email)).join('')}
      ${resto.length ? `<details><summary>Después (${resto.length})</summary>${resto.map(x => tarea(x, g.email)).join('')}</details>` : ''}</div>`;
  }).join('');
}
