/* ============================================================================
   POSTURALIA · Plataforma de Certificación
   sw.js — Service worker

   Hace dos cosas: permite instalar la plataforma como aplicación y la deja
   funcionar sin internet. Lo segundo importa más de lo que parece: la sesión
   de Alineación se da en un salón, y ahí la señal se cae. Un candidato a
   media práctica no debería perder la pantalla porque el wifi parpadeó.

   ── Estrategias ───────────────────────────────────────────────────────────
   Documentos HTML   red primero, caché de respaldo.
                     Si se publica una corrección, la ve en cuanto haya red;
                     si no hay, ve la última versión que alcanzó a guardar.
   CSS y JS          red primero, caché de respaldo — igual que el HTML,
                     para que nunca se mezclen versiones (ver fetch).
   Iconos, imágenes  caché primero y se revalida por detrás.
   Datos y material  caché primero, sin revalidar.
                     El banco de reactivos y el deck no cambian entre sesiones
                     y el deck solo pesa 700 KB una vez.

   ── Una advertencia deliberada ────────────────────────────────────────────
   Nada del expediente del candidato pasa por aquí. Su avance vive en
   localStorage y, cuando se encienda Supabase, en la nube. Guardar respuestas
   en el caché del service worker las dejaría legibles para cualquiera que
   abra el navegador en esa computadora — y en un Centro Evaluador las
   computadoras se comparten.
   ========================================================================== */

const VERSION = 'posturalia-v50';
const CACHE_APP    = `${VERSION}-app`;
const CACHE_PESADO = `${VERSION}-material`;

/* El armazón: lo mínimo para que la plataforma abra sin red. El deck de
   Alineación NO va aquí — son 700 KB que harían eterna la instalación. Se
   guarda solo, la primera vez que alguien lo abre. */
const ARMAZON = [
  './',
  './portada.html',
  './index.html',
  './autodiagnostico.html',
  './reforzamiento.html',
  './alineacion.html',
  './biblioteca.html',
  './recursos.html',
  './guion-maestro.html',
  './plan.html',
  './documentos.html',
  './sesion.html',
  './examen-formulario.html',
  './admin-iec.html',
  './practica.html',
  './examen.html',
  './encuesta.html',
  './evidencias.html',
  './entrega.html',
  './admin.html',
  './admin-candidatos.html',
  './admin-precios.html',
  './admin-sesiones.html',
  './admin-kpis.html',
  './admin-utilidades.html',
  './admin-evaluacion.html',
  './cedula.html',
  './restablecer-password.html',
  './registro.html',
  './pago.html',

  './posturalia-styles.css',
  './plataforma-styles.css',
  './admin-styles.css',

  './js/config.js',
  './js/data-medios.js',
  './js/videos.js',
  './js/pdf-util.js',
  './js/portafolio-avance.js',
  './js/portafolio-imagenes.js',
  './portafolio.html',
  './js/registro.js',
  './js/sesion.js',
  './js/tema.js',
  './js/iconos.js',
  './js/panel.js',
  './js/brechas.js',
  './js/fechas.js',
  './js/firma.js',
  './js/archivos.js',
  './js/almacen-grande.js',
  './js/archivos-nube.js',
  './js/seguro.js',
  './js/store.js',
  './js/flow.js',
  './js/shell.js',
  './js/instalar.js',
  './js/admin-shell.js',
  './js/admin-data.js',
  './js/expediente.js',
  './js/nube.js',
  './js/mapeo-nube.js',
  './js/data-autodiagnostico.js',
  './js/data-examen.js',
  './js/data-practica.js',
  './js/data-biblioteca.js',
  './js/data-guion.js',
  './js/data-formatos.js',
  './js/data-portafolio.js',
  './js/data-objetivos.js',
  './js/data-criterios.js',
  './js/data-plan-oficial.js',
  './js/doc-plan-oficial.js',
  './js/demo-paideia.js',
  './js/tutorial-equipo.js',
  './js/cuenta.js',
  './js/evaluacion.js',
  './js/data-iec.js',
  './js/firma-simple.js',
  './js/doc-portafolio.js',
  './js/doc-portafolio-oficial.js',
  './js/doc-iec-oficial.js',
  './js/data-cuestionario-iec.js',
  './js/resultado.js',
  './js/sala.js',
  './js/sala-datos.js',
  './js/sala-ui.js',
  './js/importar.js',
  './js/data-sesion.js',
  './js/doc-sesion.js',
  './js/grabacion.js',
  './js/examen-guiado.js',
  './js/toolkit.js',
  './js/pagos.js',
  './js/sesiones-alineacion.js',
  './js/doc-registro.js',
  './js/nda.js',
  './js/protege.js',
  './js/incorporar.js',
  './js/centro-nube.js',
  './js/prueba-rapida.js',
  './js/biblioteca-para-ti.js',

  './favicon.svg',
  './manifest.webmanifest',
  './iconos/icono-192.png',
  './iconos/icono-512.png',
];

/* Lo pesado, que se guarda cuando se pide y ya no se vuelve a bajar */
const ES_PESADO = url =>
  url.pathname.endsWith('alineacion-deck.html') ||
  url.pathname.endsWith('biblioteca-deck.html') ||
  /\.(pdf|mp4|webm|woff2?)$/i.test(url.pathname);

/* ── Archivos que NUNCA se sirven de caché primero ────────────────────────
   config.js decide a qué backend apunta toda la plataforma. Con la estrategia
   normal —guardado primero, revalidar por detrás— quien ya tuviera la app
   instalada seguiría hablándole al backend viejo durante toda esa visita
   después de que se publiquen credenciales nuevas: escribiría en un lado
   mientras el panel lee del otro, y nadie entendería por qué falta el avance.

   El manifest va igual: cambia poco, pero cuando cambia es porque cambió cómo
   se instala la app, y eso no puede quedarse rezagado una versión.          */
const ES_CRITICO = url =>
  url.pathname.endsWith('/js/config.js') ||
  url.pathname.endsWith('manifest.webmanifest');

const esHTML = req =>
  req.mode === 'navigate' ||
  (req.headers.get('accept') || '').includes('text/html');

/* ── Instalación ──────────────────────────────────────────────────────────
   addAll falla entero si un solo archivo falla. En una lista de 40, basta con
   que uno se renombre para que la instalación no ocurra nunca y el usuario
   se quede sin app sin saber por qué. Se guardan uno por uno y se sigue. */
self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE_APP);
    await Promise.allSettled(
      ARMAZON.map(url => cache.add(new Request(url, { cache: 'reload' })))
    );
    self.skipWaiting();
  })());
});

/* ── Activación: se tiran los cachés de versiones viejas ────────────────── */
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const nombres = await caches.keys();
    await Promise.all(
      nombres.filter(n => !n.startsWith(VERSION)).map(n => caches.delete(n))
    );
    await self.clients.claim();
  })());
});

/* ── Peticiones ─────────────────────────────────────────────────────────── */
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Nada de otro origen entra al caché: Supabase, fuentes, lo que sea.
  // Una respuesta de la API guardada aquí se serviría vieja sin avisar.
  if (url.origin !== self.location.origin) return;

  // Videos propios (.mp4/.webm) y peticiones por rangos: directo a la red.
  // El reproductor pide el video en trozos (Range); guardarlo en caché
  // rompería el adelantar/retroceder y llenaría el almacenamiento.
  if (/\.(mp4|webm|mov)$/i.test(url.pathname) || req.headers.has('range')) return;

  if (ES_CRITICO(url)) return e.respondWith(redPrimero(req));
  if (ES_PESADO(url))  return e.respondWith(cachePrimero(req, CACHE_PESADO));
  if (esHTML(req))     return e.respondWith(redPrimero(req));
  /* JS y CSS también red primero. Con "caché primero y revalidar", la
     primera visita después de publicar mezclaba el HTML nuevo con módulos
     viejos del caché: si la página importaba una función recién agregada
     (pagoDe de admin-data.js, por ejemplo), el módulo no la traía y la
     pantalla se quedaba en blanco. Sin red, sigue saliendo lo guardado. */
  if (/\.(m?js|css)$/i.test(url.pathname)) return e.respondWith(redPrimero(req));
  e.respondWith(revalidando(req));
});

/* Red primero: la versión publicada gana; sin red, la guardada */
async function redPrimero(req) {
  const cache = await caches.open(CACHE_APP);
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    return (await cache.match(req))
        || (await cache.match('./portada.html'))
        || new Response(
             '<!doctype html><meta charset="utf-8">' +
             '<title>Sin conexión</title>' +
             '<div style="font-family:system-ui;padding:40px;text-align:center">' +
             '<h1>Sin conexión</h1><p>Esta pantalla no alcanzó a guardarse. ' +
             'Vuelve a abrirla cuando tengas internet.</p></div>',
             { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 503 });
  }
}

/* Caché primero y se revalida por detrás */
async function revalidando(req) {
  const cache = await caches.open(CACHE_APP);
  const guardado = await cache.match(req);

  const red = fetch(req).then(res => {
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  }).catch(() => null);

  return guardado || (await red) || new Response('', { status: 504 });
}

/* Caché primero, sin revalidar: material que no cambia */
async function cachePrimero(req, nombreCache) {
  const cache = await caches.open(nombreCache);
  const guardado = await cache.match(req);
  if (guardado) return guardado;
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    return new Response('', { status: 504 });
  }
}

/* La página pide saltar la espera cuando el usuario acepta actualizar */
self.addEventListener('message', e => {
  if (e.data === 'saltar-espera') self.skipWaiting();
});
