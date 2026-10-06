/* ============================================================================
   POSTURALIA · biblioteca-para-ti.js — Las pantallas que le tocan a cada
   candidato (como «Para ti» del visor de Paideia, visor-diapositivas.js)

   Una pantalla se le recomienda si:
     · toca un criterio donde marcó reactivos en NO en su Autodiagnóstico, o
     · es el repaso de un tema del Examen de Conocimientos que falló al
       PRIMER intento (el examen no deja avanzar sin acertar, así que el
       primer intento es lo único que dice qué no sabía).
   Cada una lleva sus motivos, para que el candidato sepa por qué está ahí.

   Y la búsqueda dentro del contenido: el texto de cada pantalla del deck,
   sin las imágenes incrustadas (el deck con imágenes pesa ~5 MB).
   Sin DOM salvo textosDelDeck(), que recibe el HTML ya descargado.
   ========================================================================== */

/* biblioteca: BIBLIOTECA de data-biblioteca.js
   brechas:    reactivos en NO (brechasDelAutodiagnostico de brechas.js)
   examen:     estado guiado del Examen ({ primer: { n: { ok } } })
   preguntas:  PREGUNTAS del examen (con .n y .reactivo)
   repaso:     REPASO del examen (reactivo → [sid])
   temaDe:     q → { tema } */
export function recomendadas({ biblioteca = [], brechas = [], examen = null, preguntas = [], repaso = {}, temaDe = () => null } = {}) {
  const motivos = new Map();
  const poner = (sid, m) => {
    if (!motivos.has(sid)) motivos.set(sid, []);
    if (!motivos.get(sid).includes(m)) motivos.get(sid).push(m);
  };
  const enDeck = new Set(biblioteca.filter(s => s.enDeck).map(s => s.sid));

  /* Autodiagnóstico: cuántos reactivos en NO trae cada criterio */
  const porCrit = {};
  brechas.forEach(r => { if (r.crit) porCrit[r.crit] = (porCrit[r.crit] || 0) + 1; });
  biblioteca.forEach(s => {
    if (!s.enDeck) return;
    (s.crit || []).forEach(c => {
      if (porCrit[c]) poner(s.sid, `Autodiagnóstico: ${porCrit[c]} reactivo${porCrit[c] > 1 ? 's' : ''} en No (${c})`);
    });
  });

  /* Examen: temas fallados al primer intento */
  const primer = examen?.primer || {};
  preguntas.forEach(q => {
    if (!primer[q.n] || primer[q.n].ok) return;
    const tema = temaDe(q)?.tema || `reactivo ${q.reactivo}`;
    (repaso[q.reactivo] || []).forEach(sid => { if (enDeck.has(sid)) poner(sid, `Examen: fallaste «${tema}» al primer intento`); });
  });
  return motivos;
}

/* Minúsculas y sin acentos: «higiene» encuentra «Higiene», «presion»
   encuentra «presión». */
export const normaliza = t => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/* {sid: texto normalizado} a partir del HTML del deck. Las imágenes van
   incrustadas como data: y no se buscan, así que se quitan antes de
   parsear (5 MB → unos cientos de KB). */
export function textosDelDeck(html, parser = new DOMParser()) {
  const limpio = String(html || '').replace(/(src|href)="data:[^"]*"/g, '$1=""');
  const doc = parser.parseFromString(limpio, 'text/html');
  const out = {};
  doc.querySelectorAll('section.slide[data-sid]').forEach(sec => {
    sec.querySelectorAll('script,style').forEach(x => x.remove());
    out[sec.dataset.sid] = normaliza(sec.textContent.replace(/\s+/g, ' '));
  });
  return out;
}
