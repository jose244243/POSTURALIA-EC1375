/* POSTURALIA · data-criterios.js — Los 34 criterios del EC1375 (Paideia V4.5).

   Un "tema" de Reforzamiento es un criterio con al menos un reactivo en NO
   en el autodiagnóstico. `pantallas` = las de la Biblioteca de ese criterio
   con ruta remedial/both (rutaCriterio() de Paideia). Obligatorio = el
   criterio tiene un reactivo eliminatorio en NO.                          */

export const CRITERIOS = {
 "E1·D1": {
  "titulo": "Realiza los protocolos de seguridad sanitaria",
  "elem": 1,
  "tipo": "Desempeño",
  "peso": 4.99,
  "riesgo": "critico",
  "criticos": [
   2
  ],
  "rx": [
   1,
   2,
   3,
   4,
   5,
   6
  ],
  "instr": "Guía de Observación",
  "pantallas": [
   "v3-10",
   "v3-11",
   "v3-12",
   "v3-13",
   "v3-14",
   "v3-15",
   "v3-108"
  ]
 },
 "E1·P1": {
  "titulo": "El espacio acondicionado para otorgar el servicio",
  "elem": 1,
  "tipo": "Producto",
  "peso": 8.51,
  "riesgo": "critico",
  "criticos": [
   7,
   8
  ],
  "rx": [
   7,
   8,
   9,
   10,
   11,
   12,
   13,
   14,
   15
  ],
  "instr": "Lista de Cotejo",
  "pantallas": [
   "v3-17",
   "v3-18",
   "v3-25"
  ]
 },
 "E1·P2": {
  "titulo": "Las herramientas y materiales de trabajo seleccionados",
  "elem": 1,
  "tipo": "Producto",
  "peso": 7.06,
  "riesgo": "critico",
  "criticos": [
   16,
   17
  ],
  "rx": [
   16,
   17,
   18,
   19
  ],
  "instr": "Lista de Cotejo",
  "pantallas": [
   "v3-20",
   "v3-22"
  ]
 },
 "E1·C1": {
  "titulo": "Técnicas de atención tradicional y complementaria · Comprensión",
  "elem": 1,
  "tipo": "Conocimiento",
  "peso": 0.29,
  "riesgo": "menor",
  "criticos": [],
  "rx": [
   20
  ],
  "instr": "Cuestionario",
  "pantallas": [
   "v3-8",
   "n-tecnicas"
  ]
 },
 "E1·C2": {
  "titulo": "Desinfección vs Sanitización · Aplicación",
  "elem": 1,
  "tipo": "Conocimiento",
  "peso": 0.29,
  "riesgo": "menor",
  "criticos": [],
  "rx": [
   21
  ],
  "instr": "Cuestionario",
  "pantallas": [
   "v3-23"
  ]
 },
 "E1·C3": {
  "titulo": "Manejo de residuos peligrosos NOM-087-ECOL-SSA1-2002 · Conocimiento",
  "elem": 1,
  "tipo": "Conocimiento",
  "peso": 0.29,
  "riesgo": "menor",
  "criticos": [],
  "rx": [
   22
  ],
  "instr": "Cuestionario",
  "pantallas": [
   "v3-24",
   "v3-25"
  ]
 },
 "E1·A1": {
  "titulo": "Limpieza",
  "elem": 1,
  "tipo": "Actitud",
  "peso": 0,
  "riesgo": "actitud",
  "criticos": [],
  "rx": [
   23
  ],
  "instr": "Guía de Observación",
  "pantallas": [
   "v3-27"
  ]
 },
 "E1·A2": {
  "titulo": "Orden",
  "elem": 1,
  "tipo": "Actitud",
  "peso": 0,
  "riesgo": "actitud",
  "criticos": [],
  "rx": [
   24
  ],
  "instr": "Guía de Observación",
  "pantallas": [
   "v3-27"
  ]
 },
 "E2·D1": {
  "titulo": "Recibe al usuario",
  "elem": 2,
  "tipo": "Desempeño",
  "peso": 2.63,
  "riesgo": "medio",
  "criticos": [],
  "rx": [
   25,
   26,
   27,
   28,
   29,
   30,
   31
  ],
  "instr": "Guía de Observación",
  "pantallas": [
   "v3-30",
   "v3-31",
   "v3-32",
   "v3-108"
  ]
 },
 "E2·D2": {
  "titulo": "Introduce al usuario para el llenado de la bitácora/carpeta/documentación",
  "elem": 2,
  "tipo": "Desempeño",
  "peso": 7.06,
  "riesgo": "critico",
  "criticos": [
   33
  ],
  "rx": [
   32,
   33,
   34,
   35,
   36,
   37,
   38,
   39,
   40
  ],
  "instr": "Guía de Observación",
  "pantallas": [
   "v3-34",
   "v3-36",
   "v3-39"
  ]
 },
 "E2·D3": {
  "titulo": "Introduce al usuario para el llenado de la ficha de registro",
  "elem": 2,
  "tipo": "Desempeño",
  "peso": 6.17,
  "riesgo": "critico",
  "criticos": [
   46
  ],
  "rx": [
   41,
   42,
   43,
   44,
   45,
   46,
   47,
   48
  ],
  "instr": "Guía de Observación",
  "pantallas": [
   "v3-6",
   "v3-36",
   "v3-37",
   "v3-39"
  ]
 },
 "E2·D4": {
  "titulo": "Mide niveles de saturación de oxígeno y pulso",
  "elem": 2,
  "tipo": "Desempeño",
  "peso": 2.34,
  "riesgo": "medio",
  "criticos": [],
  "rx": [
   49,
   50,
   51,
   52,
   53,
   54
  ],
  "instr": "Guía de Observación",
  "pantallas": [
   "v3-41",
   "v3-42",
   "v3-43",
   "v3-44",
   "v3-45",
   "v3-107"
  ]
 },
 "E2·D5": {
  "titulo": "Observa la postura física del usuario",
  "elem": 2,
  "tipo": "Desempeño",
  "peso": 0.88,
  "riesgo": "medio",
  "criticos": [],
  "rx": [
   55,
   56
  ],
  "instr": "Guía de Observación",
  "pantallas": [
   "v3-41",
   "v3-46",
   "v3-47",
   "v3-48"
  ]
 },
 "E2·D6": {
  "titulo": "Realiza la toma de la frecuencia respiratoria",
  "elem": 2,
  "tipo": "Desempeño",
  "peso": 1.17,
  "riesgo": "medio",
  "criticos": [],
  "rx": [
   57,
   58,
   59
  ],
  "instr": "Guía de Observación",
  "pantallas": [
   "v3-41",
   "v3-49",
   "v3-50"
  ]
 },
 "E2·D7": {
  "titulo": "Verifica la presión arterial del usuario",
  "elem": 2,
  "tipo": "Desempeño",
  "peso": 2.05,
  "riesgo": "medio",
  "criticos": [],
  "rx": [
   60,
   61,
   62,
   63,
   64
  ],
  "instr": "Guía de Observación",
  "pantallas": [
   "v3-41",
   "v3-52",
   "v3-53",
   "v3-55",
   "v3-56",
   "v3-106"
  ]
 },
 "E2·P1": {
  "titulo": "La bitácora/carpeta/documentación de atención integral conformada",
  "elem": 2,
  "tipo": "Producto",
  "peso": 7.33,
  "riesgo": "critico",
  "criticos": [
   75
  ],
  "rx": [
   65,
   66,
   67,
   68,
   69,
   70,
   71,
   72,
   73,
   74,
   75,
   76
  ],
  "instr": "Lista de Cotejo",
  "pantallas": [
   "v3-6",
   "v3-38",
   "v3-62",
   "v3-109",
   "n-somatometria"
  ]
 },
 "E2·C1": {
  "titulo": "Rangos y niveles de signos vitales en niños, adultos y tercera edad · Aplicación",
  "elem": 2,
  "tipo": "Conocimiento",
  "peso": 0.59,
  "riesgo": "medio",
  "criticos": [],
  "rx": [
   77
  ],
  "instr": "Cuestionario",
  "pantallas": [
   "v3-42",
   "v3-49",
   "v3-53",
   "v3-54",
   "v3-60",
   "v3-61",
   "n-hipotension"
  ]
 },
 "E2·C2": {
  "titulo": "Goniometría: concepto, utilidad, aplicación · Aplicación",
  "elem": 2,
  "tipo": "Conocimiento",
  "peso": 0.29,
  "riesgo": "menor",
  "criticos": [],
  "rx": [
   78
  ],
  "instr": "Cuestionario",
  "pantallas": [
   "v3-64",
   "v3-66"
  ]
 },
 "E2·C3": {
  "titulo": "Biomecánica: definición, planos, ejes, movimientos, anatomía topográfica · Conocimiento",
  "elem": 2,
  "tipo": "Conocimiento",
  "peso": 0.59,
  "riesgo": "medio",
  "criticos": [],
  "rx": [
   79
  ],
  "instr": "Cuestionario",
  "pantallas": [
   "v3-67",
   "v3-68",
   "v3-69",
   "n-cuadrantes"
  ]
 },
 "E2·C4": {
  "titulo": "Higiene de columna: posiciones adecuadas y manipulación de cargas · Aplicación",
  "elem": 2,
  "tipo": "Conocimiento",
  "peso": 0.29,
  "riesgo": "menor",
  "criticos": [],
  "rx": [
   80
  ],
  "instr": "Cuestionario",
  "pantallas": [
   "v3-70",
   "v3-71",
   "v3-72",
   "v3-89"
  ]
 },
 "E2·C5": {
  "titulo": "Pruebas funcionales musculares de Daniels: posiciones y desarrollo · Aplicación",
  "elem": 2,
  "tipo": "Conocimiento",
  "peso": 0.29,
  "riesgo": "menor",
  "criticos": [],
  "rx": [
   81
  ],
  "instr": "Cuestionario",
  "pantallas": [
   "v3-73",
   "v3-75"
  ]
 },
 "E2·A1": {
  "titulo": "Amabilidad",
  "elem": 2,
  "tipo": "Actitud",
  "peso": 0,
  "riesgo": "actitud",
  "criticos": [],
  "rx": [
   82
  ],
  "instr": "Guía de Observación",
  "pantallas": [
   "v3-76"
  ]
 },
 "E2·A2": {
  "titulo": "Orden",
  "elem": 2,
  "tipo": "Actitud",
  "peso": 0,
  "riesgo": "actitud",
  "criticos": [],
  "rx": [
   83
  ],
  "instr": "Guía de Observación",
  "pantallas": [
   "v3-76"
  ]
 },
 "E2·A3": {
  "titulo": "Responsabilidad",
  "elem": 2,
  "tipo": "Actitud",
  "peso": 0,
  "riesgo": "actitud",
  "criticos": [],
  "rx": [
   84
  ],
  "instr": "Guía de Observación",
  "pantallas": [
   "v3-76"
  ]
 },
 "E3·D1": {
  "titulo": "Introduce al usuario a la contribución tradicional y complementaria",
  "elem": 3,
  "tipo": "Desempeño",
  "peso": 3.82,
  "riesgo": "critico",
  "criticos": [
   86
  ],
  "rx": [
   85,
   86,
   87
  ],
  "instr": "Guía de Observación",
  "pantallas": [
   "v3-79"
  ]
 },
 "E3·D2": {
  "titulo": "Explica el procedimiento designado por el especialista",
  "elem": 3,
  "tipo": "Desempeño",
  "peso": 9.99,
  "riesgo": "critico",
  "criticos": [
   88,
   89,
   90
  ],
  "rx": [
   88,
   89,
   90,
   91,
   92,
   93
  ],
  "instr": "Guía de Observación",
  "pantallas": [
   "v3-80",
   "v3-83"
  ]
 },
 "E3·D3": {
  "titulo": "Presenta el documento de consentimiento informado/aceptación del servicio",
  "elem": 3,
  "tipo": "Desempeño",
  "peso": 3.82,
  "riesgo": "critico",
  "criticos": [
   96
  ],
  "rx": [
   94,
   95,
   96
  ],
  "instr": "Guía de Observación",
  "pantallas": [
   "v3-82",
   "v3-83"
  ]
 },
 "E3·D4": {
  "titulo": "Informa al usuario sobre la finalización del servicio",
  "elem": 3,
  "tipo": "Desempeño",
  "peso": 5.58,
  "riesgo": "critico",
  "criticos": [
   99
  ],
  "rx": [
   97,
   98,
   99,
   100,
   101,
   102,
   103
  ],
  "instr": "Guía de Observación",
  "pantallas": [
   "v3-71",
   "v3-87",
   "v3-89",
   "v3-90"
  ]
 },
 "E3·P1": {
  "titulo": "La carta de consentimiento informado/aceptación del servicio elaborada",
  "elem": 3,
  "tipo": "Producto",
  "peso": 9.12,
  "riesgo": "critico",
  "criticos": [
   106
  ],
  "rx": [
   104,
   105,
   106,
   107,
   108,
   109,
   110,
   111,
   112,
   113,
   114,
   115,
   116
  ],
  "instr": "Lista de Cotejo",
  "pantallas": [
   "v3-84"
  ]
 },
 "E4·D1": {
  "titulo": "Aplica encuesta de satisfacción",
  "elem": 4,
  "tipo": "Desempeño",
  "peso": 1.16,
  "riesgo": "menor",
  "criticos": [],
  "rx": [
   117,
   118,
   119,
   120
  ],
  "instr": "Guía de Observación",
  "pantallas": [
   "v3-94",
   "v3-95"
  ]
 },
 "E4·D2": {
  "titulo": "Acuerda con el usuario el programa de seguimiento",
  "elem": 4,
  "tipo": "Desempeño",
  "peso": 5.87,
  "riesgo": "critico",
  "criticos": [
   126
  ],
  "rx": [
   121,
   122,
   123,
   124,
   125,
   126,
   127,
   128
  ],
  "instr": "Guía de Observación",
  "pantallas": [
   "v3-94",
   "v3-96"
  ]
 },
 "E4·D3": {
  "titulo": "Asegura el medio de contacto para el seguimiento",
  "elem": 4,
  "tipo": "Desempeño",
  "peso": 1.16,
  "riesgo": "menor",
  "criticos": [],
  "rx": [
   129,
   130,
   131,
   132
  ],
  "instr": "Guía de Observación",
  "pantallas": [
   "v3-94",
   "v3-97"
  ]
 },
 "E4·P1": {
  "titulo": "Plan de Seguimiento elaborado",
  "elem": 4,
  "tipo": "Producto",
  "peso": 1.75,
  "riesgo": "medio",
  "criticos": [],
  "rx": [
   133,
   134,
   135,
   136,
   137
  ],
  "instr": "Lista de Cotejo",
  "pantallas": [
   "v3-98"
  ]
 },
 "E4·P2": {
  "titulo": "El Plan de sesión elaborado",
  "elem": 4,
  "tipo": "Producto",
  "peso": 4.7,
  "riesgo": "critico",
  "criticos": [
   142
  ],
  "rx": [
   138,
   139,
   140,
   141,
   142
  ],
  "instr": "Lista de Cotejo",
  "pantallas": [
   "v3-98",
   "v3-100"
  ]
 }
};
