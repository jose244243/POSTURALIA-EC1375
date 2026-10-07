/* ============================================================================
   POSTURALIA · Panel del Centro Evaluador
   admin-shell.js — Menú lateral del panel

   Mismas seis secciones que el CRM de Paideia, con sus mismas etiquetas, para
   que quien use los dos sistemas no tenga que reaprender dónde está cada cosa.
   ========================================================================== */

import { CONFIG } from './config.js';
import { cargar, candidatos, contables, kpis } from './admin-data.js';
import { conectarConmutador, botonVerComoCandidato, marcarAdmin, apagarEspejo } from './sesion.js';
import { alternarTema, etiquetaBoton } from './tema.js';
import { montarInstalador } from './instalar.js';
import { icono, iconoDe } from './iconos.js';
import { sesion, exigirSesion, cerrarSesion, iniciales } from './cuenta.js';

/* Páginas que el rol evaluador sí puede abrir (como en Paideia: Candidatos
   y la evaluación; nada de dinero). */
export const PAGINAS_EVALUADOR = ['admin-candidatos.html', 'admin-evaluacion.html', 'admin-iec.html'];

export const SECCIONES = [
  { id: 'panel',      label: 'Panel del equipo',      archivo: 'admin.html',           ico: 'tablero'    },
  { id: 'candidatos', label: 'Candidatos',            archivo: 'admin-candidatos.html',ico: 'usuarios', evaluador: true },
  { id: 'iec',        label: 'Calificar el IEC',      archivo: 'admin-iec.html',       ico: 'chequeCaja', evaluador: true },
  { id: 'precios',    label: 'Precios y pagos',       archivo: 'admin-precios.html',   ico: 'dinero'     },
  { id: 'sesiones',   label: 'Sesiones de Alineación',archivo: 'admin-sesiones.html',  ico: 'video'      },
  { id: 'kpis',       label: 'KPIs',                  archivo: 'admin-kpis.html',      ico: 'grafica'    },
  { id: 'utilidades', label: 'Utilidades',            archivo: 'admin-utilidades.html',ico: 'archivo'    },
];

function archivoActual() {
  return location.pathname.split('/').pop() || 'admin.html';
}

function construir() {
  const actual = archivoActual();
  const datos = cargar();
  const n = contables(candidatos(datos)).length;
  const k = kpis(datos);

  const ses = sesion();
  const esEvaluador = ses?.rol === 'evaluador';
  const items = SECCIONES.filter(s => !esEvaluador || s.evaluador).map(s => {
    const activo = s.archivo === actual;
    const insignia = s.id === 'candidatos' && n ? `<span class="ash-badge">${n}</span>` : '';
    return `<a class="ash-item ${activo ? 'ash-item--activo' : ''}" href="${s.archivo}"
               ${activo ? 'aria-current="page"' : ''}>
      <span class="ash-ico">${icono(s.ico, 18)}</span>
      <span class="ash-nom">${s.label}</span>
      ${insignia}
    </a>`;
  }).join('');

  /* Recursos, como en el CRM de Paideia: Biblioteca, Guion Maestro y
     Tutoriales y toolkit, a la mano desde el panel (antes solo estaban en
     la vista del candidato y en el índice al fondo del Panel del equipo).
     Son las mismas páginas que ve el candidato; se abren sin candado. */
  const recursos = (CONFIG.consulta || []).map(m => `
    <a class="ash-item" href="${m.archivo}" title="${m.desc || ''}">
      <span class="ash-ico">${icono(iconoDe(m.id), 18)}</span>
      <span class="ash-nom">${m.nombre}</span>
    </a>`).join('');

  return `
    <div class="ash-marca">
      <a href="admin.html">
        <strong>POSTURALIA</strong>
        <span>Centro Evaluador · ${CONFIG.marca.estandar}</span>
      </a>
    </div>

    ${esEvaluador ? '' : `<nav class="ash-nav ash-nav--vistas" aria-label="Vistas">
      <div class="ash-nav-label">Vistas</div>
      ${botonVerComoCandidato()}
    </nav>`}

    <div class="ash-resumen" ${esEvaluador ? 'hidden' : ''}>
      <div class="ash-res-fila"><span>Candidatos</span><strong>${n}</strong></div>
      <div class="ash-res-fila"><span>Certificados</span><strong>${k.completados}</strong></div>
    </div>

    <nav class="ash-nav" aria-label="Secciones del panel">
      <div class="ash-nav-label">Operación</div>
      ${items}
    </nav>

    <nav class="ash-nav ash-nav--recursos" aria-label="Recursos">
      <div class="ash-nav-label">Recursos</div>
      ${recursos}
    </nav>

    <div class="ash-pie">
      ${ses ? `<div class="sh-usuario" style="border-top:0;margin:0 0 10px;padding:0"><span class="sh-avatar">${iniciales(ses)}</span>
        <span class="sh-u-txt"><b>${(ses.nombre || ses.correo).replace(/[<>&"]/g, '')}</b><small>${ses.rol === 'admin' ? 'Administrador' : 'Evaluador'} · ${ses.correo.replace(/[<>&"]/g, '')}</small></span></div>` : ''}
      <button class="ash-tema" type="button" id="ashTema">${etiquetaBoton()}</button>
      ${ses ? '<button class="ash-tema" type="button" id="ashSalir">Cerrar sesión</button>' : ''}
      <a class="ash-tema" href="#" id="ashInstalar" data-visible="no">${icono('descarga', 17)} Instalar como app</a>
      <div class="ash-ciudad">${CONFIG.marca.ciudad}</div>
    </div>`;
}

/* El tema vive en js/tema.js y lo comparten las dos vistas: el candidato
   también puede ponerse en oscuro. Antes cada barra llevaba su propia copia
   con su propia clave, así que cambiarlo en el panel no cambiaba nada del
   otro lado y volvías a blanco al cruzar. */

/* Acceso del equipo: correo y contraseña con rol. El evaluador que abre una
   página de dinero por su dirección va a Candidatos. */
function exigirAccesoEquipo() {
  const pagina = location.pathname.split('/').pop() || 'admin.html';
  const permitirEvaluador = PAGINAS_EVALUADOR.includes(pagina);
  const s = sesion();
  if (s?.rol === 'evaluador' && !permitirEvaluador) { location.replace('admin-candidatos.html'); return; }
  exigirSesion({ equipo: true, permitirEvaluador }).then(s2 => {
    if (s2?.rol === 'evaluador' && !permitirEvaluador) { location.replace('admin-candidatos.html'); return; }
    if (s2?.rol === 'admin') marcarAdmin();   // verá «Volver al panel de administrador» en la vista del candidato
    refrescarAdminShell();
    traerDeLaNube();
    vigilarNube();
  });
}

/* ── Como el «realtime» de Paideia: mientras el panel está abierto, vuelve a
   preguntarle a la nube cada 2 minutos y al regresar a la pestaña (si pasó
   más de un minuto). Nunca recarga encima de lo que estás capturando: si
   llegó algo nuevo, avisa con «Ver». */
let vigilando = false, ultimaVuelta = Date.now();
async function vigilarNube() {
  if (vigilando) return;
  const { CONFIG } = await import('./config.js');
  if (!(CONFIG.supabase?.url && CONFIG.supabase?.anonKey)) return;
  vigilando = true;
  const vuelta = () => {
    if (document.hidden || Date.now() - ultimaVuelta < 60000) return;
    /* Si está tecleando, se espera a la siguiente vuelta: traer datos nuevos
       vuelve a pintar la página y se perdería lo que lleva escrito. */
    if (document.activeElement?.matches?.('input, textarea, select, [contenteditable]')) return;
    ultimaVuelta = Date.now();
    traerDeLaNube({ soloAviso: true });
  };
  setInterval(vuelta, 120000);
  document.addEventListener('visibilitychange', vuelta);
}

/* ── Con Supabase: lo que capturaron los otros socios y los candidatos que
   se registraron solos (v43). Si llega algo nuevo en cuanto abre la página,
   se recarga una vez para pintarlo; si ya estaba trabajando, se le avisa
   en vez de recargarle encima de lo que teclea. */
async function traerDeLaNube({ soloAviso = false } = {}) {
  const { CONFIG } = await import('./config.js');
  if (!(CONFIG.supabase?.url && CONFIG.supabase?.anonKey)) return;
  const { sincronizarCentro } = await import('./admin-data.js');
  const r = await sincronizarCentro().catch(e => ({ ok: false, motivo: e.message }));
  /* En las vueltas de fondo, un corte de red no merece aviso: se reintenta */
  if (soloAviso) { if (r.ok && r.cambios) avisoNube('Llegaron datos nuevos de la nube.', true); return; }
  if (!r.ok) return avisoNube(`No se pudo traer lo de la nube (${r.motivo || 'sin conexión'}). Lo que captures se guarda aquí y sube al volver la conexión.`);
  if (!r.cambios) return;
  const clave = 'posturalia.centro.recarga.' + location.pathname;
  let reciente = false; try { reciente = Date.now() - Number(sessionStorage.getItem(clave) || 0) < 15000; } catch {}
  const escribiendo = document.activeElement && document.activeElement !== document.body;
  if (performance.now() < 6000 && !escribiendo && !reciente) {
    try { sessionStorage.setItem(clave, String(Date.now())); } catch {}
    location.reload();
  } else avisoNube('Llegaron datos nuevos de la nube.', true);
}
function avisoNube(texto, conBoton = false) {
  let a = document.getElementById('avisoNube');
  if (!a) { a = document.createElement('div'); a.id = 'avisoNube'; a.setAttribute('role', 'status');
    a.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:500;max-width:360px;background:#0d2a6e;color:#fff;padding:12px 14px;border-radius:12px;font-size:.85rem;box-shadow:0 12px 30px rgba(0,0,0,.2)';
    document.body.appendChild(a); }
  a.innerHTML = `${texto}${conBoton ? ' <button type="button" style="margin-left:8px;background:#fff;color:#0d2a6e;border:0;border-radius:8px;padding:4px 10px;font-weight:700;cursor:pointer">Ver</button>' : ''}`;
  a.querySelector('button')?.addEventListener('click', () => location.reload());
}
window.addEventListener('centro:nube', e => {
  if (!e.detail?.ok) avisoNube(`${e.detail?.pendientes || 'Algunos'} cambio(s) no subieron a la nube (${e.detail?.motivo || 'sin conexión'}). Se reintentan solos al abrir el panel.`);
});

export function montarAdminShell() {
  if (document.getElementById('ashell')) return;
  exigirAccesoEquipo();
  document.body.classList.add('con-ashell');

  const aside = document.createElement('aside');
  aside.id = 'ashell';
  aside.className = 'ashell';
  aside.innerHTML = construir();
  document.body.prepend(aside);
  conectarConmutador(aside);
  montarInstalador(document.getElementById('ashInstalar'));

  const velo = document.createElement('div');
  velo.className = 'ashell-velo';
  velo.hidden = true;
  document.body.prepend(velo);

  aside.addEventListener('click', e => {
    if (e.target.closest('#ashSalir')) {
      if (!confirm('¿Cerrar sesión del panel en este dispositivo?')) return;
      cerrarSesion().then(() => location.reload()); return;
    }
    if (!e.target.closest('#ashTema')) return;
    alternarTema();
    refrescarAdminShell();
  });

  const barra = document.querySelector('.ad-top-in');
  if (barra) {
    const btn = document.createElement('button');
    btn.className = 'ashell-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Abrir el menú del panel');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span></span><span></span><span></span>';
    barra.prepend(btn);

    const cerrar = () => { aside.classList.remove('abierto'); velo.hidden = true; btn.setAttribute('aria-expanded','false'); };
    const abrir  = () => { aside.classList.add('abierto');    velo.hidden = false; btn.setAttribute('aria-expanded','true'); };
    btn.onclick = () => aside.classList.contains('abierto') ? cerrar() : abrir();
    velo.onclick = cerrar;
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && aside.classList.contains('abierto')) cerrar();
    });
  }
}

export function refrescarAdminShell() {
  const a = document.getElementById('ashell');
  if (!a) return;
  a.innerHTML = construir();
  montarInstalador(document.getElementById('ashInstalar'));
}

window.addEventListener('admin:cambio', refrescarAdminShell);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', montarAdminShell);
} else {
  montarAdminShell();
}
