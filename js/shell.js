/* ============================================================================
   POSTURALIA · Plataforma de Certificación
   shell.js — Menú lateral persistente

   Se inyecta solo: cada página lo único que hace es importarlo. Lee el estado
   real del flujo, así que el menú siempre refleja qué está completado, qué
   está disponible y qué sigue bloqueado.

   En pantallas angostas (≤900px) el menú se colapsa y se abre con el botón
   hamburguesa de la barra superior.
   ========================================================================== */

import { CONFIG } from './config.js';
import { Store }  from './store.js';
import { estadoDelFlujo, avanceGlobal, avancePorFase, siguientePaso,
         navegable, ESTADO } from './flow.js';
import { conectarConmutador, espejo, botonVolverAdmin } from './sesion.js';
import { alternarTema, etiquetaBoton } from './tema.js';
import { montarInstalador } from './instalar.js';
import { icono, iconoDe, ICONO_ESTADO as ICO_EST } from './iconos.js';
import { sesion, exigirSesion, cerrarSesion, iniciales, asegurarRol } from './cuenta.js';

/* El estado de cada módulo se dibuja con el set de iconos, no con emojis:
   🔒 y ⏳ se ven distintos en cada sistema y ⏳ ni siquiera tiene glifo en
   varias versiones de Windows, donde salía como un cuadro vacío junto a
   "Entrega" — lo que parecía un error de la plataforma, no un estado. */
const marcaEstado = e => icono(ICO_EST[e] || 'flecha', 15);

function docsPorEntregar(m) {
  const mod = CONFIG.flujo.find(x => x.id === m.id);
  if (!mod?.docs?.length) return 0;
  const g = Store.get(mod.id).documentos || {};
  return mod.docs.filter(k => { const v = g[k]; return !(Array.isArray(v) ? v.length : v); }).length;
}

const CLAVE_ABIERTO = 'shell.abierto';

/* Qué página está abierta ahora mismo */
/* Páginas que son parte de un paso: se marcan y se abren con él */
const PARTE_DE = { 'sesion.html': 'documentos.html', 'examen-formulario.html': 'examen.html' };
function archivoActual() {
  const p = location.pathname.split('/').pop() || 'index.html';
  return PARTE_DE[p] || p;
}

/* ── Marcado ──────────────────────────────────────────────────────────── */
function construir() {
  const flujo   = estadoDelFlujo();
  const actual  = archivoActual();
  const pct     = avanceGlobal();
  const sig     = siguientePaso();
  const hechos  = flujo.filter(m => m.estado === ESTADO.COMPLETADO).length;
  const listos  = flujo.filter(m => m.listo).length;

  const items = flujo.map(m => {
    const activo = m.archivo === actual;
    const clases = [
      'sh-item',
      `sh-item--${m.estado}`,
      activo ? 'sh-item--activo' : '',
    ].filter(Boolean).join(' ');

    /* Cuántos documentos le faltan entregar en ese paso (como el badge del
       menú de Paideia): se ve desde cualquier página, no solo al entrar. */
    const faltan = (m.estado === ESTADO.EN_CURSO || m.estado === ESTADO.DISPONIBLE) ? docsPorEntregar(m) : 0;
    const cuerpo = `
      <span class="sh-ico">${icono(iconoDe(m.id), 18)}</span>
      <span class="sh-nom">${m.nombre}</span>
      ${faltan ? `<span class="sh-pend" title="${faltan} documento${faltan > 1 ? 's' : ''} por entregar" aria-label="${faltan} documento${faltan > 1 ? 's' : ''} por entregar">${faltan}</span>` : ''}
      <span class="sh-est">${marcaEstado(m.estado)}</span>`;

    return navegable(m.estado)
      ? `<a class="${clases}" href="${m.archivo}" title="${m.motivo || ''}"
             ${activo ? 'aria-current="page"' : ''}>${cuerpo}</a>`
      : `<span class="${clases}" aria-disabled="true"
               title="${m.motivo || ''}">${cuerpo}</span>`;
  }).join('');

  /* El avance ponderado necesita mostrar su desglose: un 38% sin explicar
     parece inventado. Con las fases a la vista se entiende de dónde sale. */
  const fases = avancePorFase().map(f => `
    <div class="sh-fase">
      <span class="sh-fase-n">${f.label}</span>
      <span class="sh-fase-b"><i style="width:${f.pct}%"></i></span>
      <span class="sh-fase-p">${f.peso}%</span>
    </div>`).join('');

  /* El material de consulta no es un paso del proceso: se abre siempre, sin
     esperar al paso anterior ni a que se libere ninguna fase. */
  const consulta = (CONFIG.consulta || []).map(m => `
    <a class="sh-recurso ${m.archivo === actual ? 'sh-recurso--activo' : ''}"
       href="${m.archivo}" title="${m.desc || ''}"
       ${m.archivo === actual ? 'aria-current="page"' : ''}>
      <span class="sh-ico">${icono(iconoDe(m.id), 18)}</span>
      <span class="sh-nom">${m.nombre}</span>
    </a>`).join('');

  const esp = espejo();

  return `
    <div class="sh-marca">
      <a href="index.html">
        <strong>POSTURALIA</strong>
        <span>Certificación ${CONFIG.marca.estandar}</span>
      </a>
    </div>

    ${esp ? `<div class="sh-espejo">Expediente de <strong>${esp.nombre}</strong></div>` : ''}
    ${botonVolverAdmin()}

    <div class="sh-avance">
      <div class="sh-avance-txt">
        <span>${esp ? 'Su avance' : 'Tu avance'}</span><strong>${pct}%</strong>
      </div>
      <div class="sh-barra"><div class="sh-barra-fill" style="width:${pct}%"></div></div>
      <div class="sh-avance-sub">${hechos} de ${listos} módulos terminados · ponderado por fase</div>
    </div>

    <div class="sh-fases">${fases}</div>

    <nav class="sh-nav sh-nav--panel" aria-label="Panel">
      <a class="sh-item sh-item--panel ${actual === 'index.html' ? 'sh-item--activo' : ''}" href="index.html"
         ${actual === 'index.html' ? 'aria-current="page"' : ''}>
        <span class="sh-ico">${icono('casa', 18)}</span><span class="sh-nom">Panel</span><span class="sh-est"></span></a>
      <a class="sh-item sh-item--panel sh-item--cedula ${actual === 'cedula.html' ? 'sh-item--activo' : ''}" href="cedula.html"
         ${actual === 'cedula.html' ? 'aria-current="page"' : ''}>
        <span class="sh-ico">${icono('escudo', 18)}</span><span class="sh-nom">Mi Cédula</span><span class="sh-est"></span></a>
      <a class="sh-item sh-item--panel ${actual === 'portafolio.html' ? 'sh-item--activo' : ''}" href="portafolio.html"
         ${actual === 'portafolio.html' ? 'aria-current="page"' : ''}>
        <span class="sh-ico">${icono('archivo', 18)}</span><span class="sh-nom">Mi Portafolio</span><span class="sh-est"></span></a>
    </nav>

    <nav class="sh-nav" aria-label="Módulos del proceso">
      <div class="sh-nav-label">Tu proceso</div>
      ${items}
    </nav>

    <nav class="sh-nav sh-nav--consulta" aria-label="Recursos">
      <div class="sh-nav-label">Recursos</div>
      ${consulta}
    </nav>

    <div class="sh-pie">
      ${sig ? `<div class="sh-sig">Sigue: <strong>${sig.nombre}</strong></div>` : ''}
      <a class="sh-wa" href="https://wa.me/${CONFIG.marca.whatsapp}" target="_blank" rel="noopener">
        ${icono('mensaje', 17)} Dudas por WhatsApp
      </a>
      <button class="sh-tema" type="button" id="shTema">${etiquetaBoton()}</button>
      ${(() => { const s = sesion(); return s && !esp ? `
      <div class="sh-usuario"><span class="sh-avatar">${iniciales(s)}</span>
        <span class="sh-u-txt"><b>${(Store.get('candidato', {}).nombre || s.nombre || s.correo).replace(/[<>&"]/g, '')}</b><small>${s.correo.replace(/[<>&"]/g, '')}</small></span></div>
      <button class="sh-tema sh-salir" type="button" id="shSalir">${icono('flecha', 16)} Cerrar sesión</button>` : ''; })()}
      <a class="sh-instalar" href="#" id="shInstalar" data-visible="no">${icono('descarga', 17)} Instalar como app</a>
      <div class="sh-ciudad">${CONFIG.marca.ciudad}</div>
    </div>`;
}

/* ── «Ver cómo se hace» ───────────────────────────────────────────────────
   Como el botón del encabezado de Paideia: cada paso, cada recurso y el
   panel abren su tutorial en video encima de la página, sin salir de ella.
   Si el video no existe todavía, lleva a su guía escrita en Tutoriales. */
function enlaceTutorial() {
  const actual = archivoActual();
  const m = [...CONFIG.flujo, ...(CONFIG.consulta || [])].find(x => x.archivo === actual);
  const id = m ? m.id : (actual === 'index.html' || actual === '' ? 'general' : null);
  if (!id || id === 'recursos') return;
  let head = document.querySelector('[data-tuto-ancla]') || document.querySelector('.plat-head');
  /* El panel pinta su encabezado con innerHTML: el botón va en su propia
     franja, justo debajo, para que no se borre al repintar. */
  if (!head && document.getElementById('hero')) {
    if (document.getElementById('shTutoPanel')) return;
    head = document.createElement('div'); head.id = 'shTutoPanel'; head.style.cssText = 'margin:-6px 0 12px';
    document.getElementById('hero').insertAdjacentElement('afterend', head);
  }
  if (!head || head.querySelector('.sh-tuto')) return;
  const a = document.createElement('a');
  a.className = 'sh-tuto';
  a.href = `recursos.html#tuto-${id}`;
  a.dataset.tutorial = id;
  a.innerHTML = '▶ Ver cómo se hace';
  a.style.cssText = 'display:inline-block;margin-top:8px;font-size:.84rem;font-weight:600;color:var(--spoke-deep,#0f766e);text-decoration:none';
  a.addEventListener('click', async e => {
    /* preventDefault antes de cualquier await: después ya es tarde y el
       navegador sigue la liga. Ctrl/⌘ + clic sí abre Recursos aparte. */
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button) return;
    e.preventDefault();
    const { TUTORIALES, TUTORIALES_INFO } = await import('./data-medios.js');
    const ruta = TUTORIALES[id];
    if (!ruta) { location.href = a.href; return; }   // sin video: a la guía escrita
    const { abrirVideo } = await import('./videos.js');
    const info = TUTORIALES_INFO[id] || {};
    abrirVideo(ruta, { titulo: info.titulo || 'Tutorial', desc: info.desc || '', disparador: a });
  });
  head.appendChild(a);
}

/* ── Página bloqueada abierta por su dirección ─────────────────────────────
   El menú no deja entrar a un paso con candado, pero escribir la URL sí
   dejaba: el examen se podía presentar sin haber hecho la práctica. Ahora
   la página se tapa con el motivo y un camino de regreso. El evaluador en
   vista espejo (solo lectura) sí puede verla.                            */
/* ── Caja de pago (como Paideia) ──────────────────────────────────────────
   En los pasos de una fase que todavía no está pagada: cuánto, cómo pagar y
   a dónde mandar el comprobante. La fase la libera el Centro. */
function cajaDePago() {
  const m = [...CONFIG.flujo].find(x => x.archivo === archivoActual());
  if (!m || !m.fase || m.fase === 'registro' || document.getElementById('shPago')) return;
  import('./flow.js').then(async ({ faseAutorizada }) => {
    if (faseAutorizada(m.fase)) return;
    const head = document.querySelector('.plat-head'); if (!head || document.getElementById('shPago')) return;
    const { datosPago, montoPara, montarPago } = await import('./pagos.js');
    const cfg = await datosPago();
    const c = Store.get('candidato', {}) || {};
    const el = document.createElement('div'); el.id = 'shPago';
    head.after(el);
    montarPago(el, m.fase, cfg, { monto: montoPara(c.email || sesion()?.correo, m.fase, cfg), nombre: c.nombre || '' });
  }).catch(() => {});
}

function guardaDePagina() {
  if (Store.soloLectura) return;
  /* El equipo en "Ver como candidato" puede abrir cualquier paso para
     revisarlo (el bypass de administrador de Paideia). */
  const s = sesion();
  if (s?.rol === 'admin' || s?.rol === 'evaluador') return;
  const m = estadoDelFlujo().find(x => x.archivo === archivoActual());
  if (!m || m.estado !== ESTADO.BLOQUEADO) return;
  const sig = siguientePaso();
  const velo = document.createElement('div');
  velo.className = 'sh-guarda';
  velo.style.cssText = 'position:fixed;inset:0;z-index:50;display:grid;place-items:center;' +
    'background:rgba(15,23,42,.55);backdrop-filter:blur(3px);padding:16px';
  velo.innerHTML = `<div style="max-width:440px;background:var(--white,#fff);border-radius:16px;padding:26px;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,.25)">
    <div style="font-size:1.6rem;margin-bottom:6px">${icono('candado', 28)}</div>
    <h2 style="margin:0 0 8px;font-size:1.15rem">${m.nombre} todavía no está abierto</h2>
    <p style="color:var(--muted,#64748b);line-height:1.6;font-size:.92rem;margin:0 0 18px">${m.motivo || 'Se abre al terminar el paso anterior.'}</p>
    ${sig ? `<a class="btn-plat btn-plat--primario" href="${sig.archivo}">Ir a ${sig.nombre} →</a>` : ''}
    <div style="margin-top:12px"><a href="index.html" style="font-size:.86rem">Volver a mi panel</a></div></div>`;
  document.body.appendChild(velo);
}

/* ── Montaje ──────────────────────────────────────────────────────────── */
/* ── Acceso ───────────────────────────────────────────────────────────────
   Como en Paideia: el proceso del candidato pide correo y contraseña. El
   evaluador en modo espejo y quien ya tiene sesión (candidato o equipo en
   "Ver como candidato") pasan directo. El correo con el que entra se
   propone en sus datos generales si todavía no los captura. */
function exigirAcceso() {
  if (espejo()) return;
  exigirSesion().then(s => {
    const c = Store.get('candidato', {}) || {};
    if (!c.email && s?.correo && !Store.soloLectura) Store.merge('candidato', { email: s.correo });
    refrescarShell();
    /* Si su correo es del equipo (lista central o de este navegador), la
       sesión toma su rol y aparece «Volver al panel de administrador». */
    asegurarRol().then(cambio => { if (cambio) refrescarShell(); }).catch(() => {});
    traerMiAvance();
  });
}

/* ── Con Supabase: su avance y sus fases desde la nube (v43) ─────────────
   Store.sincronizar() existía pero ninguna página lo llamaba: en otro
   dispositivo el candidato no veía su avance, y las fases que el Centro le
   liberaba (tabla autorizaciones) nunca le llegaban. Se llama al abrir cada
   página; si bajó algo, se recarga una sola vez para pintarlo, salvo que ya
   esté escribiendo. */
async function traerMiAvance() {
  if (Store.esLocal || Store.soloLectura) return;
  const r = await Store.sincronizar().catch(() => null);
  if (!r?.ok || !r.bajados?.length) return;
  refrescarShell();
  const clave = 'posturalia.recarga.' + location.pathname;
  let reciente = false; try { reciente = Date.now() - Number(sessionStorage.getItem(clave) || 0) < 15000; } catch {}
  const escribiendo = document.activeElement && document.activeElement !== document.body;
  if (performance.now() < 6000 && !escribiendo && !reciente) {
    try { sessionStorage.setItem(clave, String(Date.now())); } catch {}
    location.reload();
  }
}

export function montarShell() {
  if (document.getElementById('shell')) return;
  exigirAcceso();

  document.body.classList.add('con-shell');

  const aside = document.createElement('aside');
  aside.id = 'shell';
  aside.className = 'shell';
  aside.innerHTML = construir();
  document.body.prepend(aside);
  conectarConmutador(aside);

  aside.addEventListener('click', async e => {
    if (e.target.closest('#shSalir')) {
      if (!confirm('¿Cerrar sesión en este dispositivo? Tu avance se queda guardado.')) return;
      await cerrarSesion(); location.href = 'index.html'; return;
    }
    if (!e.target.closest('#shTema')) return;
    alternarTema();
    refrescarShell();
  });

  montarInstalador(document.getElementById('shInstalar'));
  enlaceTutorial();
  guardaDePagina();
  cajaDePago();

  const velo = document.createElement('div');
  velo.className = 'shell-velo';
  velo.hidden = true;
  document.body.prepend(velo);

  // Botón hamburguesa en la barra superior existente
  const top = document.querySelector('.plat-top-inner');
  if (top) {
    const btn = document.createElement('button');
    btn.className = 'shell-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Abrir el menú de módulos');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span></span><span></span><span></span>';
    top.prepend(btn);

    const cerrar = () => {
      aside.classList.remove('abierto');
      velo.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    };
    const abrir = () => {
      aside.classList.add('abierto');
      velo.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
    };

    btn.onclick = () => aside.classList.contains('abierto') ? cerrar() : abrir();
    velo.onclick = cerrar;
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && aside.classList.contains('abierto')) cerrar();
    });
  }
}

/* Vuelve a pintar el menú: se llama cuando un módulo cambia de estado */
export function refrescarShell() {
  const aside = document.getElementById('shell');
  if (!aside) return;
  aside.innerHTML = construir();
  /* Repintar tira el botón de instalar con su escucha: se vuelve a conectar.
     Sin esto, el botón desaparecía en cuanto el candidato completaba un
     módulo, porque el menú se redibuja con cada cambio de estado. */
  montarInstalador(document.getElementById('shInstalar'));
}

/* El avance del menú se recalcula cuando cambian los datos (cada respuesta
   del autodiagnóstico, cada reactivo de la práctica…), no solo al recargar.
   Con pausa corta para no redibujar en cada tecla. */
let _repinta = null;
const repintarPronto = () => { clearTimeout(_repinta); _repinta = setTimeout(refrescarShell, 350); };
window.addEventListener('store:cambio', repintarPronto);
window.addEventListener('flujo:cambio', repintarPronto);

/* Se monta solo al importar */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', montarShell);
} else {
  montarShell();
}
