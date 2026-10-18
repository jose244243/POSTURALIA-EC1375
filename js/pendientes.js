/* ============================================================================
   POSTURALIA · pendientes.js — Lo que le toca corregir al candidato (v65)

   Como el panel de Paideia (12-13 oct): arriba del panel, «Tu portafolio
   tiene N pendientes», con lo que el portafolio marcaría como faltante y
   SOLO el candidato puede resolver, en el orden de su ruta y con un botón a
   la página donde se arregla. Lo del Centro (IEC, Verificación Interna,
   firmas del evaluador, fechas) no va aquí.

   Solo se piden pasos que ya pasó: un paso cuenta cuando ya hay algo de un
   paso posterior, ya generó algo en él, o ya tiene su Cédula publicada. Así
   a quien apenas empieza no se le llena el panel de avisos.

   La lista sale de estadoPortafolio (portafolio-avance.js): es la misma que
   ven «Mi portafolio» y la tarjeta de Portafolio del Centro. Aquí no se
   inventa ninguna regla nueva, salvo la pregunta 4 de la Encuesta, que va al
   revés (si no lo condicionaron a tomar un curso, la respuesta correcta es
   «Totalmente en desacuerdo»).
   ========================================================================== */
import { CONFIG } from './config.js';
import { esc } from './seguro.js';
import { Store } from './store.js';
import { leerRespaldo } from './expediente.js';
import { estadoPortafolio } from './portafolio-avance.js';
import { cedulaPublicada } from './evaluacion.js';
import { ENCUESTA } from './data-portafolio.js';

export const RUTA = ['autodiagnostico', 'plan', 'documentos', 'encuesta', 'evidencias'];
export const PREGUNTA_CURSO = ENCUESTA.preguntas.findIndex(p => /condicionad/i.test(p));
export const RESPUESTA_CURSO = ENCUESTA.escala.indexOf('Totalmente en desacuerdo');

const vacio = o => !o || typeof o !== 'object' || !Object.keys(o).length;
const idDe = p => !p ? null : p.archivo === 'cedula.html' ? 'cedula'
  : ([...CONFIG.flujo, ...(CONFIG.consulta || [])].find(f => f.archivo === p.archivo)?.id || null);

/* x: expediente (leerRespaldo); ev: lo que el candidato ve de su evaluación.
   → [{ clave, texto, pagina, paginaLabel }] */
export function pendientesCandidato(x = {}, ev = {}) {
  ev = ev || {};
  const ced = cedulaPublicada(ev);
  const datos = m => x?.estado?.[m]?.datos || {};
  const hay = m => !vacio(datos(m)) || x?.estado?.[m]?.estado === 'completado';
  const genero = m => {
    const d = datos(m);
    return !!(d.completado || d.sesionGenerada || d.triptico?.firma || !vacio(d.documentos));
  };
  const pasado = m => !!ced || genero(m) || RUTA.slice(RUTA.indexOf(m) + 1).some(hay);
  const items = estadoPortafolio(x, ev).items.filter(i => i.estado === 'falta' && i.quien === 'tú' && i.paso);
  const out = [];
  const poner = (m, i) => out.push({ clave: i.titulo, texto: `${i.titulo}: ${i.detalle}`, pagina: i.paso.archivo, paginaLabel: i.paso.nombre });
  RUTA.forEach(m => {
    if (!pasado(m)) return;
    items.filter(i => idDe(i.paso) === m).forEach(i => poner(m, i));
    if (m === 'encuesta' && PREGUNTA_CURSO >= 0 && RESPUESTA_CURSO >= 0) {
      const r = datos('encuesta').respuestas || {};
      const v = r[PREGUNTA_CURSO];
      if (v !== undefined && v !== null && v !== '' && Number(v) !== RESPUESTA_CURSO) {
        const mod = CONFIG.flujo.find(f => f.id === 'encuesta');
        out.push({ clave: 'pregunta_curso', pagina: mod?.archivo || 'encuesta.html', paginaLabel: mod?.nombre || 'Encuesta de Satisfacción',
          texto: `Revisa la pregunta ${PREGUNTA_CURSO + 1} de tu Encuesta («${ENCUESTA.preguntas[PREGUNTA_CURSO]}»): contestaste «${ENCUESTA.escala[Number(v)] || v}». Va al revés: si no te condicionaron, la respuesta es «${ENCUESTA.escala[RESPUESTA_CURSO]}»` });
      }
    }
  });
  items.filter(i => idDe(i.paso) === 'cedula').forEach(i => poner('cedula', i));
  return out;
}

const CSS = `
.pend{border:1.5px solid #f59e0b;background:#fffbeb;border-radius:14px;padding:16px 18px;margin:0 0 16px}
.pend-t{display:block;font-size:1.02rem;color:#92400e}
.pend p{margin:4px 0 12px;color:#78350f;font-size:.9rem}
.pend ol{margin:0;padding-left:22px;display:grid;gap:10px}
.pend li{padding-left:2px}
.pend-li{display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap}
.pend-li span{flex:1 1 220px;font-size:.92rem;color:#1f2937;line-height:1.45}
.pend-li a{white-space:nowrap}
:root[data-tema="oscuro"] .pend{background:#2a1f05;border-color:#b45309}
:root[data-tema="oscuro"] .pend-t{color:#fbbf24}
:root[data-tema="oscuro"] .pend p{color:#fcd34d}
:root[data-tema="oscuro"] .pend-li span{color:#e5e7eb}
`;

export function htmlPendientes(lista) {
  if (!lista?.length) return '';
  const n = lista.length;
  return `<section class="pend" role="region" aria-label="Pendientes de tu portafolio">
    <strong class="pend-t">Tu portafolio tiene ${n} ${n === 1 ? 'pendiente' : 'pendientes'}</strong>
    <p>Resuélvelos en este orden para que tu portafolio salga sin errores.</p>
    <ol>${lista.map(p => `<li><div class="pend-li"><span>${esc(p.texto)}.</span><a class="btn-plat btn-plat--secundario" href="${esc(p.pagina)}">Ir a ${esc(p.paginaLabel)}</a></div></li>`).join('')}</ol>
  </section>`;
}

let turno = 0;
export async function montarPendientes(el) {
  if (!el) return;
  const mio = ++turno;
  if (!document.getElementById('pendCss')) {
    const st = document.createElement('style'); st.id = 'pendCss'; st.textContent = CSS; document.head.appendChild(st);
  }
  let x = null, ev = {};
  try { const r = leerRespaldo(JSON.stringify(Store.exportar()), 'mi-avance.json'); x = r.ok ? r.expediente : null; } catch { x = null; }
  if (!x) { el.innerHTML = ''; return; }
  try { ev = (await (await import('./resultado.js')).miEvaluacion()) || {}; } catch { ev = {}; }
  if (mio !== turno) return;
  el.innerHTML = htmlPendientes(pendientesCandidato(x, ev));
}
