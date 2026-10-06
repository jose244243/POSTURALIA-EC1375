/* ============================================================================
   POSTURALIA · resultado.js — Lo que el candidato ve de su evaluación

   Como Paideia (cedula.html + panel): el candidato lee su Cédula de
   Evaluación publicada, sigue las etapas de su certificación y firma
   «Estoy de acuerdo con el juicio…» desde su propio dispositivo.

   De dónde sale:
     · Con Supabase: `mi_evaluacion()` / `firmar_cedula()` (ver supabase.sql).
       El candidato nunca lee la tabla del equipo: solo su recorte.
     · En modo local: la evaluación vive en el navegador del Centro. Si el
       candidato abre la plataforma en ESE navegador (firma en persona), se
       lee de ahí; en su propio celular no hay de dónde leerla y la página
       lo explica.
   ========================================================================== */
import { CONFIG } from './config.js';
import { Store } from './store.js';
import { sesion } from './cuenta.js';
import { cargar, evaluacionDe, guardarEvaluacion } from './admin-data.js';
import { paraCandidato, lineaDeTiempo, firmaValida } from './evaluacion.js';
import { estaCompleto, faseAutorizada } from './flow.js';

export const enNube = () => !!(CONFIG.supabase?.url && CONFIG.supabase?.anonKey);
export const miCorreo = () => String(sesion()?.correo || Store.get('candidato', {}).email || '').toLowerCase().trim();

/* { cedula, etapas, firma_candidato } o null si el Centro no ha registrado nada */
export async function miEvaluacion() {
  if (enNube()) {
    const { Evaluaciones } = await import('./nube.js');
    return await Evaluaciones.mia();
  }
  const correo = miCorreo();
  if (!correo) return null;
  const ev = evaluacionDe(cargar(), correo);
  return Object.keys(ev).length ? paraCandidato(ev) : null;
}

/* Firma la Cédula publicada. Devuelve la firma sellada con su fecha. */
export async function firmarMiCedula(firma) {
  if (!firmaValida(firma)) throw new Error('Dibuja tu firma o escribe tu nombre completo.');
  const limpia = { mode: firma.mode, dataUrl: firma.mode === 'draw' ? firma.dataUrl : null, typedName: firma.mode === 'type' ? String(firma.typedName || '').trim() : null };
  if (enNube()) {
    const { Evaluaciones } = await import('./nube.js');
    return await Evaluaciones.firmar(limpia);
  }
  const correo = miCorreo();
  const ev = evaluacionDe(cargar(), correo);
  if (!ev.cedula || ev.cedula.borrador) throw new Error('Tu Cédula todavía no está publicada.');
  if (ev.firma_candidato) return ev.firma_candidato;
  const sellada = { ...limpia, fecha: new Date().toISOString() };
  guardarEvaluacion(correo, { firma_candidato: sellada });
  return sellada;
}

/* Etapas del Centro con lo que el candidato ya sabe de su lado */
export function misEtapas(ev) {
  return lineaDeTiempo({
    evaluacion: ev || {},
    evidenciasHechas: estaCompleto('evidencias'),
    entregaPagada: faseAutorizada('entrega'),
  });
}
