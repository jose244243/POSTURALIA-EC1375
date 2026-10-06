/* POSTURALIA · data-guion.js
   `videos` (por sección): mediaIds de js/data-medios.js que se muestran en
   ese bloque del guión — los mismos videos oficiales de Paideia V4.5.
 — Guión Maestro real del EC1375.
   Extraído íntegro de guion.json. Tipos de item:
     dialogo   = lo que dice quien presta el servicio
     usuario   = respuesta esperada del usuario
     accion    = lo que hay que hacer (evaluable por observación)
     nota      = advertencia sobre el alcance del estándar
     subtitulo = encabezado dentro de la sección                           */

/* Versión del guión. Los pasos dominados se guardan por posición
   ("sección.renglón"); al insertar las secciones 1 y 16 (22-sep-2026) las
   posiciones se recorren, y documentos.html migra las marcas viejas con
   MIGRAR_POSICIONES para que el candidato no pierda lo que ya dominaba. */
export const GUION_VERSION = '2026-09-22';
/* índice viejo → índice nuevo (secciones de la versión anterior) */
export const MIGRAR_POSICIONES = {"0": 1, "1": 2, "2": 3, "3": 4, "4": 5, "5": 6, "6": 7, "7": 8, "8": 9, "9": 10, "10": 11, "11": 12, "12": 13, "13": 14, "14": 16, "15": 17, "16": 18, "17": 19};

export const GUION = [
 {
  "clave": "preparacion",
  "nombre": "Preparación del espacio y protocolo sanitario",
  "seccionNum": 1,
  "items": [
   {
    "t": "subtitulo",
    "x": "Antes de recibir al usuario (E1·D1, E1·P1, E1·P2)"
   },
   {
    "t": "accion",
    "x": "Lavarse las manos conforme al protocolo de la Organización Mundial de la Salud (reactivo eliminatorio)."
   },
   {
    "t": "accion",
    "x": "Colocarse cubrebocas quirúrgico de triple capa, según las recomendaciones de la Secretaría de Salud."
   },
   {
    "t": "accion",
    "x": "Colocar el tapete sanitizante con solución desinfectante al ingreso del inmueble."
   },
   {
    "t": "accion",
    "x": "Disponer gel antibacterial y termómetro digital en el ingreso del inmueble."
   },
   {
    "t": "accion",
    "x": "Verificar el espacio: material, mobiliario y equipo suficientes; espacio para desplazarse; archivero o medio digital; ventilado y sin corrientes de aire; energía eléctrica e iluminación natural; paredes y techo claros; depósitos de basura orgánica e inorgánica; depósito de residuos peligrosos biológico-infecciosos (NOM-087); lugar para las pertenencias del usuario."
   },
   {
    "t": "accion",
    "x": "Verificar las herramientas y materiales: limpios y desinfectados / sanitizados, disponibles y en condiciones de uso, guardados en estuches o contenedores, con sus especificaciones de uso / vigencia / garantía."
   },
   {
    "t": "nota",
    "x": "Los reactivos 2 (lavado de manos), 7 y 8 (espacio) y 16 y 17 (herramientas) son eliminatorios: uno solo sin cumplir reprueba la evaluación completa. Usa el formato «Verificación del espacio y las herramientas»."
   }
  ],
  "videos": [
   "lavado_manos",
   "cubrebocas",
   "tapete_sanitizante",
   "limpieza_desinfeccion"
  ]
 },
 {
  "clave": "recepcion",
  "nombre": "Recepción y bienvenida",
  "seccionNum": 2,
  "items": [
   {
    "t": "dialogo",
    "x": "Buenos días. Bienvenido."
   },
   {
    "t": "accion",
    "x": "Aplicar gel antibacterial en las manos del usuario."
   },
   {
    "t": "dialogo",
    "x": "Antes de pasar, voy a tomarle la temperatura."
   },
   {
    "t": "accion",
    "x": "Tomar la temperatura con termómetro digital."
   },
   {
    "t": "dialogo",
    "x": "Mi nombre es [NOMBRE COMPLETO] y mi función es [FUNCIÓN]. Muchas gracias por acompañarnos el día de hoy. ¿Me puede proporcionar su nombre completo, por favor?"
   },
   {
    "t": "usuario",
    "x": "[NOMBRE COMPLETO]."
   },
   {
    "t": "dialogo",
    "x": "Muchas gracias, [NOMBRE]. Por favor, acompáñeme al área de recepción."
   },
   {
    "t": "accion",
    "x": "Conducirlo a recepción/antesala y ofrecer un lugar cómodo previamente sanitizado."
   },
   {
    "t": "dialogo",
    "x": "Puede tomar asiento aquí, por favor. El lugar ha sido previamente sanitizado."
   }
  ],
  "videos": [
   "termometro"
  ]
 },
 {
  "clave": "explicacion",
  "nombre": "Explicación del proceso",
  "seccionNum": 3,
  "items": [
   {
    "t": "dialogo",
    "x": "Antes de comenzar quiero explicarle cómo vamos a llevar a cabo su atención."
   },
   {
    "t": "dialogo",
    "x": "Los servicios auxiliares tradicionales y complementarios tienen como objetivo contribuir a la recuperación de las condiciones físicas y socioemocionales de las personas."
   },
   {
    "t": "dialogo",
    "x": "La información que usted nos proporcione será manejada bajo principios de discreción y confidencialidad. Sus datos personales están protegidos conforme a la Ley Federal de Protección de Datos Personales en Posesión de Particulares."
   },
   {
    "t": "dialogo",
    "x": "Vamos a integrar su ficha de registro de atención de condiciones físicas y socioemocionales."
   },
   {
    "t": "dialogo",
    "x": "Posteriormente realizaremos una exploración física y tomaremos sus signos vitales. Para realizar estos procedimientos necesitaremos previamente su autorización mediante la firma correspondiente en su ficha de registro."
   },
   {
    "t": "dialogo",
    "x": "¿Hasta este momento tiene alguna duda?"
   },
   {
    "t": "usuario",
    "x": "No."
   },
   {
    "t": "dialogo",
    "x": "Perfecto. Si durante el proceso surge cualquier duda, puede comentármela."
   }
  ]
 },
 {
  "clave": "privacidad",
  "nombre": "Aviso de privacidad e identificación",
  "seccionNum": 4,
  "items": [
   {
    "t": "accion",
    "x": "Presentar/comentar el Aviso de Privacidad."
   },
   {
    "t": "dialogo",
    "x": "Este es nuestro Aviso de Privacidad. Una vez que ha sido informado sobre el manejo de sus datos personales, necesito su firma de enterado, por favor."
   },
   {
    "t": "accion",
    "x": "Recabar firma."
   },
   {
    "t": "dialogo",
    "x": "Ahora necesito corroborar su nombre completo con una identificación oficial vigente, por favor."
   },
   {
    "t": "accion",
    "x": "Revisar identificación y corroborar nombre."
   }
  ],
  "videos": [
   "aviso_privacidad"
  ]
 },
 {
  "clave": "ficha",
  "nombre": "Ficha de registro y antecedentes",
  "seccionNum": 5,
  "items": [
   {
    "t": "dialogo",
    "x": "Vamos a completar su ficha de registro. Le voy a solicitar algunos datos y antecedentes necesarios para su atención."
   },
   {
    "t": "accion",
    "x": "Recabar la información de manera verbal y presencial."
   },
   {
    "t": "subtitulo",
    "x": "Preguntas naturales de ejemplo"
   },
   {
    "t": "dialogo",
    "x": "¿Actualmente lo atiende algún médico o profesional de la salud?"
   },
   {
    "t": "dialogo",
    "x": "¿Tiene algún antecedente físico o alguna condición que considere importante mencionar?"
   },
   {
    "t": "dialogo",
    "x": "¿Existen enfermedades importantes dentro de sus antecedentes familiares?"
   },
   {
    "t": "dialogo",
    "x": "¿Padece alguna enfermedad crónica o degenerativa?"
   },
   {
    "t": "dialogo",
    "x": "¿Tiene alguna alergia conocida?"
   },
   {
    "t": "dialogo",
    "x": "Cuénteme un poco sobre sus hábitos de alimentación y sueño."
   },
   {
    "t": "dialogo",
    "x": "¿Realiza alguna actividad física?"
   },
   {
    "t": "dialogo",
    "x": "¿Consume actualmente algún medicamento o alguna otra sustancia que debamos registrar?"
   },
   {
    "t": "accion",
    "x": "Registrar las respuestas."
   },
   {
    "t": "dialogo",
    "x": "Quiero señalarle también que los servicios tradicionales y complementarios que ofrecemos no cubren ni sustituyen las indicaciones de su médico tratante o profesional de la salud."
   }
  ]
 },
 {
  "clave": "peso_estatura",
  "nombre": "Peso y estatura",
  "seccionNum": 6,
  "items": [
   {
    "t": "nota",
    "x": "El EC1375 incluye báscula y estadímetro dentro del equipo mínimo y exige peso y estatura en la documentación, aunque no describe un protocolo específico de medición."
   },
   {
    "t": "dialogo",
    "x": "Ahora voy a registrar su peso y estatura como parte de sus datos."
   },
   {
    "t": "accion",
    "x": "Utilizar la báscula y registrar el peso."
   },
   {
    "t": "accion",
    "x": "Utilizar el estadímetro y registrar la estatura."
   }
  ],
  "videos": [
   "estadimetro"
  ]
 },
 {
  "clave": "spo2_pulso",
  "nombre": "Saturación de oxígeno y pulso",
  "seccionNum": 7,
  "items": [
   {
    "t": "dialogo",
    "x": "Ahora voy a medir su saturación de oxígeno y su pulso utilizando el oxímetro."
   },
   {
    "t": "accion",
    "x": "Limpiar la superficie del sensor con paño suave o algodón y solución desinfectante, conforme a las recomendaciones del fabricante."
   },
   {
    "t": "dialogo",
    "x": "Por favor, coloque el dedo en el sensor de esta manera. Durante la medición le pido permanecer sin movimientos, porque podrían alterar el resultado."
   },
   {
    "t": "accion",
    "x": "Activar el oxímetro conforme a las instrucciones del fabricante."
   },
   {
    "t": "dialogo",
    "x": "Tenemos una saturación de oxígeno de [VALOR REAL] y un pulso de [VALOR REAL]."
   },
   {
    "t": "accion",
    "x": "Registrar SpO2 y pulso en la ficha."
   }
  ],
  "videos": [
   "oximetro_pulso"
  ]
 },
 {
  "clave": "postura",
  "nombre": "Observación de postura",
  "seccionNum": 8,
  "items": [
   {
    "t": "dialogo",
    "x": "Ahora realizaré una observación visual de su postura. Le voy a pedir que permanezca en la posición que le indique mientras observo diferentes segmentos de su cuerpo."
   },
   {
    "t": "accion",
    "x": "Revisar visualmente cabeza, cuello, tórax, extremidades y pelvis."
   },
   {
    "t": "accion",
    "x": "Registrar los hallazgos en la ficha."
   },
   {
    "t": "nota",
    "x": "Importante: en esta parte el criterio solicita observación visual y registro; no es necesario inventar un diagnóstico."
   }
  ],
  "videos": [
   "goniometro",
   "daniels"
  ]
 },
 {
  "clave": "frec_resp",
  "nombre": "Frecuencia respiratoria",
  "seccionNum": 9,
  "items": [
   {
    "t": "dialogo",
    "x": "Ahora voy a registrar su frecuencia respiratoria. Por favor permanezca sentado y en reposo."
   },
   {
    "t": "accion",
    "x": "Contar las elevaciones del tórax y abdomen durante un minuto completo."
   },
   {
    "t": "accion",
    "x": "Registrar el resultado."
   }
  ],
  "videos": [
   "frecuencia_respiratoria"
  ]
 },
 {
  "clave": "presion",
  "nombre": "Presión arterial",
  "seccionNum": 10,
  "items": [
   {
    "t": "dialogo",
    "x": "A continuación voy a verificar su presión arterial con el monitor de presión arterial de brazo. Le voy a colocar el brazalete y le pediré que adopte la posición indicada."
   },
   {
    "t": "accion",
    "x": "Colocar el brazalete y posicionar al usuario conforme a las indicaciones del fabricante."
   },
   {
    "t": "accion",
    "x": "Activar el equipo y obtener la lectura."
   },
   {
    "t": "dialogo",
    "x": "Su presión arterial registrada es [VALOR REAL OBTENIDO]."
   },
   {
    "t": "accion",
    "x": "Registrar el resultado en la ficha."
   }
  ],
  "videos": [
   "presion_digital",
   "presion_manual_1",
   "presion_manual_2"
  ]
 },
 {
  "clave": "verificar",
  "nombre": "Verificación de no impedimento",
  "seccionNum": 11,
  "items": [
   {
    "t": "accion",
    "x": "Con la información recabada y la exploración realizada, identificar que no exista impedimento para recibir la atención tradicional y complementaria."
   },
   {
    "t": "dialogo",
    "x": "Con la información que hemos recabado podemos continuar con la atención programada. Es importante mencionar que su participación y compromiso con las indicaciones forman parte del proceso para buscar un resultado satisfactorio."
   }
  ]
 },
 {
  "clave": "terapia_explicacion",
  "nombre": "Explicación de la atención",
  "seccionNum": 12,
  "items": [
   {
    "t": "dialogo",
    "x": "De acuerdo con los hallazgos que encontramos durante la inspección y exploración, el procedimiento que se ha designado para esta sesión consiste en [DESCRIBIR ATENCIÓN]."
   },
   {
    "t": "dialogo",
    "x": "Esta atención busca [OBJETIVO DE LA SESIÓN]. Entre sus bondades, beneficios o ventajas se encuentran [DESCRIBIR], dentro del alcance propio de este servicio."
   },
   {
    "t": "dialogo",
    "x": "Durante la atención podría experimentar [SENSACIONES/REACCIONES POSIBLES] y posteriormente podrían presentarse [EFECTOS O SENSACIONES POSTERIORES]."
   },
   {
    "t": "dialogo",
    "x": "Para realizar la atención se recomienda utilizar [VESTIMENTA RECOMENDADA]. ¿Tiene alguna duda o comentario sobre el procedimiento que vamos a realizar?"
   }
  ]
 },
 {
  "clave": "consentimiento",
  "nombre": "Consentimiento informado",
  "seccionNum": 13,
  "items": [
   {
    "t": "accion",
    "x": "Presentar el consentimiento antes de iniciar la atención."
   },
   {
    "t": "dialogo",
    "x": "Antes de comenzar necesito presentarle el documento de consentimiento informado y aceptación del servicio. En este documento se describe la atención que vamos a realizar, las técnicas que se aplicarán, las zonas del cuerpo que podrán ser abordadas, las posibles reacciones físicas, las condiciones de preparación, las limitantes del servicio, el número y duración de las sesiones y los objetivos que buscamos alcanzar."
   },
   {
    "t": "dialogo",
    "x": "Si está de acuerdo con lo que hemos explicado y no tiene dudas, le solicito su firma de aceptación."
   },
   {
    "t": "accion",
    "x": "Recabar firma/huella del usuario, firmar quien otorga el servicio e integrar el consentimiento al expediente."
   }
  ]
 },
 {
  "clave": "atencion",
  "nombre": "Ejecución de la atención",
  "seccionNum": 14,
  "items": [
   {
    "t": "accion",
    "x": "Preparar al usuario conforme a la técnica indicada y realizar la terapia manual programada."
   },
   {
    "t": "nota",
    "x": "Importante: el EC1375 no especifica una técnica particular de terapia manual ni prescribe maniobras quiroprácticas concretas. La técnica demostrada debe corresponder a lo previamente explicado y consentido."
   }
  ]
 },
 {
  "clave": "finalizacion",
  "nombre": "Finalización de la sesión",
  "seccionNum": 15,
  "items": [
   {
    "t": "dialogo",
    "x": "Hemos finalizado la atención. Puede permanecer unos momentos sobre la mesa antes de incorporarse."
   },
   {
    "t": "dialogo",
    "x": "¿Cómo se siente después de la atención que recibió? ¿Tiene alguna duda o quiere comentarme algo sobre lo que acaba de experimentar?"
   },
   {
    "t": "dialogo",
    "x": "Durante las siguientes veinticuatro horas pueden presentarse [EFECTOS CORRESPONDIENTES A LA TÉCNICA APLICADA]. Ahora le voy a explicar cómo incorporarse."
   },
   {
    "t": "accion",
    "x": "Explicar y acompañar la incorporación conforme a los protocolos de higiene de columna."
   },
   {
    "t": "accion",
    "x": "Cuando corresponda, dejar el área para permitir al usuario vestirse."
   }
  ],
  "videos": [
   "higiene_columna"
  ]
 },
 {
  "clave": "encuesta_usuario",
  "nombre": "Encuesta de satisfacción del usuario",
  "seccionNum": 16,
  "items": [
   {
    "t": "subtitulo",
    "x": "Al término del servicio (E4·D1)"
   },
   {
    "t": "dialogo",
    "x": "Para terminar, le pido que conteste esta breve encuesta de satisfacción. Califique cada enunciado del 1 al 5, donde 1 es «totalmente en desacuerdo» y 5 «totalmente de acuerdo»."
   },
   {
    "t": "accion",
    "x": "Entregar la encuesta de satisfacción del usuario y explicar las instrucciones para su llenado."
   },
   {
    "t": "dialogo",
    "x": "¿Tiene algún comentario acerca del servicio que recibió el día de hoy?"
   },
   {
    "t": "accion",
    "x": "Recibir los comentarios del usuario sin interrumpir ni justificarse."
   },
   {
    "t": "dialogo",
    "x": "Muchas gracias por su colaboración y por sus comentarios."
   }
  ]
 },
 {
  "clave": "plan_sesion",
  "nombre": "Plan de sesiones",
  "seccionNum": 17,
  "items": [
   {
    "t": "dialogo",
    "x": "Ahora vamos a establecer su programa de seguimiento. El objetivo que buscamos alcanzar en las siguientes sesiones será [OBJETIVO POR SESIÓN]."
   },
   {
    "t": "dialogo",
    "x": "La propuesta es realizar [NÚMERO DE SESIONES], con una frecuencia de [FRECUENCIA] y una duración aproximada de [DURACIÓN] por sesión."
   }
  ]
 },
 {
  "clave": "plan_seguimiento",
  "nombre": "Programación de seguimiento",
  "seccionNum": 18,
  "items": [
   {
    "t": "dialogo",
    "x": "Tengo disponibles [FECHA Y HORARIO] o [FECHA Y HORARIO]. ¿Cuál le resulta más conveniente? Perfecto, entonces dejamos programada su próxima atención para [FECHA Y HORA ACORDADAS]."
   },
   {
    "t": "dialogo",
    "x": "Recuerde también las recomendaciones indicadas para su tratamiento: [RECOMENDACIONES]. Para realizar en casa tendrá las siguientes actividades, tareas o ejercicios: [ACTIVIDADES INDICADAS]."
   },
   {
    "t": "dialogo",
    "x": "Si posteriormente tiene alguna duda, inquietud o necesita consultar información respecto al servicio recibido, podremos atenderla. ¿Quedó alguna duda pendiente que no hayamos resuelto?"
   }
  ]
 },
 {
  "clave": "medio_contacto",
  "nombre": "Medio de contacto",
  "seccionNum": 19,
  "items": [
   {
    "t": "dialogo",
    "x": "Para darle seguimiento, ¿cuál es el medio de contacto que le resulta más conveniente: teléfono, celular, correo electrónico o alguna plataforma digital?"
   },
   {
    "t": "accion",
    "x": "Registrar el medio de contacto."
   },
   {
    "t": "dialogo",
    "x": "Le proporciono también los datos de nuestro Centro de Atención Tradicional y Complementaria y nuestro medio de atención telefónica para cualquier duda relacionada con su servicio."
   }
  ]
 },
 {
  "clave": "cierre",
  "nombre": "Cierre",
  "seccionNum": 20,
  "items": [
   {
    "t": "dialogo",
    "x": "Con esto concluimos su atención del día de hoy. Muchas gracias por su asistencia, por su disposición y por la confianza."
   },
   {
    "t": "dialogo",
    "x": "Nos vemos en su próxima sesión el [FECHA] a las [HORA]. Que tenga un excelente día."
   }
  ]
 }
];

export const TOTAL_PASOS = GUION.reduce((n, s) => n + s.items.length, 0);
