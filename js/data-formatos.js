/* ============================================================================
   POSTURALIA · Plataforma de Certificación
   data-formatos.js — Los seis formatos que se usan el día de la sesión

   De dónde sale esto: son los contenidos obligatorios que el EC1375 enumera
   reactivo por reactivo, tal como aparecen en las listas de cotejo del
   material de Alineación. No son un formato "bonito" inventado aquí: cada
   línea corresponde a un reactivo que el evaluador revisa documento en mano.

   Por qué importa tanto que estén completos: un formato al que le falta un
   contenido no pierde un punto, pierde el reactivo entero — y varios de
   estos reactivos son de los pesados. Bajar un formato genérico de internet
   es de los errores más caros que se pueden cometer, porque se descubre el
   día de la evaluación y ya no hay manera de arreglarlo.

   Actualizado el 22-sep-2026 contra la redacción OFICIAL de los reactivos
   (EC1375_DATA.bloques de Paideia V4.5): cada contenido de las listas de
   cotejo de los productos E1·P1, E1·P2, E2·P1, E3·P1, E4·P1 y E4·P2 tiene
   aquí su campo, incluidos los eliminatorios 7, 8, 16, 17, 75, 106 y 142.

   ── Advertencia ───────────────────────────────────────────────────────────
   La ESTRUCTURA está tomada del estándar. La redacción de las leyendas y el
   orden de los campos los armó esta plataforma para que sean usables en
   papel. Humberto tiene que validarlos contra el instrumento oficial antes
   de usarlos con un candidato real — igual que los reactivos.
   ========================================================================== */

/* Tipos de campo:
     texto    una línea
     area     varias líneas
     fecha    fecha
     firma    espacio de firma en el impreso
     leyenda  texto fijo que DEBE aparecer, no se llena
     grupo    encabezado dentro del formato                                  */

export const FORMATOS = [

  /* ── 1. Ficha de Registro ─────────────────────────────────────────────
     Reactivos de la bitácora: doce contenidos. El primero de la lista del
     estándar ("ficha + plan de seguimiento + consentimiento") no es un campo
     sino la exigencia de que los tres vivan en el mismo expediente, así que
     aquí aparece como nota al pie y no como renglón que llenar.            */
  {
    clave: 'ficha',
    nombre: 'Ficha de Registro del usuario',
    para: 'Se llena al recibir al usuario, antes de cualquier maniobra.',
    reactivos: 'Lista de cotejo · doce contenidos de la bitácora',
    campos: [
      { t: 'grupo',   x: 'Identificación' },
      { t: 'texto',   x: 'Folio', ancho: 'corto' },
      { t: 'fecha',   x: 'Fecha', ancho: 'corto' },
      { t: 'texto',   x: 'Nombre completo' },
      { t: 'fecha',   x: 'Fecha de nacimiento', ancho: 'corto' },
      { t: 'texto',   x: 'Edad', ancho: 'corto' },
      { t: 'texto',   x: 'Peso', ancho: 'corto' },
      { t: 'texto',   x: 'Estatura', ancho: 'corto' },
      { t: 'texto',   x: 'Dirección' },
      { t: 'texto',   x: 'Identificación oficial vigente cotejada (tipo y número)' },
      { t: 'texto',   x: 'Contacto: teléfono fijo / celular / correo electrónico / redes sociales' },

      { t: 'grupo',   x: 'Aviso de privacidad y autorizaciones' },
      { t: 'leyenda', x: 'AVISO DE PRIVACIDAD. Sus datos personales están protegidos conforme a la ' +
                          'Ley Federal de Protección de Datos Personales en Posesión de los Particulares ' +
                          '(LFPDPPP) y se tratan con discreción y confidencialidad, con la única finalidad ' +
                          'de prestarle el servicio.' },
      { t: 'firma',   x: 'Firma de enterado del Aviso de Privacidad (usuario)' },
      { t: 'firma',   x: 'Autorizo que se me realice una exploración física (usuario)' },
      { t: 'firma',   x: 'Autorizo la toma de mis signos vitales (usuario)' },

      { t: 'grupo',   x: 'Profesional de la salud' },
      { t: 'texto',   x: 'Médico tratante o profesional de la salud' },
      { t: 'texto',   x: 'Contacto del médico tratante' },
      { t: 'area',    x: 'Diagnóstico del médico tratante, si existe', filas: 2 },

      { t: 'grupo',   x: 'Antecedentes' },
      { t: 'area',    x: 'Antecedentes físicos y fisiológicos', filas: 2 },
      { t: 'area',    x: 'Antecedentes socioemocionales', filas: 2 },
      { t: 'area',    x: 'Antecedentes heredofamiliares', filas: 2 },
      { t: 'area',    x: 'Enfermedades crónicas, degenerativas y alérgicas', filas: 2 },
      { t: 'area',    x: 'Información toxicológica', filas: 2 },

      { t: 'grupo',   x: 'Hábitos' },
      { t: 'area',    x: 'Sueño, alimentación, higiene y deporte', filas: 2 },
      { t: 'area',    x: 'Fármacos y sustancias adictivas', filas: 2 },

      { t: 'grupo',   x: 'Exploración' },
      { t: 'texto',   x: 'Presión arterial (mmHg)', ancho: 'corto' },
      { t: 'texto',   x: 'Pulso (lpm)', ancho: 'corto' },
      { t: 'texto',   x: 'Saturación de oxígeno SpO₂ (%)', ancho: 'corto' },
      { t: 'texto',   x: 'Temperatura (°C)', ancho: 'corto' },
      { t: 'texto',   x: 'Frecuencia respiratoria (rpm)', ancho: 'corto' },
      { t: 'area',    x: 'Observación postural', filas: 3 },
      { t: 'area',    x: 'Resumen de estudios de laboratorio y gabinete, actuales y previos', filas: 2 },

      { t: 'grupo',   x: 'Motivo' },
      { t: 'area',    x: 'Interés, necesidad o malestar para recibir el servicio', filas: 3 },

      { t: 'leyenda', x: 'Los servicios que aquí se prestan NO cubren ni sustituyen ' +
                          'las indicaciones del médico tratante o profesional de la salud.' },

      { t: 'leyenda', x: 'Este expediente integra: ☐ Ficha de registro  ☐ Plan de seguimiento  ' +
                          '☐ Consentimiento informado / aceptación del servicio' },

      { t: 'firma',   x: 'Nombre completo y firma del usuario' },
      { t: 'firma',   x: 'Nombre completo y firma del asistente auxiliar' },
      { t: 'firma',   x: 'Nombre completo y firma del profesional que otorga el servicio' },
    ],
    nota: 'Esta ficha se archiva junto con el consentimiento informado y el ' +
          'plan de seguimiento: el estándar pide que los tres estén integrados ' +
          'en el mismo expediente del usuario.',
  },

  /* ── 2. Carta de Consentimiento Informado ────────────────────────────── */
  {
    clave: 'consentimiento',
    nombre: 'Carta de Consentimiento Informado',
    para: 'Se presenta, se explica y se firma ANTES de iniciar la técnica. ' +
          'Firmado a media sesión no cumple.',
    reactivos: 'Lista de cotejo · trece contenidos obligatorios',
    campos: [
      { t: 'grupo',   x: 'Datos del usuario' },
      { t: 'texto',   x: 'Folio del expediente al que se integra', ancho: 'corto' },
      { t: 'fecha',   x: 'Fecha', ancho: 'corto' },
      { t: 'texto',   x: 'Nombre completo' },
      { t: 'texto',   x: 'Edad', ancho: 'corto' },
      { t: 'fecha',   x: 'Fecha de nacimiento', ancho: 'corto' },
      { t: 'texto',   x: 'Dirección' },
      { t: 'texto',   x: 'Familiar a quien avisar y su teléfono' },

      { t: 'leyenda', x: 'AVISO DE PRIVACIDAD. Sus datos personales serán tratados ' +
                          'conforme a la Ley Federal de Protección de Datos Personales ' +
                          'en Posesión de los Particulares (LFPDPPP), con la única ' +
                          'finalidad de prestarle el servicio, bajo principios de ' +
                          'discreción y confidencialidad.' },

      { t: 'grupo',   x: 'En qué consiste el servicio' },
      { t: 'area',    x: 'Descripción de las técnicas a aplicar', filas: 3 },
      { t: 'area',    x: 'Puntos y zonas del cuerpo que se tocarán, según el efecto a lograr', filas: 3 },
      { t: 'area',    x: 'Reacciones físicas posibles que se presentan', filas: 2 },
      { t: 'area',    x: 'Vestimenta recomendada para la preparación de las técnicas', filas: 2 },
      { t: 'area',    x: 'Limitantes de aplicación del servicio', filas: 2 },
      { t: 'area',    x: 'Condiciones de preparación que debe cubrir el usuario', filas: 2 },

      { t: 'grupo',   x: 'Alcance acordado' },
      { t: 'texto',   x: 'Número de sesiones', ancho: 'corto' },
      { t: 'texto',   x: 'Duración de cada sesión', ancho: 'corto' },
      { t: 'area',    x: 'Objetivos por sesión y efectos generales esperados', filas: 3 },

      { t: 'leyenda', x: 'Declaro que se me explicó lo anterior en un lenguaje que ' +
                          'entiendo, que tuve oportunidad de preguntar y que mis dudas ' +
                          'fueron aclaradas, y otorgo mi conformidad para recibir el ' +
                          'servicio en los términos aquí descritos.' },

      { t: 'firma',   x: 'Rúbrica, firma o huella de conformidad del usuario' },
      { t: 'firma',   x: 'Nombre completo y firma / huella digital del usuario' },
      { t: 'firma',   x: 'Nombre completo y firma de quien otorga el servicio' },
    ],
    nota: 'Se archiva integrada al expediente del usuario al terminar la sesión.',
  },

  /* ── 3. Plan de Sesión ────────────────────────────────────────────────── */
  {
    clave: 'plan_sesion',
    nombre: 'Plan de Sesión',
    para: 'Lo que se va a hacer en esta sesión concreta, escrito antes de empezar.',
    reactivos: 'Producto del Elemento 4 · Lista de cotejo · cinco contenidos',
    campos: [
      { t: 'grupo',   x: 'Sesión' },
      { t: 'texto',   x: 'Folio del Plan de Seguimiento al que se integra', ancho: 'corto' },
      { t: 'texto',   x: 'Nombre del usuario' },
      { t: 'texto',   x: 'Número de sesión', ancho: 'corto' },
      { t: 'fecha',   x: 'Fecha', ancho: 'corto' },
      { t: 'texto',   x: 'Hora de inicio', ancho: 'corto' },
      { t: 'texto',   x: 'Hora de término', ancho: 'corto' },

      { t: 'grupo',   x: 'Registro de signos vitales de esta sesión' },
      { t: 'texto',   x: 'Presión arterial (mmHg)', ancho: 'corto' },
      { t: 'texto',   x: 'Pulso (lpm)', ancho: 'corto' },
      { t: 'texto',   x: 'SpO₂ (%)', ancho: 'corto' },
      { t: 'texto',   x: 'Temperatura (°C)', ancho: 'corto' },
      { t: 'texto',   x: 'Frecuencia respiratoria (rpm)', ancho: 'corto' },

      { t: 'grupo',   x: 'Contenido de la sesión' },
      { t: 'area',    x: 'Objetivo de esta sesión', filas: 2 },
      { t: 'area',    x: 'Actividades / intervenciones / atención que se otorgará, en orden', filas: 4 },
      { t: 'area',    x: 'Zonas del cuerpo a trabajar', filas: 2 },
      { t: 'area',    x: 'Material, herramientas y equipo requeridos', filas: 2 },
      { t: 'texto',   x: 'Duración estimada', ancho: 'corto' },

      { t: 'grupo',   x: 'Cierre' },
      { t: 'area',    x: 'Cómo se sintió el usuario al terminar', filas: 2 },
      { t: 'area',    x: 'Notas de evolución', filas: 3 },
      { t: 'texto',   x: 'Pronóstico del número de sesiones necesarias para el bienestar del usuario' },
      { t: 'area',    x: 'Actividades / tareas / ejercicios para realizar en casa que coadyuven a la ' +
                         'atención recibida (reactivo eliminatorio: no lo dejes en blanco)', filas: 3 },
      { t: 'area',    x: 'Observaciones', filas: 2 },

      { t: 'firma',   x: 'Usuario' },
      { t: 'firma',   x: 'Quien otorga el servicio' },
    ],
    nota: 'El plan de sesión programado se retoma en el plan de seguimiento.',
  },

  /* ── 4. Plan de Seguimiento ──────────────────────────────────────────── */
  {
    clave: 'plan_seguimiento',
    nombre: 'Plan de Seguimiento',
    para: 'Cómo continúa la atención después de esta sesión.',
    reactivos: 'Lista de cotejo · cinco contenidos',
    campos: [
      { t: 'grupo',   x: 'Fechas y horarios' },
      { t: 'texto',   x: 'Nombre del usuario' },
      { t: 'area',    x: 'Información general sobre fechas y horarios acordados', filas: 3 },

      { t: 'grupo',   x: 'Contacto' },
      { t: 'area',    x: 'Medio de contacto para el seguimiento: encuentro presencial / llamada ' +
                         'telefónica / correo electrónico / mensaje telefónico / plataformas digitales', filas: 2 },
      { t: 'texto',   x: 'Teléfono fijo / celular / correo electrónico / redes sociales del usuario' },
      { t: 'texto',   x: 'Datos del Centro de Atención y teléfono de atención' },

      { t: 'grupo',   x: 'Programa' },
      { t: 'texto',   x: 'Número de sesiones programadas', ancho: 'corto' },
      { t: 'texto',   x: 'Frecuencia', ancho: 'corto' },
      { t: 'texto',   x: 'Duración de cada sesión', ancho: 'corto' },
      { t: 'area',    x: 'El plan de sesión programado', filas: 4 },
      { t: 'area',    x: 'Recomendaciones del especialista para su tratamiento', filas: 3 },

      { t: 'firma',   x: 'Nombre completo y firma / huella digital del usuario' },
      { t: 'firma',   x: 'Nombre completo y firma de quien otorga el servicio' },
    ],
    nota: 'Se archiva junto con la ficha de registro y el consentimiento informado.',
  },

  /* ── 5. Encuesta de satisfacción del usuario (E4·D1, reactivos 117-120)
     Es la que el CANDIDATO le aplica a SU usuario al terminar el servicio;
     no confundir con la encuesta CONOCER que contesta el candidato sobre su
     propia evaluación (encuesta.html). Redacción de las preguntas: propuesta
     de esta plataforma, a validar por Humberto.                           */
  {
    clave: 'encuesta_usuario',
    nombre: 'Encuesta de satisfacción del usuario',
    para: 'Se aplica al término del servicio: explícale cómo llenarla, recibe sus comentarios y agradécele.',
    reactivos: 'Desempeño E4·D1 · cuatro reactivos',
    campos: [
      { t: 'grupo',   x: 'Datos' },
      { t: 'texto',   x: 'Nombre del usuario (opcional)' },
      { t: 'fecha',   x: 'Fecha', ancho: 'corto' },
      { t: 'leyenda', x: 'INSTRUCCIONES. Califique cada enunciado del 1 al 5, donde 1 es "totalmente ' +
                          'en desacuerdo" y 5 es "totalmente de acuerdo". Sus respuestas nos ayudan a ' +
                          'mejorar el servicio.' },
      { t: 'grupo',   x: 'Su opinión sobre el servicio' },
      { t: 'texto',   x: 'Se me explicó con claridad en qué consistía el servicio (1-5)', ancho: 'corto' },
      { t: 'texto',   x: 'Se me trató con respeto, discreción y confidencialidad (1-5)', ancho: 'corto' },
      { t: 'texto',   x: 'El espacio estaba limpio, ordenado y ventilado (1-5)', ancho: 'corto' },
      { t: 'texto',   x: 'Se atendieron mis dudas antes y después de la sesión (1-5)', ancho: 'corto' },
      { t: 'texto',   x: 'Recomendaría este servicio (1-5)', ancho: 'corto' },
      { t: 'area',    x: 'Comentarios acerca del servicio', filas: 3 },
      { t: 'leyenda', x: 'Gracias por su colaboración y sus comentarios.' },
      { t: 'firma',   x: 'Firma del usuario' },
    ],
    nota: 'Se archiva en el expediente del usuario junto con el plan de seguimiento.',
  },

  /* ── 6. Verificación del espacio y las herramientas (E1·P1 y E1·P2)
     Los trece contenidos de las listas de cotejo, con su redacción oficial.
     Cuatro son eliminatorios (7, 8, 16 y 17).                              */
  {
    clave: 'verificacion_espacio',
    nombre: 'Verificación del espacio y las herramientas',
    para: 'Se revisa antes de recibir al usuario, el mismo día de la evaluación.',
    reactivos: 'Productos E1·P1 y E1·P2 · trece contenidos',
    campos: [
      { t: 'fecha',   x: 'Fecha', ancho: 'corto' },
      { t: 'grupo',   x: 'El espacio acondicionado para otorgar el servicio (E1·P1)' },
      { t: 'leyenda', x: '☐ ★ Dispone del material, herramientas, mobiliario y equipo suficientes para otorgar el servicio' },
      { t: 'leyenda', x: '☐ ★ Cuenta con el espacio suficiente para el desplazamiento libre y a distancia entre el usuario y quien otorga el servicio' },
      { t: 'leyenda', x: '☐ Cuenta con archivero / medio digital para el resguardo de la documentación del usuario' },
      { t: 'leyenda', x: '☐ Está ventilado y sin corrientes de aire' },
      { t: 'leyenda', x: '☐ Cuenta con energía eléctrica e iluminación natural' },
      { t: 'leyenda', x: '☐ Presenta colores claros en las paredes y techo' },
      { t: 'leyenda', x: '☐ Dispone de depósitos para desechar basura orgánica e inorgánica' },
      { t: 'leyenda', x: '☐ Dispone de depósitos para desechar residuos peligrosos biológico-infecciosos de acuerdo con la NOM-087-ECOL-SSA1-2002' },
      { t: 'leyenda', x: '☐ Cuenta con un lugar específico para que los usuarios coloquen sus pertenencias' },
      { t: 'grupo',   x: 'Las herramientas y materiales de trabajo seleccionados (E1·P2)' },
      { t: 'leyenda', x: '☐ ★ Están limpias y desinfectadas / sanitizadas' },
      { t: 'leyenda', x: '☐ ★ Se encuentran disponibles y en condiciones para su uso' },
      { t: 'leyenda', x: '☐ Están contenidas en estuches / depósitos / contenedores que las protejan de contaminantes ambientales' },
      { t: 'leyenda', x: '☐ Tienen las especificaciones de uso / vigencia / garantía / condiciones de operación de la empresa o proveedor' },
      { t: 'firma',   x: 'Nombre completo y firma de quien otorga el servicio' },
    ],
    nota: 'Los marcados ★ son eliminatorios: uno solo sin cumplir reprueba la evaluación.',
  },
];

export const formatoPorClave = c => FORMATOS.find(f => f.clave === c);

/* Cuántos renglones que de verdad se llenan tiene un formato — sirve para
   decirle al candidato qué tan largo es antes de que lo abra. */
export const camposLlenables = f =>
  f.campos.filter(c => ['texto', 'area', 'fecha'].includes(c.t)).length;
