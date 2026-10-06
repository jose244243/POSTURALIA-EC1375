/* ============================================================================
   POSTURALIA · data-medios.js — Videos del EC1375 y tutoriales de la plataforma

   MEDIOS: los videos oficiales que usa Paideia V4.5 (EC1375_MEDIA_LIBRARY +
   termómetro), con el mismo youtubeId, título y nota. Los usan el Guión
   Maestro (cada bloque trae los suyos), los Tutoriales y el material.

   TUTORIALES: un video por módulo que explica cómo se usa esa parte de la
   plataforma. Pon aquí la ruta de un .mp4 propio (p. ej.
   'medios/tutoriales/autodiagnostico.mp4', recomendado: no pasa por
   terceros) o el youtubeId de un video no listado del canal de POSTURALIA.
   Aparece en Tutoriales y en el propio módulo. Vacío = "video pendiente"
   con la guía escrita.
   ========================================================================== */

export const MEDIOS = {
 "lavado_manos": {
  "youtubeId": "NMmAj1EKdVo",
  "title": "Lavado de manos conforme al protocolo de la OMS",
  "role": "instructional",
  "optional": false,
  "caption": "Es el reactivo 2 del autodiagnóstico y es de peso mayor: fallarlo reprueba."
 },
 "termometro": {
  "youtubeId": "d54G0pB_b6c",
  "title": "Toma digital de temperatura al ingreso",
  "role": "instructional",
  "optional": false,
  "caption": "Es el reactivo 26, de peso mayor (0.59): el estándar pide «la aplicación de gel antibacterial en las manos y la toma digital de temperatura» ANTES de que el usuario pase. El evaluador lo observa en los primeros segundos de la recepción."
 },
 "cubrebocas": {
  "youtubeId": "23lZ0kzdfL4",
  "title": "Colocación del cubrebocas quirúrgico de triple capa",
  "role": "instructional",
  "optional": false,
  "caption": "El estándar pide el de tipo quirúrgico de triple capa, conforme a las recomendaciones de la Secretaría de Salud."
 },
 "tapete_sanitizante": {
  "youtubeId": "GDXBvoSG8s0",
  "title": "Tapete sanitizante en el ingreso",
  "role": "instructional",
  "optional": false,
  "caption": ""
 },
 "limpieza_desinfeccion": {
  "youtubeId": "pruNwAH3Ahk",
  "title": "Limpieza, desinfección y sanitización de herramientas",
  "role": "instructional",
  "optional": false,
  "caption": ""
 },
 "aviso_privacidad": {
  "youtubeId": "NJBrcCA-oMI",
  "title": "Aviso de privacidad y datos personales",
  "role": "instructional",
  "optional": false,
  "caption": "El video explica el marco general; lo que se evalúa es que TÚ lo comuniques al usuario antes del llenado de su documentación."
 },
 "oximetro_pulso": {
  "youtubeId": "2psdvUwL-tY",
  "title": "Toma de saturación de oxígeno y frecuencia del pulso",
  "role": "instructional",
  "optional": false,
  "caption": ""
 },
 "frecuencia_respiratoria": {
  "youtubeId": "oSj1JlxWRXE",
  "title": "Medición de la frecuencia respiratoria",
  "role": "instructional",
  "optional": false,
  "caption": ""
 },
 "presion_digital": {
  "youtubeId": "smRl05APPHw",
  "title": "Verificación de la presión arterial con equipo digital",
  "role": "instructional",
  "optional": false,
  "caption": "Éste es el procedimiento que describe el estándar: brazalete colocado conforme al fabricante, postura recomendada por el fabricante y registro del dato en la ficha."
 },
 "presion_manual_1": {
  "youtubeId": "DCbR3YJVKko",
  "title": "Presión arterial con baumanómetro manual · técnica",
  "role": "complementary",
  "optional": true,
  "caption": "Complementario. El EC1375 no exige la técnica auscultatoria."
 },
 "presion_manual_2": {
  "youtubeId": "addCc2ThmFg",
  "title": "Presión arterial con baumanómetro manual · desarrollo",
  "role": "complementary",
  "optional": true,
  "caption": "Complementario. Sirve para entender la lectura, no para demostrar el desempeño evaluado."
 },
 "estadimetro": {
  "youtubeId": "iIFdIoNYwhw",
  "title": "Uso del estadímetro y la báscula",
  "role": "demonstrative",
  "optional": true,
  "caption": ""
 },
 "goniometro": {
  "youtubeId": "cfzZpLtbDpU",
  "title": "Uso del goniómetro",
  "role": "demonstrative",
  "optional": true,
  "caption": "La goniometría se evalúa por Cuestionario, no como desempeño práctico."
 },
 "higiene_columna": {
  "youtubeId": "5c_lTr5N1PY",
  "title": "Higiene de columna: posiciones y manipulación de cargas",
  "role": "demonstrative",
  "optional": true,
  "caption": "Se pregunta por Cuestionario y se aplica al explicarle al usuario cómo incorporarse."
 },
 "daniels": {
  "youtubeId": "Jw8KntxU2PA",
  "title": "Pruebas funcionales musculares de Daniels",
  "role": "demonstrative",
  "optional": true,
  "caption": "Se evalúa por Cuestionario. El video ayuda a entender la escala."
 }
};

/* Cómo se agrupan en la galería de Tutoriales */
export const GRUPOS_MEDIOS = [
  { titulo: 'Elemento 1 · Preparar el espacio', ids: ['lavado_manos', 'cubrebocas', 'tapete_sanitizante', 'limpieza_desinfeccion', 'termometro'] },
  { titulo: 'Elemento 2 · Preparar al usuario', ids: ['aviso_privacidad', 'estadimetro', 'oximetro_pulso', 'frecuencia_respiratoria', 'presion_digital', 'presion_manual_1', 'presion_manual_2'] },
  { titulo: 'Conocimientos que se evalúan por cuestionario', ids: ['goniometro', 'higiene_columna', 'daniels'] },
];

/* Tutoriales de la plataforma (como los de Paideia, 17 sep): uno por paso y
   por recurso, grabados en la plataforma de verdad con una candidata
   ficticia, con letreros que explican cada paso. Son .mp4 propios con su
   portada .jpg en medios/tutoriales/ — no pasan por YouTube. Los graba
   pruebas/tutoriales/grabar-todos.mjs (5 oct). `dur` en segundos. */
const T = id => `medios/tutoriales/${id}.mp4`;
export const TUTORIALES_INFO = {
  inicio:          { titulo: 'Iniciar sesión',            desc: 'Entrar con tu correo y contraseña, y qué hacer si la olvidaste.', dur: 63 },
  general:         { titulo: 'Tu panel',                  desc: 'Dónde ver tu avance, tus documentos, tus pagos y tu siguiente paso.', dur: 52 },
  autodiagnostico: { titulo: 'Autodiagnóstico',           desc: 'Tus datos generales, el acuerdo, las 142 preguntas de SÍ o NO y tu resultado.', dur: 78 },
  reforzamiento:   { titulo: 'Reforzamiento',             desc: 'Repasar los temas que marcaste con NO y dar tu visto bueno.', dur: 43 },
  alineacion:      { titulo: 'Alineación',                desc: 'Inscribirte a tu sesión en vivo, llegar preparado y confirmar que la tomaste.', dur: 37 },
  plan:            { titulo: 'Plan de Evaluación',        desc: 'Qué se te va a evaluar, apartar tu sesión grabada, acordar la fecha y firmar el acuse.', dur: 48 },
  documentos:      { titulo: 'Documentos de Sesión',      desc: 'Los seis formatos que llevas a tu evaluación y cómo llenarlos con tu usuario.', dur: 56 },
  practica:        { titulo: 'Práctica',                  desc: 'Contestar por tema, repasar si fallas y volver a intentar.', dur: 37 },
  examen:          { titulo: 'Examen de Conocimientos',   desc: 'Las 37 preguntas oficiales, una a la vez, con repaso cuando fallas.', dur: 37 },
  encuesta:        { titulo: 'Encuesta de Satisfacción',  desc: 'Las 8 preguntas del CONOCER, los formatos de atención, tu firma y el envío.', dur: 34 },
  evidencias:      { titulo: 'Evidencias',                desc: 'Subir tus archivos, la liga de tu video y confirmar tu entrega.', dur: 34 },
  entrega:         { titulo: 'Entrega de certificado',    desc: 'Qué pasa después de tu evaluación y cómo pagar la Entrega.', dur: 32 },
  biblioteca:      { titulo: 'Biblioteca',                desc: 'Buscar cualquier tema, ver lo recomendado para ti y recorrer la presentación.', dur: 46 },
  guion:           { titulo: 'Guion Maestro',             desc: 'Lo que se dice y se hace en tu evaluación, de principio a fin, y cómo ensayarlo.', dur: 35 },
};
/* La ruta del video de cada uno (lo que lee recursos.html y el botón
   «Ver cómo se hace» de cada página). Vacío = "video pendiente". */
export const TUTORIALES = Object.fromEntries(Object.keys(TUTORIALES_INFO).map(id => [id, T(id)]));
export const portadaTutorial = ruta => String(ruta || '').replace(/\.mp4$/i, '.jpg');
export const duracionTexto = seg => { seg = Math.max(0, Math.round(Number(seg) || 0)); return seg ? `${Math.floor(seg / 60)}:${String(seg % 60).padStart(2, '0')}` : ''; };

/* GUION_PROPIOS: el video de ejemplo de cada sección del Guión Maestro,
   grabado por POSTURALIA (Short vertical). Dos formas de conectarlo:
     · archivo: ruta de un .mp4 propio dentro de la plataforma, p. ej.
       'medios/guion/preparacion.mp4' — se sirve desde el mismo sitio, sin
       YouTube: sin marca de terceros, sin "Ver en YouTube" y sin
       analíticas externas. Es la opción recomendada.
     · youtubeId: el ID de un video NO LISTADO de un canal de POSTURALIA.
   Si ambos están vacíos, la sección muestra solo los videos de técnica. */
export const GUION_PROPIOS = {
  preparacion:       { archivo: '', youtubeId: '' },   // Preparación del espacio y protocolo sanitario
  recepcion:         { archivo: '', youtubeId: '' },   // Recepción y bienvenida
  explicacion:       { archivo: '', youtubeId: '' },   // Explicación del proceso
  privacidad:        { archivo: '', youtubeId: '' },   // Aviso de privacidad e identificación
  ficha:             { archivo: '', youtubeId: '' },   // Ficha de registro y antecedentes
  peso_estatura:     { archivo: '', youtubeId: '' },   // Peso y estatura
  spo2_pulso:        { archivo: '', youtubeId: '' },   // Saturación de oxígeno y pulso
  postura:           { archivo: '', youtubeId: '' },   // Observación de postura
  frec_resp:         { archivo: '', youtubeId: '' },   // Frecuencia respiratoria
  presion:           { archivo: '', youtubeId: '' },   // Presión arterial
  verificar:         { archivo: '', youtubeId: '' },   // Verificación de no impedimento
  terapia_explicacion: { archivo: '', youtubeId: '' },   // Explicación de la atención
  consentimiento:    { archivo: '', youtubeId: '' },   // Consentimiento informado
  atencion:          { archivo: '', youtubeId: '' },   // Ejecución de la atención
  finalizacion:      { archivo: '', youtubeId: '' },   // Finalización de la sesión
  encuesta_usuario:  { archivo: '', youtubeId: '' },   // Encuesta de satisfacción del usuario
  plan_sesion:       { archivo: '', youtubeId: '' },   // Plan de sesiones
  plan_seguimiento:  { archivo: '', youtubeId: '' },   // Programación de seguimiento
  medio_contacto:    { archivo: '', youtubeId: '' },   // Medio de contacto
  cierre:            { archivo: '', youtubeId: '' },   // Cierre
};

/* TUTORIALES_EQUIPO: los del Centro Evaluador (como los `equipo: true` de
   Paideia). No salen al candidato ni en Recursos: se abren en ventana desde
   el botón «Tutorial» de su propia página del panel. Mientras no haya video
   (archivo .mp4 propio o YouTube no listado), la ventana muestra los pasos
   escritos, que ya sirven para capacitar a un evaluador nuevo. */
export const TUTORIALES_EQUIPO = {
  evaluador_iec: {
    titulo: 'Calificar el Instrumento de Evaluación (IEC)', dur: 54,
    video: { archivo: 'medios/tutoriales/evaluador-iec.mp4', youtubeId: '' },
    pasos: [
      'Elige al candidato. La lista los agrupa por cómo va su IEC: sin empezar, a medias o terminado.',
      'Sin la grabación de su sesión el IEC tiene candado: primero liga la grabación en Centro Evaluador → «Grabación de la sesión».',
      'Abre la grabación a un lado y ve elemento por elemento. Lo que el expediente ya respalda viene propuesto (conocimiento y producto en Sí, y el cuestionario si aprobó el Examen): confírmalo, no se guarda solo.',
      'Marca Sí solo lo que viste hacer. En cada No escribe la observación: es lo que se le explica al candidato.',
      '«Todo Sí» completa un grupo en Sí y respeta los No que ya pusiste.',
      'Un Sí con observación sale como aviso: revísalo antes de entregar, porque contradice el reactivo.',
      'Con el IEC completo, el juicio queda calculado. Publícalo en la Cédula de Evaluación y firma la rúbrica en «Firmas del evaluador».',
    ],
  },
  evaluador_verificacion: {
    titulo: 'Verificación Interna del Proceso', dur: 37,
    video: { archivo: 'medios/tutoriales/evaluador-verificacion.mp4', youtubeId: '' },
    pasos: [
      'Es la hoja del Centro (pág. 41 del formato): 14 puntos que se revisan antes de enviar el portafolio a la SEP.',
      'Escribe el nombre de quien verifica y la fecha. Sin el nombre, el portafolio sale con aviso.',
      'Contesta los 14 puntos con Sí o No. El punto 5 pide cero espacios en blanco en el Plan de Evaluación.',
      'Si algo va en No, anótalo en Observaciones y corrígelo antes de generar el portafolio.',
      'Guarda, firma la Verificación Interna en «Firmas del evaluador» e imprímela si la necesitas en papel.',
      'En «Portafolio de Evidencias» ya no debe salir ningún aviso de la Verificación Interna.',
    ],
  },
};
