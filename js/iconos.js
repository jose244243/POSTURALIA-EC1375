/* ============================================================================
   POSTURALIA · Plataforma de Certificación
   iconos.js — Set de iconos de línea, monocromos

   Por qué existe, si los emojis ya "funcionaban":

   Un emoji no lo dibuja la plataforma, lo dibuja el sistema operativo. El
   mismo 🤲 de Práctica sale beige en Windows, amarillo en Android y con otro
   trazo en iPhone; 🗓️ se cae a un cuadro vacío en varias versiones de
   Windows, y 🖥️ ni siquiera tiene glifo en algunos Android. En una pantalla
   donde el candidato lee su avance, un cuadro vacío junto a "Plan de
   Evaluación" parece un error de la plataforma.

   Estos iconos son SVG de trazo, heredan `currentColor` y miden lo que se
   les pida. Se ven iguales en todos lados y cambian de color solos cuando
   el tema pasa a oscuro — cosa que un emoji tampoco hace.

   Uso:  icono('award')           → 20px, color del texto
         icono('award', 28)       → 28px
         icono('award', 20, 'cls')→ con clase CSS extra
   ========================================================================== */

/* Trazos de 24×24, estilo lineal de 1.8px. Cada entrada es una lista de
   subtrazos: se separan para poder cerrar unos y dejar otros abiertos. */
const TRAZOS = {
  /* Navegación y estructura */
  casa:      ['M3 9.5 12 3l9 6.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9.5 22v-8h5v8'],
  tablero:   ['M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z', 'M3 9.5h18', 'M9.5 21V9.5'],
  usuarios:  ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'],
  engrane:   ['M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z', 'M19.4 15a1.6 1.6 0 0 0 .32 1.76l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.6 1.6 0 0 0 15 19.4a1.6 1.6 0 0 0-1 1.47V21a2 2 0 1 1-4 0v-.09A1.6 1.6 0 0 0 9 19.4a1.6 1.6 0 0 0-1.76.32l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.6 1.6 0 0 0 4.6 15a1.6 1.6 0 0 0-1.47-1H3a2 2 0 1 1 0-4h.09A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.32-1.76l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.6 1.6 0 0 0 9 4.6a1.6 1.6 0 0 0 1-1.47V3a2 2 0 1 1 4 0v.09a1.6 1.6 0 0 0 1 1.47 1.6 1.6 0 0 0 1.76-.32l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.6 1.6 0 0 0 19.4 9v.09a1.6 1.6 0 0 0 1.47 1H21a2 2 0 1 1 0 4h-.09a1.6 1.6 0 0 0-1.47 1z'],

  /* Módulos del proceso */
  portapapeles: ['M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2', 'M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z'],
  diana:     ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z', 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'],
  video:     ['M15 10.5 22 7v10l-7-3.5', 'M4 5h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z'],
  calendario:['M5 4.5h14a2 2 0 0 1 2 2V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2z', 'M16 2.5v4', 'M8 2.5v4', 'M3 10.5h18'],
  carpeta:   ['M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'],
  manos:     ['M11 13.5V7a1.5 1.5 0 0 1 3 0v5', 'M14 12V5.5a1.5 1.5 0 0 1 3 0V12', 'M17 12v-.5a1.5 1.5 0 0 1 3 0V15a7 7 0 0 1-7 7h-1a7 7 0 0 1-7-7v-3a1.5 1.5 0 0 1 3 0', 'M11 13.5V11a1.5 1.5 0 0 0-3 0v1'],
  cerebro:   ['M9.5 3a3 3 0 0 0-3 3 3 3 0 0 0-2 5.2A3 3 0 0 0 6 16.5 3 3 0 0 0 9.5 21a2.5 2.5 0 0 0 2.5-2.5V5.5A2.5 2.5 0 0 0 9.5 3z', 'M14.5 3a3 3 0 0 1 3 3 3 3 0 0 1 2 5.2A3 3 0 0 1 18 16.5 3 3 0 0 1 14.5 21a2.5 2.5 0 0 1-2.5-2.5V5.5A2.5 2.5 0 0 1 14.5 3z'],
  mensaje:   ['M21 14.5a2 2 0 0 1-2 2H8l-5 4.5V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'],
  subir:     ['M21 15.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3.5', 'M16.5 7.5 12 3 7.5 7.5', 'M12 3v12.5'],
  medalla:   ['M12 15.5a6.25 6.25 0 1 0 0-12.5 6.25 6.25 0 0 0 0 12.5z', 'M8.4 14.3 7 22l5-2.8L17 22l-1.4-7.7'],

  /* Material y documentos */
  libro:     ['M2.5 3.5h5A4 4 0 0 1 12 7.5v13a3.2 3.2 0 0 0-3.2-2.6H2.5z', 'M21.5 3.5h-5A4 4 0 0 0 12 7.5v13a3.2 3.2 0 0 1 3.2-2.6h6.3z'],
  monitor:   ['M4 3.5h16a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 14V5A1.5 1.5 0 0 1 4 3.5z', 'M8.5 20.5h7', 'M12 15.5v5'],
  archivo:   ['M14 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8z', 'M14 2.5V8h5.5', 'M15 13.5H9', 'M15 17.5H9'],
  descarga:  ['M21 15.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3.5', 'M7.5 11 12 15.5 16.5 11', 'M12 3v12.5'],
  impresora: ['M6.5 9V3.5h11V9', 'M6.5 17.5H5A2 2 0 0 1 3 15.5v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-1.5', 'M6.5 14h11v6.5h-11z'],
  ojo:       ['M1.5 12S5.5 4.5 12 4.5 22.5 12 22.5 12 18.5 19.5 12 19.5 1.5 12 1.5 12z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],

  /* Estado y señales */
  cheque:    ['m4.5 12.5 5 5 10-11'],
  chequeCaja:['M9 11.5l2.5 2.5L21 4.5', 'M20.5 12.5V19a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10'],
  reloj:     ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 7v5.2l3.2 2'],
  candado:   ['M5.5 10.5h13a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 20v-8a1.5 1.5 0 0 1 1.5-1.5z', 'M7.5 10.5V7a4.5 4.5 0 0 1 9 0v3.5'],
  llave:     ['M14.5 10.5a4.5 4.5 0 1 1-4.2-4.49', 'M21 3l-8.5 8.5', 'M17 7l2.5 2.5', 'M14.5 9.5 17 12'],
  alerta:    ['M10.3 4.2 2.6 17.5A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z', 'M12 9.5v4', 'M12 17.2h.01'],
  escudo:    ['M12 22s8-3.5 8-9.5V5.5L12 2.5 4 5.5V12.5C4 18.5 12 22 12 22z'],
  nube:      ['M17.5 19.5a4.5 4.5 0 0 0 .5-8.97A6.5 6.5 0 0 0 5.4 12.1 3.7 3.7 0 0 0 6 19.5z'],
  sincroniza:['M21 12a9 9 0 0 1-9 9 9 9 0 0 1-7.8-4.5', 'M3 12a9 9 0 0 1 9-9 9 9 0 0 1 7.8 4.5', 'M21 3.5V8h-4.5', 'M3 20.5V16h4.5'],
  rayo:      ['M13 2.5 4 13.5h7l-1 8 9-11h-7z'],
  flecha:    ['M5 12h13', 'M12.5 5.5 19 12l-6.5 6.5'],
  dinero:    ['M12 1.5v21', 'M17 6H9.5a3.25 3.25 0 0 0 0 6.5h5a3.25 3.25 0 0 1 0 6.5H6'],
  grafica:   ['M22 12h-4l-3 9L9 3l-3 9H2'],
  brujula:   ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M15.5 8.5 13.8 13.8 8.5 15.5l1.7-5.3z'],
  sol:       ['M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z', 'M12 1.5v2.5', 'M12 20v2.5', 'M3.9 3.9l1.8 1.8', 'M18.3 18.3l1.8 1.8', 'M1.5 12H4', 'M20 12h2.5', 'M3.9 20.1l1.8-1.8', 'M18.3 5.7l1.8-1.8'],
  luna:      ['M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z'],
};

/* Los que se dibujan rellenos y sin trazo (ninguno hoy, pero el hueco evita
   tener que reescribir la función cuando aparezca el primero). */
const RELLENOS = new Set();

/* ── El helper ────────────────────────────────────────────────────────────
   Devuelve HTML, no un nodo: casi todo el pintado de la plataforma arma
   cadenas y las asigna con innerHTML. Un nodo obligaría a reescribir eso.  */
export function icono(nombre, tam = 20, clase = '') {
  const trazos = TRAZOS[nombre];
  if (!trazos) return '';   // un icono que no existe no rompe la pantalla

  const relleno = RELLENOS.has(nombre);
  const d = trazos.map(p => `<path d="${p}"/>`).join('');

  return `<svg class="ico ${clase}" width="${tam}" height="${tam}"
     viewBox="0 0 24 24" fill="${relleno ? 'currentColor' : 'none'}"
     stroke="${relleno ? 'none' : 'currentColor'}" stroke-width="1.8"
     stroke-linecap="round" stroke-linejoin="round"
     aria-hidden="true" focusable="false">${d}</svg>`;
}

export const existeIcono = n => !!TRAZOS[n];

/* ── Qué icono le toca a cada módulo ──────────────────────────────────────
   Vive aquí y no en config.js para que config.js siga siendo solo datos del
   negocio: precios, reglas, orden del flujo. Si un módulo no está en esta
   tabla cae a 'archivo', que siempre se ve bien.                          */
const POR_MODULO = {
  autodiagnostico: 'portapapeles',
  reforzamiento:   'diana',
  alineacion:      'video',
  plan:            'calendario',
  documentos:      'carpeta',
  practica:        'manos',
  examen:          'cerebro',
  encuesta:        'mensaje',
  evidencias:      'subir',
  entrega:         'medalla',
  biblioteca:      'libro',
  deck:            'monitor',
  guion:           'archivo',
};

export const iconoDe = id => POR_MODULO[id] || 'archivo';

/* Icono por estado del flujo, para las listas de pasos */
export const ICONO_ESTADO = {
  completado:  'cheque',
  en_curso:    'reloj',
  disponible:  'flecha',
  bloqueado:   'candado',
  pendiente:   'reloj',
  esperando:   'reloj',
  sin_pago:    'llave',
};
