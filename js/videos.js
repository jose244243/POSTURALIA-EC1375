/* ============================================================================
   POSTURALIA · videos.js — Tarjeta de video de YouTube (carga al tocarla)

   No se incrusta el reproductor de entrada: con 15 videos en una página se
   descargarían 15 reproductores. Se muestra la miniatura y el iframe se
   crea al tocar (youtube-nocookie, sin cookies de seguimiento).
   ========================================================================== */
import { MEDIOS } from './data-medios.js';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let estiloListo = false;
function estilo() {
  if (estiloListo) return; estiloListo = true;
  const st = document.createElement('style');
  st.textContent = `
  .vid-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:14px;margin:12px 0}
  .vid{border:1px solid var(--border,#e5e7eb);border-radius:12px;overflow:hidden;background:var(--white,#fff)}
  .vid-play{position:relative;display:block;width:100%;aspect-ratio:16/9;border:0;padding:0;cursor:pointer;background:#0b1b33 center/cover no-repeat}
  .vid-play::after{content:"▶";position:absolute;inset:0;margin:auto;width:54px;height:38px;border-radius:10px;background:rgba(220,38,38,.92);color:#fff;font-size:18px;display:grid;place-items:center}
  .vid-play iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
  .vid-play.on::after{display:none}
  .vid-tx{padding:10px 12px;font-size:.84rem;line-height:1.5}
  .vid-tx b{display:block;color:var(--dark,#0f172a);margin-bottom:2px}
  .vid-tx small{color:var(--muted,#64748b)}
  .vid-tag{display:inline-block;font-size:.66rem;font-weight:700;letter-spacing:.05em;border-radius:4px;padding:1px 6px;margin-bottom:4px;background:#ECFDF5;color:#065F46}
  .vid-tag--comp{background:#F1F5F9;color:#475569}
  .vid--vert{max-width:300px}
  .vid-vert{aspect-ratio:9/16;max-height:520px}
  .vid video{display:block;width:100%;background:#000}
  .vid-pend{aspect-ratio:16/9;display:grid;place-items:center;background:#F8FAFC;color:var(--muted,#64748b);font-size:.82rem;text-align:center;padding:12px}`;
  document.head.appendChild(st);
}

/* Tarjeta de un video del catálogo (por mediaId) o de un youtubeId suelto */
export function tarjetaVideo(idOMedio, { titulo, nota } = {}) {
  estilo();
  /* Un tutorial propio puede ser la ruta de un .mp4 servido por la plataforma */
  if (/\.(mp4|webm)$/i.test(idOMedio || '')) return `<div class="vid">
    <video controls playsinline preload="none" controlsList="nodownload" src="${esc(idOMedio)}" style="aspect-ratio:16/9"
      ${/medios\/tutoriales\//.test(idOMedio) ? `poster="${esc(idOMedio.replace(/\.(mp4|webm)$/i, '.jpg'))}"` : ''}></video>
    <div class="vid-tx"><b>${esc(titulo || 'Video')}</b>${nota ? `<small>${esc(nota)}</small>` : ''}</div></div>`;
  const m = MEDIOS[idOMedio] || (idOMedio ? { youtubeId: idOMedio, title: titulo || 'Video' } : null);
  if (!m || !m.youtubeId) return `<div class="vid"><div class="vid-pend">Video tutorial pendiente de cargar</div>
    <div class="vid-tx"><b>${esc(titulo || '')}</b>${nota ? `<small>${esc(nota)}</small>` : ''}</div></div>`;
  const tag = m.role === 'instructional' ? '<span class="vid-tag">LO QUE OBSERVA EL EVALUADOR</span>'
            : m.role === 'complementary' ? '<span class="vid-tag vid-tag--comp">COMPLEMENTARIO</span>' : '';
  return `<div class="vid">
    <button class="vid-play" data-yt="${esc(m.youtubeId)}" aria-label="Reproducir: ${esc(titulo || m.title)}"
      style="background-image:url('https://i.ytimg.com/vi/${esc(m.youtubeId)}/hqdefault.jpg')"></button>
    <div class="vid-tx">${tag}<b>${esc(titulo || m.title)}</b>${(nota ?? m.caption) ? `<small>${esc(nota ?? m.caption)}</small>` : ''}</div>
  </div>`;
}

/* Video propio (archivo .mp4 servido por la plataforma, o YouTube no listado
   del canal de POSTURALIA). Un archivo propio no pasa por terceros: nada que
   rastrear. preload="none": no descarga nada hasta que se toca play. */
export function tarjetaPropia(v, { titulo = 'Ejemplo de esta sección', nota = '' } = {}) {
  estilo();
  if (!v || !(v.archivo || v.youtubeId)) return '';
  const tx = `<div class="vid-tx"><span class="vid-tag">GRABADO POR POSTURALIA</span><b>${esc(titulo)}</b>${nota ? `<small>${esc(nota)}</small>` : ''}</div>`;
  if (v.archivo) return `<div class="vid vid--vert">
    <video class="vid-vert" controls playsinline preload="none" controlsList="nodownload"
      ${v.poster ? `poster="${esc(v.poster)}"` : ''} src="${esc(v.archivo)}"></video>${tx}</div>`;
  return `<div class="vid vid--vert">
    <button class="vid-play vid-vert" data-yt="${esc(v.youtubeId)}" aria-label="Reproducir: ${esc(titulo)}"
      style="background-image:url('https://i.ytimg.com/vi/${esc(v.youtubeId)}/hqdefault.jpg')"></button>${tx}</div>`;
}

/* Un tutorial de la plataforma en ventana, encima de la página (como
   «Ver cómo se hace» de Paideia): no se pierde lo que se estaba haciendo.
   Arranca solo y en silencio (los tutoriales son mudos, con letreros). */
export function abrirVideo(ruta, { titulo = 'Tutorial', desc = '', todos = 'recursos.html#tutoriales', disparador = null } = {}) {
  estilo();
  document.getElementById('dlgVideo')?.remove();
  const d = document.createElement('dialog');
  d.id = 'dlgVideo';
  d.setAttribute('aria-label', 'Tutorial: ' + titulo);
  d.style.cssText = 'max-width:960px;width:calc(100% - 24px);border:0;border-radius:14px;padding:0;overflow:hidden;background:var(--white,#fff);color:inherit';
  d.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 16px">
      <strong style="font-size:1rem">${esc(titulo)}</strong>
      <button type="button" class="btn-plat btn-plat--secundario" data-cerrar aria-label="Cerrar tutorial" style="padding:6px 12px">✕</button></div>
    <video src="${esc(ruta)}" poster="${esc(ruta.replace(/\.(mp4|webm)$/i, '.jpg'))}" controls autoplay muted playsinline preload="metadata"
      controlsList="nodownload" style="display:block;width:100%;aspect-ratio:16/9;background:#000"></video>
    <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:10px 16px;font-size:.84rem;color:var(--muted,#64748b)">
      <span>${esc(desc)}</span>${todos ? `<a href="${esc(todos)}" style="font-weight:600">Todos los tutoriales</a>` : ''}</div>`;
  const cerrar = () => d.close();
  d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-cerrar]')) cerrar(); });
  d.addEventListener('close', () => { d.querySelector('video')?.pause(); d.remove(); disparador?.focus?.(); });
  document.body.appendChild(d);
  d.showModal();
  return d;
}

export const rejillaVideos = ids => `<div class="vid-grid">${ids.map(id => tarjetaVideo(id)).join('')}</div>`;

/* Una sola escucha para toda la página: toca la miniatura → reproductor */
let montado = false;
export function montarVideos() {
  estilo();
  if (montado) return; montado = true;
  document.addEventListener('click', e => {
    const b = e.target.closest('.vid-play[data-yt]');
    if (!b || b.classList.contains('on')) return;
    e.preventDefault(); e.stopPropagation();
    b.classList.add('on');
    b.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${b.dataset.yt}?rel=0&modestbranding=1&playsinline=1&autoplay=1"
      title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen></iframe>`;
  }, true);
}
