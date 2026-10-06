import { icono } from './iconos.js';
/* ============================================================================
   POSTURALIA · Plataforma de Certificación
   tema.js — Modo claro y oscuro, para las dos vistas

   Antes el modo oscuro existía solo en el panel del evaluador, y encima había
   dos atributos peleándose: la hoja base traía un `@media prefers-color-scheme`
   que reaccionaba a `data-theme="light"` mientras el panel escribía
   `data-tema="oscuro"`. Quien tuviera el sistema en oscuro y eligiera modo
   claro se quedaba con los tokens oscuros filtrándose, porque el guardia
   miraba un atributo que nadie escribía.

   Ahora manda un solo atributo, `data-tema`, con tres estados:

     auto     sigue lo que tenga el sistema operativo, y cambia en vivo si el
              usuario cambia el suyo. Es lo que aplica si nunca eligió.
     claro    forzado
     oscuro   forzado

   El valor efectivo (claro/oscuro) siempre queda escrito en el atributo, así
   que el CSS nunca tiene que consultar el sistema por su cuenta.
   ========================================================================== */

const CLAVE = 'posturalia.tema';

export const TEMAS = ['auto', 'claro', 'oscuro'];

export const ETIQUETA_TEMA = {
  auto:   'Automático',
  claro:  'Claro',
  oscuro: 'Oscuro',
};

/* El sol y la luna en emoji salían de color —amarillo y morado— contra un
   botón que es monocromo, y en Windows el ◐ de "automático" ni siquiera
   tenía glifo. Estos tres siguen el color del texto como todo lo demás. */
export const ICONO_TEMA = {
  auto:   'brujula',
  claro:  'sol',
  oscuro: 'luna',
};

export const iconoTema = (pref = preferencia()) => icono(ICONO_TEMA[pref] || 'brujula', 16);

const mq = () => matchMedia('(prefers-color-scheme: dark)');

/* La preferencia guardada, que puede ser 'auto' */
export function preferencia() {
  try {
    const v = localStorage.getItem(CLAVE);
    if (TEMAS.includes(v)) return v;
  } catch {}
  return 'auto';
}

/* El tema que realmente se ve ahora: 'claro' u 'oscuro', nunca 'auto' */
export function temaEfectivo(pref = preferencia()) {
  if (pref === 'auto') return mq().matches ? 'oscuro' : 'claro';
  return pref;
}

export function aplicarTema(pref = preferencia()) {
  document.documentElement.dataset.tema = temaEfectivo(pref);
  document.documentElement.dataset.temaPref = pref;
  try { localStorage.setItem(CLAVE, pref); } catch {}
  window.dispatchEvent(new CustomEvent('tema:cambio', { detail: { pref } }));
}

/* Rota entre los tres estados, pero de modo que el PRIMER clic siempre
   invierta lo que se está viendo.

   Rotar en el orden fijo auto → claro → oscuro tenía un defecto molesto: si
   estabas en automático con el sistema en claro, el primer clic te dejaba en
   claro forzado — o sea, sin ningún cambio visible. Parecía que el botón no
   servía y había que darle dos veces.

   Con esto: lo que ves se invierte de inmediato, y 'auto' queda al final del
   ciclo para quien lo busque.                                              */
export function siguienteTema() {
  const pref = preferencia();
  if (pref === 'auto')   return temaEfectivo(pref) === 'claro' ? 'oscuro' : 'claro';
  if (pref === 'claro')  return 'oscuro';
  return 'auto';
}

export function alternarTema() {
  aplicarTema(siguienteTema());
}

/* Etiqueta del botón: dice el estado actual, no el siguiente. Un botón que
   dice "Modo oscuro" cuando ya estás en oscuro deja a todos adivinando. */
export function etiquetaBoton(pref = preferencia()) {
  const efectivo = temaEfectivo(pref);
  return pref === 'auto'
    ? `${iconoTema('auto')} Automático (${efectivo})`
    : `${iconoTema(pref)} ${ETIQUETA_TEMA[pref]}`;
}

/* Si está en automático y el usuario cambia el tema de su sistema, seguimos */
mq().addEventListener?.('change', () => {
  if (preferencia() === 'auto') aplicarTema('auto');
});

/* Se aplica en cuanto alguien importa el módulo, antes de que pinte la página,
   para que no haya un parpadeo blanco al abrir en oscuro. */
aplicarTema();
