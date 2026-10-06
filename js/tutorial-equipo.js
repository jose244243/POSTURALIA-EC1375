/* ============================================================================
   POSTURALIA · tutorial-equipo.js — Tutoriales del Centro en ventana
   (como CrmShell.mount({ tutorial }) de Paideia: los del equipo no salen en
   Recursos ni al candidato; se abren desde su propia página sin salir de ella,
   así no se pierde lo que se estaba calificando).
   ========================================================================== */
import { TUTORIALES_EQUIPO } from './data-medios.js';
import { tarjetaVideo, montarVideos } from './videos.js';
import { esc } from './seguro.js';

export function botonTutorial(id, texto = 'Tutorial') {
  const t = TUTORIALES_EQUIPO[id];
  if (!t) return '';
  return `<button type="button" class="btn-a btn-a--sec" data-tutorial-equipo="${esc(id)}" title="${esc(t.titulo)}">▶ ${esc(texto)}</button>`;
}

export function abrirTutorial(id) {
  const t = TUTORIALES_EQUIPO[id];
  if (!t) return null;
  document.getElementById('dlgTutorial')?.remove();
  const d = document.createElement('dialog');
  d.id = 'dlgTutorial';
  d.setAttribute('aria-labelledby', 'dlgTutorialT');
  d.style.cssText = 'max-width:640px;width:calc(100% - 32px);border:1px solid var(--border,#e2e8f0);border-radius:12px;padding:20px;color:inherit;background:var(--surface,#fff)';
  const src = t.video?.archivo || t.video?.youtubeId || '';
  const video = src ? tarjetaVideo(src, { titulo: t.titulo, nota: t.dur ? `${Math.round(t.dur / 60 * 10) / 10} min` : '' }) : '';
  d.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:start;gap:12px">
      <h2 id="dlgTutorialT" style="margin:0;font-size:1.1rem">${esc(t.titulo)}</h2>
      <button type="button" class="btn-a btn-a--sec" data-cerrar aria-label="Cerrar tutorial">✕</button></div>
    ${video || '<p style="color:var(--muted,#64748b);font-size:.84rem;margin:10px 0">El video de este tutorial todavía no se graba. Mientras, estos son los pasos:</p>'}
    <ol style="line-height:1.7;margin:10px 0 0 20px;padding:0">${t.pasos.map(p => `<li>${esc(p)}</li>`).join('')}</ol>`;
  d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-cerrar]')) d.close(); });
  d.addEventListener('close', () => { d.querySelectorAll('video').forEach(v => v.pause()); d.remove(); });
  document.body.appendChild(d);
  d.showModal();
  return d;
}

/* Un solo escucha para toda la página: los botones pueden repintarse */
let montado = false;
export function montarTutoriales() {
  if (montado) return; montado = true;
  montarVideos();
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-tutorial-equipo]');
    if (b) { e.preventDefault(); abrirTutorial(b.dataset.tutorialEquipo); }
  });
}
