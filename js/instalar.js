/* ============================================================================
   POSTURALIA · Plataforma de Certificación
   instalar.js — Registro del service worker e instalación como aplicación

   Instalada, la plataforma abre desde el escritorio o la pantalla de inicio
   sin barra del navegador, y funciona sin internet. Eso último es lo que
   resuelve el problema real: la Alineación se da en un salón donde la señal
   se cae, y el candidato pierde la pantalla a medio módulo.

   ── Sobre el botón ────────────────────────────────────────────────────────
   Chrome y Edge avisan cuándo se puede instalar con `beforeinstallprompt`, y
   ahí el botón aparece solo. Safari nunca dispara ese evento: en iPhone y
   iPad hay que ir a Compartir → Añadir a pantalla de inicio, a mano. Por eso
   el botón detecta el caso y explica los pasos en vez de quedarse mudo, que
   es lo que hacía antes de esto.
   ========================================================================== */

let promesaInstalacion = null;

/* Los botones registrados, para refrescarlos todos cuando cambie el estado.

   El evento `beforeinstallprompt` se dispara UNA vez y muy temprano. Si cada
   llamada a montarInstalador() pusiera su propia escucha, la segunda llegaría
   tarde al evento y nunca vería nada — y además se irían acumulando escuchas
   cada vez que el menú lateral se repinta, que es en cada cambio de estado.
   Por eso se escucha una sola vez, aquí, y los botones se apuntan a una lista. */
const botones = new Set();

/* ── Registro del service worker ──────────────────────────────────────────
   Va con ruta relativa para que funcione igual servido desde la raíz del
   dominio o desde una subcarpeta.

   Solo en http(s): abierto con doble clic (file://) el navegador no permite
   service workers, y el error en consola hace pensar que algo se rompió.   */
export async function registrarSW() {
  if (!('serviceWorker' in navigator)) return null;
  if (!location.protocol.startsWith('http')) return null;

  try {
    const reg = await navigator.serviceWorker.register('sw.js', { scope: './' });

    /* Si ya hay una versión nueva esperando, se avisa. Recargar sin avisar le
       borraría al candidato el reactivo que está contestando. */
    reg.addEventListener('updatefound', () => {
      const nuevo = reg.installing;
      if (!nuevo) return;
      nuevo.addEventListener('statechange', () => {
        if (nuevo.state === 'installed' && navigator.serviceWorker.controller) {
          avisarActualizacion(reg);
        }
      });
    });

    return reg;
  } catch {
    return null;   // sin app instalable, pero la plataforma sigue funcionando
  }
}

/* ── Aviso de versión nueva ─────────────────────────────────────────────── */
function avisarActualizacion(reg) {
  if (document.getElementById('avisoAct')) return;

  const barra = document.createElement('div');
  barra.id = 'avisoAct';
  barra.className = 'aviso-act';
  barra.innerHTML = `
    <span>Hay una versión nueva de la plataforma.</span>
    <button type="button" id="actAhora">Actualizar</button>
    <button type="button" id="actDespues" aria-label="Cerrar el aviso">✕</button>`;
  document.body.appendChild(barra);

  /* El service worker nuevo puede haber tomado el control ya (se instala
     con skipWaiting): entonces no hay nadie "esperando" y el botón no hacía
     nada. Si hay uno esperando se le pide pasar; si no, basta recargar. */
  document.getElementById('actAhora').onclick = () => {
    if (reg.waiting) {
      navigator.serviceWorker.addEventListener('controllerchange',
        () => location.reload(), { once: true });
      reg.waiting.postMessage('saltar-espera');
    } else {
      location.reload();
    }
  };
  document.getElementById('actDespues').onclick = () => barra.remove();
}

/* ── ¿Ya está instalada? ────────────────────────────────────────────────── */
export const yaInstalada = () =>
  matchMedia('(display-mode: standalone)').matches ||
  matchMedia('(display-mode: window-controls-overlay)').matches ||
  navigator.standalone === true;

const ua = () => navigator.userAgent || '';
const esApple = () =>
  /iPad|iPhone|iPod/.test(ua()) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

/* ¿En qué navegador está? Decide qué pasos se le enseñan.
   Lo importante (sep 2026): la liga casi siempre llega por WhatsApp, y
   WhatsApp, Facebook e Instagram la abren DENTRO de su app, donde no hay
   forma de instalar nada. Antes el botón ni aparecía y parecía descompuesto. */
export function entorno(u = ua(), apple = esApple()) {
  if (/FBAN|FBAV|FB_IAB|Instagram|Line\/|WhatsApp|Telegram|Snapchat|TikTok|musical_ly|\bwv\)/i.test(u)) return 'dentro-de-app';
  if (apple) {
    if (/CriOS|EdgiOS|FxiOS/.test(u)) return 'iphone-otro';
    if (/iPhone|iPad|iPod/.test(u) || navigator.maxTouchPoints > 1) return 'iphone-safari';
    return 'mac-safari';
  }
  if (/Android/i.test(u)) {
    if (/SamsungBrowser/i.test(u)) return 'android-samsung';
    if (/Firefox/i.test(u)) return 'android-firefox';
    return 'android-chrome';
  }
  if (/Firefox/i.test(u)) return 'escritorio-firefox';
  if (/Safari/i.test(u) && !/Chrome|Chromium|Edg/i.test(u)) return 'mac-safari';
  if (/Edg\//.test(u)) return 'escritorio-edge';
  return 'escritorio-chrome';
}

export const PASOS = {
  'dentro-de-app': {
    titulo: 'Ábrela primero en tu navegador',
    pasos: ['Estás viendo la plataforma dentro de WhatsApp, Facebook o Instagram, y desde ahí no se puede instalar.',
      'Toca los tres puntos (⋮ o ⋯) de arriba y elige «Abrir en el navegador» (Chrome o Safari). O copia la liga con el botón de abajo y pégala en Chrome o Safari.',
      'Ya en el navegador, vuelve a tocar «Instalar como app».'] },
  'iphone-safari': {
    titulo: 'Instalarla en tu iPhone o iPad',
    pasos: ['Toca el botón Compartir (el cuadrito con la flecha hacia arriba), abajo al centro o arriba a la derecha en iPad.',
      'Desliza hacia abajo y elige «Añadir a pantalla de inicio».', 'Toca «Añadir». Te queda como una app más.'] },
  'iphone-otro': {
    titulo: 'Instalarla en tu iPhone o iPad',
    pasos: ['Toca el botón Compartir (el cuadrito con la flecha), junto a la barra de direcciones.',
      'Elige «Añadir a pantalla de inicio» (en Chrome, si no aparece, toca «Más»).',
      'Si tu iPhone no lo ofrece, abre la liga en Safari: copia la liga con el botón de abajo y pégala en Safari.'] },
  'android-chrome': {
    titulo: 'Instalarla en tu celular Android',
    pasos: ['Toca el menú ⋮ de Chrome, arriba a la derecha.', 'Elige «Instalar app» o «Agregar a la pantalla principal».', 'Confirma con «Instalar».'] },
  'android-samsung': {
    titulo: 'Instalarla en tu Samsung',
    pasos: ['Toca el menú ☰ abajo a la derecha.', 'Elige «Añadir página a» y luego «Pantalla de inicio».', 'Confirma con «Añadir».'] },
  'android-firefox': {
    titulo: 'Instalarla en tu celular Android',
    pasos: ['Toca el menú ⋮ de Firefox.', 'Elige «Instalar» o «Agregar a la pantalla de inicio».'] },
  'escritorio-chrome': {
    titulo: 'Instalarla en tu computadora',
    pasos: ['En Chrome, busca el icono de instalar (una pantallita con flecha) al final de la barra de direcciones y dale clic.',
      'Si no aparece: menú ⋮ → «Transmitir, guardar y compartir» → «Instalar página como app».',
      'Si estás en una computadora de trabajo, tu empresa puede tener bloqueada la instalación o el sitio: en ese caso usa tu celular o tu computadora personal.'] },
  'escritorio-edge': {
    titulo: 'Instalarla en tu computadora',
    pasos: ['En Edge, dale clic al icono de instalar al final de la barra de direcciones.',
      'Si no aparece: menú ⋯ → «Aplicaciones» → «Instalar este sitio como una aplicación».',
      'Si estás en una computadora de trabajo, tu empresa puede tener bloqueada la instalación o el sitio: usa tu celular o tu computadora personal.'] },
  'escritorio-firefox': {
    titulo: 'Firefox no instala aplicaciones web',
    pasos: ['Abre la plataforma en Chrome o Edge (copia la liga con el botón de abajo) y ahí toca «Instalar como app».'] },
  'mac-safari': {
    titulo: 'Instalarla en tu Mac',
    pasos: ['En Safari, abre el menú «Archivo» y elige «Agregar al Dock».', 'Si tu Safari no lo tiene (versiones anteriores a la 17), abre la plataforma en Chrome.'] },
};

/* ¿Hay algo que ofrecer? Siempre que no esté instalada: si el navegador no
   da el evento, al menos se le explican los pasos. Antes el botón solo salía
   con el evento (o en iPhone) y en Samsung, Firefox, dentro de WhatsApp o
   cuando Chrome todavía no avisaba, simplemente no había botón. */
const sePuedeOfrecer = () => !yaInstalada();

function refrescarBotones() {
  botones.forEach(b => b.dataset.visible = sePuedeOfrecer() ? 'si' : 'no');
}

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();          // sin esto Chrome pone su propia barra encima
  promesaInstalacion = e;
  refrescarBotones();
});

window.addEventListener('appinstalled', () => {
  promesaInstalacion = null;
  refrescarBotones();
});

async function alPulsar(e) {
  e.preventDefault();

  if (promesaInstalacion) {
    const ev = promesaInstalacion;
    promesaInstalacion = null;         // el evento no se puede reutilizar
    try {
      ev.prompt();
      await ev.userChoice;
      refrescarBotones();
      return;
    } catch { /* si el navegador lo rechaza, se enseñan los pasos */ }
  }
  mostrarPasos();
}

/* Ventana con los pasos del navegador en el que está (no un alert: en un
   alert no se puede copiar la liga, que es lo que más falta hace). */
export function mostrarPasos(clave = entorno()) {
  document.getElementById('dlgInstalar')?.remove();
  const info = PASOS[clave] || PASOS['escritorio-chrome'];
  const liga = new URL('portada.html', location.href).href;
  const d = document.createElement('dialog');
  d.id = 'dlgInstalar';
  d.dataset.entorno = clave;
  d.setAttribute('aria-labelledby', 'dlgInstTit');
  d.style.cssText = 'max-width:440px;width:calc(100% - 32px);border:0;border-radius:16px;padding:22px 20px;box-shadow:0 24px 60px rgba(0,0,0,.3);background:var(--white,#fff);color:var(--dark,#0f172a)';
  d.innerHTML = `
    <h2 id="dlgInstTit" style="margin:0 0 10px;font-size:1.1rem">${info.titulo}</h2>
    <ol style="margin:0 0 14px;padding-left:20px;line-height:1.6;font-size:.92rem">${info.pasos.map(x => `<li style="margin:4px 0">${x}</li>`).join('')}</ol>
    <p style="font-size:.8rem;color:var(--muted,#64748b);margin:0 0 12px">Instalada, abre desde tu pantalla de inicio sin la barra del navegador y funciona aunque se caiga el internet.</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button type="button" data-copiar style="flex:1;padding:10px;border-radius:10px;border:1.5px solid var(--border,#e2e8f0);background:var(--white,#fff);font:inherit;font-weight:700;cursor:pointer;color:inherit">Copiar la liga</button>
      <button type="button" data-cerrar style="flex:1;padding:10px;border-radius:10px;border:0;background:#0d2a6e;color:#fff;font:inherit;font-weight:700;cursor:pointer">Entendido</button>
    </div>`;
  document.body.appendChild(d);
  d.querySelector('[data-cerrar]').onclick = () => { d.close(); d.remove(); };
  d.querySelector('[data-copiar]').onclick = async ev => {
    const b = ev.currentTarget;
    try { await navigator.clipboard.writeText(liga); b.textContent = 'Liga copiada ✓'; }
    catch { b.textContent = liga; }
  };
  d.addEventListener('close', () => d.remove());
  if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
  return d;
}

/* ── Botón de instalar ────────────────────────────────────────────────────
   Se puede llamar tantas veces como se repinte el menú: los botones viven en
   un Set y el `onclick` se reasigna en vez de acumularse.                  */
export function montarInstalador(boton) {
  registrarSW();
  if (!boton) return;

  botones.forEach(b => { if (!b.isConnected) botones.delete(b); });
  botones.add(boton);
  boton.onclick = alPulsar;
  boton.dataset.visible = sePuedeOfrecer() ? 'si' : 'no';
}
