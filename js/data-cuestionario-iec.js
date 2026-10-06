/* ============================================================================
   POSTURALIA · data-cuestionario-iec.js — Cuestionario oficial del IEC1375

   Las 37 preguntas de conocimiento del Instrumento de Evaluación de
   Competencia (IEC1375, formato N-FO-03 v2.0), agrupadas en los 8 reactivos
   de conocimiento (135 a 142), con sus opciones completas y la respuesta
   correcta del Anexo 2. Texto cotejado contra el instrumento oficial en
   blanco del CONOCER (45 pp): se conservan sus erratas («infático»,
   «Flanco derecho» repetido, la «d)» vacía de la 141).

   `etiqueta` es el prefijo tal como se imprime («1.( )», «1. ( )» o nada).
   `imagen.tipo` elige la figura: 'cuadrantes' (140·10) o 'ejes_cuerpo' (140·5).
   En cada grupo, `cuestionario` (1 o 2) y `elemento` ubican el reactivo en el
   Cuestionario 1 (elemento 1) o el Cuestionario 2 (elemento 2) del IEC.

   Tipos:
     opcion_multiple      correcta: 'c)'
     verdadero_falso      correcta: 'a)'
     relacionar_columnas  izquierda: [...] y correcta: [{ item, letra }]
                          (Desinfección: [{ item, letras: [...] }])

   Las respuestas del candidato se guardan por `n` (1–37), como cadena de
   letras: 'c)' o, para relacionar, 'e),c),b)' en el orden de la columna
   izquierda (Desinfección: 'b),c),e) | a),d),f)').
   ========================================================================== */

export const GRUPOS_CUESTIONARIO = [
 {
  "reactivo": 135,
  "cod": "135.1/1-C1E1",
  "peso": 0.29,
  "tema": "Técnicas de atención tradicional y complementaria.",
  "subtemas": [],
  "instruccion": "De cada una de las siguientes preguntas subraye sobre las opciones la respuesta correcta.",
  "preguntas": 4,
  "cuestionario": 1,
  "elemento": 1
 },
 {
  "reactivo": 136,
  "cod": "136.1/1-C2E1",
  "peso": 0.29,
  "tema": "Desinfección vs Sanitización:",
  "subtemas": [],
  "instruccion": "Relaciones las siguientes columnas, anotando en los paréntesis de la izquierda la letra según corresponda a los procesos de sanitización o desinfección.",
  "preguntas": 1,
  "cuestionario": 1,
  "elemento": 1
 },
 {
  "reactivo": 137,
  "cod": "137.1/1-C3E1",
  "peso": 0.29,
  "tema": "Manejo de residuos peligrosos NOM-087-ECOL-SSA1-2002.",
  "subtemas": [],
  "instruccion": "Subraye la respuesta correcta de las opciones que se le presentan para cada pregunta.",
  "preguntas": 3,
  "cuestionario": 1,
  "elemento": 1
 },
 {
  "reactivo": 138,
  "cod": "138.1/1-C1E2",
  "peso": 0.59,
  "tema": "Rangos y niveles de signos vitales en niños, adultos y personas de la tercera edad.",
  "subtemas": [],
  "instruccion": "Selecciona la respuesta correcta de acuerdo con los criterios de rangos normales de los signos vitales.",
  "preguntas": 8,
  "cuestionario": 2,
  "elemento": 2
 },
 {
  "reactivo": 139,
  "cod": "139.1/1-C2E2",
  "peso": 0.29,
  "tema": "Goniometría:",
  "subtemas": [
   "Concepto.",
   "Utilidad.",
   "Aplicación"
  ],
  "instruccion": "Instrucciones: Subraye la respuesta correcta para cada cuestionamiento.",
  "preguntas": 3,
  "cuestionario": 2,
  "elemento": 2
 },
 {
  "reactivo": 140,
  "cod": "140.1/1-C3E2",
  "peso": 0.59,
  "tema": "Biomecánica:",
  "subtemas": [
   "Definición.",
   "Planos anatómicos.",
   "Ejes del cuerpo.",
   "Movimientos del cuerpo.",
   "Anatomía y Fisiología topográfica."
  ],
  "instruccion": "Instrucciones: Subraye la respuesta correcta para cada cuestionamiento.",
  "preguntas": 14,
  "cuestionario": 2,
  "elemento": 2
 },
 {
  "reactivo": 141,
  "cod": "141.1/1-C4E2",
  "peso": 0.29,
  "tema": "Higiene de columna:",
  "subtemas": [
   "Posiciones adecuadas.",
   "Manipulaciones de carga."
  ],
  "instruccion": "Seleccione la respuesta correcta, anotando en el paréntesis de la izquierda la opción que corresponda.",
  "preguntas": 2,
  "cuestionario": 2,
  "elemento": 2
 },
 {
  "reactivo": 142,
  "cod": "142.1/1-C5E2",
  "peso": 0.29,
  "tema": "Pruebas funcionales musculares de Daniels:",
  "subtemas": [
   "Posiciones."
  ],
  "instruccion": "Subraye la respuesta correcta para cada cuestionamiento.",
  "preguntas": 2,
  "cuestionario": 2,
  "elemento": 2
 }
];

export const CUESTIONARIO = [
{"n": 1, "reactivo": 135, "num": 1, "tipo": "opcion_multiple", "etiqueta": "1.", "pregunta": "Es la técnica que consiste en colocar balines o semillas de mostaza en el pabellón auricular para estimular puntos reflejos con fines terapéuticos:", "opciones": ["a) Masaje Zapoteca", "b) Iridología", "c) Auriculoterapia", "d) Flores de Bach", "e) Audioterapia"], "correcta": "c)"},
{"n": 2, "reactivo": 135, "num": 2, "tipo": "opcion_multiple", "etiqueta": "2.", "pregunta": "Incorpora con fines terapéuticos, estéticos o deportivos manipulaciones como Effleurage, Tapotement y Petrissage", "opciones": ["a) Pruebas funcionales", "b) Masaje sueco", "c) Reiki", "d) Flores de Bach", "e) Masaje drenaje infático"], "correcta": "b)"},
{"n": 3, "reactivo": 135, "num": 3, "tipo": "opcion_multiple", "etiqueta": "3.", "pregunta": "Proviene del náhuatl temaz (sudor) y Calli (Casa) y es utilizado con fines terapéuticos y espirituales:", "opciones": ["a) Masaje Zapoteca", "b) Reiki", "c) Auriculoterapia", "d) Temazcal", "e) Terapia de agua"], "correcta": "d)"},
{"n": 4, "reactivo": 135, "num": 4, "tipo": "opcion_multiple", "etiqueta": "4.", "pregunta": "Su implementación tiene que ver con preparaciones herbarias que contienen como principios activos partes de plantas, materiales vegetales o combinaciones de estos", "opciones": ["a) Medicina complementaria", "b) Medicamentos herbarios", "c) Herbolaria", "d) Medicina naturista", "e) Naturopatía"], "correcta": "c)"},
{"n": 5, "reactivo": 136, "num": 1, "tipo": "relacionar_columnas", "etiqueta": "", "pregunta": "Relaciones las siguientes columnas, anotando en los paréntesis de la izquierda la letra según corresponda a los procesos de sanitización o desinfección.", "opciones": ["a) Los productos utilizados para este proceso eliminan los microorganismos en su totalidad. Poseen propiedades germicidas y antibacteriales.", "b) Se lleva acabo con sustancias que ayudan a matar este tipo de microorganismos a un nivel seguro. Sin embargo, no los elimina por completo. Los productos utilizados poseen propiedades antimicrobianas para evitar la proliferación de gérmenes, bacterias y microbios.", "c) Algunos productos utilizados para este proceso son: etanol, isopropanol, aldehidos,halogenuros, yodo, cloramina, fenoles", "d) Algunos productos utilizados para este proceso son: Peróxido, yodóforos, ácido paracético cloruro de benzalconio y alcohol etílico e isopropílico", "e) Su agente químico que reduce el número e inhibe el crecimiento microbiano a un 99.9% de microorganismos patógenos hasta un nivel de seguridad que evite el contagio de alguna enfermedad.", "f) Este proceso se utiliza comúnmente en áreas quirúrgicas, zonas que tengan contacto con alimentos y áreas de exposición permanente a agentes patógenos como los baños."], "correcta": [{"item": "Sanitización", "letras": ["b)", "c)", "e)"]}, {"item": "Desinfección", "letras": ["a)", "d)", "f)"]}], "izquierda": ["( ) Sanitización", "( ) Desinfección"], "nota": "Official question page prints NO number and NO separate stem: the line 'Relaciones las siguientes columnas…' is the group instruction printed once under the reactivo table, followed directly by the two columns. Anexo 2 prints the stem once and two key rows: 'Sanitización [b), c), e)]' and 'Desinfección [a), d), f)]'."},
{"n": 6, "reactivo": 137, "num": 1, "tipo": "opcion_multiple", "etiqueta": "1.", "pregunta": "La norma NOM-0870 ECOL-SSA1-2002 define los agentes biológico-infeccioso como:", "opciones": ["a) Cualquier microorganismo capaz de producir enfermedades cuando está presente en concentraciones suficientes (inóculo), en un ambiente propicio (supervivencia), en un hospedero susceptible y en presencia de una vía de entrada.", "b) Instalación de servicio que tiene por objeto resguardar temporalmente y bajo ciertas condiciones a los residuos peligrosos biológico-infecciosos para su envío a instalaciones autorizadas para su tratamiento o disposición final.", "c) Son aquellos materiales generados durante los servicios de atención médica que contengan agentes biológico-infecciosos según son definidos en esta Norma, y que puedan causar efectos nocivos a la salud y al ambiente."], "correcta": "a)"},
{"n": 7, "reactivo": 137, "num": 2, "tipo": "opcion_multiple", "etiqueta": "2.", "pregunta": "La norma NOM-087 ECOL-SSA1-2002 describe los Residuos Peligrosos Biológico-Infecciosos (RPBI) como:", "opciones": ["a) Cualquier microorganismo capaz de producir enfermedades cuando está presente en concentraciones suficientes (inóculo), en un ambiente propicio (supervivencia), en un hospedero susceptible y en presencia de una vía de entrada.", "b) Instalación de servicio que tiene por objeto resguardar temporalmente y bajo ciertas condiciones a los residuos peligrosos biológico-infecciosos para su envío a instalaciones autorizadas para su tratamiento o disposición final.", "c) Son aquellos materiales generados durante los servicios de atención médica que contengan agentes biológico-infecciosos y que puedan causar efectos nocivos a la salud y al ambiente."], "correcta": "c)", "nota": "Option c) wording differs slightly from question 1 (no \"según son definidos en esta Norma,\")."},
{"n": 8, "reactivo": 137, "num": 3, "tipo": "opcion_multiple", "etiqueta": "1. ( )", "pregunta": "El Centro de acopio donde llegan los RPBI (Residuos Peligrosos Biológico-Infecciosos) se puede definir como:\nLa Instalación de servicio que tiene por objeto resguardar ______________________ y bajo ciertas condiciones a los residuos _________________ biológico-infecciosos para su envío a instalaciones __________________________ para su __________________ o disposición final.", "opciones": ["a) Siempre, riesgosos, apropiadas, resguardo.", "b) Temporalmente, peligrosos, resguardadas, canalización.", "c) Temporalmente, peligrosos, autorizadas, tratamiento.", "d) Parcialmente, orgánicos, autorizadas, abordaje."], "correcta": "c)", "subtipo": "completar_espacios", "nota": "Official numbering restarts at '1. ( )' for this third question, both on the question page and in Anexo 2."},
{"n": 9, "reactivo": 138, "num": 1, "tipo": "opcion_multiple", "etiqueta": "1.( )", "pregunta": "Los rangos normales de presión arterial en un adulto son de:", "opciones": ["a) Sistólica (< 120 mm Hg); Diastólica (< 80 mm Hg)", "b) Sistólica (< 70 mm Hg); Diastólica (< 80 mm Hg).", "c) Sistólica (< 130 mm Hg); Diastólica (< 90 mm Hg)."], "correcta": "a)"},
{"n": 10, "reactivo": 138, "num": 2, "tipo": "opcion_multiple", "etiqueta": "2.( )", "pregunta": "Los rangos para considerar pre hipertensión en un adultos son de:", "opciones": ["a) Sistólica (< 120- 139 mm Hg); Diastólica (< 80- 89 mm Hg).", "b) Sistólica (< 80- 100 mm Hg); Diastólica (<89 mm Hg).", "c) Sistólica (< 60- 90 mm Hg); Diastólica (<70 mm Hg)."], "correcta": "a)"},
{"n": 11, "reactivo": 138, "num": 3, "tipo": "opcion_multiple", "etiqueta": "3.( )", "pregunta": "Los rangos para considerar hipertensión en edades de 18 años hasta menos de 60 años, diabetes o enfermedad renal, son:", "opciones": ["a) Sistólica (< 110- 120 mm Hg); Diastólica (< 90- 99 mm Hg).", "b) Sistólica (< 120- 130 mm Hg); Diastólica (< 60- 80 mm Hg).", "c) Sistólica (< 140- 159 mm Hg); Diastólica (< 90- 99 mm Hg)."], "correcta": "c)"},
{"n": 12, "reactivo": 138, "num": 4, "tipo": "opcion_multiple", "etiqueta": "4.( )", "pregunta": "Los rangos para considerar hipertensión en edades de 60 años o más son:", "opciones": ["a) Sistólica (< 120- 130 mm Hg); Diastólica (< 80 mm Hg).", "b) Sistólica (< 150- 159 mm Hg); Diastólica (< 90- 99 mm Hg).", "c) Sistólica (< 110- 89 mm Hg); Diastólica (< 89- 60 mm Hg)."], "correcta": "b)"},
{"n": 13, "reactivo": 138, "num": 5, "tipo": "opcion_multiple", "etiqueta": "5.( )", "pregunta": "Los rangos para considerar hipotensión son:", "opciones": ["a) Sistólica (< 100mm Hg); Diastólica (80mm Hg).", "b) Sistólica (80mm/ Hg); Diastólica (50 mm Hg).", "c) Sistólica (< 130mm Hg); Diastólica (90mm Hg)."], "correcta": "b)"},
{"n": 14, "reactivo": 138, "num": 6, "tipo": "opcion_multiple", "etiqueta": "6. ( )", "pregunta": "La Frecuencia Respiratoria normal es de:", "opciones": ["a) 40 respiraciones por minuto.", "b) 20 respiraciones por minuto.", "c) 10 respiraciones por minuto."], "correcta": "b)"},
{"n": 15, "reactivo": 138, "num": 7, "tipo": "opcion_multiple", "etiqueta": "7. ( )", "pregunta": "El rango de temperatura corporal normal es de:", "opciones": ["a) 37- 38.5 °C.", "b) 35- 36 °C.", "c) 36.5- 37°C."], "correcta": "c)"},
{"n": 16, "reactivo": 138, "num": 8, "tipo": "opcion_multiple", "etiqueta": "8. ( )", "pregunta": "El rango del pulso normal es de:", "opciones": ["a) 55- 60 (latidos por minuto).", "b) 90-120 (latidos por minuto).", "c) 72- 80 (latidos por minuto)."], "correcta": "c)"},
{"n": 17, "reactivo": 139, "num": 1, "tipo": "opcion_multiple", "etiqueta": "1.", "pregunta": "¿Qué estudia la Goniometría?", "opciones": ["a) Disciplina que se encarga de estudiar la medición de los ángulos", "b) Disciplina que se encarga de estudiar las articulaciones", "c) Disciplina que se encarga de estudiar los niveles de artritis", "d) Disciplina que se encarga de atender la rigidez articular"], "correcta": "a)"},
{"n": 18, "reactivo": 139, "num": 2, "tipo": "opcion_multiple", "etiqueta": "2.", "pregunta": "¿Para que nos sirve la Goniometría?", "opciones": ["a) Para ver si el paciente tiene artritis", "b) Para verificar que una articulación es suficientemente fuerte", "c) Para hacer la medición de los ángulos creados por la intersección de los ejes longitudinales de los huesos a nivel de las articulaciones", "d) Hacer más grande el nivel de rango articular"], "correcta": "c)"},
{"n": 19, "reactivo": 139, "num": 3, "tipo": "opcion_multiple", "etiqueta": "3.", "pregunta": "¿Cuándo se aplica la goniometría?", "opciones": ["a) Para realizar el tratamiento de un paciente con hombro congelado", "b) Para saber porque se tiene un padecimiento en el sistema osteoarticular", "c) Para describir la presencia de los ejes a nivel del sistema osteoarticular con fines diagnósticos, pronósticos, terapéuticos y de investigación", "d) El goniómetro es el principal instrumento que se utiliza para medir los ángulos en el sistema osteoarticular."], "correcta": "c)"},
{"n": 20, "reactivo": 140, "num": 1, "tipo": "opcion_multiple", "etiqueta": "1.", "pregunta": "¿Qué estudia la biomecánica articular?", "opciones": ["a) Estudia los movimientos realizados por las articulaciones", "b) Estudia el funcionamiento de las articulaciones", "c) Estudia los tipos de articulaciones", "d) Estudia la actividad articular"], "correcta": "a)"},
{"n": 21, "reactivo": 140, "num": 2, "tipo": "opcion_multiple", "etiqueta": "2.", "pregunta": "¿El plano sagital como divide el cuerpo?", "opciones": ["a) Arriba y abajo", "b) Derecha e izquierda", "c) Posterior y anterior", "d) En oblicuo y lateral"], "correcta": "b)"},
{"n": 22, "reactivo": 140, "num": 3, "tipo": "opcion_multiple", "etiqueta": "3.", "pregunta": "¿Cómo es la división del cuerpo en el plano frontal?", "opciones": ["a) Arriba y abajo", "b) Derecha e izquierda", "c) Posterior y anterior", "d) Perpendicular y transversal"], "correcta": "c)"},
{"n": 23, "reactivo": 140, "num": 4, "tipo": "opcion_multiple", "etiqueta": "4.", "pregunta": "¿Cómo se divide el cuerpo en el plano transversal?", "opciones": ["a) Arriba y abajo", "b) Derecha e izquierda", "c) Lateral y de frente", "d) Posterior y anterior"], "correcta": "a)"},
{"n": 24, "reactivo": 140, "num": 5, "tipo": "relacionar_columnas", "etiqueta": "5.", "pregunta": "Relaciona la letra que corresponda con cada uno de los ejes del cuerpo.", "opciones": ["a) Eje medio Lateral", "b) Eje Anteroposterior", "c) Eje vertical"], "correcta": [{"item": "Eje Medio lateral", "letra": "c)"}, {"item": "Eje Anteroposterior", "letra": "b)"}, {"item": "Eje Vertical", "letra": "a)"}], "izquierda": ["Eje Medio lateral", "Eje Anteroposterior", "Eje Vertical"], "nota": "Key copied verbatim from official Anexo 2: Eje Medio lateral [c)], Eje Anteroposterior [b)], Eje Vertical [a)]. It follows the letters A/B/C of the official figure (A = vertical axis), not the printed right-hand column 'a) Eje medio Lateral, b) Eje Anteroposterior, c) Eje vertical'. Reproduce as official.", "imagen": {"tipo": "ejes_cuerpo", "titulo": "Ejes del cuerpo", "leyenda": ["A", "B", "C"], "descripcion": "Standing human figure (front view) with a vertical line through the body labelled A (label at the feet) and two crossing oblique lines at pelvis level labelled B (right side) and C (left side). Printed between the stem and the two columns (page 31)."}},
{"n": 25, "reactivo": 140, "num": 6, "tipo": "opcion_multiple", "etiqueta": "6.", "pregunta": "Es todo movimiento en el plano sagital que desplaza una parte del cuerpo hacia delante de la posición anatómica", "opciones": ["a) Flexión", "b) Aducción", "c) Extensión", "d) Abducción"], "correcta": "a)"},
{"n": 26, "reactivo": 140, "num": 7, "tipo": "opcion_multiple", "etiqueta": "7.", "pregunta": "Es todo movimiento en el plano sagital que desplaza una parte del cuerpo hacia atrás de la posición anatómica", "opciones": ["a) Flexión", "b) Aducción", "c) Extensión", "d) Abducción"], "correcta": "c)"},
{"n": 27, "reactivo": 140, "num": 8, "tipo": "opcion_multiple", "etiqueta": "8.", "pregunta": "Es todo movimiento en el plano frontal que aleja una parte del cuerpo de la línea media", "opciones": ["a) Flexión", "b) Aducción", "c) Extensión", "d) Abducción"], "correcta": "d)"},
{"n": 28, "reactivo": 140, "num": 9, "tipo": "opcion_multiple", "etiqueta": "9.", "pregunta": "Es todo movimiento que en el plano frontal acerca una parte del cuerpo a la línea media", "opciones": ["a) Flexión", "b) Aducción", "c) Extensión", "d) Abducción"], "correcta": "b)"},
{"n": 29, "reactivo": 140, "num": 10, "tipo": "relacionar_columnas", "etiqueta": "10.", "pregunta": "Relaciona cada número con el cuadrante abdominal que le corresponde", "opciones": ["a) 1", "b) 2", "c) 3", "d) 4", "e) 5", "f) 6", "g) 7", "h) 8", "i) 9"], "correcta": [{"item": "Flanco derecho", "letra": "g)"}, {"item": "Hipogastrio", "letra": "c)"}, {"item": "Mesogastrio", "letra": "b)"}, {"item": "Fosa Iliaca derecha", "letra": "h)"}, {"item": "Hipocondrio derecho", "letra": "d)"}, {"item": "Hipocondrio izquierdo", "letra": "e)"}, {"item": "Epigastrio", "letra": "a)"}, {"item": "Flanco derecho", "letra": "f)"}, {"item": "Fosa Iliaca izquierda", "letra": "i)"}], "izquierda": ["Flanco derecho", "Hipogastrio", "Mesogastrio", "Fosa Iliaca derecha", "Hipocondrio derecho", "Hipocondrio izquierdo", "Epigastrio", "Flanco derecho", "Fosa Iliaca izquierda"], "imagen": {"tipo": "cuadrantes", "titulo": "Cuadrantes abdominales", "leyenda": ["1: Epigastrio", "2: Región umbilical", "3: Hipogastrio", "4: Hipocondrio derecho", "5: Hipocondrio izquierdo", "6: Flanco derecho", "7: Flanco izquierdo", "8: FID", "9: FII"]}, "nota": "Official typo: \"Flanco derecho\" appears twice; per the key and the figure the FIRST one is Flanco izquierdo (7 = g)) and the second is Flanco derecho (6 = f)). In Anexo 2 this item is printed after questions 11-14."},
{"n": 30, "reactivo": 140, "num": 11, "tipo": "opcion_multiple", "etiqueta": "11.", "pregunta": "¿En qué cuadrante abdominal se localiza el lóbulo derecho del hígado y la vesícula biliar?", "opciones": ["a) Hipocondrio derecho", "b) Epigastrio", "c) Flanco derecho", "d) Hipocondrio izquierdo"], "correcta": "a)"},
{"n": 31, "reactivo": 140, "num": 12, "tipo": "opcion_multiple", "etiqueta": "12.", "pregunta": "¿En qué cuadrante abdominal se localiza el bazo?", "opciones": ["a) Hipocondrio derecho", "b) Fosa iliaca derecha", "c) Flanco derecho", "d) Hipocondrio izquierdo"], "correcta": "d)"},
{"n": 32, "reactivo": 140, "num": 13, "tipo": "opcion_multiple", "etiqueta": "13.", "pregunta": "¿En qué cuadrante abdominal se localiza el apéndice?", "opciones": ["a) Hipocondrio derecho", "b) Fosa iliaca derecha", "c) Flanco derecho", "d) Hipocondrio izquierdo"], "correcta": "b)"},
{"n": 33, "reactivo": 140, "num": 14, "tipo": "opcion_multiple", "etiqueta": "14.", "pregunta": "¿En qué cuadrante abdominal se localiza el estómago?", "opciones": ["a) Hipocondrio derecho", "b) Fosa iliaca derecha", "c) Epigastrio", "d) Hipocondrio izquierdo"], "correcta": "c)"},
{"n": 34, "reactivo": 141, "num": 1, "tipo": "verdadero_falso", "etiqueta": "1. ( )", "pregunta": "La posición correcta al estar en decúbito supino es la siguiente: Almohada a la altura de los hombros (no debe de sobrepasarlos), almohada pequeña abajo de las rodillas", "opciones": ["a) Verdadero", "b) Falso", "c) Ninguna"], "correcta": "a)"},
{"n": 35, "reactivo": 141, "num": 2, "tipo": "verdadero_falso", "etiqueta": "", "pregunta": "La manipulación de carga correcta al estar sentado es la siguiente: Espalda bien recta, pegada al respaldo de la silla, pies pegados al suelo, las rodillas deben de quedar ligeramente más altas que las caderas, cabeza recta, mirando al frente, en periodos largos (más de 50 min. pararse y caminar 5 min)", "opciones": ["a) Verdadero", "b) Falso", "c) Ninguna", "d)"], "correcta": "a)", "nota": "Official prints NO number/label before this stem (question and Anexo 2), and an empty 'd)' option. Render the stem with no prefix."},
{"n": 36, "reactivo": 142, "num": 1, "tipo": "opcion_multiple", "etiqueta": "1.", "pregunta": "¿En que posiciones se pueden realizar las pruebas funcionales de Daniels?", "opciones": ["a) Paciente sentado en una silla cómoda a la altura de la cadera del terapeuta", "b) Se puede realizar en cualquier posición donde el musculo agonista necesite vencer la gravedad", "c) Paciente en cualquier posición donde el musculo antagonista realice el trabajo de carga"], "correcta": "b)"},
{"n": 37, "reactivo": 142, "num": 2, "tipo": "relacionar_columnas", "etiqueta": "2.", "pregunta": "Coloca en el paréntesis el número del 0 al 5 con el que corresponde a cada valor de la escala de Daniels:", "opciones": ["a) 0", "b) 1", "c) 2", "d) 3", "e) 4", "f) 5"], "correcta": [{"item": "Movimiento con resistencia parcial", "letra": "e)"}, {"item": "Movimiento con resistencia máxima", "letra": "f)"}, {"item": "Movimiento que no vence la gravedad", "letra": "c)"}, {"item": "Ausencia de contracción", "letra": "a)"}, {"item": "Movimiento completo que vence la gravedad", "letra": "d)"}, {"item": "Contracción sin movimiento", "letra": "b)"}], "izquierda": ["Movimiento con resistencia parcial", "Movimiento con resistencia máxima", "Movimiento que no vence la gravedad", "Ausencia de contracción", "Movimiento completo que vence la gravedad", "Contracción sin movimiento"]}
];
