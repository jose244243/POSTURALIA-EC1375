/* ============================================================================
   POSTURALIA · Plataforma de Certificación
   data-autodiagnostico.js — Instrumento de autodiagnóstico EC1375 (OFICIAL)

   Los 142 reactivos oficiales del EC1375, con la redacción del instrumento
   de evaluación (fuente: plataforma Paideia V4.5, EC1375_DATA.bloques) y la
   estructura de 4 elementos × categorías × grupos del formato de
   autodiagnóstico CONOCER que usa la app de registro de Paideia.

   Las claves (e1_c0_g0_i0 …) siguen exactamente el orden de ese formato, así
   que son las MISMAS que las de Paideia: las respuestas se pueden migrar
   entre ambas plataformas sin traducir nada.

   Cada reactivo trae además su número oficial (1–142), su código del
   instrumento (p. ej. 17.2/6-D1E1), su criterio (E1·D1), su peso y si es
   eliminatorio (critico): un solo reactivo crítico en NO reprueba la
   evaluación completa, por alta que sea la suma.

   VERSION cambia cuando cambia el instrumento: las respuestas guardadas con
   otra versión no se cuentan (ver respuestasVigentes).
   ========================================================================== */

export const VERSION = 'oficial-2026-09';

export const INSTRUMENTO = {
  "estandar": "EC1375",
  "nombre": "Prestación de servicios auxiliares en la contribución tradicional y complementaria de la recuperación de las condiciones físicas y socioemocionales de las personas",
  "version": "oficial-2026-09",
  "total": 142,
  "elementos": [
    {
      "n": 1,
      "nombre": "Preparar el espacio en la contribución tradicional y complementaria de la recuperación de las condiciones físicas y socioemocionales de las personas",
      "criterios": [
        {
          "tipo": "Desempeño",
          "titulo": "¿Puede usted realizar los siguientes DESEMPEÑOS?",
          "grupos": [
            {
              "titulo": "Realiza los protocolos de seguridad sanitaria",
              "items": [
                "Antes de recibir al usuario",
                "Lavándose las manos, conforme al protocolo señalado por la Organización Mundial de la Salud",
                "Colocándose cubrebocas de tipo quirúrgico de triple capa, de acuerdo con las recomendaciones de uso de la Secretaría de Salud",
                "Colocando tapete sanitizante con solución desinfectante al ingreso del inmueble",
                "Disponiendo de gel antibacterial para el ingreso del inmueble",
                "Disponiendo de termómetro digital para el ingreso del inmueble"
              ]
            }
          ]
        },
        {
          "tipo": "Producto",
          "titulo": "¿Usted puede obtener los siguientes PRODUCTOS?",
          "grupos": [
            {
              "titulo": "El espacio acondicionado para otorgar el servicio de las técnicas tradicionales y complementarias",
              "items": [
                "Dispone del material, herramientas, mobiliario y equipo suficientes para otorgar el servicio",
                "Cuenta con el espacio suficiente para el desplazamiento libre y a distancia entre el usuario y quien otorga el servicio",
                "Cuenta con archivero / medio digital para el resguardo de la documentación del usuario",
                "Está ventilado y sin corrientes de aire",
                "Cuenta con energía eléctrica e iluminación natural",
                "Presenta colores claros en las paredes y techo",
                "Dispone de depósitos para desechar basura orgánica e inorgánica",
                "Dispone de depósitos para desechar residuos peligrosos biológico-infecciosos de acuerdo con la NOM-087-ECOL-SSA1-2002",
                "Cuenta con un lugar específico para que los usuarios coloquen sus pertenencias"
              ]
            },
            {
              "titulo": "Las herramientas y materiales de trabajo seleccionados",
              "items": [
                "Están limpias y desinfectadas / sanitizadas",
                "Se encuentran disponibles y en condiciones para su uso",
                "Están contenidas en estuches / depósitos / contenedores que las protejan de contaminantes ambientales",
                "Tienen las especificaciones de uso / vigencia / garantía / condiciones de operación de la empresa o proveedor"
              ]
            }
          ]
        },
        {
          "tipo": "Conocimiento",
          "titulo": "¿Usted cuenta con los siguientes CONOCIMIENTOS?",
          "grupos": [
            {
              "titulo": "Cuenta con conocimientos en los siguientes temas",
              "items": [
                "Técnicas de atención tradicional y complementaria",
                "Desinfección vs Sanitización: definición, características, medios y recursos",
                "Manejo de residuos peligrosos NOM-087-ECOL-SSA1-2002"
              ]
            }
          ]
        },
        {
          "tipo": "Actitud",
          "titulo": "¿Usted cuenta con las siguientes ACTITUDES, HÁBITOS y VALORES?",
          "grupos": [
            {
              "titulo": "Usted presenta",
              "items": [
                "Limpieza: la manera en que el espacio acondicionado está libre de polvo, suciedad, manchas, malos olores y basura",
                "Orden: la manera en que el espacio acondicionado tiene dispuestos de manera organizada un lugar particular para sus equipos, materiales, herramientas, documentación y mobiliario"
              ]
            }
          ]
        }
      ]
    },
    {
      "n": 2,
      "nombre": "Preparar al usuario para la contribución tradicional y complementaria de la recuperación de las condiciones físicas y socioemocionales de las personas",
      "criterios": [
        {
          "tipo": "Desempeño",
          "titulo": "¿Puede usted realizar los siguientes DESEMPEÑOS?",
          "grupos": [
            {
              "titulo": "Recibe al usuario",
              "items": [
                "Saludándolo cordialmente",
                "Aplicando los protocolos de seguridad sanitaria, con la aplicación de gel antibacterial en las manos y la toma digital de temperatura",
                "Presentándose, indicando su nombre completo y su función",
                "Agradeciendo su presencia",
                "Preguntando su nombre completo",
                "Indicándole pasar al lugar de recepción / antesala para su atención",
                "Ofreciéndole un lugar cómodo y previamente sanitizado para que tome asiento"
              ]
            },
            {
              "titulo": "Introduce al usuario para el llenado de la bitácora / carpeta / documentación de atención integral",
              "items": [
                "Antes de iniciar la atención tradicional y complementaria",
                "Estableciendo un clima de confianza",
                "Señalando que la prestación de servicios auxiliares complementarios y tradicionales tienen como objetivo la recuperación de las condiciones físicas y socioemocionales de las personas",
                "Indicando los principios de discreción y confidencialidad en su atención",
                "Comentando al usuario que sus datos personales están protegidos conforme a la Ley Federal de Protección de Datos Personales en Posesión de Particulares",
                "Indicándole sobre el llenado de su ficha de registro de atención de condiciones físicas y socioemocionales",
                "Indicándole que se le realizará una exploración física, previa autorización manifestada con firma en la ficha de registro",
                "Indicándole que se le tomarán signos vitales, el orden a seguir, las razones para ello, y su previa autorización manifestada con firma en la ficha de registro",
                "Preguntándole si tiene dudas, para su aclaración"
              ]
            },
            {
              "titulo": "Introduce al usuario para el llenado de la ficha de registro de atención de condiciones físicas y socioemocionales",
              "items": [
                "Comentando al usuario que sus datos personales están protegidos conforme a la Ley Federal de Protección de Datos Personales en Posesión de Particulares",
                "Solicitando la firma de enterado del usuario una vez comentado el Aviso de Privacidad",
                "Corroborando nombre completo con identificación oficial vigente",
                "Recabando la información de manera verbal y presencial por parte del usuario",
                "Solicitando al usuario el llenado de la ficha de registro con sus datos generales, médico tratante, antecedentes físicos y socioemocionales, antecedentes heredofamiliares, enfermedades crónicas, degenerativas y alergias, hábitos personales de alimentación y sueño, y la práctica de alguna actividad física",
                "Registrando información acerca de su interés / necesidad / diagnóstico emitido por el médico tratante / profesional de la salud",
                "Señalando que los servicios tradicionales y complementarios que se ofrecen no cubren, ni substituyen las indicaciones del médico tratante / profesional de la salud",
                "Agradeciendo su disponibilidad"
              ]
            },
            {
              "titulo": "Mide niveles de saturación de oxígeno y pulso en el usuario",
              "items": [
                "Explicando el procedimiento, conforme a las indicaciones del fabricante del oxímetro",
                "Limpiando la superficie del sensor, con un paño suave o un algodón y solución desinfectante, conforme a las recomendaciones del fabricante",
                "Solicitando al usuario colocar el dedo en el sensor, conforme a las indicaciones del fabricante",
                "Solicitando al usuario que durante la toma se mantenga sin movimientos que puedan alterar la medición",
                "Presionando el interruptor de inicio de medición, de acuerdo con el fabricante",
                "Registrando los valores obtenidos de SpO₂ y pulso, en la ficha de registro de atención de condiciones físicas y socioemocionales"
              ]
            },
            {
              "titulo": "Observa la postura física del usuario",
              "items": [
                "Revisando visualmente la cabeza, cuello, tórax, extremidades y pelvis",
                "Registrando los datos obtenidos en la ficha de registro de atención de condiciones físicas y socioemocionales"
              ]
            },
            {
              "titulo": "Realiza la toma de la frecuencia respiratoria del usuario",
              "items": [
                "Solicitando al usuario permanezca sentado y en reposo",
                "Contando las elevaciones del tórax y abdomen durante un minuto",
                "Registrando los datos obtenidos en la ficha de registro de atención de condiciones físicas y socioemocionales"
              ]
            },
            {
              "titulo": "Verifica la presión arterial del usuario",
              "items": [
                "Explicando el procedimiento a seguir, conforme a las indicaciones del fabricante del monitor de presión arterial de brazo",
                "Colocando el brazalete en el brazo del usuario, conforme a las indicaciones del fabricante del equipo",
                "Solicitando al usuario, tome la postura recomendada por el fabricante del equipo",
                "Activando el interruptor de inicio conforme lo señala el fabricante",
                "Registrando los datos obtenidos en la ficha de registro de atención de condiciones físicas y socioemocionales"
              ]
            }
          ]
        },
        {
          "tipo": "Producto",
          "titulo": "¿Usted puede obtener los siguientes PRODUCTOS?",
          "grupos": [
            {
              "titulo": "La bitácora / carpeta / documentación de atención integral del usuario conformada",
              "items": [
                "Contiene la ficha de registro de atención de condiciones físicas y socioemocionales, plan de seguimiento de atención y consentimiento informado / aceptación del servicio tradicional y complementario",
                "Contiene fecha, nombre completo del usuario, edad, peso, estatura, fecha de nacimiento, dirección y folio asignado",
                "Incluye datos del médico tratante / profesional de la salud que atiende al usuario",
                "Contiene antecedentes físicos, fisiológicos, socioemocionales y heredofamiliares",
                "Contiene el registro de enfermedades crónicas, degenerativas y alérgicas",
                "Contiene información toxicológica",
                "Contiene información sobre hábitos personales, de sueño, alimenticios, de higiene, deportivos, así como el consumo de sustancias farmacológicas y/o adictivas",
                "Contiene los registros de la medición de los signos vitales y de las observaciones realizadas de la postura física del usuario",
                "Contiene el resumen de los resultados actuales y previos con base en los estudios de laboratorio y gabinete",
                "Contiene información acerca de su interés / necesidad / malestar para recibir el servicio",
                "Señala la leyenda de que los servicios tradicionales y complementarios que se ofrecen no cubren, ni substituyen las indicaciones del médico tratante",
                "Contiene el nombre completo y firma del usuario, del asistente auxiliar y del profesional que brinda los servicios tradicionales y complementarios"
              ]
            }
          ]
        },
        {
          "tipo": "Conocimiento",
          "titulo": "¿Usted cuenta con los siguientes CONOCIMIENTOS?",
          "grupos": [
            {
              "titulo": "Cuenta con conocimientos en los siguientes temas",
              "items": [
                "Rangos y niveles de signos vitales en niños, adultos y personas de la tercera edad",
                "Goniometría: concepto, utilidad y aplicación",
                "Biomecánica: definición, planos anatómicos, ejes del cuerpo, movimientos del cuerpo, anatomía y fisiología topográfica",
                "Higiene de columna: posiciones adecuadas y manipulaciones de carga",
                "Pruebas funcionales musculares de Daniels: posiciones y desarrollo"
              ]
            }
          ]
        },
        {
          "tipo": "Actitud",
          "titulo": "¿Usted cuenta con las siguientes ACTITUDES, HÁBITOS y VALORES?",
          "grupos": [
            {
              "titulo": "Usted presenta",
              "items": [
                "Amabilidad: la manera en que brinda el servicio al usuario, resolviendo sus dudas y recibiendo comentarios",
                "Orden: la manera en que integra el expediente clínico del usuario conforme al servicio tradicional y complementario otorgado",
                "Responsabilidad: la manera en que recaba, resguarda y no hace mal uso de la información que ha proporcionado el usuario"
              ]
            }
          ]
        }
      ]
    },
    {
      "n": 3,
      "nombre": "Introducir al usuario a la contribución tradicional y complementaria de la recuperación de las condiciones físicas y socioemocionales de las personas",
      "criterios": [
        {
          "tipo": "Desempeño",
          "titulo": "¿Puede usted realizar los siguientes DESEMPEÑOS?",
          "grupos": [
            {
              "titulo": "Introduce al usuario a la contribución tradicional y complementaria",
              "items": [
                "Antes de que reciba la atención tradicional y complementaria",
                "Identificando que no haya impedimento para recibir la atención tradicional y complementaria, de las condiciones físicas y socioemocionales de las personas",
                "Resaltando la importancia y el compromiso del usuario para el resultado satisfactorio de la atención tradicional y complementaria"
              ]
            },
            {
              "titulo": "Explica el procedimiento designado por el especialista en la contribución tradicional y complementaria",
              "items": [
                "Partiendo de los hallazgos encontrados durante la inspección visual de las condiciones del usuario / de una solicitud de atención por parte de un profesional de la salud / usuario sobre la recuperación de sus condiciones físicas y socioemocionales o de los hallazgos identificados en la exploración del usuario",
                "Describiendo la atención tradicional y complementaria, así como sus bondades / beneficios / ventajas y alcance / casos de éxito",
                "Señalando posibles reacciones / sensaciones / efectos durante y después de la atención",
                "Mencionando el objetivo a alcanzar",
                "Describiendo la vestimenta recomendada para la atención tradicional y complementaria",
                "Preguntando si tiene dudas o algún comentario, para atenderlas"
              ]
            },
            {
              "titulo": "Presenta al usuario el documento de consentimiento informado / aceptación del servicio",
              "items": [
                "Antes de dar inicio a la atención tradicional y complementaria",
                "Describiendo en qué consiste el documento, su contenido y alcances",
                "Recabando firma de aceptación por parte del usuario"
              ]
            },
            {
              "titulo": "Informa al usuario sobre la finalización del servicio tradicional y complementario",
              "items": [
                "Indicando que el servicio ha finalizado",
                "Mencionando que puede permanecer en la mesa / superficie por unos momentos y sus razones",
                "Preguntando cómo se siente después de la atención recibida",
                "Preguntando si tiene dudas al respecto para atenderlas",
                "Informando el efecto de las técnicas dentro de las veinticuatro horas subsecuentes a su aplicación",
                "Explicando la forma que debe incorporarse, conforme a los protocolos de Higiene de Columna",
                "Dejando el área de trabajo para permitirle al usuario vestirse"
              ]
            }
          ]
        },
        {
          "tipo": "Producto",
          "titulo": "¿Usted puede obtener los siguientes PRODUCTOS?",
          "grupos": [
            {
              "titulo": "La carta de consentimiento informado / aceptación del servicio elaborada",
              "items": [
                "Contiene fecha, nombre completo del usuario, edad, fecha de nacimiento, dirección, nombre de algún familiar a quien avisar en caso de que se requiera",
                "Contiene el Aviso de Privacidad, conforme la Ley Federal de Protección de Datos Personales en Posesión de Particulares",
                "Contiene descritas las técnicas a aplicar",
                "Especifica los puntos y zonas del cuerpo que tocará de acuerdo con el efecto a lograr",
                "Contiene descritas las reacciones físicas posibles que se presentan",
                "Especifica la vestimenta recomendada para la preparación de las técnicas",
                "Señala limitantes de aplicación del servicio de técnicas tradicionales y complementarias",
                "Describe las condiciones de preparación que debe cubrir el usuario",
                "Contiene el número de sesiones a utilizar y la duración de cada sesión",
                "Contiene los objetivos a alcanzar por sesión y los efectos generales",
                "Contiene la rúbrica / firma / huella de conformidad del usuario",
                "Está integrada al expediente del usuario",
                "Contiene nombre y firma / huella digital del usuario y de quien otorga el servicio tradicional y complementario"
              ]
            }
          ]
        }
      ]
    },
    {
      "n": 4,
      "nombre": "Dar seguimiento al usuario en la contribución tradicional y complementaria de la recuperación de las condiciones físicas y socioemocionales de las personas",
      "criterios": [
        {
          "tipo": "Desempeño",
          "titulo": "¿Puede usted realizar los siguientes DESEMPEÑOS?",
          "grupos": [
            {
              "titulo": "Aplica encuesta de satisfacción",
              "items": [
                "Al término del servicio",
                "Explicando las instrucciones para su llenado",
                "Recibiendo comentarios acerca del servicio",
                "Agradeciendo al usuario su colaboración y comentarios"
              ]
            },
            {
              "titulo": "Acuerda con el usuario el programa de seguimiento",
              "items": [
                "Una vez finalizado el servicio",
                "Atendiendo las indicaciones del profesional que otorgó la atención tradicional y complementaria",
                "Mencionando el objetivo a alcanzar por sesión con la atención tradicional y complementaria",
                "Proponiendo fechas y horarios",
                "Acordando fechas y horarios",
                "Resaltando las recomendaciones para su tratamiento por parte del especialista de la atención tradicional y complementaria",
                "Indicando que la atención será permanente para la aclaración de dudas / manifestación de inquietudes / consulta de información respecto al servicio recibido",
                "Confirmando que se hayan resuelto las dudas planteadas"
              ]
            },
            {
              "titulo": "Asegura el medio de contacto para el seguimiento al usuario",
              "items": [
                "Solicitando la vía más viable para mantener la comunicación",
                "Registrando teléfono fijo / teléfono celular / correo electrónico / redes sociales",
                "Proporcionándole datos del Centro de Atención Tradicional y Complementaria y los datos de atención telefónica",
                "Agradeciendo su asistencia, disposición y confianza"
              ]
            }
          ]
        },
        {
          "tipo": "Producto",
          "titulo": "¿Usted puede obtener los siguientes PRODUCTOS?",
          "grupos": [
            {
              "titulo": "Plan de Seguimiento elaborado",
              "items": [
                "Contiene datos que incluyen información general sobre fechas y horarios",
                "Señala el medio de contacto para el seguimiento: encuentro presencial / llamada telefónica / correo electrónico / mensaje telefónico / plataformas digitales",
                "Contiene número de sesiones programadas, su frecuencia y duración",
                "Contiene el plan de sesión programado",
                "Contiene nombre y firma / huella digital del usuario y de quien otorga el servicio tradicional y complementario"
              ]
            },
            {
              "titulo": "El Plan de sesión elaborado",
              "items": [
                "Se integra en el Plan de Seguimiento",
                "Contiene por cada sesión de atención, número, fecha, hora de inicio y término y el registro de los signos vitales",
                "Describe las actividades / intervenciones / atención que se otorgará en el servicio al usuario",
                "Incluye notas de evolución y el pronóstico del número de sesiones de atención que serán necesarias para el bienestar del usuario, e",
                "Incluye para realizar en casa actividades / tareas / ejercicios que coadyuven a la atención recibida"
              ]
            }
          ]
        }
      ]
    }
  ]
};

/* Metadatos oficiales por clave: n, cod, crit, peso, critico */
export const META_REACTIVOS = {"e1_c0_g0_i0":{"n":1,"cod":"16.1/6-D1E1","crit":"E1·D1","peso":0.59,"critico":false},"e1_c0_g0_i1":{"n":2,"cod":"17.2/6-D1E1","crit":"E1·D1","peso":2.94,"critico":true},"e1_c0_g0_i2":{"n":3,"cod":"18.3/6-D1E1","crit":"E1·D1","peso":0.59,"critico":false},"e1_c0_g0_i3":{"n":4,"cod":"19.4/6-D1E1","crit":"E1·D1","peso":0.29,"critico":false},"e1_c0_g0_i4":{"n":5,"cod":"20.5/6-D1E1","crit":"E1·D1","peso":0.29,"critico":false},"e1_c0_g0_i5":{"n":6,"cod":"21.6/6-D1E1","crit":"E1·D1","peso":0.29,"critico":false},"e1_c1_g0_i0":{"n":7,"cod":"1.1/9-P1E1","crit":"E1·P1","peso":2.94,"critico":true},"e1_c1_g0_i1":{"n":8,"cod":"2.2/9-P1E1","crit":"E1·P1","peso":2.94,"critico":true},"e1_c1_g0_i2":{"n":9,"cod":"3.3/9-P1E1","crit":"E1·P1","peso":0.29,"critico":false},"e1_c1_g0_i3":{"n":10,"cod":"4.4/9-P1E1","crit":"E1·P1","peso":0.29,"critico":false},"e1_c1_g0_i4":{"n":11,"cod":"5.5/9-P1E1","crit":"E1·P1","peso":0.59,"critico":false},"e1_c1_g0_i5":{"n":12,"cod":"6.6/9-P1E1","crit":"E1·P1","peso":0.29,"critico":false},"e1_c1_g0_i6":{"n":13,"cod":"7.7/9-P1E1","crit":"E1·P1","peso":0.59,"critico":false},"e1_c1_g0_i7":{"n":14,"cod":"8.8/9-P1E1","crit":"E1·P1","peso":0.29,"critico":false},"e1_c1_g0_i8":{"n":15,"cod":"9.9/9-P1E1","crit":"E1·P1","peso":0.29,"critico":false},"e1_c1_g1_i0":{"n":16,"cod":"10.1/4-P2E1","crit":"E1·P2","peso":2.94,"critico":true},"e1_c1_g1_i1":{"n":17,"cod":"11.2/4-P2E1","crit":"E1·P2","peso":2.94,"critico":true},"e1_c1_g1_i2":{"n":18,"cod":"12.3/4-P2E1","crit":"E1·P2","peso":0.59,"critico":false},"e1_c1_g1_i3":{"n":19,"cod":"13.4/4-P2E1","crit":"E1·P2","peso":0.59,"critico":false},"e1_c2_g0_i0":{"n":20,"cod":"135.1/1-C1E1","crit":"E1·C1","peso":0.29,"critico":false},"e1_c2_g0_i1":{"n":21,"cod":"136.1/1-C2E1","crit":"E1·C2","peso":0.29,"critico":false},"e1_c2_g0_i2":{"n":22,"cod":"137.1/1-C3E1","crit":"E1·C3","peso":0.29,"critico":false},"e1_c3_g0_i0":{"n":23,"cod":"14.1/1-AHV1E1","crit":"E1·A1","peso":-0.29,"critico":false},"e1_c3_g0_i1":{"n":24,"cod":"15.1/1-AHV2E1","crit":"E1·A2","peso":-0.29,"critico":false},"e2_c0_g0_i0":{"n":25,"cod":"22.1/7-D1E2","crit":"E2·D1","peso":0.29,"critico":false},"e2_c0_g0_i1":{"n":26,"cod":"23.2/7-D1E2","crit":"E2·D1","peso":0.59,"critico":false},"e2_c0_g0_i2":{"n":27,"cod":"24.3/7-D1E2","crit":"E2·D1","peso":0.29,"critico":false},"e2_c0_g0_i3":{"n":28,"cod":"25.4/7-D1E2","crit":"E2·D1","peso":0.29,"critico":false},"e2_c0_g0_i4":{"n":29,"cod":"26.5/7-D1E2","crit":"E2·D1","peso":0.29,"critico":false},"e2_c0_g0_i5":{"n":30,"cod":"27.6/7-D1E2","crit":"E2·D1","peso":0.29,"critico":false},"e2_c0_g0_i6":{"n":31,"cod":"28.7/7-D1E2","crit":"E2·D1","peso":0.59,"critico":false},"e2_c0_g1_i0":{"n":32,"cod":"29.1/9-D2E2","crit":"E2·D2","peso":0.29,"critico":false},"e2_c0_g1_i1":{"n":33,"cod":"30.2/9-D2E2","crit":"E2·D2","peso":2.94,"critico":true},"e2_c0_g1_i2":{"n":34,"cod":"31.3/9-D2E2","crit":"E2·D2","peso":0.59,"critico":false},"e2_c0_g1_i3":{"n":35,"cod":"32.4/9-D2E2","crit":"E2·D2","peso":0.59,"critico":false},"e2_c0_g1_i4":{"n":36,"cod":"33.5/9-D2E2","crit":"E2·D2","peso":0.59,"critico":false},"e2_c0_g1_i5":{"n":37,"cod":"34.6/9-D2E2","crit":"E2·D2","peso":0.29,"critico":false},"e2_c0_g1_i6":{"n":38,"cod":"35.7/9-D2E2","crit":"E2·D2","peso":0.59,"critico":false},"e2_c0_g1_i7":{"n":39,"cod":"36.8/9-D2E2","crit":"E2·D2","peso":0.59,"critico":false},"e2_c0_g1_i8":{"n":40,"cod":"37.9/9-D2E2","crit":"E2·D2","peso":0.59,"critico":false},"e2_c0_g2_i0":{"n":41,"cod":"38.1/8-D3E2","crit":"E2·D3","peso":0.59,"critico":false},"e2_c0_g2_i1":{"n":42,"cod":"39.2/8-D3E2","crit":"E2·D3","peso":0.59,"critico":false},"e2_c0_g2_i2":{"n":43,"cod":"40.3/8-D3E2","crit":"E2·D3","peso":0.29,"critico":false},"e2_c0_g2_i3":{"n":44,"cod":"41.4/8-D3E2","crit":"E2·D3","peso":0.59,"critico":false},"e2_c0_g2_i4":{"n":45,"cod":"42.5/8-D3E2","crit":"E2·D3","peso":0.59,"critico":false},"e2_c0_g2_i5":{"n":46,"cod":"43.6/8-D3E2","crit":"E2·D3","peso":2.94,"critico":true},"e2_c0_g2_i6":{"n":47,"cod":"44.7/8-D3E2","crit":"E2·D3","peso":0.29,"critico":false},"e2_c0_g2_i7":{"n":48,"cod":"45.8/8-D3E2","crit":"E2·D3","peso":0.29,"critico":false},"e2_c0_g3_i0":{"n":49,"cod":"46.1/6-D4E2","crit":"E2·D4","peso":0.29,"critico":false},"e2_c0_g3_i1":{"n":50,"cod":"47.2/6-D4E2","crit":"E2·D4","peso":0.59,"critico":false},"e2_c0_g3_i2":{"n":51,"cod":"48.3/6-D4E2","crit":"E2·D4","peso":0.29,"critico":false},"e2_c0_g3_i3":{"n":52,"cod":"49.4/6-D4E2","crit":"E2·D4","peso":0.59,"critico":false},"e2_c0_g3_i4":{"n":53,"cod":"50.5/6-D4E2","crit":"E2·D4","peso":0.29,"critico":false},"e2_c0_g3_i5":{"n":54,"cod":"51.6/6-D4E2","crit":"E2·D4","peso":0.29,"critico":false},"e2_c0_g4_i0":{"n":55,"cod":"52.1/2-D5E2","crit":"E2·D5","peso":0.59,"critico":false},"e2_c0_g4_i1":{"n":56,"cod":"53.2/2-D5E2","crit":"E2·D5","peso":0.29,"critico":false},"e2_c0_g5_i0":{"n":57,"cod":"54.1/3-D6E2","crit":"E2·D6","peso":0.59,"critico":false},"e2_c0_g5_i1":{"n":58,"cod":"55.2/3-D6E2","crit":"E2·D6","peso":0.29,"critico":false},"e2_c0_g5_i2":{"n":59,"cod":"56.3/3-D6E2","crit":"E2·D6","peso":0.29,"critico":false},"e2_c0_g6_i0":{"n":60,"cod":"57.1/5-D7E2","crit":"E2·D7","peso":0.59,"critico":false},"e2_c0_g6_i1":{"n":61,"cod":"58.2/5-D7E2","crit":"E2·D7","peso":0.29,"critico":false},"e2_c0_g6_i2":{"n":62,"cod":"59.3/5-D7E2","crit":"E2·D7","peso":0.59,"critico":false},"e2_c0_g6_i3":{"n":63,"cod":"60.4/5-D7E2","crit":"E2·D7","peso":0.29,"critico":false},"e2_c0_g6_i4":{"n":64,"cod":"61.5/5-D7E2","crit":"E2·D7","peso":0.29,"critico":false},"e2_c1_g0_i0":{"n":65,"cod":"100.1/12-P1E2","crit":"E2·P1","peso":0.59,"critico":false},"e2_c1_g0_i1":{"n":66,"cod":"101.2/12-P1E2","crit":"E2·P1","peso":0.29,"critico":false},"e2_c1_g0_i2":{"n":67,"cod":"102.3/12-P1E2","crit":"E2·P1","peso":0.29,"critico":false},"e2_c1_g0_i3":{"n":68,"cod":"103.4/12-P1E2","crit":"E2·P1","peso":0.29,"critico":false},"e2_c1_g0_i4":{"n":69,"cod":"104.5/12-P1E2","crit":"E2·P1","peso":0.29,"critico":false},"e2_c1_g0_i5":{"n":70,"cod":"105.6/12-P1E2","crit":"E2·P1","peso":0.29,"critico":false},"e2_c1_g0_i6":{"n":71,"cod":"106.7/12-P1E2","crit":"E2·P1","peso":0.29,"critico":false},"e2_c1_g0_i7":{"n":72,"cod":"107.8/12-P1E2","crit":"E2·P1","peso":0.59,"critico":false},"e2_c1_g0_i8":{"n":73,"cod":"108.9/12-P1E2","crit":"E2·P1","peso":0.29,"critico":false},"e2_c1_g0_i9":{"n":74,"cod":"109.10/12-P1E2","crit":"E2·P1","peso":0.59,"critico":false},"e2_c1_g0_i10":{"n":75,"cod":"110.11/12-P1E2","crit":"E2·P1","peso":2.94,"critico":true},"e2_c1_g0_i11":{"n":76,"cod":"111.12/12-P1E2","crit":"E2·P1","peso":0.59,"critico":false},"e2_c2_g0_i0":{"n":77,"cod":"138.1/1-C1E2","crit":"E2·C1","peso":0.59,"critico":false},"e2_c2_g0_i1":{"n":78,"cod":"139.1/1-C2E2","crit":"E2·C2","peso":0.29,"critico":false},"e2_c2_g0_i2":{"n":79,"cod":"140.1/1-C3E2","crit":"E2·C3","peso":0.59,"critico":false},"e2_c2_g0_i3":{"n":80,"cod":"141.1/1-C4E2","crit":"E2·C4","peso":0.29,"critico":false},"e2_c2_g0_i4":{"n":81,"cod":"142.1/1-C5E2","crit":"E2·C5","peso":0.29,"critico":false},"e2_c3_g0_i0":{"n":82,"cod":"62.1/1-AHV1E2","crit":"E2·A1","peso":-0.59,"critico":false},"e2_c3_g0_i1":{"n":83,"cod":"63.1/1-AHV2E2","crit":"E2·A2","peso":-0.59,"critico":false},"e2_c3_g0_i2":{"n":84,"cod":"64.1/1-AHV3E2","crit":"E2·A3","peso":-0.29,"critico":false},"e3_c0_g0_i0":{"n":85,"cod":"65.1/3-D1E3","crit":"E3·D1","peso":0.29,"critico":false},"e3_c0_g0_i1":{"n":86,"cod":"66.2/3-D1E3","crit":"E3·D1","peso":2.94,"critico":true},"e3_c0_g0_i2":{"n":87,"cod":"67.3/3-D1E3","crit":"E3·D1","peso":0.59,"critico":false},"e3_c0_g1_i0":{"n":88,"cod":"68.1/6-D2E3","crit":"E3·D2","peso":2.94,"critico":true},"e3_c0_g1_i1":{"n":89,"cod":"69.2/6-D2E3","crit":"E3·D2","peso":2.94,"critico":true},"e3_c0_g1_i2":{"n":90,"cod":"70.3/6-D2E3","crit":"E3·D2","peso":2.94,"critico":true},"e3_c0_g1_i3":{"n":91,"cod":"71.4/6-D2E3","crit":"E3·D2","peso":0.59,"critico":false},"e3_c0_g1_i4":{"n":92,"cod":"72.5/6-D2E3","crit":"E3·D2","peso":0.29,"critico":false},"e3_c0_g1_i5":{"n":93,"cod":"73.6/6-D2E3","crit":"E3·D2","peso":0.29,"critico":false},"e3_c0_g2_i0":{"n":94,"cod":"74.1/3-D3E3","crit":"E3·D3","peso":0.29,"critico":false},"e3_c0_g2_i1":{"n":95,"cod":"75.2/3-D3E3","crit":"E3·D3","peso":0.59,"critico":false},"e3_c0_g2_i2":{"n":96,"cod":"76.3/3-D3E3","crit":"E3·D3","peso":2.94,"critico":true},"e3_c0_g3_i0":{"n":97,"cod":"77.1/7-D4E3","crit":"E3·D4","peso":0.29,"critico":false},"e3_c0_g3_i1":{"n":98,"cod":"78.2/7-D4E3","crit":"E3·D4","peso":0.29,"critico":false},"e3_c0_g3_i2":{"n":99,"cod":"79.3/7-D4E3","crit":"E3·D4","peso":2.94,"critico":true},"e3_c0_g3_i3":{"n":100,"cod":"80.4/7-D4E3","crit":"E3·D4","peso":0.59,"critico":false},"e3_c0_g3_i4":{"n":101,"cod":"81.5/7-D4E3","crit":"E3·D4","peso":0.59,"critico":false},"e3_c0_g3_i5":{"n":102,"cod":"82.6/7-D4E3","crit":"E3·D4","peso":0.59,"critico":false},"e3_c0_g3_i6":{"n":103,"cod":"83.7/7-D4E3","crit":"E3·D4","peso":0.29,"critico":false},"e3_c1_g0_i0":{"n":104,"cod":"112.1/13-P1E3","crit":"E3·P1","peso":0.29,"critico":false},"e3_c1_g0_i1":{"n":105,"cod":"113.2/13-P1E3","crit":"E3·P1","peso":0.59,"critico":false},"e3_c1_g0_i2":{"n":106,"cod":"114.3/13-P1E3","crit":"E3·P1","peso":2.94,"critico":true},"e3_c1_g0_i3":{"n":107,"cod":"115.4/13-P1E3","crit":"E3·P1","peso":0.59,"critico":false},"e3_c1_g0_i4":{"n":108,"cod":"116.5/13-P1E3","crit":"E3·P1","peso":0.29,"critico":false},"e3_c1_g0_i5":{"n":109,"cod":"117.6/13-P1E3","crit":"E3·P1","peso":0.59,"critico":false},"e3_c1_g0_i6":{"n":110,"cod":"118.7/13-P1E3","crit":"E3·P1","peso":0.59,"critico":false},"e3_c1_g0_i7":{"n":111,"cod":"119.8/13-P1E3","crit":"E3·P1","peso":0.59,"critico":false},"e3_c1_g0_i8":{"n":112,"cod":"120.9/13-P1E3","crit":"E3·P1","peso":0.59,"critico":false},"e3_c1_g0_i9":{"n":113,"cod":"121.10/13-P1E3","crit":"E3·P1","peso":0.59,"critico":false},"e3_c1_g0_i10":{"n":114,"cod":"122.11/13-P1E3","crit":"E3·P1","peso":0.59,"critico":false},"e3_c1_g0_i11":{"n":115,"cod":"123.12/13-P1E3","crit":"E3·P1","peso":0.29,"critico":false},"e3_c1_g0_i12":{"n":116,"cod":"124.13/13-P1E3","crit":"E3·P1","peso":0.59,"critico":false},"e4_c0_g0_i0":{"n":117,"cod":"84.1/4-D1E4","crit":"E4·D1","peso":0.29,"critico":false},"e4_c0_g0_i1":{"n":118,"cod":"85.2/4-D1E4","crit":"E4·D1","peso":0.29,"critico":false},"e4_c0_g0_i2":{"n":119,"cod":"86.3/4-D1E4","crit":"E4·D1","peso":0.29,"critico":false},"e4_c0_g0_i3":{"n":120,"cod":"87.4/4-D1E4","crit":"E4·D1","peso":0.29,"critico":false},"e4_c0_g1_i0":{"n":121,"cod":"88.1/8-D2E4","crit":"E4·D2","peso":0.29,"critico":false},"e4_c0_g1_i1":{"n":122,"cod":"89.2/8-D2E4","crit":"E4·D2","peso":0.59,"critico":false},"e4_c0_g1_i2":{"n":123,"cod":"90.3/8-D2E4","crit":"E4·D2","peso":0.29,"critico":false},"e4_c0_g1_i3":{"n":124,"cod":"91.4/8-D2E4","crit":"E4·D2","peso":0.29,"critico":false},"e4_c0_g1_i4":{"n":125,"cod":"92.5/8-D2E4","crit":"E4·D2","peso":0.29,"critico":false},"e4_c0_g1_i5":{"n":126,"cod":"93.6/8-D2E4","crit":"E4·D2","peso":2.94,"critico":true},"e4_c0_g1_i6":{"n":127,"cod":"94.7/8-D2E4","crit":"E4·D2","peso":0.59,"critico":false},"e4_c0_g1_i7":{"n":128,"cod":"95.8/8-D2E4","crit":"E4·D2","peso":0.59,"critico":false},"e4_c0_g2_i0":{"n":129,"cod":"96.1/4-D3E4","crit":"E4·D3","peso":0.29,"critico":false},"e4_c0_g2_i1":{"n":130,"cod":"97.2/4-D3E4","crit":"E4·D3","peso":0.29,"critico":false},"e4_c0_g2_i2":{"n":131,"cod":"98.3/4-D3E4","crit":"E4·D3","peso":0.29,"critico":false},"e4_c0_g2_i3":{"n":132,"cod":"99.4/4-D3E4","crit":"E4·D3","peso":0.29,"critico":false},"e4_c1_g0_i0":{"n":133,"cod":"125.1/5-P1E4","crit":"E4·P1","peso":0.29,"critico":false},"e4_c1_g0_i1":{"n":134,"cod":"126.2/5-P1E4","crit":"E4·P1","peso":0.29,"critico":false},"e4_c1_g0_i2":{"n":135,"cod":"127.3/5-P1E4","crit":"E4·P1","peso":0.29,"critico":false},"e4_c1_g0_i3":{"n":136,"cod":"128.4/5-P1E4","crit":"E4·P1","peso":0.29,"critico":false},"e4_c1_g0_i4":{"n":137,"cod":"129.5/5-P1E4","crit":"E4·P1","peso":0.59,"critico":false},"e4_c1_g1_i0":{"n":138,"cod":"130.1/5-P2E4","crit":"E4·P2","peso":0.29,"critico":false},"e4_c1_g1_i1":{"n":139,"cod":"131.2/5-P2E4","crit":"E4·P2","peso":0.29,"critico":false},"e4_c1_g1_i2":{"n":140,"cod":"132.3/5-P2E4","crit":"E4·P2","peso":0.59,"critico":false},"e4_c1_g1_i3":{"n":141,"cod":"133.4/5-P2E4","crit":"E4·P2","peso":0.59,"critico":false},"e4_c1_g1_i4":{"n":142,"cod":"134.5/5-P2E4","crit":"E4·P2","peso":2.94,"critico":true}};

/* ── Utilidades ────────────────────────────────────────────────────────── */

/* Aplana el instrumento a una lista de reactivos con su clave canónica */
export function reactivosPlanos() {
  const salida = [];
  INSTRUMENTO.elementos.forEach((el, ei) => {
    el.criterios.forEach((cr, ci) => {
      cr.grupos.forEach((gr, gi) => {
        gr.items.forEach((texto, ii) => {
          const clave = `e${ei + 1}_c${ci}_g${gi}_i${ii}`;
          salida.push({
            clave,
            elemento: el.n,
            elementoNombre: el.nombre,
            criterio: cr.titulo,
            tipo: cr.tipo,
            grupo: gr.titulo,
            texto,
            ...META_REACTIVOS[clave],
          });
        });
      });
    });
  });
  return salida;
}

/* Respuestas que valen para ESTE instrumento. Un autodiagnóstico contestado
   con el instrumento anterior (redacción propia, no oficial) tiene claves
   que ya significan otra cosa: no se cuentan y el candidato lo vuelve a
   contestar. */
export function respuestasVigentes(auto) {
  if (!auto || auto.instrumento !== VERSION) return {};
  return auto.answers || {};
}

/* Reactivos eliminatorios (críticos) marcados en NO */
export function criticosEnNo(answers) {
  return reactivosPlanos().filter(r => r.critico && answers[r.clave] === 'NO');
}

/* Verificación de integridad: debe dar 142 */
export const TOTAL_REAL = reactivosPlanos().length;
