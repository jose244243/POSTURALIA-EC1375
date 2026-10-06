/* ============================================================================
   POSTURALIA · prueba-rapida.js — «Cargar candidatos de prueba» a la vista

   El escenario de prueba (demo-paideia.js: una persona ficticia por cada
   categoría) existía desde v41, pero su botón vivía en la última tarjeta
   del Panel del equipo. Quien abría Candidatos y la veía vacía no tenía
   cómo saber que estaba ahí (30 sep). Ahora, mientras el panel no tenga
   candidatos, se ofrece arriba en el Panel y en la propia lista.

   Solo para administradores: el escenario trae precios y pagos, y el
   evaluador no ve dinero.
   ========================================================================== */
import { sesion } from './cuenta.js';
import { CONFIG } from './config.js';

const enNube = () => !!(CONFIG.supabase?.url && CONFIG.supabase?.anonKey);

export function ofrecerPrueba(contenedor, alCargar) {
  if (!contenedor) return;
  const s = sesion();
  if (s?.rol === 'evaluador') { contenedor.innerHTML = ''; return; }
  contenedor.innerHTML = `
    <div class="prueba-rapida" role="region" aria-label="Candidatos de prueba">
      <strong>¿Quieres probar la categorización?</strong>
      <p>Carga <b>19 candidatos ficticios</b>, uno por categoría: prospecto, cada paso del proceso,
        beca, anticipo, estancado, plazo vencido, esperando evaluador, COMPETENTE, TODAVÍA NO COMPETENTE,
        entregado, desistió y cambió de lote. Incluye tu cuenta de prueba
        <code>posturalia.d817@gmail.com</code>. No son datos de nadie y se quitan con un clic
        (Panel del equipo → Datos de prueba).</p>
      <button type="button" class="btn-a btn-a--pri" data-cargar-prueba>Cargar 19 candidatos de prueba</button>
      <p class="prueba-nota">${enNube()
        ? 'Los datos de prueba se quedan en este navegador: nunca se suben a la nube.'
        : 'Mientras no esté conectado Supabase, se guardan solo en este navegador: si abres la plataforma en otro equipo o en el celular, allá hay que cargarlos otra vez.'}</p>
    </div>`;
  contenedor.querySelector('[data-cargar-prueba]').onclick = async (e) => {
    e.currentTarget.disabled = true;
    e.currentTarget.textContent = 'Cargando…';
    const { cargarEscenarioCompleto } = await import('./demo-paideia.js');
    cargarEscenarioCompleto();
    contenedor.innerHTML = '';
    alCargar?.();
  };
}
