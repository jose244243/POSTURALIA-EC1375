/* POSTURALIA · data-portafolio.js — Contenido real de los módulos de portafolio.
   Fuente: modulos.json (plan de evaluación, encuesta CONOCER, evidencias).

   Las claves de EVIDENCIAS son las mismas que usa la plataforma de Paideia
   (zoom, ine, curp, fotoDiploma) para que un expediente pueda migrarse entre
   los dos sistemas sin traducir nada. Esas cuatro son las que cierran el
   módulo; video y certificados son adicionales.                            */

export const PLAN      = {
 "instrumentoPorTipo": {
  "DESEMPEÑOS": "Guía de Observación",
  "PRODUCTOS": "Lista de Cotejo",
  "CONOCIMIENTOS": "Cuestionario",
  "ACTITUDES": "Guía de Observación"
 },
 "criterios": [
  {
   "elemento": 1,
   "titulo": "Preparar el espacio",
   "desempenos": 6,
   "productos": 13,
   "conocimientos": 3,
   "actitudes": 2
  },
  {
   "elemento": 2,
   "titulo": "Preparar al usuario",
   "desempenos": 40,
   "productos": 12,
   "conocimientos": 5,
   "actitudes": 3
  },
  {
   "elemento": 3,
   "titulo": "Introducir al usuario",
   "desempenos": 19,
   "productos": 13,
   "conocimientos": 0,
   "actitudes": 0
  },
  {
   "elemento": 4,
   "titulo": "Dar seguimiento",
   "desempenos": 16,
   "productos": 10,
   "conocimientos": 0,
   "actitudes": 0
  }
 ],
 "requerimientos": [
  {
   "label": "Escritorio / mesa para atención"
  },
  {
   "label": "Sillas"
  },
  {
   "label": "Lavabo de manos"
  },
  {
   "label": "Mesa de apoyo para herramientas"
  },
  {
   "label": "Banco de altura"
  },
  {
   "label": "Archivero / computadora"
  },
  {
   "label": "Monitor de presión arterial"
  },
  {
   "label": "Oxímetro"
  },
  {
   "label": "Termómetro digital"
  },
  {
   "label": "Perchero"
  },
  {
   "label": "Báscula"
  },
  {
   "label": "Estadímetro"
  },
  {
   "label": "Áreas de recepción y atención"
  }
 ]
};

export const ENCUESTA  = {
 "preguntas": [
  "¿La presentación del Estándar de Competencia y la aplicación del diagnóstico, fue realizada sin costo para usted?",
  "¿La información proporcionada fue suficiente para iniciar sin dudas su proceso de evaluación?",
  "¿Recibió un trato digno y respetuoso durante las etapas del proceso de evaluación?",
  "¿Fue condicionada a tomar un curso de capacitación previo a la evaluación?",
  "¿Le presentaron, explicaron y acordaron el Plan de Evaluación previo a la evaluación?",
  "¿Recibió retroalimentación detallada de las etapas y resultados de su evaluación?",
  "¿El evaluador atendió todas sus dudas?",
  "¿En caso de haber resultado competente, le informaron los tiempos de entrega del certificado?"
 ],
 "_fuente": "FORMATO PORTAFOLIO-1375-2026, pág. 39 (8 preguntas; antes eran 7)",
 "escala": [
  "Muy de acuerdo",
  "De acuerdo",
  "Parcialmente en desacuerdo",
  "Totalmente en desacuerdo"
 ]
};

/* Formato de Atención a Usuarios (FORMATO PORTAFOLIO-1375-2026, pág. 42):
   el usuario califica cómo lo atendieron cuando pidió informes. */
export const FORMATO_ATENCION = {
  titulo: 'Formato de Atención a Usuarios.',
  medios: ['Presencial', 'Telefónico', 'Watsapp empresarial', 'E-Mail', 'Otro'],
  escala: ['Bueno', 'Regular', 'Malo'],
  preguntas: [
    '¿Cómo califica la atención que se le ha dado? (tiempo en que fue atendido y utilidad de la información que se le proporcionó)',
    'Considera que el tiempo de atención fue el adecuado (Tiempo que duró la explicación y aclaración de dudas)',
    '¿Considera que se le dio un trato amable? (La persona le saludó, le trató con respeto y cordialidad)',
    'La persona que le brindó la atención ¿Le dio la confianza necesaria para satisfacer todas sus dudas respecto al proceso de evaluación-certificación?',
    '¿Para dirigirse a usted la persona que lo atendió utilizo palabras y términos que le facilitaron comprender lo que estaba explicando?',
  ],
};

/* Cédula de Evaluación del Servicio a usuarios en el Proceso de Evaluación –
   Certificación (FORMATO PORTAFOLIO-1375-2026, pág. 40). "NA" = no aplica. */
export const CEDULA_SERVICIO = {
  titulo: 'Cédula de Evaluación del Servicio a usuarios en el Proceso de Evaluación – Certificación',
  medios: ['Promoción directa', 'Por su patrón o su empleador', 'Trípticos, folletos o carteles', 'Canalizado por ECE u OC', 'Otro'],
  escala: ['Bueno', 'Regular', 'Malo', 'NA'],
  aspectos: [
    'Trato general del personal que le atendió',
    'Explicación del proceso evaluación – certificación',
    'Claridad en el uso del lenguaje',
    'Transparencia en información sobre costos',
    'Aclaración de dudas',
    'Estado de las Instalaciones en las que se evaluó',
    'Estado del equipo con el que se evaluó',
    'Proceso de Evaluación de la competencia',
    'Comunicación general para dar seguimiento a su proceso',
    'Entrega del certificado (oportunidad)',
  ],
};

export const EVIDENCIAS = [
 {
  "icon": "monitor",
  "titulo": "Capturas de tu sesión Zoom",
  "desc": "Fotos o capturas de pantalla que muestren tu sesión en vivo con el usuario.",
  "required": true,
  "clave": "zoom"
 },
 {
  "icon": "flecha",
  "titulo": "Liga al video completo",
  "desc": "Sube tu grabación completa a YouTube (puede ser oculto o no listado) u otra plataforma, y pega la liga. Tu evaluador la revisa para calificar el Instrumento de Evaluación.",
  "required": true,
  "isLink": true,
  "clave": "video"
 },
 {
  "icon": "archivo",
  "titulo": "Identificación oficial (INE o Pasaporte)",
  "desc": "Copia legible de tu identificación vigente, frente y reverso.",
  "required": true,
  "clave": "ine"
 },
 {
  "icon": "archivo",
  "titulo": "Comprobante CURP",
  "desc": "Constancia o copia de tu CURP.",
  "required": true,
  "clave": "curp"
 },
 {
  "icon": "monitor",
  "titulo": "Foto para tu diploma",
  "desc": "De frente, fondo blanco, sin texturas, formal y nítida. Orejas descubiertas, vestimenta clara y lisa, sin retoques, no mayor a 2 meses de antigüedad.",
  "required": true,
  "clave": "fotoDiploma"
 },
 {
  "icon": "medalla",
  "titulo": "Certificados o diplomas de formación",
  "desc": "Respaldo adicional de tus especialidades. Opcional.",
  "required": false,
  "clave": "certificados"
 }
];
