/* POSTURALIA · data-objetivos.js — Los 20 temas (objetivos) de la Práctica.

   Mismos 20 objetivos que Paideia V4.5 (EC1375_DATA.objetivos): cada uno es
   un conocimiento del estándar que se evalúa en el cuestionario. La Práctica
   pide acertar UNA pregunta por tema; si fallas, repasas sus pantallas y
   contestas una pregunta de verificación distinta. Las preguntas de cada
   tema salen de data-practica.js (campo `obj`, de 4 a 6 variantes).      */

export const OBJETIVOS = [
 {
  "id": "TEC-DEF",
  "crit": "E1·C1",
  "elemento": 1,
  "rx": 20,
  "nombre": "Alcance de las técnicas tradicionales y complementarias",
  "descripcion": "Qué son las técnicas de atención tradicional y complementaria, y hasta dónde llegan",
  "pantallas": [
   "v3-8"
  ],
  "fuente": "EC1375 · Elemento 1 · Conocimiento 1 — Técnicas de atención tradicional y complementaria",
  "referencia": "135.1/1-C1E1",
  "peso": 0.29,
  "nivel": "Comprensión"
 },
 {
  "id": "TEC-IDENT",
  "crit": "E1·C1",
  "elemento": 1,
  "rx": 20,
  "nombre": "Identificar cada técnica por su descripción",
  "descripcion": "Identificar cada técnica por su descripción: auriculoterapia, masoterapia, temazcal, fitoterapia, reflexología, acupuntura, quiropraxia, osteopatía",
  "pantallas": [
   "n-tecnicas"
  ],
  "fuente": "EC1375 · Elemento 1 · Conocimiento 1 — Técnicas de atención tradicional y complementaria",
  "referencia": "135.1/1-C1E1",
  "peso": 0.29,
  "nivel": "Comprensión"
 },
 {
  "id": "DES-DIF",
  "crit": "E1·C2",
  "elemento": 1,
  "rx": 21,
  "nombre": "Desinfección frente a sanitización",
  "descripcion": "Qué hace cada proceso y en qué se diferencian: desinfección elimina, sanitización reduce a nivel seguro",
  "pantallas": [
   "v3-23"
  ],
  "fuente": "EC1375 · Elemento 1 · Conocimiento 2 — Desinfección vs Sanitización · Definición, Características",
  "referencia": "136.1/1-C2E1",
  "peso": 0.29,
  "nivel": "Aplicación"
 },
 {
  "id": "DES-MEDIOS",
  "crit": "E1·C2",
  "elemento": 1,
  "rx": 21,
  "nombre": "Medios y recursos de cada proceso",
  "descripcion": "Con qué se hace cada uno y dónde se aplica: agentes, productos y superficies",
  "pantallas": [
   "v3-23",
   "v3-20"
  ],
  "fuente": "EC1375 · Elemento 1 · Conocimiento 2 — Desinfección vs Sanitización · Medios, Recursos",
  "referencia": "136.1/1-C2E1",
  "peso": 0.29,
  "nivel": "Aplicación"
 },
 {
  "id": "NOM-DEF",
  "crit": "E1·C3",
  "elemento": 1,
  "rx": 22,
  "nombre": "Qué es un residuo biológico-infeccioso",
  "descripcion": "Qué es un residuo peligroso biológico-infeccioso y qué son los agentes biológico-infecciosos según la norma",
  "pantallas": [
   "v3-24",
   "v3-25"
  ],
  "fuente": "EC1375 · Elemento 1 · Conocimiento 3 — Manejo de residuos peligrosos NOM-087-ECOL-SSA1-2002",
  "referencia": "137.1/1-C3E1",
  "peso": 0.29,
  "nivel": "Conocimiento"
 },
 {
  "id": "NOM-ENVASE",
  "crit": "E1·C3",
  "elemento": 1,
  "rx": 22,
  "nombre": "Envase y color por tipo de RPBI",
  "descripcion": "Los cinco tipos de RPBI, su estado físico y el envase y color que les corresponde",
  "pantallas": [
   "v3-24"
  ],
  "fuente": "EC1375 · Elemento 1 · Conocimiento 3 — Manejo de residuos peligrosos NOM-087-ECOL-SSA1-2002",
  "referencia": "137.1/1-C3E1",
  "peso": 0.29,
  "nivel": "Conocimiento"
 },
 {
  "id": "SV-PA-NORMAL",
  "crit": "E2·C1",
  "elemento": 2,
  "rx": 77,
  "nombre": "Presión arterial normal del adulto",
  "descripcion": "Los valores normales de presión arterial en el adulto y qué significa cada número",
  "pantallas": [
   "v3-53",
   "v3-61"
  ],
  "fuente": "EC1375 · Elemento 2 · Conocimiento 1 — Rangos y niveles de signos vitales en niños, adultos y personas de la tercera edad",
  "referencia": "138.1/1-C1E2",
  "peso": 0.59,
  "nivel": "Aplicación"
 },
 {
  "id": "SV-PA-CLASIF",
  "crit": "E2·C1",
  "elemento": 2,
  "rx": 77,
  "nombre": "Clasificación de la presión arterial",
  "descripcion": "Cómo se clasifica una presión por encima de lo normal, según los dos marcos vigentes (ACC/AHA 2025 y NOM-030-SSA2-2009)",
  "pantallas": [
   "v3-54"
  ],
  "fuente": "EC1375 · Elemento 2 · Conocimiento 1 — Rangos y niveles de signos vitales en niños, adultos y personas de la tercera edad",
  "referencia": "138.1/1-C1E2",
  "peso": 0.59,
  "nivel": "Aplicación"
 },
 {
  "id": "SV-HIPO",
  "crit": "E2·C1",
  "elemento": 2,
  "rx": 77,
  "nombre": "Hipotensión",
  "descripcion": "Qué se considera hipotensión y cómo se distingue de una presión normal baja",
  "pantallas": [
   "n-hipotension"
  ],
  "fuente": "EC1375 · Elemento 2 · Conocimiento 1 — Rangos y niveles de signos vitales en niños, adultos y personas de la tercera edad",
  "referencia": "138.1/1-C1E2",
  "peso": 0.59,
  "nivel": "Aplicación"
 },
 {
  "id": "SV-RANGOS-EDAD",
  "crit": "E2·C1",
  "elemento": 2,
  "rx": 77,
  "nombre": "Rangos por grupo de edad",
  "descripcion": "Frecuencia cardiaca y respiratoria por grupo de edad, del lactante al adulto mayor",
  "pantallas": [
   "v3-60"
  ],
  "fuente": "EC1375 · Elemento 2 · Conocimiento 1 — Rangos y niveles de signos vitales en niños, adultos y personas de la tercera edad",
  "referencia": "138.1/1-C1E2",
  "peso": 0.59,
  "nivel": "Aplicación"
 },
 {
  "id": "SV-OTROS",
  "crit": "E2·C1",
  "elemento": 2,
  "rx": 77,
  "nombre": "Saturación, temperatura y pulso",
  "descripcion": "Saturación de oxígeno, temperatura corporal y pulso: rangos de referencia",
  "pantallas": [
   "v3-61",
   "v3-42"
  ],
  "fuente": "EC1375 · Elemento 2 · Conocimiento 1 — Rangos y niveles de signos vitales en niños, adultos y personas de la tercera edad",
  "referencia": "138.1/1-C1E2",
  "peso": 0.59,
  "nivel": "Aplicación"
 },
 {
  "id": "GON-TRES",
  "crit": "E2·C2",
  "elemento": 2,
  "rx": 78,
  "nombre": "Goniometría: concepto, utilidad y aplicación",
  "descripcion": "Goniometría: qué es, para qué sirve y cuándo se aplica",
  "pantallas": [
   "v3-65",
   "v3-66"
  ],
  "fuente": "EC1375 · Elemento 2 · Conocimiento 2 — Goniometría · Concepto, Utilidad, Aplicación",
  "referencia": "139.1/1-C2E2",
  "peso": 0.29,
  "nivel": "Aplicación"
 },
 {
  "id": "BIO-PLANOS",
  "crit": "E2·C3",
  "elemento": 2,
  "rx": 79,
  "nombre": "Definición y planos anatómicos",
  "descripcion": "Qué estudia la biomecánica articular y cómo divide el cuerpo cada plano: sagital, frontal y transversal",
  "pantallas": [
   "v3-67"
  ],
  "fuente": "EC1375 · Elemento 2 · Conocimiento 3 — Biomecánica · Definición, Planos anatómicos",
  "referencia": "140.1/1-C3E2",
  "peso": 0.59,
  "nivel": "Conocimiento"
 },
 {
  "id": "BIO-EJEMOV",
  "crit": "E2·C3",
  "elemento": 2,
  "rx": 79,
  "nombre": "Ejes y movimientos del cuerpo",
  "descripcion": "Los tres ejes y el movimiento que ocurre sobre cada uno: flexión, extensión, abducción, aducción y rotación",
  "pantallas": [
   "v3-68"
  ],
  "fuente": "EC1375 · Elemento 2 · Conocimiento 3 — Biomecánica · Ejes del cuerpo, Movimientos del cuerpo",
  "referencia": "140.1/1-C3E2",
  "peso": 0.59,
  "nivel": "Conocimiento"
 },
 {
  "id": "BIO-REGIONES",
  "crit": "E2·C3",
  "elemento": 2,
  "rx": 79,
  "nombre": "Anatomía topográfica",
  "descripcion": "Anatomía topográfica general: nombrar las regiones del cuerpo para la observación y el consentimiento",
  "pantallas": [
   "v3-69"
  ],
  "fuente": "EC1375 · Elemento 2 · Conocimiento 3 — Biomecánica · Anatomía y Fisiología topográfica",
  "referencia": "140.1/1-C3E2",
  "peso": 0.59,
  "nivel": "Conocimiento"
 },
 {
  "id": "BIO-CUAD",
  "crit": "E2·C3",
  "elemento": 2,
  "rx": 79,
  "nombre": "Cuadrantes y regiones abdominales",
  "descripcion": "Los cuatro cuadrantes y las nueve regiones abdominales, y qué órgano se localiza en cada uno",
  "pantallas": [
   "n-cuadrantes"
  ],
  "fuente": "EC1375 · Elemento 2 · Conocimiento 3 — Biomecánica · Anatomía y Fisiología topográfica",
  "referencia": "140.1/1-C3E2",
  "peso": 0.59,
  "nivel": "Conocimiento"
 },
 {
  "id": "HIG-POSICIONES",
  "crit": "E2·C4",
  "elemento": 2,
  "rx": 80,
  "nombre": "Posiciones adecuadas",
  "descripcion": "Posiciones adecuadas: sedente, bipedestación prolongada y decúbito supino",
  "pantallas": [
   "v3-71"
  ],
  "fuente": "EC1375 · Elemento 2 · Conocimiento 4 — Higiene de columna · Posiciones adecuadas",
  "referencia": "141.1/1-C4E2",
  "peso": 0.29,
  "nivel": "Aplicación"
 },
 {
  "id": "HIG-CARGA",
  "crit": "E2·C4",
  "elemento": 2,
  "rx": 80,
  "nombre": "Manipulación de cargas",
  "descripcion": "Manipulación de cargas: cómo se levanta, se traslada y se gira con una carga",
  "pantallas": [
   "v3-70",
   "v3-72"
  ],
  "fuente": "EC1375 · Elemento 2 · Conocimiento 4 — Higiene de columna · Manipulaciones de carga",
  "referencia": "141.1/1-C4E2",
  "peso": 0.29,
  "nivel": "Aplicación"
 },
 {
  "id": "DAN-ESCALA",
  "crit": "E2·C5",
  "elemento": 2,
  "rx": 81,
  "nombre": "La escala de Daniels",
  "descripcion": "La escala de 0 a 5 y qué demuestra el usuario en cada grado",
  "pantallas": [
   "v3-73"
  ],
  "fuente": "EC1375 · Elemento 2 · Conocimiento 5 — Pruebas funcionales musculares de Daniels · Desarrollo",
  "referencia": "142.1/1-C5E2",
  "peso": 0.29,
  "nivel": "Aplicación"
 },
 {
  "id": "DAN-POSDES",
  "crit": "E2·C5",
  "elemento": 2,
  "rx": 81,
  "nombre": "Posiciones y desarrollo de la prueba",
  "descripcion": "Posiciones contra gravedad y con gravedad eliminada, y los pasos del desarrollo de la prueba",
  "pantallas": [
   "v3-74",
   "v3-75"
  ],
  "fuente": "EC1375 · Elemento 2 · Conocimiento 5 — Pruebas funcionales musculares de Daniels · Posiciones, Desarrollo",
  "referencia": "142.1/1-C5E2",
  "peso": 0.29,
  "nivel": "Aplicación"
 }
];
