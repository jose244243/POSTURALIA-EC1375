/* ============================================================================
   POSTURALIA · Plataforma de Certificación
   config.js — Configuración del entorno
   ============================================================================

   ⚠️  ADVERTENCIA IMPORTANTE — LEER ANTES DE CONFIGURAR
   ----------------------------------------------------------------------------
   NO uses aquí las credenciales de Supabase de la plataforma de Paideia Tech
   (proyecto `numsuiuwrvpprhnxovmh`). Si apuntas esta plataforma a esa base de
   datos, cada registro, respuesta y documento generado aquí se ESCRIBIRÁ sobre
   la plataforma que ya está en producción y en uso por candidatos reales.

   Esta plataforma debe tener su PROPIO proyecto de Supabase, separado.
   Crea uno nuevo en https://supabase.com y pega abajo sus credenciales.

   Mientras SUPABASE_URL esté vacío, la plataforma funciona en MODO LOCAL:
   todo se guarda en el navegador (localStorage). Es perfectamente usable para
   pruebas y demos, pero los datos no salen del dispositivo.
   ========================================================================== */

export const CONFIG = {

  /* ── Identidad de marca ─────────────────────────────────────────────── */
  marca: {
    nombre:      'POSTURALIA',
    nombreLargo: 'POSTURALIA D 8:17',
    ciudad:      'Monterrey, N.L.',
    estandar:    'EC1375',
    estandarNombre: 'Prestación de servicios auxiliares en la contribución tradicional y complementaria de la recuperación de las condiciones físicas y socioemocionales de las personas',
    whatsapp:    '5218136071342',
    sitio:       '../index.html',
  },

  /* ── Equipo central (como la lista de administradores de Paideia) ───────
     Quién es del equipo en CUALQUIER navegador, sin tener que darlo de alta
     en cada equipo. Como este archivo es público, no lleva los correos:
     lleva su huella SHA-256 ('posturalia-equipo:' + correo en minúsculas).
     La plataforma sabe si un correo es admin, pero nadie puede leer la
     lista. Para agregar a alguien: pídeselo a quien mantiene la plataforma
     (o dalo de alta en «Acceso del equipo», que vale solo en ese navegador).
     Con Supabase manda la tabla `evaluadores`.                             */
  equipoCentral: [
    { h: 'cdc244e7ce0645f5867e40bf1ba0536df902a762d0a8492f76817719f176bc22', rol: 'admin', nombre: 'Fernando Villarreal' },
    { h: 'b56ef7af4ba16919cde6062a69d63880ea06597193ee147e08752bb42e509bbd', rol: 'admin', nombre: 'Fernando Villarreal' },
  ],

  /* ── Centro de Evaluación (formatos oficiales del portafolio) ───────────
     Sale en el encabezado, el pie y los campos de todos los documentos que
     se suben a SEP-CONOCER (Plan de Evaluación, Cédula, acuses…). Tomado
     del FORMATO PORTAFOLIO-1375-2026. Los logos viven en formatos/logos/.  */
  centroEvaluacion: {
    clave:      'CE1399-OC063-18',
    nombre:     'COLEGIO ILUSTRE DE CIENCIAS FORENSES DE MEXICO A.C.',
    direccion:  'BRASIL 306 COL 27 DE SEPTIEMBRE POZA RICA VER.',
    telefono:   '7821138710',
    evaluadora: '',          // nombre por omisión; el Plan permite cambiarlo
    umbral:     97.64,
    /* 6-oct: Fernando pidió quitar el logo del Colegio Ilustre de los
       documentos. Quedan CONOCER a la izquierda y la ECE a la derecha, como
       en el portafolio de Humberto. Para volver a ponerlo:
       centro: 'formatos/logos/centro.jpg'. */
    logos: { izq: 'formatos/logos/conocer.jpg', centro: '', der: 'formatos/logos/ece.png' },
  },

  /* ── Backend ────────────────────────────────────────────────────────────
     Déjalo vacío para operar en modo local (localStorage).
     Cuando crees TU proyecto de Supabase, pega aquí URL y anon key.        */
  supabase: {
      url: 'https://oazbreajkjpkajbpzfrp.supabase.co',
     anonKey: 'sb_publishable_bw4yBQBWbZ0u8OtcMuPDSQ_s9teczuI',
  },

  /* ── Aviso de reembolsos (el mismo de Paideia) ─────────────────────────
     Sale en la página a donde regresa Mercado Pago (pago.html). Es una
     política comercial: cámbiala aquí si POSTURALIA decide otra. Vacía =
     no se muestra.                                                        */
  avisoReembolso: 'Una vez realizado cualquier pago o anticipo, no aplican reembolsos, salvo que la causa sea responsabilidad del Centro Evaluador.',

  /* ── Lámina oficial del CONOCER con ejemplos de foto ─────────────────
     (3 correctas de 25 × 30 mm y 5 incorrectas), como la muestra Paideia en
     el registro. Guarda la imagen en formatos/ y pon aquí su ruta, p. ej.
     'formatos/lamina-fotos-conocer.webp'. Vacía = no se muestra.           */
  laminaFotoConocer: 'formatos/lamina-fotos-conocer.webp',

  /* ── Reglas de evaluación ───────────────────────────────────────────── */
  reglas: {
    // % mínimo de autodiagnóstico para recomendar evaluación directa
    umbralAutodiagnostico: 90,
    // % mínimo para aprobar el examen de conocimientos
    umbralExamen: 80,
    // Cuántos reactivos se presentan en el examen
    reactivosExamen: 37,
    // Barajar el orden de los reactivos en cada intento
    barajarExamen: true,
    // Mostrar la respuesta correcta tras fallar
    retroalimentacionInmediata: false,
  },

  /* ── Fases del proceso ────────────────────────────────────────────────
     El avance NO es "módulos terminados / módulos totales": cada fase pesa
     distinto. Terminar el autodiagnóstico no equivale a terminar la
     evaluación, y presentarlo como si sí lo fuera le da al candidato una
     lectura falsa de qué tan cerca está.                                   */
  fases: [
    { id: 'registro',   label: 'Registro',   peso: 15 },
    { id: 'alineacion', label: 'Alineación', peso: 30 },
    { id: 'evaluacion', label: 'Evaluación', peso: 40 },
    { id: 'entrega',    label: 'Entrega',    peso: 15 },
  ],

  /* ── Flujo de certificación (orden de los módulos) ────────────────────
     listo     el módulo ya está construido en esta versión.
     libre     material de consulta: se abre sin esperar al paso anterior.
     fase      a qué fase del proceso pertenece (para el avance ponderado).
     requiere  qué desbloquea el módulo:
                 'pago'      el Centro autoriza al confirmar el pago de la fase
                 'evaluador' solo el Centro lo marca; el candidato no puede
     docs      archivos que deben quedar entregados para darlo por cerrado.
     aprueba   no basta con contestarlo: tiene que quedar aprobado.

     El icono de cada módulo NO vive aquí: lo resuelve iconos.js a partir del
     id. Antes había un emoji en cada línea y era el sistema operativo quien
     lo dibujaba, así que la misma plataforma se veía distinta en Windows,
     Android e iPhone — y 🗓️ ni siquiera tenía glifo en varias versiones de
     Windows, donde salía como un cuadro vacío junto a "Plan de Evaluación".  */
  flujo: [
    { id: 'autodiagnostico', nombre: 'Autodiagnóstico',         archivo: 'autodiagnostico.html', listo: true, fase: 'registro' },
    { id: 'reforzamiento',   nombre: 'Reforzamiento',           archivo: 'reforzamiento.html',   listo: true, fase: 'registro' },
    { id: 'alineacion',      nombre: 'Alineación',              archivo: 'alineacion.html',      listo: true, fase: 'alineacion', libre: true, requiere: 'pago' },
    { id: 'plan',            nombre: 'Plan de Evaluación',      archivo: 'plan.html',            listo: true, fase: 'evaluacion',
      docs: ['planEvaluacion', 'acusePlanEvaluacion'] },
    { id: 'documentos',      nombre: 'Documentos de Sesión',    archivo: 'documentos.html',      listo: true, fase: 'evaluacion', libre: true,
      docs: ['ficha', 'consentimiento', 'plan_sesion', 'plan_seguimiento', 'encuesta_usuario', 'verificacion_espacio'] },
    { id: 'practica',        nombre: 'Práctica',                archivo: 'practica.html',        listo: true, fase: 'evaluacion', libre: true },
    { id: 'examen',          nombre: 'Examen de Conocimientos', archivo: 'examen.html',          listo: true, fase: 'evaluacion', aprueba: true,
      previos: ['practica'] },
    { id: 'encuesta',        nombre: 'Encuesta de Satisfacción',archivo: 'encuesta.html',        listo: true, fase: 'evaluacion',
      docs: ['encuesta'] },
    { id: 'evidencias',      nombre: 'Evidencias',              archivo: 'evidencias.html',      listo: true, fase: 'entrega',
      docs: ['zoom', 'video', 'ine', 'curp', 'fotoDiploma'] },
    { id: 'entrega',         nombre: 'Entrega',                 archivo: 'entrega.html',         listo: true, fase: 'entrega', requiere: 'evaluador' },
  ],

  /* ── Recursos (así se llama en Paideia) ─────────────────────────────────────────────
     No son pasos del proceso y no cuentan para el avance: son las fuentes
     que el candidato abre cuando necesita repasar algo.

     Estaban construidas pero no había por dónde llegar a ellas. La
     Biblioteca vivía dentro del módulo Alineación, que está bloqueado
     hasta que el Centro marque pagada esa fase, así que a un candidato
     nuevo le aparecía con candado y no sabía siquiera que existía. Que el
     material esté a la vista también sirve para vender: se ve qué se abre
     al pagar la Alineación.                                              */
  consulta: [
    { id: 'biblioteca', nombre: 'Biblioteca',   archivo: 'biblioteca.html',
      desc: 'El temario completo, con su material' },
    { id: 'guion',      nombre: 'Guion Maestro', archivo: 'guion-maestro.html',
      desc: 'Lo que se dice y se hace, de principio a fin' },
    { id: 'recursos',   nombre: 'Tutoriales y toolkit', archivo: 'recursos.html',
      desc: 'Cómo se usa cada parte de la plataforma' },
  ],

  /* ── Registro de documentos del expediente ────────────────────────────
     Las claves ya existían regadas en `flujo[].docs`, pero solo como
     claves: 'acusePlanEvaluacion' no es algo que se le pueda enseñar a
     un candidato. Aquí cada una recibe el nombre con el que se le llama
     de verdad y, sobre todo, de quién depende:

       sube      lo entrega el candidato (lo escanea, lo fotografía, lo carga)
       descarga  lo genera la plataforma y él solo tiene que bajarlo
       firma     lo firma aquí mismo: no hay que imprimir, firmar y escanear

     La distinción no es cosmética. En la pantalla del expediente, un
     documento en 'sube' que falta es trabajo pendiente del candidato; uno
     en 'descarga' que falta es un archivo que todavía no abrió. Mezclarlos
     en un solo "pendiente" hacía que 11 de 15 se leyera como once tareas,
     cuando cuatro de ellas eran un clic.                                 */
  documentos: {
    planEvaluacion:      { nombre: 'Plan de Evaluación',          tipo: 'descarga' },
    acusePlanEvaluacion: { nombre: 'Acuse — Plan de Evaluación',  tipo: 'firma'    },
    ficha:               { nombre: 'Ficha de Registro del paciente', tipo: 'descarga' },
    consentimiento:      { nombre: 'Carta de Consentimiento',     tipo: 'descarga' },
    plan_sesion:         { nombre: 'Plan de Sesión',              tipo: 'descarga' },
    plan_seguimiento:    { nombre: 'Plan de Seguimiento',         tipo: 'descarga' },
    encuesta_usuario:    { nombre: 'Encuesta de satisfacción del usuario', tipo: 'descarga' },
    verificacion_espacio:{ nombre: 'Verificación del espacio y herramientas', tipo: 'descarga' },
    encuesta:            { nombre: 'Encuesta de Satisfacción',    tipo: 'firma'    },
    zoom:                { nombre: 'Capturas de Zoom',            tipo: 'sube'     },
    video:               { nombre: 'Liga al video de la evaluación', tipo: 'sube' },
    ine:                 { nombre: 'INE',                         tipo: 'sube'     },
    curp:                { nombre: 'CURP',                        tipo: 'sube'     },
    fotoDiploma:         { nombre: 'Foto para el diploma',        tipo: 'sube'     },
  },
};

/* Namespace de almacenamiento. Distinto al de cualquier otra plataforma
   para que jamás haya colisión de datos entre sistemas.                   */
export const NS = 'posturalia.cert.v1';

export const modoLocal = () => !CONFIG.supabase.url;
