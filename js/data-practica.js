/* POSTURALIA · data-practica.js — 103 reactivos de práctica del EC1375.
   fmt: mc = opción múltiple · fill = completar (con opciones) · col = relacionar.
   crit = criterio del estándar · obj = tema (objetivo) de Paideia V4.5.
   Las opciones vienen con la correcta en `resp` (casi siempre la primera):
   practica.html las BARAJA al mostrarlas. Sin barajar, la respuesta
   correcta de 80 reactivos era siempre la A.
   Fuente de opciones de "completar": Paideia V4.5 (EC1375_DATA.banco). */

export const PRACTICA = [
 {
  "id": "TEC-DEF-01",
  "fmt": "mc",
  "crit": "E1·C1",
  "stem": "Según el glosario del EC1375, ¿qué caracteriza a las técnicas de atención tradicional y complementaria?",
  "expl": "El estándar las define como técnicas con raíz en saberes de pueblos originarios que buscan el equilibrio físico y socioemocional y que <b>complementan</b> —nunca sustituyen— la atención del profesional de la salud.",
  "slides": [
   "v3-8"
  ],
  "op": [
   "Rescatan la tradición de pueblos originarios y complementan la atención del profesional de la salud",
   "Sustituyen el tratamiento indicado por el médico tratante",
   "Se aplican únicamente en instituciones del sector salud",
   "Requieren un diagnóstico previo emitido por quien las aplica"
  ],
  "resp": 0,
  "obj": "TEC-DEF"
 },
 {
  "id": "TEC-DEF-02",
  "fmt": "mc",
  "crit": "E1·C1",
  "stem": "Un usuario te pide que le digas si puede dejar el medicamento que le recetó su médico porque ya se siente mejor con el servicio. ¿Qué corresponde hacer?",
  "expl": "El estándar es explícito: las técnicas «complementan —nunca sustituyen— la atención del profesional de la salud». Opinar sobre el medicamento, sugerir reducir la dosis o callar ante la pregunta excede tu alcance.",
  "slides": [
   "v3-8"
  ],
  "op": [
   "Explicarle que el servicio complementa y no sustituye la indicación médica",
   "Decirle que puede dejarlo si él se siente mejor",
   "Sugerirle que reduzca la dosis poco a poco",
   "Decirle que la decisión es suya y no opinar"
  ],
  "resp": 0,
  "obj": "TEC-DEF"
 },
 {
  "id": "TEC-DEF-03",
  "fmt": "fill",
  "crit": "E1·C1",
  "stem": "Completa: las técnicas tradicionales y complementarias buscan el equilibrio ____ y socioemocional de la persona.",
  "expl": "La definición del glosario dice «equilibrio en físico y socioemocional». Las dos dimensiones van juntas.",
  "slides": [
   "v3-8"
  ],
  "obj": "TEC-DEF",
  "op": [
   "físico",
   "clínico",
   "farmacológico",
   "postural"
  ],
  "resp": 0
 },
 {
  "id": "TEC-DEF-04",
  "fmt": "mc",
  "crit": "E1·C1",
  "stem": "¿Cuál de estas afirmaciones queda FUERA del alcance de quien brinda servicios auxiliares en técnicas tradicionales y complementarias?",
  "expl": "El estándar dice que estas técnicas «complementan —nunca sustituyen— la atención del profesional de la salud», y diagnosticar es precisamente lo que le corresponde al profesional. Registrar, explicar y referir sí forman parte del servicio y de hecho son reactivos del estándar.",
  "slides": [
   "v3-8"
  ],
  "op": [
   "Emitir un diagnóstico sobre el padecimiento del usuario",
   "Registrar los signos vitales en la ficha de atención",
   "Explicar en qué consiste la técnica antes de aplicarla",
   "Referir al usuario con su médico tratante"
  ],
  "resp": 0,
  "obj": "TEC-DEF"
 },
 {
  "id": "TEC-IDENT-01",
  "fmt": "mc",
  "crit": "E1·C1",
  "stem": "Técnica que coloca balines o semillas en el pabellón de la oreja para estimular puntos reflejos:",
  "expl": "El pabellón auricular es la clave: <b>auriculoterapia</b>. La reflexología trabaja zonas reflejas de pies y manos; la acupuntura inserta agujas.",
  "slides": [
   "n-tecnicas"
  ],
  "op": [
   "Auriculoterapia",
   "Reflexología",
   "Acupuntura",
   "Masoterapia"
  ],
  "resp": 0,
  "obj": "TEC-IDENT"
 },
 {
  "id": "TEC-IDENT-02",
  "fmt": "mc",
  "crit": "E1·C1",
  "stem": "Técnica que emplea manipulaciones como effleurage, petrissage y tapotement:",
  "expl": "Esos tres nombres son maniobras clásicas del masaje: <b>masoterapia</b>. La osteopatía y la quiropraxia manipulan estructuras, no tejidos blandos con esas maniobras.",
  "slides": [
   "n-tecnicas"
  ],
  "op": [
   "Masoterapia",
   "Osteopatía",
   "Quiropraxia",
   "Hidroterapia"
  ],
  "resp": 0,
  "obj": "TEC-IDENT"
 },
 {
  "id": "TEC-IDENT-03",
  "fmt": "mc",
  "crit": "E1·C1",
  "stem": "Del náhuatl <i>temaz</i> (sudor) y <i>calli</i> (casa), se usa con fines terapéuticos y espirituales:",
  "expl": "La etimología lo resuelve: casa de sudor, <b>temazcal</b>. La hidroterapia usa agua y la fitoterapia, plantas.",
  "slides": [
   "n-tecnicas"
  ],
  "op": [
   "Temazcal",
   "Hidroterapia",
   "Fangoterapia",
   "Fitoterapia"
  ],
  "resp": 0,
  "obj": "TEC-IDENT"
 },
 {
  "id": "TEC-IDENT-04",
  "fmt": "mc",
  "crit": "E1·C1",
  "stem": "Técnica cuyos preparados tienen como principio activo partes de plantas o materiales vegetales:",
  "expl": "<b>Fitoterapia</b> —también llamada herbolaria—. La homeopatía parte de diluciones y no se define por el origen vegetal.",
  "slides": [
   "n-tecnicas"
  ],
  "op": [
   "Fitoterapia",
   "Homeopatía",
   "Acupuntura",
   "Reflexología"
  ],
  "resp": 0,
  "obj": "TEC-IDENT"
 },
 {
  "id": "TEC-IDENT-05",
  "fmt": "mc",
  "crit": "E1·C1",
  "stem": "Técnica que aplica presión sobre zonas reflejas de los pies y las manos:",
  "expl": "<b>Reflexología</b>. La auriculoterapia usa el mismo principio de puntos reflejos, pero en la oreja: es la confusión más común entre las dos.",
  "slides": [
   "n-tecnicas"
  ],
  "op": [
   "Reflexología",
   "Auriculoterapia",
   "Masoterapia",
   "Quiropraxia"
  ],
  "resp": 0,
  "obj": "TEC-IDENT"
 },
 {
  "id": "TEC-IDENT-06",
  "fmt": "col",
  "crit": "E1·C1",
  "stem": "Relaciona cada técnica con el rasgo que la identifica.",
  "expl": "Cada técnica tiene un rasgo que la vuelve inconfundible: el instrumento, la estructura que trabaja, el medio o el origen del principio activo.",
  "slides": [
   "n-tecnicas"
  ],
  "pares": [
   [
    "Acupuntura",
    "Inserción de agujas finas en puntos específicos"
   ],
   [
    "Quiropraxia",
    "Ajustes manuales dirigidos a la columna vertebral"
   ],
   [
    "Temazcal",
    "Baño de vapor ritual de origen prehispánico"
   ],
   [
    "Fitoterapia",
    "Preparados con partes de plantas como principio activo"
   ]
  ],
  "obj": "TEC-IDENT"
 },
 {
  "id": "DES-DIF-01",
  "fmt": "mc",
  "crit": "E1·C2",
  "stem": "¿Cuál es la diferencia central entre desinfectar y sanitizar?",
  "expl": "La desinfección <b>mata o erradica</b>; la sanitización <b>reduce</b> la carga microbiana a un nivel considerado seguro. Es la distinción que pide el estándar.",
  "slides": [
   "v3-23"
  ],
  "op": [
   "Desinfectar elimina los microorganismos; sanitizar reduce su número a un nivel seguro",
   "Sanitizar elimina los microorganismos; desinfectar sólo limpia la superficie",
   "Son sinónimos y el estándar los usa indistintamente",
   "Desinfectar aplica a personas y sanitizar a objetos"
  ],
  "resp": 0,
  "obj": "DES-DIF"
 },
 {
  "id": "DES-DIF-02",
  "fmt": "mc",
  "crit": "E1·C2",
  "stem": "Sobre el alcance de los sanitizantes, ¿qué afirmación es correcta?",
  "expl": "Un sanitizante reduce; no garantiza la eliminación de virus ni de hongos. Por eso no puede sustituir a la desinfección cuando el objeto lo requiere.",
  "slides": [
   "v3-23"
  ],
  "op": [
   "No eliminan virus ni hongos, sólo reducen la carga microbiana",
   "Eliminan bacterias, virus y hongos por igual",
   "Sustituyen a la esterilización en instrumental",
   "Sólo se usan sobre la piel"
  ],
  "resp": 0,
  "obj": "DES-DIF"
 },
 {
  "id": "DES-DIF-03",
  "fmt": "fill",
  "crit": "E1·C2",
  "stem": "Completa: la desinfección se aplica sobre objetos ____ y actúa sobre bacterias, virus y protozoos.",
  "expl": "La definición del estándar habla de microorganismos presentes en objetos <b>inertes</b>: superficies y materiales, no tejidos vivos.",
  "slides": [
   "v3-23"
  ],
  "obj": "DES-DIF",
  "op": [
   "inertes",
   "vivos",
   "porosos",
   "estériles"
  ],
  "resp": 0
 },
 {
  "id": "DES-DIF-04",
  "fmt": "mc",
  "crit": "E1·C2",
  "stem": "Terminas de atender a un usuario y vas a preparar la camilla para el siguiente. ¿Qué corresponde según el estándar?",
  "expl": "La camilla tuvo contacto directo con el usuario: es un objeto inerte que debe quedar libre de microorganismos, y eso es justo lo que hace la <b>desinfección</b> —elimina— y no la sanitización —solo reduce—.",
  "slides": [
   "v3-23"
  ],
  "op": [
   "Desinfectar la superficie de contacto, porque debe quedar libre de microorganismos",
   "Sanitizar es suficiente porque no hubo procedimiento invasivo",
   "Basta con retirar la sábana y cambiarla",
   "Aplicar sanitizante y desinfectante a la vez para reforzar"
  ],
  "resp": 0,
  "obj": "DES-DIF"
 },
 {
  "id": "DES-MEDIOS-01",
  "fmt": "mc",
  "crit": "E1·C2",
  "stem": "¿Qué caracteriza a un desinfectante frente a un sanitizante?",
  "expl": "El desinfectante es un <b>químico germicida</b>. Es el rasgo que el cuestionario usa para distinguirlo de los productos de sanitización.",
  "slides": [
   "v3-23",
   "v3-20"
  ],
  "op": [
   "Es un producto químico con propiedades germicidas",
   "Es siempre un producto de origen natural",
   "Actúa únicamente por medios físicos como el calor",
   "Se aplica sólo por aspersión"
  ],
  "resp": 0,
  "obj": "DES-MEDIOS"
 },
 {
  "id": "DES-MEDIOS-02",
  "fmt": "mc",
  "crit": "E1·C2",
  "stem": "Además de estar limpia y desinfectada o sanitizada, ¿qué otra condición debe cumplir al mismo tiempo una herramienta para «estar lista para usarse»?",
  "expl": "Las cuatro condiciones se verifican juntas: limpia y desinfectada/sanitizada, <b>disponible y en condiciones</b>, y <b>protegida de contaminantes</b> en su estuche o depósito.",
  "slides": [
   "v3-23",
   "v3-20"
  ],
  "op": [
   "Estar disponible y en condiciones para su uso, y protegida de contaminantes ambientales",
   "Haber sido utilizada al menos una vez antes",
   "Contar con el empaque original de fábrica",
   "Estar etiquetada con el nombre del último usuario"
  ],
  "resp": 0,
  "obj": "DES-MEDIOS"
 },
 {
  "id": "DES-MEDIOS-03",
  "fmt": "mc",
  "crit": "E1·C2",
  "stem": "Vas a preparar las herramientas antes de la sesión. El estándar pide que estén:",
  "expl": "Es el reactivo de producto del Elemento 1: limpias y desinfectadas/sanitizadas, disponibles y en condiciones, y <b>contenidas en estuches o depósitos</b> que las protejan.",
  "slides": [
   "v3-23",
   "v3-20"
  ],
  "op": [
   "Limpias y desinfectadas o sanitizadas, y protegidas de contaminantes ambientales",
   "Únicamente limpias y a la vista",
   "Esterilizadas en autoclave sin excepción",
   "Desinfectadas sólo si hubo contacto con sangre"
  ],
  "resp": 0,
  "obj": "DES-MEDIOS"
 },
 {
  "id": "DES-MEDIOS-04",
  "fmt": "col",
  "crit": "E1·C2",
  "stem": "Relaciona cada proceso con lo que le corresponde.",
  "expl": "Cuatro ideas del mismo conocimiento: qué hace cada proceso, con qué producto, y qué condición debe cumplir la herramienta antes de usarse.",
  "slides": [
   "v3-23",
   "v3-20"
  ],
  "pares": [
   [
    "Desinfección",
    "Producto químico germicida sobre objetos inertes"
   ],
   [
    "Sanitización",
    "Reduce la carga microbiana, sin eliminar virus ni hongos"
   ],
   [
    "Herramienta lista para usarse",
    "Limpia y desinfectada/sanitizada, disponible y protegida de contaminantes"
   ],
   [
    "Objetos inertes",
    "Donde actúan bacterias, virus y protozoos, y no en tejido vivo"
   ]
  ],
  "obj": "DES-MEDIOS"
 },
 {
  "id": "NOM-DEF-01",
  "fmt": "mc",
  "crit": "E1·C3",
  "stem": "Según el estándar, un residuo se considera peligroso cuando:",
  "expl": "La definición es literal: un residuo es peligroso si aparece en los listados de la <b>NOM-052-SEMARNAT-2005</b> o si es <b>corrosivo, reactivo, inflamable o tóxico</b>.",
  "slides": [
   "v3-24",
   "v3-25"
  ],
  "op": [
   "Aparece en los listados de la NOM-052-SEMARNAT-2005, o es corrosivo, reactivo, inflamable o tóxico",
   "Proviene de cualquier consultorio de salud, sin excepción",
   "Se generó durante un procedimiento invasivo",
   "Tuvo contacto con guantes desechables"
  ],
  "resp": 0,
  "obj": "NOM-DEF"
 },
 {
  "id": "NOM-DEF-02",
  "fmt": "mc",
  "crit": "E1·C3",
  "stem": "El reactivo 14 exige que el espacio disponga del depósito para RPBI; el reactivo 22 exige poder explicar su clasificación. ¿Con qué instrumento se evalúa cada uno?",
  "expl": "Son dos reactivos de naturaleza distinta: el depósito es un <b>producto</b> —se revisa por Lista de Cotejo—; poder explicar la clasificación es <b>conocimiento</b> —se pregunta por Cuestionario—.",
  "slides": [
   "v3-24",
   "v3-25"
  ],
  "op": [
   "El 14 con Lista de Cotejo (es producto); el 22 con Cuestionario (es conocimiento)",
   "Ambos con Cuestionario, porque los dos son conocimiento",
   "El 14 con Cuestionario; el 22 con Guía de Observación",
   "Ambos con Guía de Observación, porque se revisan en la sesión"
  ],
  "resp": 0,
  "obj": "NOM-DEF"
 },
 {
  "id": "NOM-DEF-03",
  "fmt": "fill",
  "crit": "E1·C3",
  "stem": "Completa: los RPBI nunca se depositan junto con la basura ____ ni con la inorgánica.",
  "expl": "El estándar pide depósitos separados justamente para eso: los RPBI van a su propio contenedor, nunca a la basura común.",
  "slides": [
   "v3-24",
   "v3-25"
  ],
  "obj": "NOM-DEF",
  "op": [
   "orgánica",
   "reciclable",
   "sanitaria",
   "peligrosa"
  ],
  "resp": 0
 },
 {
  "id": "NOM-DEF-04",
  "fmt": "mc",
  "crit": "E1·C3",
  "stem": "En un servicio tradicional y complementario la generación de RPBI es baja. Aun así, ¿qué exige el estándar?",
  "expl": "Son dos reactivos distintos: uno de <b>producto</b> —el espacio dispone del depósito— y uno de <b>conocimiento</b> —poder explicar la clasificación—.",
  "slides": [
   "v3-24",
   "v3-25"
  ],
  "op": [
   "Disponer del depósito para RPBI conforme a la NOM-087 y saber qué va en él",
   "Contratar una empresa recolectora aunque no se generen residuos",
   "Nada, porque no se generan RPBI",
   "Usar el mismo depósito de basura inorgánica debidamente rotulado"
  ],
  "resp": 0,
  "obj": "NOM-DEF"
 },
 {
  "id": "NOM-ENVASE-01",
  "fmt": "mc",
  "crit": "E1·C3",
  "stem": "La sangre en estado líquido se deposita en:",
  "expl": "Líquido implica <b>recipiente hermético</b>; el color rojo corresponde a la sangre y sus derivados.",
  "slides": [
   "v3-24"
  ],
  "op": [
   "Recipiente hermético rojo",
   "Bolsa amarilla",
   "Recipiente rígido rojo",
   "Bolsa roja de polietileno"
  ],
  "resp": 0,
  "obj": "NOM-ENVASE"
 },
 {
  "id": "NOM-ENVASE-02",
  "fmt": "mc",
  "crit": "E1·C3",
  "stem": "Los residuos punzocortantes se depositan en:",
  "expl": "Sólo un envase <b>rígido</b> impide que el punzocortante lo perfore. Es el que más se pregunta porque es el de mayor riesgo de accidente.",
  "slides": [
   "v3-24"
  ],
  "op": [
   "Recipiente rígido rojo",
   "Bolsa roja",
   "Bolsa amarilla",
   "Recipiente hermético amarillo"
  ],
  "resp": 0,
  "obj": "NOM-ENVASE"
 },
 {
  "id": "NOM-ENVASE-03",
  "fmt": "mc",
  "crit": "E1·C3",
  "stem": "¿Qué tipo de residuo corresponde a la bolsa amarilla?",
  "expl": "El amarillo identifica a los residuos <b>patológicos</b>. El resto de las categorías van en rojo, cambiando el tipo de envase.",
  "slides": [
   "v3-24"
  ],
  "op": [
   "Patológicos",
   "Punzocortantes",
   "Cultivos y cepas",
   "No anatómicos"
  ],
  "resp": 0,
  "obj": "NOM-ENVASE"
 },
 {
  "id": "NOM-ENVASE-04",
  "fmt": "col",
  "crit": "E1·C3",
  "stem": "Relaciona cada tipo de RPBI con su envase.",
  "expl": "Dos preguntas resuelven cualquier variante: ¿es líquido o sólido? —eso define el envase— y ¿es patológico? —eso define el color—.",
  "slides": [
   "v3-24"
  ],
  "pares": [
   [
    "Punzocortantes",
    "Recipiente rígido rojo"
   ],
   [
    "Patológicos",
    "Bolsa o recipiente hermético amarillo"
   ],
   [
    "Cultivos y cepas",
    "Bolsa roja de polietileno"
   ],
   [
    "Sangre líquida",
    "Recipiente hermético rojo"
   ]
  ],
  "obj": "NOM-ENVASE"
 },
 {
  "id": "SV-PA-NORMAL-01",
  "fmt": "mc",
  "crit": "E2·C1",
  "stem": "Los valores de referencia de presión arterial normal en un adulto son:",
  "expl": "El valor de referencia del adulto es <b>&lt; 120 / &lt; 80 mmHg</b>. Los otros tres corresponden a umbrales de hipertensión, hipotensión y presión elevada.",
  "slides": [
   "v3-53",
   "v3-61"
  ],
  "op": [
   "Menos de 120 de sistólica y menos de 80 de diastólica",
   "Menos de 140 de sistólica y menos de 90 de diastólica",
   "Menos de 90 de sistólica y menos de 60 de diastólica",
   "Entre 130 y 139 de sistólica"
  ],
  "resp": 0,
  "obj": "SV-PA-NORMAL"
 },
 {
  "id": "SV-PA-NORMAL-02",
  "fmt": "mc",
  "crit": "E2·C1",
  "stem": "En una lectura de 118/76 mmHg, ¿qué representa el número 76?",
  "expl": "El segundo número es la <b>diastólica</b>: la presión que queda entre latidos. La sistólica es la del momento en que el corazón expulsa la sangre.",
  "slides": [
   "v3-53",
   "v3-61"
  ],
  "op": [
   "La presión entre contracciones, con el corazón en reposo",
   "La presión en el momento de la contracción del corazón",
   "La frecuencia del pulso",
   "La saturación de oxígeno"
  ],
  "resp": 0,
  "obj": "SV-PA-NORMAL"
 },
 {
  "id": "SV-PA-NORMAL-03",
  "fmt": "fill",
  "crit": "E2·C1",
  "stem": "Completa: la presión arterial se expresa en ____ , escribiendo la sistólica sobre la diastólica.",
  "expl": "mmHg es la unidad. Confundirla con lpm es el error más común al registrar la ficha.",
  "slides": [
   "v3-53",
   "v3-61"
  ],
  "obj": "SV-PA-NORMAL",
  "op": [
   "milímetros de mercurio (mmHg)",
   "latidos por minuto",
   "grados centígrados",
   "porcentaje"
  ],
  "resp": 0
 },
 {
  "id": "SV-PA-NORMAL-04",
  "fmt": "mc",
  "crit": "E2·C1",
  "stem": "Registras 121/79 mmHg en un adulto. ¿Qué corresponde anotar en la ficha?",
  "expl": "Tu reactivo es <b>registrar el dato obtenido</b>. Clasificar o interpretar excede el alcance del servicio, aunque el cuestionario sí evalúe que conozcas los rangos.",
  "slides": [
   "v3-53",
   "v3-61"
  ],
  "op": [
   "El valor tal como lo entregó el equipo, sin interpretarlo",
   "«Hipertensión leve»",
   "«Presión alta, referir de inmediato»",
   "El promedio de dos tomas para redondear a 120/80"
  ],
  "resp": 0,
  "obj": "SV-PA-NORMAL"
 },
 {
  "id": "SV-PA-NORMAL-05",
  "fmt": "mc",
  "crit": "E2·C1",
  "stem": "Registras una sola lectura de presión arterial durante la sesión. Según el estándar, ese valor:",
  "expl": "El estándar es literal: «un valor aislado no es un diagnóstico». Por eso se registra el dato y, si hace falta interpretarlo, se refiere al médico tratante.",
  "slides": [
   "v3-53",
   "v3-61"
  ],
  "op": [
   "No constituye un diagnóstico por sí solo",
   "Es suficiente para diagnosticar hipertensión",
   "Sustituye cualquier valoración médica futura",
   "Debe repetirse cada minuto durante toda la sesión"
  ],
  "resp": 0,
  "obj": "SV-PA-NORMAL"
 },
 {
  "id": "SV-PA-NORMAL-06",
  "fmt": "mc",
  "crit": "E2·C1",
  "stem": "En una lectura de 118/76 mmHg, ¿qué representa el número 118?",
  "expl": "El primer número es la <b>sistólica</b>: la presión en el momento en que el corazón se contrae y expulsa la sangre. El segundo es la diastólica.",
  "slides": [
   "v3-53",
   "v3-61"
  ],
  "op": [
   "La presión cuando el corazón se contrae y expulsa la sangre",
   "La presión entre contracciones, con el corazón en reposo",
   "La frecuencia del pulso",
   "La saturación de oxígeno"
  ],
  "resp": 0,
  "obj": "SV-PA-NORMAL"
 },
 {
  "id": "SV-PA-CLASIF-01",
  "fmt": "mc",
  "crit": "E2·C1",
  "stem": "Una presión de 125/78 mmHg en un adulto se ubica, según los marcos de clasificación vigentes, como:",
  "expl": "Sistólica entre 120 y 129 con diastólica por debajo de 80 corresponde a presión <b>elevada</b>: ya no es normal y todavía no es hipertensión.",
  "slides": [
   "v3-54"
  ],
  "op": [
   "Elevada",
   "Normal",
   "Hipertensión etapa 1",
   "Hipotensión"
  ],
  "resp": 0,
  "obj": "SV-PA-CLASIF"
 },
 {
  "id": "SV-PA-CLASIF-02",
  "fmt": "mc",
  "crit": "E2·C1",
  "stem": "Según la clasificación ACC/AHA 2025, la hipertensión etapa 2 comienza a partir de:",
  "expl": "Hipertensión etapa 2: <b>≥ 140 o ≥ 90</b>. La etapa 1 va de 130-139 o 80-89; la presión elevada, de 120-129 con diastólica menor a 80.",
  "slides": [
   "v3-54"
  ],
  "op": [
   "≥ 140 o ≥ 90 mmHg",
   "130 – 139 u 80 – 89 mmHg",
   "120 – 129 y < 80 mmHg",
   "< 120 y < 80 mmHg"
  ],
  "resp": 0,
  "obj": "SV-PA-CLASIF"
 },
 {
  "id": "SV-PA-CLASIF-03",
  "fmt": "mc",
  "crit": "E2·C1",
  "stem": "Según la NOM-030-SSA2-2009, una presión de 145/95 mmHg corresponde a:",
  "expl": "La NOM-030 ubica la <b>hipertensión grado 1</b> entre 140-159/90-99. El grado 2 empieza en 160/100.",
  "slides": [
   "v3-54"
  ],
  "op": [
   "Hipertensión grado 1",
   "Hipertensión grado 2",
   "Fronteriza",
   "Normal"
  ],
  "resp": 0,
  "obj": "SV-PA-CLASIF"
 },
 {
  "id": "SV-PA-CLASIF-04",
  "fmt": "fill",
  "crit": "E2·C1",
  "stem": "Completa: en México, además del marco de la American Heart Association, coexiste la clasificación de la norma ____ .",
  "expl": "La NOM-030 clasifica la presión arterial. La NOM-087 es la de residuos peligrosos: no confundirlas, cada una responde a un conocimiento distinto del estándar.",
  "slides": [
   "v3-54"
  ],
  "obj": "SV-PA-CLASIF",
  "op": [
   "NOM-030-SSA2",
   "NOM-087-ECOL",
   "NOM-004-SSA3",
   "NOM-045-SSA2"
  ],
  "resp": 0
 },
 {
  "id": "SV-PA-CLASIF-05",
  "fmt": "mc",
  "crit": "E2·C1",
  "stem": "Un usuario presenta 134/86 mmHg. Según la NOM-030-SSA2-2009, esa lectura se clasifica como:",
  "expl": "134/86 cae dentro de 130-139/85-89: <b>fronteriza</b>. No es normal (120-129/80-84) ni alcanza hipertensión grado 1 (140-159/90-99).",
  "slides": [
   "v3-54"
  ],
  "op": [
   "Fronteriza",
   "Normal",
   "Hipertensión grado 1",
   "Óptima"
  ],
  "resp": 0,
  "obj": "SV-PA-CLASIF"
 },
 {
  "id": "SV-PA-CLASIF-06",
  "fmt": "mc",
  "crit": "E2·C1",
  "stem": "¿Por qué el estándar evalúa que conozcas la clasificación si tú no diagnosticas?",
  "expl": "Es la distinción entre <b>qué se hace</b> y <b>qué se debe saber</b>. Tú registras; el cuestionario evalúa que conozcas los rangos.",
  "slides": [
   "v3-54"
  ],
  "op": [
   "Porque el conocimiento se evalúa por cuestionario, aunque la clasificación no sea parte de tu servicio",
   "Porque debes anotar la categoría junto al valor en la ficha",
   "Porque puedes ajustar el servicio según la categoría",
   "Porque sustituyes al médico cuando él no está"
  ],
  "resp": 0,
  "obj": "SV-PA-CLASIF"
 },
 {
  "id": "SV-HIPO-01",
  "fmt": "mc",
  "crit": "E2·C1",
  "stem": "Los valores que se consideran hipotensión son del orden de:",
  "expl": "<b>90/60 mmHg o menos</b> es la referencia de hipotensión. Las otras tres cifras corresponden a normal, fronteriza e hipertensión.",
  "slides": [
   "n-hipotension"
  ],
  "op": [
   "90/60 mmHg o menos",
   "120/80 mmHg",
   "130/85 mmHg",
   "140/90 mmHg"
  ],
  "resp": 0,
  "obj": "SV-HIPO"
 },
 {
  "id": "SV-HIPO-02",
  "fmt": "mc",
  "crit": "E2·C1",
  "stem": "¿Cuál de estos signos suele acompañar a una presión baja?",
  "expl": "Mareo, visión borrosa, debilidad y piel fría son los signos que suelen acompañarla. Reconocerlos te permite actuar, no diagnosticar.",
  "slides": [
   "n-hipotension"
  ],
  "op": [
   "Mareo y visión borrosa",
   "Rubor facial intenso",
   "Aumento de la temperatura",
   "Dolor punzante en el hombro"
  ],
  "resp": 0,
  "obj": "SV-HIPO"
 },
 {
  "id": "SV-HIPO-03",
  "fmt": "mc",
  "crit": "E2·C1",
  "stem": "Registras 88/58 mmHg en un usuario que refiere mareo. ¿Qué corresponde?",
  "expl": "Registrar siempre. Repetir en reposo y <b>referir</b> es lo que corresponde; indicar tratamiento —incluso dietético— excede tu alcance.",
  "slides": [
   "n-hipotension"
  ],
  "op": [
   "Registrar el dato, repetir la toma en reposo y referirlo con su médico tratante",
   "Suspender cualquier medicamento que esté tomando",
   "Indicarle que consuma sal para subir la presión",
   "Continuar la sesión sin registrar nada porque no es tu competencia"
  ],
  "resp": 0,
  "obj": "SV-HIPO"
 },
 {
  "id": "SV-HIPO-04",
  "fmt": "fill",
  "crit": "E2·C1",
  "stem": "Completa: se considera hipotensión cuando la sistólica es de ____ mmHg o menos.",
  "expl": "90 de sistólica es el umbral de referencia; suele acompañarse de una diastólica de 60 o menos.",
  "slides": [
   "n-hipotension"
  ],
  "obj": "SV-HIPO",
  "op": [
   "90",
   "100",
   "110",
   "120"
  ],
  "resp": 0
 },
 {
  "id": "SV-HIPO-05",
  "fmt": "mc",
  "crit": "E2·C1",
  "stem": "¿Cuál es la diferencia entre una presión normal-baja y una hipotensión?",
  "expl": "Una presión de 105/68 es baja dentro de lo normal. La hipotensión llega al umbral y, sobre todo, suele venir con síntomas.",
  "slides": [
   "n-hipotension"
  ],
  "op": [
   "La hipotensión alcanza el umbral de 90/60 y suele acompañarse de síntomas",
   "No hay diferencia: cualquier valor bajo 120/80 es hipotensión",
   "La hipotensión sólo ocurre en adultos mayores",
   "La presión normal-baja no se registra en la ficha"
  ],
  "resp": 0,
  "obj": "SV-HIPO"
 },
 {
  "id": "SV-HIPO-06",
  "fmt": "mc",
  "crit": "E2·C1",
  "stem": "Un usuario te pregunta si su presión de 92/61 es peligrosa. ¿Qué respondes?",
  "expl": "Conocer el rango sirve para reconocer, no para dictaminar. La respuesta correcta siempre devuelve la interpretación al profesional de la salud.",
  "slides": [
   "n-hipotension"
  ],
  "op": [
   "Que registrarás el valor y que su médico tratante es quien puede interpretarlo",
   "Que está en hipotensión y necesita tratamiento",
   "Que no es nada, que está dentro de lo normal",
   "Que suspenda su medicamento por hoy"
  ],
  "resp": 0,
  "obj": "SV-HIPO"
 },
 {
  "id": "SV-RANGOS-EDAD-01",
  "fmt": "mc",
  "crit": "E2·C1",
  "stem": "La frecuencia respiratoria normal de un adulto en reposo es de:",
  "expl": "<b>12 a 20 rpm</b> en el adulto. Los valores más altos corresponden a niños pequeños y lactantes.",
  "slides": [
   "v3-60"
  ],
  "op": [
   "12 a 20 respiraciones por minuto",
   "8 a 12 respiraciones por minuto",
   "20 a 30 respiraciones por minuto",
   "30 a 40 respiraciones por minuto"
  ],
  "resp": 0,
  "obj": "SV-RANGOS-EDAD"
 },
 {
  "id": "SV-RANGOS-EDAD-02",
  "fmt": "mc",
  "crit": "E2·C1",
  "stem": "El rango normal del pulso en un adulto en reposo es de:",
  "expl": "<b>60 a 100 lpm</b>. El rango de 60 a 80 suena razonable y es el distractor que más se elige: el límite superior del adulto es 100.",
  "slides": [
   "v3-60"
  ],
  "op": [
   "60 a 100 latidos por minuto",
   "40 a 60 latidos por minuto",
   "100 a 120 latidos por minuto",
   "60 a 80 latidos por minuto"
  ],
  "resp": 0,
  "obj": "SV-RANGOS-EDAD"
 },
 {
  "id": "SV-RANGOS-EDAD-03",
  "fmt": "mc",
  "crit": "E2·C1",
  "stem": "¿Qué ocurre con la frecuencia cardiaca conforme aumenta la edad, del lactante al adulto?",
  "expl": "Es la regla que ahorra memorizar la tabla: a menor edad, mayor frecuencia. El lactante puede llegar a 180 lpm y el adulto se estabiliza entre 60 y 100.",
  "slides": [
   "v3-60"
  ],
  "op": [
   "Disminuye progresivamente hasta estabilizarse en 60 a 100 lpm",
   "Aumenta progresivamente",
   "Se mantiene igual toda la vida",
   "Disminuye sólo después de los 60 años"
  ],
  "resp": 0,
  "obj": "SV-RANGOS-EDAD"
 },
 {
  "id": "SV-RANGOS-EDAD-04",
  "fmt": "mc",
  "crit": "E2·C1",
  "stem": "Un preescolar de 4 años presenta 110 lpm en reposo. Esa cifra:",
  "expl": "En preescolares el rango va aproximadamente de 80 a 120 lpm. Aplicar el rango del adulto a un niño es el error clásico de esta pregunta.",
  "slides": [
   "v3-60"
  ],
  "op": [
   "Está dentro del rango esperado para su edad",
   "Es taquicardia y debe referirse de inmediato",
   "Corresponde a un adulto sano",
   "Está por debajo de lo esperado"
  ],
  "resp": 0,
  "obj": "SV-RANGOS-EDAD"
 },
 {
  "id": "SV-RANGOS-EDAD-05",
  "fmt": "fill",
  "crit": "E2·C1",
  "stem": "Completa: el estándar enuncia el conocimiento como rangos y niveles de signos vitales en niños, adultos y personas de la ____ .",
  "expl": "El enunciado oficial es «niños, adultos y personas de la tercera edad»: los tres grupos por los que puede preguntarte el evaluador.",
  "slides": [
   "v3-60"
  ],
  "obj": "SV-RANGOS-EDAD",
  "op": [
   "tercera edad",
   "primera infancia",
   "edad productiva",
   "etapa escolar"
  ],
  "resp": 0
 },
 {
  "id": "SV-RANGOS-EDAD-06",
  "fmt": "mc",
  "crit": "E2·C1",
  "stem": "¿Por qué conviene registrar la edad del usuario junto con sus signos vitales?",
  "expl": "Sin la edad, el valor no se puede leer contra ningún rango. Por eso la ficha de registro pide edad y fecha de nacimiento.",
  "slides": [
   "v3-60"
  ],
  "op": [
   "Porque el rango de referencia cambia según el grupo de edad",
   "Porque el equipo se calibra por edad",
   "Porque la ficha lo pide sólo con fines estadísticos",
   "Porque la edad determina el tipo de técnica que se aplicará"
  ],
  "resp": 0,
  "obj": "SV-RANGOS-EDAD"
 },
 {
  "id": "SV-OTROS-01",
  "fmt": "mc",
  "crit": "E2·C1",
  "stem": "La saturación de oxígeno de referencia en un adulto sano en reposo es de:",
  "expl": "<b>95 a 100 %</b>. Por debajo de 95 se registra el dato y se refiere; no se interpreta.",
  "slides": [
   "v3-61",
   "v3-42"
  ],
  "op": [
   "95 a 100 %",
   "85 a 90 %",
   "90 a 94 %",
   "100 % exacto"
  ],
  "resp": 0,
  "obj": "SV-OTROS"
 },
 {
  "id": "SV-OTROS-02",
  "fmt": "mc",
  "crit": "E2·C1",
  "stem": "El oxímetro de pulso entrega dos valores. ¿Cuáles son?",
  "expl": "Un solo aparato, dos datos, y el estándar pide <b>registrar los dos</b>: SpO₂ en porcentaje y pulso en latidos por minuto.",
  "slides": [
   "v3-61",
   "v3-42"
  ],
  "op": [
   "Saturación de oxígeno y frecuencia del pulso",
   "Presión sistólica y diastólica",
   "Temperatura y frecuencia respiratoria",
   "Saturación de oxígeno y temperatura"
  ],
  "resp": 0,
  "obj": "SV-OTROS"
 },
 {
  "id": "SV-OTROS-03",
  "fmt": "mc",
  "crit": "E2·C1",
  "stem": "El rango de temperatura corporal que maneja esta ruta como referencia es:",
  "expl": "36.5 a 37.5 °C es la referencia educativa que usa el curso. El rango exacto varía según la fuente y el sitio de medición: si el evaluador cita otro, se responde con el rango y se aclara la fuente.",
  "slides": [
   "v3-61",
   "v3-42"
  ],
  "op": [
   "36.5 a 37.5 °C, con un promedio aproximado de 37 °C",
   "34.5 a 35.5 °C",
   "37.8 a 39.0 °C",
   "35.0 a 36.0 °C"
  ],
  "resp": 0,
  "obj": "SV-OTROS"
 },
 {
  "id": "SV-OTROS-04",
  "fmt": "fill",
  "crit": "E2·C1",
  "stem": "Completa: la saturación de oxígeno se registra en ____ y el pulso en latidos por minuto.",
  "expl": "Cada signo tiene su unidad. Anotar SpO₂ sin el símbolo de porcentaje es un error de registro que sí se observa en la ficha.",
  "slides": [
   "v3-61",
   "v3-42"
  ],
  "obj": "SV-OTROS",
  "op": [
   "porcentaje",
   "milímetros de mercurio",
   "grados",
   "respiraciones"
  ],
  "resp": 0
 },
 {
  "id": "SV-OTROS-05",
  "fmt": "mc",
  "crit": "E2·C1",
  "stem": "¿Qué cambia en los rangos de referencia del adulto mayor?",
  "expl": "Es un matiz que conviene decir en voz alta ante el evaluador: en el adulto mayor la temperatura basal tiende a ser menor y las condiciones crónicas amplían rangos.",
  "slides": [
   "v3-61",
   "v3-42"
  ],
  "op": [
   "La temperatura basal tiende a ser más baja y algunos rangos se amplían",
   "Todos los rangos suben proporcionalmente",
   "La frecuencia respiratoria se duplica",
   "No cambia nada respecto del adulto joven"
  ],
  "resp": 0,
  "obj": "SV-OTROS"
 },
 {
  "id": "SV-OTROS-06",
  "fmt": "mc",
  "crit": "E2·C1",
  "stem": "Al citar cualquiera de estos valores frente al evaluador, ¿qué conviene añadir?",
  "expl": "El evaluador pide el rango, no el diagnóstico. Añadir la aclaración demuestra que conoces el límite de tu alcance; añadir interpretación clínica lo excede.",
  "slides": [
   "v3-61",
   "v3-42"
  ],
  "op": [
   "Que son referencias educativas y no sustituyen la valoración de un profesional",
   "El nombre comercial del equipo utilizado",
   "Una interpretación clínica del resultado",
   "El promedio de los últimos tres usuarios atendidos"
  ],
  "resp": 0,
  "obj": "SV-OTROS"
 },
 {
  "id": "GON-TRES-01",
  "fmt": "mc",
  "crit": "E2·C2",
  "stem": "¿Qué mide la goniometría?",
  "expl": "Mide <b>ángulos articulares</b>. Confundirla con la medición de fuerza es confundirla con las pruebas de Daniels: son dos conocimientos distintos.",
  "slides": [
   "v3-65",
   "v3-66"
  ],
  "op": [
   "Los ángulos que forman los huesos en una articulación",
   "La fuerza que genera un músculo",
   "La longitud de los segmentos corporales",
   "La densidad del tejido óseo"
  ],
  "resp": 0,
  "obj": "GON-TRES"
 },
 {
  "id": "GON-TRES-02",
  "fmt": "mc",
  "crit": "E2·C2",
  "stem": "¿Para qué sirve la goniometría?",
  "expl": "Su utilidad es convertir «se mueve mejor» en un <b>número comparable</b> entre sesiones. No diagnostica.",
  "slides": [
   "v3-65",
   "v3-66"
  ],
  "op": [
   "Para documentar de forma objetiva el arco de movilidad y comparar su evolución",
   "Para determinar el diagnóstico de una lesión",
   "Para medir la resistencia cardiovascular",
   "Para evaluar la postura en estático"
  ],
  "resp": 0,
  "obj": "GON-TRES"
 },
 {
  "id": "GON-TRES-03",
  "fmt": "mc",
  "crit": "E2·C2",
  "stem": "Un usuario llega con el hombro rígido después de una inmovilización y quieres\n  dejar registrado cuánto se mueve hoy. ¿En qué situación estás aplicando la\n  goniometría?",
  "expl": "Concepto, utilidad y aplicación son las tres respuestas que pide el estándar, y la aplicación es la <b>movilidad articular</b>.",
  "slides": [
   "v3-65",
   "v3-66"
  ],
  "op": [
   "En la evaluación de la movilidad articular",
   "Durante el análisis de la pisada",
   "En estudios de composición corporal",
   "En el entrenamiento de fuerza"
  ],
  "resp": 0,
  "obj": "GON-TRES"
 },
 {
  "id": "GON-TRES-04",
  "fmt": "mc",
  "crit": "E2·C2",
  "stem": "En el goniómetro, el eje o fulcro se coloca sobre:",
  "expl": "Eje sobre el centro articular, brazo fijo sobre el segmento que no se mueve y brazo móvil acompañando el movimiento. Ese orden es el que se pregunta.",
  "slides": [
   "v3-65",
   "v3-66"
  ],
  "op": [
   "El centro de la articulación que se mide",
   "El extremo distal del segmento móvil",
   "El punto medio del brazo fijo",
   "La inserción del músculo principal"
  ],
  "resp": 0,
  "obj": "GON-TRES"
 },
 {
  "id": "GON-TRES-05",
  "fmt": "fill",
  "crit": "E2·C2",
  "stem": "Completa: en el EC1375 la goniometría se evalúa por ____ , no como desempeño práctico.",
  "expl": "Es un dato de alineación que ahorra angustia: nadie te va a pedir medir un ángulo durante la evaluación. Te lo van a preguntar.",
  "slides": [
   "v3-65",
   "v3-66"
  ],
  "obj": "GON-TRES",
  "op": [
   "cuestionario",
   "guía de observación",
   "lista de cotejo",
   "portafolio"
  ],
  "resp": 0
 },
 {
  "id": "GON-TRES-06",
  "fmt": "col",
  "crit": "E2·C2",
  "stem": "Relaciona cada parte de la respuesta con lo que le corresponde.",
  "expl": "El estándar divide este conocimiento en tres viñetas y el cuestionario las sigue en ese mismo orden.",
  "slides": [
   "v3-65",
   "v3-66"
  ],
  "pares": [
   [
    "Concepto",
    "Medición de los ángulos de una articulación"
   ],
   [
    "Utilidad",
    "Documentar el arco de movilidad y comparar su evolución"
   ],
   [
    "Aplicación",
    "Evaluación de la movilidad articular"
   ],
   [
    "Instrumento",
    "Goniómetro, con eje, brazo fijo y brazo móvil"
   ]
  ],
  "obj": "GON-TRES"
 },
 {
  "id": "BIO-PLANOS-01",
  "fmt": "mc",
  "crit": "E2·C3",
  "stem": "De lo siguiente, ¿qué es exactamente lo que le corresponde estudiar a la\n  biomecánica articular?",
  "expl": "El glosario del estándar la define como el análisis de la mecánica del movimiento del cuerpo humano: <b>cómo y por qué</b> se mueve como se mueve.",
  "slides": [
   "v3-67"
  ],
  "op": [
   "El movimiento de las articulaciones y las fuerzas que actúan sobre ellas",
   "La composición química del hueso",
   "La estructura celular de los tendones",
   "La fisiología de la contracción muscular"
  ],
  "resp": 0,
  "obj": "BIO-PLANOS"
 },
 {
  "id": "BIO-PLANOS-02",
  "fmt": "mc",
  "crit": "E2·C3",
  "stem": "El plano sagital divide el cuerpo en:",
  "expl": "Sagital = mitad <b>derecha</b> y mitad <b>izquierda</b>. Es el plano de la flexión y la extensión.",
  "slides": [
   "v3-67"
  ],
  "op": [
   "Derecha e izquierda",
   "Anterior y posterior",
   "Superior e inferior",
   "Proximal y distal"
  ],
  "resp": 0,
  "obj": "BIO-PLANOS"
 },
 {
  "id": "BIO-PLANOS-03",
  "fmt": "mc",
  "crit": "E2·C3",
  "stem": "El plano frontal o coronal divide el cuerpo en:",
  "expl": "Frontal = parte de <b>adelante</b> y parte de <b>atrás</b>. Es el plano de la abducción y la aducción.",
  "slides": [
   "v3-67"
  ],
  "op": [
   "Anterior y posterior",
   "Derecha e izquierda",
   "Superior e inferior",
   "Medial y lateral"
  ],
  "resp": 0,
  "obj": "BIO-PLANOS"
 },
 {
  "id": "BIO-PLANOS-04",
  "fmt": "mc",
  "crit": "E2·C3",
  "stem": "El plano transversal divide el cuerpo en:",
  "expl": "Transversal = mitad de <b>arriba</b> y mitad de <b>abajo</b>. Es el plano de las rotaciones.",
  "slides": [
   "v3-67"
  ],
  "op": [
   "Superior e inferior",
   "Derecha e izquierda",
   "Anterior y posterior",
   "Interno y externo"
  ],
  "resp": 0,
  "obj": "BIO-PLANOS"
 },
 {
  "id": "BIO-PLANOS-05",
  "fmt": "fill",
  "crit": "E2·C3",
  "stem": "Completa: el plano que separa la mitad derecha de la izquierda es el plano ____ .",
  "expl": "Una regla que evita confundirlos: sagital corta como una flecha de adelante hacia atrás, y por eso separa derecha de izquierda.",
  "slides": [
   "v3-67"
  ],
  "obj": "BIO-PLANOS",
  "op": [
   "sagital",
   "frontal",
   "transversal",
   "oblicuo"
  ],
  "resp": 0
 },
 {
  "id": "BIO-PLANOS-06",
  "fmt": "col",
  "crit": "E2·C3",
  "stem": "Relaciona cada plano con la división que produce.",
  "expl": "Tres planos, tres divisiones. Si los recuerdas junto con su eje y su movimiento, resuelves de una vez las tres preguntas que se hacen sobre este tema.",
  "slides": [
   "v3-67"
  ],
  "pares": [
   [
    "Sagital",
    "Derecha e izquierda"
   ],
   [
    "Frontal",
    "Anterior y posterior"
   ],
   [
    "Transversal",
    "Superior e inferior"
   ]
  ],
  "obj": "BIO-PLANOS"
 },
 {
  "id": "BIO-EJEMOV-01",
  "fmt": "mc",
  "crit": "E2·C3",
  "stem": "Movimiento en el plano sagital que lleva un segmento hacia delante de la posición anatómica:",
  "expl": "<b>Flexión</b> es hacia delante; extensión es el regreso o el movimiento hacia atrás. Los dos ocurren en el plano sagital.",
  "slides": [
   "v3-68"
  ],
  "op": [
   "Flexión",
   "Extensión",
   "Abducción",
   "Rotación interna"
  ],
  "resp": 0,
  "obj": "BIO-EJEMOV"
 },
 {
  "id": "BIO-EJEMOV-02",
  "fmt": "mc",
  "crit": "E2·C3",
  "stem": "Movimiento en el plano frontal que aleja un segmento de la línea media:",
  "expl": "<b>Ab</b>ducción <b>a</b>leja; <b>ad</b>ucción <b>a</b>cerca. Las dos ocurren en el plano frontal.",
  "slides": [
   "v3-68"
  ],
  "op": [
   "Abducción",
   "Aducción",
   "Flexión",
   "Extensión"
  ],
  "resp": 0,
  "obj": "BIO-EJEMOV"
 },
 {
  "id": "BIO-EJEMOV-03",
  "fmt": "mc",
  "crit": "E2·C3",
  "stem": "Separar el brazo del costado hasta la horizontal es un movimiento de:",
  "expl": "El brazo se aleja de la línea media: abducción. Y ocurre en el plano frontal, sobre el eje anteroposterior.",
  "slides": [
   "v3-68"
  ],
  "op": [
   "Abducción, en el plano frontal",
   "Flexión, en el plano sagital",
   "Rotación externa, en el plano transversal",
   "Aducción, en el plano frontal"
  ],
  "resp": 0,
  "obj": "BIO-EJEMOV"
 },
 {
  "id": "BIO-EJEMOV-04",
  "fmt": "mc",
  "crit": "E2·C3",
  "stem": "¿Qué eje corresponde al plano sagital?",
  "expl": "Cada plano tiene su eje <b>perpendicular</b>: sagital → eje transversal; frontal → eje anteroposterior; transversal → eje longitudinal.",
  "slides": [
   "v3-68"
  ],
  "op": [
   "El eje transversal",
   "El eje longitudinal",
   "El eje anteroposterior",
   "El eje vertical"
  ],
  "resp": 0,
  "obj": "BIO-EJEMOV"
 },
 {
  "id": "BIO-EJEMOV-05",
  "fmt": "mc",
  "crit": "E2·C3",
  "stem": "Los movimientos de rotación interna y externa ocurren:",
  "expl": "Girar la cabeza o el tronco sobre su propio eje: plano transversal, eje longitudinal. Es el trío que menos se recuerda.",
  "slides": [
   "v3-68"
  ],
  "op": [
   "En el plano transversal, sobre el eje longitudinal",
   "En el plano sagital, sobre el eje transversal",
   "En el plano frontal, sobre el eje anteroposterior",
   "En cualquier plano, según la articulación"
  ],
  "resp": 0,
  "obj": "BIO-EJEMOV"
 },
 {
  "id": "BIO-EJEMOV-06",
  "fmt": "col",
  "crit": "E2·C3",
  "stem": "Relaciona cada plano con su eje y su movimiento característico.",
  "expl": "Aprenderlos en tríos —plano, eje, movimiento— es la forma más rápida de responder cualquiera de las variantes de este tema.",
  "slides": [
   "v3-68"
  ],
  "pares": [
   [
    "Plano sagital",
    "Eje transversal · flexión y extensión"
   ],
   [
    "Plano frontal",
    "Eje anteroposterior · abducción y aducción"
   ],
   [
    "Plano transversal",
    "Eje longitudinal · rotaciones"
   ]
  ],
  "obj": "BIO-EJEMOV"
 },
 {
  "id": "BIO-REGIONES-01",
  "fmt": "mc",
  "crit": "E2·C3",
  "stem": "«Anatomía topográfica» significa describir el cuerpo:",
  "expl": "Topográfica = <b>por regiones</b>. Es el nivel que necesitas para nombrar dónde observaste algo y qué zona vas a tocar.",
  "slides": [
   "v3-69"
  ],
  "op": [
   "Por regiones",
   "Por sistemas",
   "Por tejidos",
   "Por funciones"
  ],
  "resp": 0,
  "obj": "BIO-REGIONES"
 },
 {
  "id": "BIO-REGIONES-02",
  "fmt": "mc",
  "crit": "E2·C3",
  "stem": "¿Para qué necesitas la anatomía topográfica en la evaluación?",
  "expl": "Tiene un uso concreto y dos reactivos detrás: la observación postural y los puntos del cuerpo que se declaran en el consentimiento.",
  "slides": [
   "v3-69"
  ],
  "op": [
   "Para nombrar las zonas en la observación postural y especificarlas en el consentimiento informado",
   "Para determinar el origen del dolor del usuario",
   "Para elegir el medicamento adecuado",
   "Para calcular el índice de masa corporal"
  ],
  "resp": 0,
  "obj": "BIO-REGIONES"
 },
 {
  "id": "BIO-REGIONES-03",
  "fmt": "mc",
  "crit": "E2·C3",
  "stem": "La región cervical forma parte de:",
  "expl": "Cráneo, cara y región cervical integran la región de cabeza y cuello. El tórax, el abdomen y la región dorsolumbar forman el tronco.",
  "slides": [
   "v3-69"
  ],
  "op": [
   "Cabeza y cuello",
   "Tronco",
   "Pelvis",
   "Extremidad superior"
  ],
  "resp": 0,
  "obj": "BIO-REGIONES"
 },
 {
  "id": "BIO-REGIONES-04",
  "fmt": "fill",
  "crit": "E2·C3",
  "stem": "Completa: la región dorsolumbar pertenece al ____ .",
  "expl": "Tronco incluye tórax, abdomen y región dorsolumbar: es donde ocurre buena parte de la observación postural.",
  "slides": [
   "v3-69"
  ],
  "obj": "BIO-REGIONES",
  "op": [
   "tronco",
   "cuello",
   "pelvis",
   "miembro inferior"
  ],
  "resp": 0
 },
 {
  "id": "BIO-CUAD-01",
  "fmt": "mc",
  "crit": "E2·C3",
  "stem": "¿En qué cuadrante abdominal se localizan el lóbulo derecho del hígado y la vesícula biliar?",
  "expl": "Hígado y vesícula: <b>cuadrante superior derecho</b>. Es el ancla que ayuda a ubicar los otros tres.",
  "slides": [
   "n-cuadrantes"
  ],
  "op": [
   "Superior derecho",
   "Superior izquierdo",
   "Inferior derecho",
   "Inferior izquierdo"
  ],
  "resp": 0,
  "obj": "BIO-CUAD"
 },
 {
  "id": "BIO-CUAD-02",
  "fmt": "mc",
  "crit": "E2·C3",
  "stem": "Observas al usuario y quieres nombrar la zona donde está el bazo. ¿Qué cuadrante\n  anotas?",
  "expl": "El bazo está a la <b>izquierda</b>, arriba, junto al estómago. Confundirlo con el lado del hígado es el error más frecuente.",
  "slides": [
   "n-cuadrantes"
  ],
  "op": [
   "Superior izquierdo",
   "Superior derecho",
   "Inferior izquierdo",
   "Inferior derecho"
  ],
  "resp": 0,
  "obj": "BIO-CUAD"
 },
 {
  "id": "BIO-CUAD-03",
  "fmt": "mc",
  "crit": "E2·C3",
  "stem": "El apéndice y el ciego comparten cuadrante. ¿Cuál es?",
  "expl": "Apéndice y ciego: <b>cuadrante inferior derecho</b>.",
  "slides": [
   "n-cuadrantes"
  ],
  "op": [
   "Inferior derecho",
   "Inferior izquierdo",
   "Superior derecho",
   "Superior izquierdo"
  ],
  "resp": 0,
  "obj": "BIO-CUAD"
 },
 {
  "id": "BIO-CUAD-04",
  "fmt": "mc",
  "crit": "E2·C3",
  "stem": "¿Cuántas regiones abdominales resultan de la división en nueve, y cómo se llama la central superior?",
  "expl": "Fila superior: hipocondrio derecho · <b>epigastrio</b> · hipocondrio izquierdo. El hipogastrio es la central de abajo.",
  "slides": [
   "n-cuadrantes"
  ],
  "op": [
   "Nueve regiones; la central superior es el epigastrio",
   "Nueve regiones; la central superior es el hipogastrio",
   "Cuatro regiones; la central superior es el mesogastrio",
   "Nueve regiones; la central superior es el flanco"
  ],
  "resp": 0,
  "obj": "BIO-CUAD"
 },
 {
  "id": "BIO-CUAD-05",
  "fmt": "fill",
  "crit": "E2·C3",
  "stem": "Completa: la región central de la fila inferior de las nueve regiones abdominales se llama ____ .",
  "expl": "De arriba abajo por el centro: epigastrio, región umbilical o mesogastrio, e <b>hipogastrio</b>.",
  "slides": [
   "n-cuadrantes"
  ],
  "obj": "BIO-CUAD",
  "op": [
   "hipogastrio",
   "epigastrio",
   "mesogastrio",
   "hipocondrio"
  ],
  "resp": 0
 },
 {
  "id": "BIO-CUAD-06",
  "fmt": "col",
  "crit": "E2·C3",
  "stem": "Relaciona cada estructura con su cuadrante abdominal.",
  "expl": "Dos líneas cruzadas en el ombligo dan los cuatro cuadrantes. Cuatro líneas dan las nueve regiones: el cuestionario usa las dos divisiones.",
  "slides": [
   "n-cuadrantes"
  ],
  "pares": [
   [
    "Hígado y vesícula biliar",
    "Cuadrante superior derecho"
   ],
   [
    "Estómago y bazo",
    "Cuadrante superior izquierdo"
   ],
   [
    "Ciego y apéndice",
    "Cuadrante inferior derecho"
   ],
   [
    "Colon sigmoides",
    "Cuadrante inferior izquierdo"
   ]
  ],
  "obj": "BIO-CUAD"
 },
 {
  "id": "HIG-POSICIONES-01",
  "fmt": "mc",
  "crit": "E2·C4",
  "stem": "La posición sedente adecuada implica:",
  "expl": "Espalda apoyada, pies planos y pantallas a la altura de los ojos. Sentarse en el borde y cruzar las piernas son justamente lo que hay que evitar.",
  "slides": [
   "v3-71"
  ],
  "op": [
   "Espalda apoyada en el respaldo y pies planos en el piso",
   "Sentarse en el borde del asiento con las piernas cruzadas",
   "Inclinar el tronco hacia el frente para acercarse a la mesa",
   "Mantener las rodillas por encima de la cadera"
  ],
  "resp": 0,
  "obj": "HIG-POSICIONES"
 },
 {
  "id": "HIG-POSICIONES-02",
  "fmt": "mc",
  "crit": "E2·C4",
  "stem": "En decúbito supino, la posición recomendada incluye:",
  "expl": "La almohada no debe sobrepasar los hombros, y el apoyo bajo las rodillas descarga la zona lumbar.",
  "slides": [
   "v3-71"
  ],
  "op": [
   "Almohada a la altura de los hombros sin sobrepasarlos y una pequeña bajo las rodillas",
   "Almohada alta bajo la cabeza y piernas completamente extendidas",
   "Dormir sin almohada y boca abajo",
   "Almohada bajo la cadera"
  ],
  "resp": 0,
  "obj": "HIG-POSICIONES"
 },
 {
  "id": "HIG-POSICIONES-03",
  "fmt": "mc",
  "crit": "E2·C4",
  "stem": "Ante una bipedestación prolongada, lo adecuado es:",
  "expl": "Alternar el apoyo evita la carga sostenida en la misma estructura. Bloquear las rodillas es el error que más se repite.",
  "slides": [
   "v3-71"
  ],
  "op": [
   "Repartir el peso y alternar un pie ligeramente elevado en un apoyo",
   "Bloquear las rodillas para no cansarse",
   "Mantener siempre el mismo apoyo durante horas",
   "Cruzar un pie delante del otro"
  ],
  "resp": 0,
  "obj": "HIG-POSICIONES"
 },
 {
  "id": "HIG-POSICIONES-04",
  "fmt": "fill",
  "crit": "E2·C4",
  "stem": "Completa: al estar sentado, la pantalla debe quedar a la altura de los ____ .",
  "expl": "A la altura de los ojos, para no flexionar el cuello de forma sostenida.",
  "slides": [
   "v3-71"
  ],
  "obj": "HIG-POSICIONES",
  "op": [
   "ojos",
   "hombros",
   "codos",
   "brazos"
  ],
  "resp": 0
 },
 {
  "id": "HIG-CARGA-01",
  "fmt": "mc",
  "crit": "E2·C4",
  "stem": "Al levantar un objeto del piso, lo correcto es:",
  "expl": "Rodillas y cadera flexionadas, espalda recta y carga pegada. Es la respuesta que el cuestionario espera y también lo que se observa en el Elemento 3.",
  "slides": [
   "v3-70",
   "v3-72"
  ],
  "op": [
   "Flexionar rodillas y cadera con la espalda recta y la carga pegada al cuerpo",
   "Flexionar la columna manteniendo las piernas rectas",
   "Levantar con un solo movimiento rápido para reducir el esfuerzo",
   "Sostener la carga alejada del cuerpo para ver mejor"
  ],
  "resp": 0,
  "obj": "HIG-CARGA"
 },
 {
  "id": "HIG-CARGA-02",
  "fmt": "mc",
  "crit": "E2·C4",
  "stem": "Al girar mientras se sostiene una carga:",
  "expl": "Rotar el tronco con carga es el gesto que más lesiona. Se gira con los <b>pies</b>.",
  "slides": [
   "v3-70",
   "v3-72"
  ],
  "op": [
   "Se mueven los pies para girar todo el cuerpo",
   "Se rota el tronco manteniendo los pies fijos",
   "Se gira la cabeza primero y luego el tronco",
   "Se apoya la carga en la cadera y se rota"
  ],
  "resp": 0,
  "obj": "HIG-CARGA"
 },
 {
  "id": "HIG-CARGA-03",
  "fmt": "mc",
  "crit": "E2·C4",
  "stem": "¿Qué debe pasar con la carga mientras se transporta, según el estándar de higiene de columna?",
  "expl": "Es uno de los puntos que se identifican en la demostración: «carga <b>pegada al cuerpo</b> durante todo el trayecto». Alejarla o rotar con ella son justo los errores que el estándar marca como incorrectos.",
  "slides": [
   "v3-70",
   "v3-72"
  ],
  "op": [
   "Debe mantenerse pegada al cuerpo durante todo el trayecto",
   "Debe sostenerse con los brazos extendidos",
   "Debe alternarse de un brazo a otro cada pocos pasos",
   "Debe apoyarse en la cadera y rotar con ella"
  ],
  "resp": 0,
  "obj": "HIG-CARGA"
 },
 {
  "id": "HIG-CARGA-04",
  "fmt": "fill",
  "crit": "E2·C4",
  "stem": "Completa: al levantar una carga se flexionan rodillas y cadera, y la espalda se mantiene ____ .",
  "expl": "Rodillas y cadera hacen el trabajo; la columna se mantiene <b>recta</b>. Es la única de las cuatro que protege el disco intervertebral.",
  "slides": [
   "v3-70",
   "v3-72"
  ],
  "obj": "HIG-CARGA",
  "op": [
   "recta",
   "curva",
   "rotada",
   "inclinada al frente"
  ],
  "resp": 0
 },
 {
  "id": "HIG-CARGA-05",
  "fmt": "mc",
  "crit": "E2·C4",
  "stem": "En el Elemento 3, ¿dónde reaparece este conocimiento?",
  "expl": "Se pregunta como conocimiento y se usa como desempeño: la secuencia para incorporarse es parte de lo que explicas al usuario.",
  "slides": [
   "v3-70",
   "v3-72"
  ],
  "op": [
   "Al explicarle al usuario cómo incorporarse de la mesa de trabajo",
   "Al tomar los signos vitales",
   "Al llenar la ficha de registro",
   "Al aplicar la encuesta de satisfacción"
  ],
  "resp": 0,
  "obj": "HIG-CARGA"
 },
 {
  "id": "DAN-ESCALA-01",
  "fmt": "mc",
  "crit": "E2·C5",
  "stem": "¿Qué evalúan las pruebas funcionales musculares de Daniels?",
  "expl": "Fuerza muscular por valoración <b>manual</b>. Medir ángulos es goniometría: los dos conocimientos se confunden constantemente.",
  "slides": [
   "v3-73"
  ],
  "op": [
   "La fuerza muscular, de forma manual",
   "El rango de movimiento articular",
   "La resistencia cardiovascular",
   "La alineación postural"
  ],
  "resp": 0,
  "obj": "DAN-ESCALA"
 },
 {
  "id": "DAN-ESCALA-02",
  "fmt": "mc",
  "crit": "E2·C5",
  "stem": "¿Cuántos grados tiene la escala de Daniels y de qué a qué va?",
  "expl": "De <b>0 a 5</b>, es decir seis grados. Contestar «cinco» es el error más común, porque se olvida el 0.",
  "slides": [
   "v3-73"
  ],
  "op": [
   "Seis grados, de 0 a 5",
   "Cinco grados, de 1 a 5",
   "Cuatro grados, de 0 a 3",
   "Diez grados, de 0 a 10"
  ],
  "resp": 0,
  "obj": "DAN-ESCALA"
 },
 {
  "id": "DAN-ESCALA-03",
  "fmt": "mc",
  "crit": "E2·C5",
  "stem": "Un músculo no genera ninguna contracción perceptible. Le corresponde el grado:",
  "expl": "Grado <b>0</b>: nulo, ninguna contracción perceptible. El grado 1 ya tiene contracción visible o palpable, aunque no haya movimiento.",
  "slides": [
   "v3-73"
  ],
  "op": [
   "0",
   "1",
   "2",
   "3"
  ],
  "resp": 0,
  "obj": "DAN-ESCALA"
 },
 {
  "id": "DAN-ESCALA-04",
  "fmt": "mc",
  "crit": "E2·C5",
  "stem": "Hay contracción visible pero el segmento no se mueve. El grado es:",
  "expl": "Grado <b>1</b>, vestigios: se ve o se palpa la contracción y no hay desplazamiento.",
  "slides": [
   "v3-73"
  ],
  "op": [
   "1",
   "0",
   "2",
   "3"
  ],
  "resp": 0,
  "obj": "DAN-ESCALA"
 },
 {
  "id": "DAN-ESCALA-05",
  "fmt": "mc",
  "crit": "E2·C5",
  "stem": "El usuario completa el arco contra la gravedad, pero no tolera resistencia. El grado es:",
  "expl": "Grado <b>3</b>, regular: arco completo contra gravedad, sin resistencia. Con resistencia moderada sería 4; con resistencia máxima, 5.",
  "slides": [
   "v3-73"
  ],
  "op": [
   "3",
   "2",
   "4",
   "5"
  ],
  "resp": 0,
  "obj": "DAN-ESCALA"
 },
 {
  "id": "DAN-ESCALA-06",
  "fmt": "col",
  "crit": "E2·C5",
  "stem": "Relaciona cada grado de la escala con lo que demuestra el usuario.",
  "expl": "La escala sube en dos ejes: primero vencer la gravedad, después tolerar resistencia. Quien entiende eso no necesita memorizar los seis grados.",
  "slides": [
   "v3-73"
  ],
  "pares": [
   [
    "Grado 5",
    "Arco completo contra gravedad y resistencia máxima"
   ],
   [
    "Grado 4",
    "Arco completo contra gravedad y resistencia moderada"
   ],
   [
    "Grado 3",
    "Arco completo contra gravedad, sin resistencia"
   ],
   [
    "Grado 2",
    "Arco completo con la gravedad eliminada"
   ]
  ],
  "obj": "DAN-ESCALA"
 },
 {
  "id": "DAN-POSDES-01",
  "fmt": "mc",
  "crit": "E2·C5",
  "stem": "En los grados 1 y 2, ¿cómo se coloca al usuario?",
  "expl": "La posición depende de si el músculo debe vencer la gravedad o no: grados 1 y 2, <b>gravedad eliminada</b>; grados 3, 4 y 5, contra gravedad.",
  "slides": [
   "v3-74",
   "v3-75"
  ],
  "op": [
   "Con el segmento apoyado en un plano horizontal, con la gravedad eliminada",
   "De pie, para que el movimiento venza el peso del segmento",
   "En la posición que el usuario prefiera",
   "Siempre en decúbito prono"
  ],
  "resp": 0,
  "obj": "DAN-POSDES"
 },
 {
  "id": "DAN-POSDES-02",
  "fmt": "mc",
  "crit": "E2·C5",
  "stem": "¿Cuál es el primer paso del desarrollo de la prueba?",
  "expl": "Primero se explica y se demuestra; luego se coloca, se estabiliza el segmento <b>proximal</b>, se pide el arco completo y al final se aplica resistencia.",
  "slides": [
   "v3-74",
   "v3-75"
  ],
  "op": [
   "Explicar y demostrar el movimiento que se va a pedir",
   "Aplicar resistencia manual",
   "Registrar el grado obtenido",
   "Estabilizar el segmento distal"
  ],
  "resp": 0,
  "obj": "DAN-POSDES"
 },
 {
  "id": "DAN-POSDES-03",
  "fmt": "mc",
  "crit": "E2·C5",
  "stem": "En el desarrollo de la prueba de Daniels, ¿en qué paso se estabiliza el segmento proximal?",
  "expl": "La secuencia es: 1· explicar y demostrar, 2· colocar al usuario, 3· <b>estabilizar el segmento proximal</b>, 4· pedir el arco completo, 5· aplicar resistencia si corresponde, 6· asignar el grado.",
  "slides": [
   "v3-74",
   "v3-75"
  ],
  "op": [
   "En el tercer paso, después de colocar al usuario en la posición correspondiente",
   "Es el primer paso, antes de explicar el movimiento",
   "Se hace al final, después de registrar el grado",
   "No forma parte del desarrollo de la prueba"
  ],
  "resp": 0,
  "obj": "DAN-POSDES"
 },
 {
  "id": "DAN-POSDES-04",
  "fmt": "fill",
  "crit": "E2·C5",
  "stem": "Completa: en el EC1375 las pruebas de Daniels se evalúan por ____ .",
  "expl": "Igual que la goniometría: se pregunta, no se ejecuta durante la evaluación.",
  "slides": [
   "v3-74",
   "v3-75"
  ],
  "obj": "DAN-POSDES",
  "op": [
   "cuestionario",
   "guía de observación",
   "lista de cotejo",
   "demostración práctica"
  ],
  "resp": 0
 }
];

export const CRITERIOS_PRACTICA = [...new Set(PRACTICA.map(r => r.crit))];
