/* ============================================================================
   POSTURALIA · brechas.js — Lo que el autodiagnóstico dejó por reforzar

   Una sola cuenta para las tres partes que la necesitan: la página de
   Reforzamiento, el flujo (¿está cerrado el paso?) y el panel (¿hay aviso?).

   Antes cada una contaba por su lado y ninguna cuadraba:
     · La página comparaba `repasados.size === brechas.length`. Si el
       candidato repasaba tres temas y luego corregía uno de esos a "Sí" en el
       autodiagnóstico, quedaban 3 repasados contra 2 brechas y el paso ya no
       se cerraba nunca. Al revés, un repasado viejo podía completar la cuenta
       de un tema nuevo que nadie había visto.
     · El flujo leía `completado:true` y ya: rehacer el autodiagnóstico con
       brechas nuevas no reabría Reforzamiento.
     · El panel avisaba con `temas` y `repasados`, que solo se escribían al
       terminar — cuando ya eran iguales. El aviso no salía jamás.

   Aquí un tema cuenta como repasado solo si sigue siendo brecha.          */

import { Store, comoLista } from './store.js';
import { reactivosPlanos, respuestasVigentes } from './data-autodiagnostico.js';
import { CRITERIOS } from './data-criterios.js';
import { OBJETIVOS } from './data-objetivos.js';

const TODOS = reactivosPlanos();
const POR_N = Object.fromEntries(TODOS.map(r => [r.n, r]));
export const PUNTAJE_MAXIMO = Math.round(TODOS.reduce((a, r) => a + (r.peso > 0 ? r.peso : 0), 0) * 100) / 100;

export function brechasDelAutodiagnostico(auto = Store.get('autodiagnostico', {})) {
  const resp = respuestasVigentes(auto);
  return TODOS.filter(r => resp[r.clave] === 'NO');
}

/* Puntaje ponderado del autodiagnóstico, como Paideia: suma el peso de
   cada reactivo en SÍ (máximo 100.08; referencia 97.64). */
export function puntajeDelAutodiagnostico(auto = Store.get('autodiagnostico', {})) {
  const resp = respuestasVigentes(auto);
  const p = TODOS.reduce((a, r) => a + (resp[r.clave] === 'SI' && r.peso > 0 ? r.peso : 0), 0);
  return Math.round(p * 100) / 100;
}

/* ── Temas de Reforzamiento (modelo Paideia: un tema = un criterio) ──────
   Un criterio es tema si tiene al menos un reactivo en NO. También entra el
   criterio de un tema de la Práctica que falló la pregunta de verificación
   ("detectado en la práctica"). Obligatorio = trae un reactivo eliminatorio
   en NO; los demás son recomendados. Orden: eliminatorios, luego peso,
   luego elemento — igual que brechas() de Paideia.                       */
const ORDEN = { critico: 0, medio: 1, menor: 2, 'n/a': 4 };

export function reforzadosGuardados(d = Store.get('reforzamiento', {}),
                                    auto = Store.get('autodiagnostico', {})) {
  const set = new Set(comoLista(d?.reforzados));
  /* Expedientes del modelo anterior (repasados = claves de reactivo): un
     criterio queda reforzado si se repasaron todos sus reactivos en NO. */
  const viejos = typeof d?.repasados === 'number' && d.completado === true
    ? brechasDelAutodiagnostico(auto).map(b => b.clave) : comoLista(d?.repasados);
  if (viejos.length) {
    const rep = new Set(viejos), porCrit = {};
    brechasDelAutodiagnostico(auto).forEach(b => (porCrit[b.crit] ||= []).push(b.clave));
    Object.entries(porCrit).forEach(([c, cl]) => { if (cl.every(k => rep.has(k))) set.add(c); });
  }
  return set;
}

export function temasDeReforzamiento(auto = Store.get('autodiagnostico', {}),
                                     d    = Store.get('reforzamiento', {}),
                                     prac = Store.get('practica', {})) {
  const g = {};
  brechasDelAutodiagnostico(auto).forEach(r => {
    (g[r.crit] ||= { criterio: r.crit, rx: [], origen: 'autodiagnostico' }).rx.push(r.n);
  });
  Object.entries(prac?.temas || {}).forEach(([oid, t]) => {
    if (!t?.apoyo || t.ok) return;
    const o = OBJETIVOS.find(x => x.id === oid); if (!o) return;
    const c = g[o.crit];
    if (!c) g[o.crit] = { criterio: o.crit, rx: [o.rx], origen: 'practica' };
    else if (c.origen === 'autodiagnostico') c.origen = 'ambos';
  });
  const hechos = reforzadosGuardados(d, auto);
  return Object.values(g).map(c => {
    const info = CRITERIOS[c.criterio] || {};
    const reac = c.rx.map(n => POR_N[n]).filter(Boolean);
    c.peso = Math.max(0, ...reac.map(r => r.peso || 0));
    c.critico = reac.some(r => r.critico) && c.origen !== 'practica';
    c.riesgo = c.critico ? 'critico' : c.peso >= .5 ? 'medio' : c.peso > 0 ? 'menor' : 'n/a';
    c.titulo = info.titulo || c.criterio; c.elem = info.elem || +c.criterio[1] || 0;
    c.tipo = info.tipo || ''; c.instr = info.instr || '';
    c.obligatorio = c.critico;
    c.hecho = hechos.has(c.criterio);
    c.pantallas = info.pantallas || [];
    c.reactivos = reac;
    return c;
  }).sort((a, b) => ORDEN[a.riesgo] - ORDEN[b.riesgo] || b.peso - a.peso || a.elem - b.elem);
}

/* Sin argumentos lee lo de este navegador (el candidato). El panel del
   evaluador le pasa los módulos del expediente importado.
   `pendientes` son los OBLIGATORIOS sin reforzar: son los que detienen el
   visto bueno. Los recomendados se informan aparte. */
export function avanceDeReforzamiento(auto = Store.get('autodiagnostico', {}),
                                      d    = Store.get('reforzamiento', {}),
                                      prac = Store.get('practica', {})) {
  const temas = temasDeReforzamiento(auto, d, prac);
  const obl = temas.filter(t => t.obligatorio);
  const repasados = temas.filter(t => t.hecho).length;
  const oblPend = obl.filter(t => !t.hecho).length;
  return { temas: temas.length, repasados, pendientes: oblPend,
           obligatorios: obl.length, recomendadosPendientes: temas.length - repasados - oblPend,
           vobo: d?.vobo === true };
}
