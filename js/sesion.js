/* ============================================================================
   POSTURALIA · Plataforma de Certificación
   sesion.js — Quién está usando la plataforma ahora mismo

   La plataforma tiene dos caras: la del candidato, que hace su proceso, y la
   del Centro Evaluador, que lo supervisa. Antes se cambiaba de una a otra con
   un enlace al pie de la página, y quien entraba por primera vez no tenía
   forma de saber que la otra existía.

   Aquí vive el rol actual, el conmutador visible que va en las dos barras
   laterales, y el modo espejo.

   ── Modo espejo ───────────────────────────────────────────────────────────
   El evaluador abre el expediente de un candidato y recorre la plataforma
   exactamente como la ve esa persona: su avance, sus respuestas, lo que
   tiene bloqueado. En SOLO LECTURA.

   La lectura sale del respaldo que el candidato subió, no del navegador del
   evaluador, y toda escritura se ignora mientras el espejo está encendido.
   Sin esa restricción, el evaluador contestaría el examen del candidato sin
   darse cuenta y quedaría guardado como si lo hubiera hecho él.
   ========================================================================== */

import { icono } from './iconos.js';
import { esc } from './seguro.js';
import { sesion as sesionCuenta } from './cuenta.js';

export const ROL = {
  CANDIDATO:  'candidato',
  EVALUADOR:  'evaluador',
};

const CLAVE_ROL    = 'posturalia.sesion.rol';
const CLAVE_ESPEJO = 'posturalia.sesion.espejo';

/* ── Rol ────────────────────────────────────────────────────────────────── */

export function rolActual() {
  try {
    const r = localStorage.getItem(CLAVE_ROL);
    if (r === ROL.EVALUADOR || r === ROL.CANDIDATO) return r;
  } catch {}
  return ROL.CANDIDATO;
}

export function fijarRol(rol) {
  try { localStorage.setItem(CLAVE_ROL, rol); } catch {}
  if (rol === ROL.EVALUADOR) { try { localStorage.setItem('posturalia.sesion.admin', '1'); } catch {} }
  if (rol === ROL.CANDIDATO) apagarEspejo();
}

export const esEvaluador = () => rolActual() === ROL.EVALUADOR;

/* ¿Ya eligió alguna vez? Sirve para decidir si mostramos la portada de
   bienvenida o lo mandamos directo a donde estaba. */
export function rolElegido() {
  try { return !!localStorage.getItem(CLAVE_ROL); } catch { return false; }
}

/* ── Espejo ─────────────────────────────────────────────────────────────── */

export function espejo() {
  try {
    const crudo = sessionStorage.getItem(CLAVE_ESPEJO);
    return crudo ? JSON.parse(crudo) : null;
  } catch { return null; }
}

export const enEspejo = () => !!espejo();

/* Enciende el espejo sobre un expediente ya cargado en el panel.

   Vive en sessionStorage, no en localStorage: si el evaluador cierra la
   pestaña, el espejo se apaga solo. Dejarlo persistente haría que abriera la
   plataforma al día siguiente viendo el expediente de otra persona sin
   acordarse de por qué.                                                     */
export function encenderEspejo(expediente) {
  if (!expediente) return false;

  const modulos = {};
  Object.entries(expediente.estado || {}).forEach(([id, e]) => {
    if (e?.datos) modulos[id] = e.datos;
  });

  const carga = {
    id:        expediente.id || '',
    nombre:    expediente.nombre || 'Candidato',
    correo:    expediente.correo || expediente.email || '',
    respaldadoEl: expediente.respaldadoEl || '',
    autorizaciones: expediente.autorizaciones || {},
    modulos,
  };

  try {
    sessionStorage.setItem(CLAVE_ESPEJO, JSON.stringify(carga));
    return true;
  } catch { return false; }
}

export function apagarEspejo() {
  try { sessionStorage.removeItem(CLAVE_ESPEJO); } catch {}
}

/* ── Cambio de vista (como Paideia) ───────────────────────────────────────
   Antes había un conmutador Candidato | Evaluador en las dos barras. Paideia
   lo resuelve con dos botones que solo ve el equipo:
     · en la vista del candidato, al pie: «Volver al panel de administrador»;
     · en el panel del equipo, en VISTAS: «Ver como candidato».
   Un candidato normal no ve ninguno de los dos: no tiene por qué saber que
   existe un panel de administración.                                       */
const CLAVE_ADMIN = 'posturalia.sesion.admin';

export function esAdmin() {
  /* Con cuenta: manda el rol de la sesión. Sin cuenta (versiones previas):
     la marca de que ya entró al panel en este navegador. */
  /* Con cuenta manda SOLO el rol de la sesión, que asegurarRol() revisa
     contra la nube en cada entrada (9 oct). Antes también valía el equipo
     local de este navegador, y una cuenta de candidato se colaba. */
  const s = sesionCuenta();
  if (s) return s.rol === 'admin';
  try { return localStorage.getItem(CLAVE_ADMIN) === '1'; } catch { return false; }
}
export function marcarAdmin() {
  try { localStorage.setItem(CLAVE_ADMIN, '1'); } catch {}
}

/* Se conserva por compatibilidad: ya no pinta el conmutador. */
export function marcaConmutador() { return ''; }

export function botonVolverAdmin() {
  if (enEspejo() || !esAdmin()) return '';
  return `<a class="sh-admin" href="admin.html" data-rol="${ROL.EVALUADOR}">
    ${icono('escudo', 17)}<span>Volver al panel de administrador</span></a>`;
}

export function botonVerComoCandidato(clase = 'ash-item') {
  return `<a class="${clase}" href="index.html" data-rol="${ROL.CANDIDATO}">
    <span class="ash-ico">${icono('ojo', 18)}</span><span class="ash-nom">Ver como candidato</span></a>`;
}

/* Conecta los botones de cambio de vista dentro de un contenedor montado */
export function conectarConmutador(contenedor) {
  if (!contenedor) return;
  contenedor.addEventListener('click', e => {
    const a = e.target.closest('[data-rol]');
    if (!a) return;
    e.preventDefault();
    const destino = a.dataset.rol;
    if (destino === ROL.EVALUADOR) marcarAdmin();
    fijarRol(destino);
    location.href = destino === ROL.EVALUADOR ? 'admin.html' : 'index.html';
  });
}

/* ── Cinta de espejo ──────────────────────────────────────────────────────
   Una franja fija arriba de todo. Tiene que estorbar: el evaluador debe
   saber en todo momento que lo que ve no es suyo y que no puede escribirlo. */

export function montarCintaEspejo() {
  const e = espejo();
  if (!e || document.getElementById('cintaEspejo')) return;

  const cinta = document.createElement('div');
  cinta.id = 'cintaEspejo';
  cinta.className = 'cinta-espejo';
  cinta.innerHTML = `
    <span class="ce-ico">${icono('escudo', 16)}</span>
    <span class="ce-txt">
      Estás viendo el proceso de <strong>${esc(e.nombre)}</strong> tal como lo ve
      ${e.correo ? `<span class="ce-mail">${esc(e.correo)}</span>` : ''}
      <span class="ce-ro">solo lectura</span>
    </span>
    <button type="button" class="ce-salir" id="ceSalir">Salir del espejo</button>`;
  document.body.prepend(cinta);
  document.body.classList.add('con-cinta');

  document.getElementById('ceSalir').onclick = () => {
    apagarEspejo();
    location.href = 'admin-candidatos.html';
  };
}

/* Se monta sola en cuanto la importa cualquier página del candidato */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', montarCintaEspejo);
} else {
  montarCintaEspejo();
}
