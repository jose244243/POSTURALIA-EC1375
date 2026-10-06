/* ============================================================================
   POSTURALIA · data-plan-oficial.js — Contenido del Plan de Evaluación oficial

   Transcrito del FORMATO PORTAFOLIO-1375-2026 (páginas 22–34): las 29 filas
   de "Actividades y forma a desarrollar" con su técnica/instrumento, la
   tabla de requerimientos, los criterios de juicio, la nota y los avisos.
   Se imprime con js/doc-plan-oficial.js tal cual lo pide SEP-CONOCER.

   Notación de cada bloque:
     ['h', 'DESEMPEÑOS']                 subtítulo en negritas
     ['p', 'texto']                      párrafo (admite <b>)
     ['i', 'encabezado', [viñetas…]]     numeral con viñetas
   ========================================================================== */

const B = (t, v) => ['i', t, v];

export const ELEMENTOS_PLAN = [
  {
    n: 1,
    filas: [
      { no: 1, instr: 'Guía de Observación', b: [
        ['p', 'Preparar el espacio en la contribución tradicional y complementaria de la recuperación de las condiciones físicas y socioemocionales de las personas.'],
        ['h', 'DESEMPEÑOS'],
        B('1.Realiza los protocolos de seguridad sanitaria:', [
          'Antes de recibir al usuario,',
          'Lavándose las manos, conforme al protocolo señalado por la Organización Mundial de la Salud,',
          'Colocándose cubrebocas de tipo quirúrgico de triple capa, de acuerdo con las recomendaciones de uso de la Secretaría de Salud,',
          'Colocando tapete sanitizante con solución desinfectante al ingreso del inmueble,',
          'Disponiendo de gel antibacterial para el ingreso del inmueble, y',
          'Disponiendo de termómetro digital para el ingreso del inmueble']),
        ['h', 'ACTITUDES/HÁBITOS/VALORES'],
        ['p', '<b>Limpieza:</b> La manera en que el espacio acondicionado está libre de polvo, suciedad, manchas, malos olores y basura.'],
        ['p', '<b>Orden:</b> La manera en que el espacio acondicionado tiene dispuestos de manera organizada un lugar particular para sus equipos, materiales, herramientas, documentación y mobiliario.'],
      ]},
      { no: 2, instr: 'Lista de Cotejo', b: [
        ['h', 'PRODUCTOS'],
        B('1.El espacio acondicionado para otorgar el servicio de las técnicas tradicionales y complementarias:', [
          'Dispone del material, herramientas, mobiliario y equipo suficientes para otorgar el servicio,',
          'Cuenta con el espacio suficiente para el desplazamiento libre y a distancia entre el usuario y quien otorga el servicio,',
          'Cuenta con archivero / medio digital para el resguardo de la documentación del usuario,',
          'Está ventilado y sin corrientes de aire,',
          'Cuenta con energía eléctrica e iluminación natural,',
          'Presenta colores claros en las paredes y techo,',
          'Dispone de depósitos para desechar basura orgánica e inorgánica,',
          'Dispone de depósitos para desechar residuos peligrosos biológicos-infecciosos de acuerdo con la NOM-087-ECOL-SSA1-2002,',
          'Cuenta con un lugar específico para que los usuarios coloquen sus pertenencias.']),
      ]},
      { no: 3, instr: 'Lista de Cotejo', b: [
        B('2.Las herramientas y materiales de trabajo seleccionados:', [
          'Están limpias y desinfectadas / sanitizadas,',
          'Se encuentran disponibles y en condiciones para su uso,',
          'Están contenidas en estuches / depósitos / contenedores que las protejan de contaminantes ambientales, y',
          'Tienen las especificaciones de uso / vigencia / garantía / condiciones de operación de la empresa o proveedor.']),
      ]},
      { no: 4, instr: 'Cuestionario', b: [
        ['h', 'CONOCIMIENTOS'],
        ['p', '1.Técnicas de atención tradicional y complementaria.'],
      ]},
      { no: 5, instr: 'Cuestionario', b: [
        B('2.Desinfección vs Sanitización:', ['Definición.', 'Características.', 'Medios.', 'Recursos.']),
      ]},
      { no: 6, instr: 'Cuestionario', b: [
        ['p', '3.Manejo de residuos peligrosos NOM-087-ECOL-SSA1- 2002.'],
      ]},
    ],
  },
  {
    n: 2,
    filas: [
      { no: 7, instr: 'Guía de Observación', b: [
        ['p', 'Preparar al usuario para la contribución tradicional y complementaria de la recuperación de las condiciones físicas y socioemocionales de las personas.'],
        ['h', 'DESEMPEÑOS'],
        B('1.Recibe al usuario:', [
          'Saludándolo cordialmente,',
          'Aplicando los protocolos de seguridad sanitaria, con la aplicación de gel antibacterial en las manos y la toma digital de temperatura,',
          'Presentándose, indicando su nombre completo y su función,',
          'Agradeciendo su presencia,',
          'Preguntando su nombre completo,',
          'Indicándole pasar al lugar de recepción / antesala para su atención, y',
          'Ofreciéndole un lugar cómodo y previamente sanitizado para que tome asiento.']),
        ['h', 'ACTITUDES/HÁBITOS/VALORES'],
        ['p', '<b>Amabilidad:</b> La manera en que brinda el servicio al usuario, resolviendo sus dudas y recibiendo comentarios.'],
        ['p', '<b>Orden:</b> La manera en que integra el expediente clínico del usuario conforme al servicio tradicional y complementario otorgado.'],
        ['p', '<b>Responsabilidad:</b> La manera en que recaba y resguarda y no hace mal uso de la información que ha proporcionado el usuario'],
      ]},
      { no: 8, instr: 'Guía de Observación', b: [
        B('2.Introduce al usuario para el llenado de la bitácora / carpeta / documentación de atención integral:', [
          'Antes de iniciar la atención tradicional y complementaria,',
          'Estableciendo un clima de confianza,',
          'Señalando que la prestación de servicios auxiliares complementarios y tradicionales tienen como objetivo la recuperación de las condiciones físicas y socioemocionales de las personas,',
          'Indicando los principios de discreción y confidencialidad en su atención,',
          'Comentando al usuario que sus datos personales están protegidos conforme a la Ley Federal de Protección de Datos Personales en Posesión de Particulares,',
          'Indicándole sobre el llenado de su ficha de registro de atención de condiciones físicas y socioemocionales,',
          'Indicándole que se le realizará una exploración física, previa autorización manifestada con firma en la ficha de registro de atención de condiciones físicas y socioemocionales,',
          'Indicándole que se le tomarán signos vitales, el orden a seguir, la razones para ello, y su previa autorización manifestada con firma en la ficha de registro de atención de condiciones físicas y socioemocionales, y',
          'Preguntándole si tiene dudas, para su aclaración.']),
      ]},
      { no: 9, instr: 'Guía de Observación', b: [
        B('3.Introduce al usuario para el llenado de la ficha de registro de atención de condiciones físicas y socioemocionales:', [
          'Comentando al usuario que sus datos personales están protegidos conforme a la Ley Federal de Protección de Datos Personales en Posesión de Particulares,',
          'Solicitando la firma de enterado del usuario una vez comentado el Aviso de Privacidad,',
          'Corroborando nombre completo con identificación oficial vigente,',
          'Recabando la información de manera verbal y presencial por parte del usuario,',
          'Solicitando al usuario el llenado de la ficha de registro con sus datos generales, médico tratante, antecedentes físicos y sociemocionales, antecedentes heredo familiares, enfermedades crónicas, degenerativas y alergias, hábitos personales de alimentación y sueño, y la práctica de alguna actividad física,',
          'Registrando información acerca de su interés / necesidad / diagnóstico emitido por el médico tratante / profesional de la salud,',
          'Señalando que los servicios tradicionales y complementarios que se ofrecen no cubren, ni substituyen las indicaciones del médico tratante / profesional de la salud, y',
          'Agradeciendo su disponibilidad.']),
      ]},
      { no: 10, instr: 'Guía de Observación', b: [
        B('4.Mide niveles de saturación de oxígeno y pulso en el usuario:', [
          'Explicando el procedimiento, conforme a las indicaciones del fabricante del oxímetro,',
          'Limpiando la superficie del sensor, con un paño suave o un algodón y solución desinfectante, conforme a las recomendaciones del fabricante,',
          'Solicitando al usuario colocar el dedo en el sensor, conforme a las indicaciones del fabricante,',
          'Solicitando al usuario que durante la toma se mantenga sin movimientos que puedan alterar la medición,',
          'Presionando el interruptor de inicio de medición, de acuerdo con el fabricante, y',
          'Registrando los valores obtenidos de Sp02 y pulso, en la ficha de registro de atención de condiciones físicas y socioemocionales.']),
      ]},
      { no: 11, instr: 'Guía de Observación', b: [
        B('5.Observa la postura física del usuario:', [
          'Revisando visualmente la cabeza, cuello, tórax, extremidades y pelvis, y',
          'Registrando los datos obtenidos en la ficha de registro de atención de condiciones físicas y socioemocionales.']),
      ]},
      { no: 12, instr: 'Guía de Observación', b: [
        B('6.Realiza la toma de la frecuencia respiratoria del usuario:', [
          'Solicitando al usuario permanezca sentado y en reposo,',
          'Contando las elevaciones del tórax y abdomen durante un minuto, y',
          'Registrando los datos obtenidos en la ficha de registro de atención de condiciones físicas y socioemocionales.']),
      ]},
      { no: 13, instr: 'Guía de Observación', b: [
        B('7.Verifica la presión arterial del usuario:', [
          'Explicando el procedimiento a seguir, conforme a las indicaciones del fabricante del monitor de presión arterial de brazo,',
          'Colocando el brazalete en el brazo del usuario, conforme a las indicaciones del fabricante del equipo,',
          'Solicitando al usuario, tome la postura recomendada por el fabricante del equipo,',
          'Activando el interruptor de inicio conforme lo señala el fabricante, y',
          'Registrando los datos obtenidos en la ficha de registro de atención de condiciones físicas y socioemocionales.']),
      ]},
      { no: 14, instr: 'Lista de Cotejo', b: [
        ['h', 'PRODUCTOS'],
        B('1.La bitácora / carpeta / documentación de atención integral del usuario conformada:', [
          'Contiene la ficha de registro de atención de condiciones físicas y socioemocionales, plan de seguimiento de atención y consentimiento informado / aceptación del servicio tradicional y complementario,',
          'Contiene fecha, nombre completo del usuario, edad, peso, estatura, fecha de nacimiento, dirección y folio asignado,',
          'Incluye datos del médico tratante / profesional de la salud que atiende al usuario,',
          'Contiene antecedentes físicos, fisiológicos, socioemocionales y heredo familiares,',
          'Contiene el registro de enfermedades crónicas, degenerativas y alérgicas,',
          'Contiene información toxicológica,',
          'Contiene información sobre hábitos personales, de sueño, alimenticios, de higiene, deportivos, así como el consumo de sustancias farmacológicas y / o adictivas,',
          'Contiene los registros de la medición de los signos vitales y de las observaciones realizadas de la postura física del usuario,',
          'Contiene el resumen de los resultados actuales y previos con base en los estudios de laboratorio y gabinete,',
          'Contiene información acerca de su interés / necesidad / malestar para recibir el servicio,',
          'Señala la leyenda de que los servicios tradicionales y complementarios que se ofrecen no cubren, ni substituyen las indicaciones del médico tratante, y',
          'Contiene el nombre completo y firma del usuario, del asistente auxiliar y del profesional que brinda los servicios tradicionales y complementarios.']),
      ]},
      { no: 15, instr: 'Cuestionario', b: [
        ['h', 'CONOCIMIENTOS'],
        ['p', '1.Rangos y niveles de signos vitales en niños, adultos y personas de la tercera edad.'],
      ]},
      { no: 16, instr: 'Cuestionario', b: [ B('2.Goniometría:', ['Concepto.', 'Utilidad.', 'Aplicación.']) ]},
      { no: 17, instr: 'Cuestionario', b: [ B('3.Biomecánica:', ['Definición.', 'Planos anatómicos.', 'Ejes del cuerpo.', 'Movimientos del cuerpo.', 'Anatomía y Fisiología topográfica.']) ]},
      { no: 18, instr: 'Cuestionario', b: [ B('4.Higiene de columna:', ['Posiciones adecuadas.', 'Manipulaciones de carga.']) ]},
      { no: 19, instr: 'Cuestionario', b: [ B('5.Pruebas funcionales musculares de Daniels:', ['Posiciones.', 'Desarrollo.']) ]},
    ],
  },
  {
    n: 3,
    filas: [
      { no: 20, instr: 'Guía de Observación', b: [
        ['p', 'Introducir al usuario a la contribución tradicional y complementaria de la recuperación de las condiciones físicas y socioemocionales de las personas.'],
        ['h', 'DESEMPEÑOS'],
        B('1.Introduce al usuario a la contribución tradicional y complementaria:', [
          'Antes de que reciba la atención tradicional y complementaria,',
          'Identificando que no haya impedimento para recibir la atención tradicional y complementaria, de las condiciones físicas y socioemocionales de las personas, y',
          'Resaltando la importancia y el compromiso del usuario para el resultado satisfactorio de la atención tradicional y complementaria.']),
      ]},
      { no: 21, instr: 'Guía de observación', b: [
        B('2.Explica el procedimiento designado por el especialista en la contribución tradicional y complementaria:', [
          'Partiendo de los hallazgos encontrados durante la inspección visual de las condiciones del usuario / de una solicitud de atención por parte de un profesional de la salud / usuario sobre la recuperación de sus condiciones físicas y socioemocionales o de los hallazgos identificados en la exploración del usuario,',
          'Describiendo la atención tradicional y complementaria, así como sus bondades / beneficios / ventajas y alcance / casos de éxito,',
          'Señalando posibles reacciones / sensaciones / efectos durante y después de la atención,',
          'Mencionando el objetivo a alcanzar,',
          'Describiendo la vestimenta recomendada para la atención tradicional y complementaria,',
          'Preguntando si tiene dudas o algún comentario, para atenderlas.']),
      ]},
      { no: 22, instr: 'Guía de observación', b: [
        B('3.Presenta al usuario el documento de consentimiento informado / aceptación del servicio:', [
          'Antes de dar inicio a la atención tradicional y complementaria,',
          'Describiendo en qué consiste el documento, su contenido y alcances, y',
          'Recabando firma de aceptación por parte del usuario.']),
      ]},
      { no: 23, instr: 'Guía de observación', b: [
        B('4.Informa al usuario sobre la finalización del servicio tradicional y complementario:', [
          'Indicando que el servicio ha finalizado,',
          'Mencionando que puede permanecer en la mesa / superficie por unos momentos y sus razones,',
          'Preguntando cómo se siente después de la atención recibida,',
          'Preguntando si tiene dudas al respecto para atenderlas,',
          'Informando el efecto de las técnicas dentro de las veinticuatro horas subsecuentes a su aplicación,',
          'Explicando la forma que debe incorporarse, conforme a los protocolos de Higiene de Columna,',
          'Dejando el área de trabajo para permitirle al usuario vestirse.']),
      ]},
      { no: 24, instr: 'Lista de cotejo', b: [
        ['h', 'PRODUCTOS'],
        B('1.La carta de consentimiento informado / aceptación del servicio elaborada:', [
          'Contiene fecha, nombre completo del usuario, edad, fecha de nacimiento, dirección, nombre de algún familiar a quien avisar en caso de que se requiera,',
          'Contiene el Aviso de Privacidad, conforme la Ley Federal de Protección de Datos Personales en Posesión de Particulares,',
          'Contiene descritas las técnicas a aplicar,',
          'Especifica los puntos y zonas del cuerpo que tocará de acuerdo con el efecto a lograr,',
          'Contiene descritas las reacciones físicas posibles que se presentan,',
          'Especifica la vestimenta recomendada para la preparación de las técnicas,',
          'Señala limitantes de aplicación del servicio de técnicas tradicionales y complementarias,',
          'Describe las condiciones de preparación que debe cubrir el usuario,',
          'Contiene el número de sesiones a utilizar y la duración de cada sesión,',
          'Contiene los objetivos a alcanzar por sesión y los efectos generales,',
          'Contiene la rúbrica / firma / huella de conformidad del usuario,',
          'Está integrada al expediente del usuario, y',
          'Contiene nombre y firma / huella digital del usuario y de quien otorga el servicio tradicional y complementario.']),
      ]},
    ],
  },
  {
    n: 4,
    filas: [
      { no: 25, instr: 'Guía de Observación', b: [
        ['p', 'Dar seguimiento al usuario en la contribución tradicional y complementaria de la recuperación de las condiciones físicas y socioemocionales de las personas.'],
        ['h', 'DESEMPEÑOS'],
        B('1.Aplica encuesta de satisfacción:', [
          'Al término del servicio,',
          'Explicando las instrucciones para su llenado,',
          'Recibiendo comentarios acerca del servicio,',
          'Agradeciendo al usuario su colaboración y comentarios.']),
      ]},
      { no: 26, instr: 'Guía de Observación', b: [
        B('2.Acuerda con el usuario el programa de seguimiento:', [
          'Una vez finalizado el servicio,',
          'Atendiendo las indicaciones del profesional que otorgo la atención tradicional y complementaria,',
          'Mencionando el objetivo a alcanzar por sesión con la atención tradicional y complementaria,',
          'Proponiendo fechas y horarios,',
          'Acordando fechas y horarios,',
          'Resaltando las recomendaciones para su tratamiento por parte del especialista de la atención tradicional y complementaria,',
          'Indicando que la atención será permanente para la aclaración de dudas / manifestación de inquietudes / consulta de información respecto al servicio recibido, y',
          'Confirmando que se hayan resuelto las dudas planteadas.']),
      ]},
      { no: 27, instr: 'Guía de Observación', b: [
        B('3.Asegura el medio de contacto para el seguimiento al usuario:', [
          'Solicitando la vía más viable para mantener la comunicación,',
          'Registrando teléfono fijo / teléfono celular / correo electrónico / redes sociales,',
          'Proporcionándole datos del Centro de Atención Tradicional y Complementaria y los datos de atención telefónica, y',
          'Agradeciendo su asistencia, disposición y confianza.']),
      ]},
      { no: 28, instr: 'Lista de cotejo', b: [
        ['h', 'PRODUCTOS'],
        B('1.Plan de Seguimiento elaborado:', [
          'Contiene datos que incluyen información general sobre fechas y horarios,',
          'Señala el medio de contacto para el seguimiento: encuentro presencial / llamada Telefónica / correo electrónico / mensaje telefónico / plataformas digitales,',
          'Contiene número de sesiones programadas, su frecuencia y duración,',
          'Contiene el plan de sesión programado, y',
          'Contiene nombre y firma / huella digital del usuario y de quien otorga el servicio tradicional y complementario.']),
      ]},
      { no: 29, instr: 'Lista de cotejo', b: [
        B('2.El Plan de sesión elaborado:', [
          'Se integra en el Plan de Seguimiento,',
          'Contiene por cada sesión de atención, número, fecha, hora de inicio y término y el registro de los signos vitales,',
          'Describe las actividades / intervenciones / atención que se otorgará en el servicio al usuario,',
          'Incluye notas de evolución y el pronóstico del número de sesiones de atención que serán necesarias para el bienestar del usuario, e',
          'Incluye para realizar en casa actividades / tareas / ejercicios que coadyuven a la atención recibida.']),
      ]},
    ],
  },
];

export const REQUERIMIENTOS_PLAN = [
  'Escritorio / mesa para la atención al usuario.', 'Sillas.', 'Lavabo de manos.', 'Computadora.',
  'Mesa de apoyo para herramientas y materiales.', 'Banco de altura.', 'Báscula.', 'Archivero.',
  'Baumanómetro.', 'Oxímetro.', 'Estandímetro.', 'Termómetro digital.',
  'Música ambiental para relajación.', 'Perchero.', 'Áreas de recepción y de atención.',
];

export const NOTA_PLAN = 'En caso de no concluir el proceso de evaluación en los tiempos establecidos en el plan de evaluación firmado de conformidad, Podrá solicitar reiniciar su proceso de evaluación responsabilizándose de los costos adicionales que esto pueda generar.';

export const CONFIRMO_PLAN = [
  'Se me proporcionó información suficiente y detallada respecto a los desempeños, productos conocimientos a demostrar durante la evaluación, así como los lugares, fechas y horarios en que se realizará.',
  'Se me proporcionó y explicó el tríptico Derechos y Obligaciones de los usuarios del Sistema Nacional de Competencias.',
];

export const NOTAS_FINALES_PLAN = [
  'La emisión del Certificado, deberá realizarse en un periodo estimado de 90 días naturales a partir de la entrega de resultados al candidato',
  'Previo a la solicitud del certificado, el proceso de evaluación será revisado por un <i>Grupo de Dictamen,</i> para asegurar que el evaluador trabajó en apego a la normatividad establecida por el CONOCER y a lo solicitado en el Estándar de Competencia.',
  'En caso de que el Grupo de Dictamen determine que el evaluador NO se apegó a la normatividad el proceso de evaluación tendrá que reponerse al candidato, sin costo y con un evaluador distinto.',
  'Si el Grupo de Dictamen Ratifica el juicio dado por el evaluador, el CE/EI se pondrá en contacto con el candidato para indicarle los trámites correspondientes ante la ECE/OC para la emisión del Certificado de competencia.',
];
