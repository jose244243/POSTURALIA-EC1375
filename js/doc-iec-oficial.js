/* ============================================================================
   POSTURALIA · doc-iec-oficial.js — Instrumento de Evaluación de Competencia
   (IEC1375 · formato N-FO-03 versión 2.0), completo y con su propia foliación

   Cotejado contra el instrumento oficial en blanco del CONOCER (45 pp):
     I. Información general · II. Introducción · III. Instrucciones de
     aplicación y de calificación · IV. Tabla de aplicación en sus 10
     instrumentos (Lista de Cotejo 1 · Guías de Observación 1–4 · Listas de
     Cotejo 2–4 · Cuestionarios 1 y 2 con sus 37 preguntas) · V. Cuantificación
     de pesos · VI. Juicio de competencia · Anexo 1 (observaciones del
     evaluador) · Anexo 2 (respuestas correctas).

   Cada página lleva el encabezado del CONOCER, «Página X de N» y al pie la
   firma del candidato (izquierda) y la del evaluador (derecha); en la primera,
   con su nombre, como el formato oficial.

   La foliación no se puede calcular de antemano (depende de cuánto mide cada
   renglón), así que el documento se pagina en el navegador al abrirse: los
   bloques se vacían en páginas tamaño carta de altura fija y las tablas se
   parten repitiendo su encabezado. Así «de N» es exacto al imprimir.

   Textos literales del oficial, con sus erratas propias («sociemocionales»,
   «repuesta», «y contiene las instrucciones…» repetido). Las del formato
   viejo que no están en el oficial («correpondientes», «muetre»,
   «evalaución», «Respuesta Elejida»…) ya no se imprimen. En el cuestionario,
   la respuesta del candidato va subrayada y, donde hay paréntesis, escrita en
   ellos, que es como lo contesta a mano.
   ========================================================================== */
import { CONFIG } from './config.js';
import { firmaHtml } from './firma-simple.js';
import { REACTIVOS } from './data-iec.js';
import { CUESTIONARIO, GRUPOS_CUESTIONARIO } from './data-cuestionario-iec.js';
import { calificarIec, normalizarRespuesta, correctaTexto } from './evaluacion.js';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const abs = p => new URL(p, location.href).href;
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
/* 2025-08-23 → «agosto 23 2025», como en el IEC */
const fechaIec = iso => { const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${MESES[+m[2] - 1]} ${+m[3]} ${m[1]}` : esc(iso || ''); };
const peso = p => Number(p).toFixed(2);
const PALOMITA = '“ ✓ ”';

/* ── Estilos propios del IEC (se suman a estilosOficiales) ───────────── */
export function estilosIec() {
  return `
  .pag-iec { height: 254mm; display: flex; flex-direction: column; break-before: page; page-break-before: always; overflow: hidden; font-size: 10.5pt }
  @media screen { .pag-iec { margin-bottom: 18mm; outline: 1px dashed #cbd5e1; outline-offset: 6mm } }
  .pag-iec .ie-enc { display: flex; justify-content: space-between; align-items: flex-start; height: 22mm; flex: none; border-bottom: 1px solid #000; margin-bottom: 3mm }
  .pag-iec .ie-enc .logo { height: 19mm; width: 44mm; display: flex; align-items: center }
  .pag-iec .ie-enc .logo img { max-height: 19mm; max-width: 44mm; object-fit: contain }
  .pag-iec .ie-enc .tit { text-align: right; font-weight: bold; font-size: 11pt; line-height: 1.5 }
  .pag-iec .ie-enc .pg { font-weight: normal; font-size: 10pt; font-style: italic; color: #555 }
  .pag-iec .ie-cuerpo { flex: 1; overflow: hidden; min-height: 0 }
  .pag-iec .ie-pie { flex: none; height: 31mm; padding-top: 1.5mm; display: grid; grid-template-columns: 1fr 1fr; column-gap: 14mm; font-size: 8.5pt }
  .pag-iec .ie-pie .rub { display: flex; flex-direction: column; justify-content: flex-end; align-items: center; height: 17mm; overflow: hidden }
  .pag-iec .ie-pie .rub .f { height: 13mm; display: flex; align-items: flex-end; justify-content: center; overflow: hidden }
  .pag-iec .ie-pie .rub .f img { max-height: 12mm !important }
  .pag-iec .ie-pie .rub .n { font-size: 8pt; text-transform: uppercase; line-height: 1.1; display: none }
  .pag-iec.primera .ie-pie .rub .n { display: block }
  .pag-iec .ie-pie .nom { text-align: center; font-weight: bold; border-top: 1px solid #000; padding-top: .5mm; text-transform: uppercase }
  .pag-iec .ie-pie .nom .p1 { display: none } .pag-iec.primera .ie-pie .nom .p1 { display: inline }
  .pag-iec .ie-pie .fmt { font-size: 7.5pt; color: #333; margin-top: 2mm }
  .ie-banda { background: #d9d9d9; font-weight: bold; padding: 1.5mm 3mm; margin: 0 0 3mm; font-size: 11pt }
  .ie-tit { background: #3f3f3f; color: #fff; font-weight: bold; padding: 1.3mm 3mm; margin: 2mm 0 0; font-size: 10.5pt }
  .ie-p { margin: 0 0 2.2mm; text-align: justify; line-height: 1.33 }
  .ie-l { margin: 0 0 2.2mm 7mm; padding: 0 } .ie-l li { margin: 0 0 1.4mm; text-align: justify; line-height: 1.32 }
  .ie-l.pto { list-style: '•  ' }
  .ie-l.sub { list-style: lower-alpha; margin-top: 1mm }
  .ie-caja { width: 100%; border-collapse: collapse; margin: 2mm 0 4mm } .ie-caja td { border: 1px solid #000; padding: 1.5mm 2.5mm; vertical-align: top }
  .ie-perfil { width: 100%; border-collapse: collapse; margin: 2mm 0 4mm } .ie-perfil td { border: 1px solid #000; padding: 2mm 3mm; vertical-align: top }
  .ie-perfil .e { font-weight: bold; margin-top: 2mm } .ie-perfil .e:first-child { margin-top: 0 }
  table.ie-t { width: 100%; border-collapse: collapse; margin: 0 0 3mm; font-size: 10pt }
  table.ie-t th, table.ie-t td { border: 1px solid #000; padding: 2.2mm 2mm; vertical-align: middle }
  table.ie-t th { background: #d9d9d9; font-size: 9pt }
  table.ie-t td.cod { width: 23mm; font-size: 8.5pt; text-align: center }
  table.ie-t td.sn { width: 9mm; text-align: center; font-size: 13pt; font-weight: bold }
  table.ie-t td.ps { width: 16mm; text-align: center; font-size: 9pt }
  table.ie-t td.ob { width: 34mm; font-size: 8.5pt }
  table.ie-t tr.gr td { font-weight: bold; background: #f2f2f2 }
  table.ie-t tr.gr td.cod, table.ie-t tr.gr td.ob { background: none }
  table.ie-t tr td { height: 13mm }
  table.ie-t tr.gr td { height: auto }
  table.ie-t.a2 tr td { height: auto; padding: 1.6mm 2mm }
  table.ie-t.a2 td.rs { border-top: 0; border-bottom: 0 } table.ie-t.a2 td.rs.ini { border-top: 1px solid #000 }
  table.ie-t.a2 tbody tr:last-child td { border-bottom: 1px solid #000 }
  table.ie-t.a2 td.res { width: 34mm; text-align: center; font-weight: bold }
  table.ie-t.a2 tr.gr td { background: none; font-weight: normal }
  .ie-inst { border: 1px solid #000; padding: 2mm 3mm; margin: 0 0 3mm; text-align: justify; line-height: 1.35 }
  .ie-tit + .ie-inst { border-top: 0 }
  .ie-q { margin: 0 0 4mm; break-inside: avoid }
  .ie-q .st { margin: 0 0 2mm; text-align: justify; line-height: 1.35 }
  .ie-q .op { margin: 0 0 0 12mm; line-height: 1.35 } .ie-q .op div { margin: 0 0 2.6mm }
  .ie-q .op .eleg { text-decoration: underline; text-underline-offset: 2px; font-weight: bold }
  .ie-q .par { font-weight: bold }
  .ie-rel { display: grid; grid-template-columns: 1fr 1.4fr; gap: 6mm; margin-left: 4mm }
  .ie-rel .iz div { margin: 0 0 2.6mm } .ie-rel .de div { margin: 0 0 2.6mm; text-align: justify }
  .ie-fig { display: flex; gap: 6mm; align-items: center; margin: 2mm 0 3mm 4mm }
  .ie-fig ol { margin: 0; padding-left: 5mm; font-size: 9.5pt } .ie-fig li { margin: 0 0 .8mm }
  .ie-v td { border: 0; padding: 1.5mm 0; vertical-align: bottom } .ie-v .val { width: 26mm; text-align: center; font-weight: bold; border-bottom: 1px solid #000 }
  .ie-juicio { display: flex; justify-content: center; gap: 24mm; margin: 5mm 0 0 } .ie-juicio span b { display: inline-block; width: 8mm; height: 6mm; border: 1px solid #000; text-align: center; margin-right: 3mm; vertical-align: middle }
  .ie-a1 { width: 100%; border-collapse: collapse } .ie-a1 th { border: 1px solid #000; background: #d9d9d9; font-size: 9pt; padding: 2mm }
  .ie-a1 td { border: 1px solid #000; vertical-align: top; padding: 2mm; font-size: 9pt }
  #iecFuente { display: none }`;
}

/* ── Contenido fijo del instrumento ──────────────────────────────────── */
const ELEMENTOS_EC = [
  'Preparar el espacio en la contribución tradicional y complementaria de la recuperación de las condiciones físicas y socioemocionales de las personas',
  'Preparar al usuario para la contribución tradicional y complementaria de la recuperación de las condiciones físicas y socioemocionales de las personas',
  'Introducir al usuario a la contribución tradicional y complementaria de la recuperación de las condiciones físicas y socioemocionales de las personas',
  'Dar seguimiento al usuario en la contribución tradicional y complementaria de la recuperación de las condiciones físicas y socioemocionales de las personas',
];
const NOMBRE_EC = 'Prestación de servicios auxiliares en la contribución tradicional y complementaria de la recuperación de las condiciones físicas y socioemocionales de las personas';

function seccionI({ evaluador, candidato, fecha }) {
  return `<div data-b>
    <div class="ie-banda">I.&nbsp;&nbsp;&nbsp;&nbsp; INFORMACIÓN GENERAL.</div>
    <table class="ie-caja"><tr><td style="width:30mm"><b>Código:</b><br><br>IEC1375</td><td>IEC para evaluar el EC ${NOMBRE_EC}</td></tr></table>
    <table class="ie-caja"><tr><td><b>NOMBRE DEL EVALUADOR:</b> ${esc(evaluador)}</td><td style="width:48mm" rowspan="2"><b>Fecha de Aplicación:</b><br>${fechaIec(fecha)}</td></tr>
      <tr><td><b>NOMBRE DEL CANDIDATO:</b> ${esc(candidato)}</td></tr></table>
    <p class="ie-p"><u><b>Perfil del EC que se evalúa.</b></u></p>
    <table class="ie-perfil"><tr><td style="width:52mm"><b>Estándar de Competencia:</b><br><br>${NOMBRE_EC}</td>
      <td>${ELEMENTOS_EC.map((t, i) => `<div class="e">Elemento ${i + 1} de 4</div><div>${t}</div>`).join('')}</td></tr></table>
    <p class="ie-p" style="margin:0">Duración estimada de la evaluación:</p>
    <p class="ie-p">50 minutos en gabinete y 1 hora en campo, totalizando 1 hora con 50 minutos.</p>
  </div>`;
}

function seccionII() {
  return `<div data-b data-salto>
    <div class="ie-banda">II.&nbsp;&nbsp;&nbsp;&nbsp; INTRODUCCIÓN</div>
    <p class="ie-p">Este documento presenta el Instrumento de Evaluación de Competencia (IEC) correspondiente a la función individual referida por el EC ${NOMBRE_EC}.</p>
    <p class="ie-p">En la que se precisan los desempeños, productos y conocimientos que una persona debe demostrar para ser declarada competente en la realización de la función individual correspondiente.</p>
    <p class="ie-p">La base de la evaluación es la observación del desempeño (guía de observación), se refuerza con productos de su trabajo (lista de cotejo) y conocimientos (cuestionario).</p>
    <p class="ie-p">Este instrumento tiene como objetivo evaluar la competencia de las personas que se desempeñan En servicios auxiliares y contiene las instrucciones para su aplicación. y contiene las instrucciones para su aplicación.</p>
    <p class="ie-p">Asimismo, encontrará la tabla de aplicación que contiene los reactivos, su código, un espacio de registro de cumplimiento (SI/NO) y otro para el registro de las observaciones que como evaluador considere pertinente realizar.</p>
    <p class="ie-p">Posteriormente se presentan las instrucciones para la calificación del IEC, para la cuantificación de los pesos relativos de los reactivos y la emisión del juicio de competencia. Finalmente se proporciona el espacio para consignar el juicio de competencia que se le debe informar al candidato.</p>
  </div>
  <div data-b>
    <p class="ie-p">El IEC contempla la evaluación de un total de 142 reactivos, de los cuales:</p>
    <ul class="ie-l pto">
      <li>69 tienen asignado un Peso Menor (0.29 c/u);</li>
      <li>51 tienen asignado un Peso Medio ( 0.59 c/u);</li>
      <li>17 tienen asignado un Peso Mayor ( 2.94 c/u), y;</li>
      <li>5 corresponden a Actitudes/Hábitos/Valores, los cuales se evaluarán de manera negativa, es decir, sólo en el caso de que no se cumplan deberá de restarse el peso asignado en cada caso (3 de peso menor 0.29, 2 de peso medio 0.59).</li>
      <li>El peso total de los reactivos del IEC es de 100.08 puntos, el excedente de 100 se origina por el uso de decimales en cada reactivo.</li>
    </ul>
  </div>
  <div data-b>
    <p class="ie-p">Dichos reactivos se agrupan en:</p>
    <ul class="ie-l pto">
      <li>4 Guía(s) de Observación, que se aplicará(n) durante las situaciones reales o simuladas de evaluación indicadas en el EC, y que suman un total de 84 reactivos,</li>
      <li>4 Lista(s) de Cotejo, que se aplicará(n) para determinar si el candidato a evaluación cumple con los requisitos de calidad de los productos establecidos en el EC referidos en 50 reactivos y</li>
      <li>2 Cuestionario(s) que se aplicará(n) para evaluar los conocimientos referidos en el EC, que consta(n) de 8 reactivos.</li>
    </ul>
  </div>`;
}

function seccionIII() {
  return `<div data-b data-salto>
    <div class="ie-banda">III.&nbsp;&nbsp;&nbsp;&nbsp; INSTRUCCIONES DE APLICACIÓN DEL IEC</div>
    <p class="ie-p"><b>Para el evaluador:</b></p>
    <ol class="ie-l">
      <li>TODOS los reactivos deberán ser evaluados, en ningún caso se debe utilizar “No aplica”</li>
      <li>Es necesario que la aplicación de este instrumento se realice con base en el acuerdo previo del plan de evaluación.</li>
      <li>Antes de aplicar el instrumento de evaluación, verifique el lugar, las condiciones, los apoyos y materiales requeridos para realizar la evaluación.</li>
      <li>Para aplicar este IEC es necesario contar con lo siguiente: Escritorio/mesa para la atención al usuario, sillas, lavabo de manos, mesa de apoyo para herramientas y materiales, banco de altura, archivero/computadora, monitor de presión arterial, oxímetro, termómetro digital y perchero. Áreas de recepción y de atención.</li>
      <li>Al interactuar con el candidato, solicítele que actúe de forma natural y evite interrumpir en lo posible, observando la forma de realizar el trabajo y anotando lo especificado en este IEC.</li>
      <li>En el caso de que se identifique que el candidato incurre en una acción que ponga en riesgo a su persona, a terceros o al equipo/maquinaria el evaluador debe detenerlo inmediatamente, advertir del riesgo y una vez que el riesgo ya no es latente, deberá registrarlo en el IEC y continuar el proceso de evaluación.</li>
      <li>Para que el candidato pueda evidenciar su desempeño, deberá contar con situaciones de evaluación real o simulada con la finalidad de cubrir todos los contenidos presentes en el EC.</li>
      <li>Para evaluar los productos presentados por el candidato, verifique que cada uno de ellos presente y cumpla con las características definidas en el presente IEC.</li>
      <li>Observe cuidadosamente la ejecución de las actividades que se enuncian y seleccione la columna correspondiente (Si/No), cuando el candidato cumpla o no, con el desempeño o las evidencias solicitadas</li>
      <li>En caso de no ser suficiente el espacio para registrar las observaciones en la tabla de aplicación, considere el Anexo 1 para el registro de las mismas.</li>
      <li>Considere que la evaluación de los reactivos de conocimiento se puede realizar de dos formas:
        <ol class="ie-l sub"><li>De forma verbal, para lo cual deberá registrar las respuestas que le dé el candidato en el cuestionario integrado en el IEC.</li>
          <li>De forma escrita, para lo cual deberá entregar al candidato el cuestionario y solicitarle que lo resuelva de acuerdo con las instrucciones especificadas en el mismo.</li></ol></li>
      <li>Al término de la aplicación del cuestionario revise que todos los reactivos de conocimiento hayan sido contestados por el candidato o de lo contrario cancele los espacios en blanco.</li>
      <li>El anexo 2 es de uso exclusivo del evaluador ya que contiene las respuestas a los reactivos del cuestionario, así como los correspondientes a respuestas ante situaciones emergentes</li>
    </ol>
  </div>
  <div data-b>
    <p class="ie-p"><b>Para la calificación del IEC:</b></p>
    <ol class="ie-l">
      <li>Asigne “0”, a cada reactivo que no haya sido cumplido por el candidato.</li>
      <li>Asigne el puntaje de acuerdo a la ponderación correspondiente a cada reactivo que haya sido cumplido por el candidato.</li>
      <li>Asigne peso “0” cuando se trate del cumplimiento de los reactivos correspondientes a “Actitudes/ Hábitos/ Valores”, en caso contrario, considere el puntaje correspondiente con valor negativo.</li>
      <li>Para la calificación de los reactivos de conocimiento, utilice el Anexo 2 del presente IEC.</li>
    </ol>
  </div>`;
}

/* ── IV. Los 10 instrumentos, en el orden y con la cobertura del oficial ── */
const INTRO = {
  cotejo: `Instrucciones para el evaluador: Marque con una ${PALOMITA} en la columna SI, cuando el candidato muestre las evidencias correspondientes y en la columna NO cuando no muestre los productos señalados.`,
  guia: `Instrucciones para el evaluador: Observe cuidadosamente la ejecución de las actividades que se enuncian y marque con una ${PALOMITA} en la columna SI cuando el candidato cumpla con el desempeño correspondiente y en la columna NO cuando no realice las actividades señaladas.`,
  ahv: `Se debe poner especial atención a los reactivos correspondientes a “Actitudes/Hábitos/Valores”, para asignar peso “0” cuando el candidato lo cumpla, en caso contrario, considere el puntaje correspondiente con valor negativo.`,
  cuest: `Instrucciones para el evaluador: Realice la evaluación de los siguientes reactivos, en forma verbal y registre las respuestas del candidato en los reactivos correspondientes. Si lo aplica de forma escrita, deberá entregar al candidato solo el cuestionario para que lo resuelva.<br> Marque con una ${PALOMITA} en la columna SI, cuando el candidato responda correctamente el reactivo y en la columna NO cuando su repuesta no sea la indicada en el Anexo 2 del presente IEC.`,
};
export const INSTRUMENTOS_IEC = [
  { tipo: 'cotejo', titulo: 'Lista de Cotejo 1', de: 1, a: 15 },
  { tipo: 'guia', titulo: 'Guía de Observación 1', de: 16, a: 21 },
  { tipo: 'guia', titulo: 'Guía de Observación 2', de: 22, a: 64, ahv: true },
  { tipo: 'guia', titulo: 'Guía de Observación 3', de: 65, a: 83 },
  { tipo: 'guia', titulo: 'Guía de Observación 4', de: 84, a: 99 },
  { tipo: 'cotejo', titulo: 'Lista de Cotejo 2', de: 100, a: 111 },
  { tipo: 'cotejo', titulo: 'Lista de Cotejo 3', de: 112, a: 124 },
  { tipo: 'cotejo', titulo: 'Lista de Cotejo 4', de: 125, a: 134 },
  { tipo: 'cuest', titulo: 'Cuestionario 1', de: 135, a: 137 },
  { tipo: 'cuest', titulo: 'Cuestionario 2', de: 138, a: 142 },
];
/* Título en banda oscura + caja de instrucciones; «data-junto» los mantiene
   en la misma página que el primer renglón de su tabla. */
const cabezaInstrumento = i => `<div data-b data-junto><div class="ie-tit">${esc(i.titulo)}:</div>
  <div class="ie-inst">${INTRO[i.tipo]}${i.ahv ? '<br>' + INTRO.ahv : ''}</div></div>`;

const ENC_TABLA = `<thead><tr><th style="width:23mm">Código del Reactivo</th><th>Reactivo</th><th style="width:9mm">Sí</th><th style="width:9mm">No</th><th style="width:16mm">Peso</th><th style="width:34mm">OBSERVACIONES</th></tr></thead>`;

/* Tabla de reactivos (se parte entre páginas repitiendo el encabezado) */
function tablaReactivos(lista, resp, obs) {
  let grupo = '';
  const filas = lista.map(r => {
    const g = r.grupo && r.grupo !== grupo ? `<tr class="gr"><td class="cod"></td><td colspan="4">${esc(r.grupo)}</td><td class="ob"></td></tr>` : '';
    grupo = r.grupo;
    const v = resp[r.n];
    const p = r.tipo === 'AHV' ? `0<br>(-${peso(r.peso)})` : peso(r.peso);
    return g + `<tr><td class="cod">${esc(r.cod)}</td><td>${esc(r.texto)}</td><td class="sn">${v === 'si' ? '✓' : ''}</td><td class="sn">${v === 'no' ? '✓' : ''}</td><td class="ps">${p}</td><td class="ob">${esc(obs[r.n] || '')}</td></tr>`;
  }).join('');
  return `<table class="ie-t" data-tabla>${ENC_TABLA}<tbody>${filas}</tbody></table>`;
}

/* ── Figuras del cuestionario (dibujos propios, genéricos) ───────────── */
function figuraCuadrantes(leyenda) {
  const celdas = [[4, 1, 5], [6, 2, 7], [8, 3, 9]];
  const x0 = 30, y0 = 34, w = 30, h = 28;
  return `<div class="ie-fig" data-fig="cuadrantes"><svg width="150" height="150" viewBox="0 0 150 150" aria-label="Cuadrantes abdominales">
      <path d="M40 6 Q75 0 110 6 L122 40 Q128 90 118 130 Q75 146 32 130 Q22 90 28 40 Z" fill="#f4f4f4" stroke="#000" stroke-width="1.2"/>
      ${celdas.map((f, i) => f.map((n, j) => `<rect x="${x0 + j * w}" y="${y0 + i * h}" width="${w}" height="${h}" fill="none" stroke="#000" stroke-width=".8"/>
        <text x="${x0 + j * w + w / 2}" y="${y0 + i * h + h / 2 + 4}" font-size="11" text-anchor="middle" font-family="Arial">${n}</text>`).join('')).join('')}
    </svg><div><b>Cuadrantes abdominales</b><ol style="list-style:none">${leyenda.map(l => `<li>${esc(l)}</li>`).join('')}</ol></div></div>`;
}
/* Figura humana de frente: eje vertical A (rótulo a los pies) y dos ejes que
   se cruzan a la altura de la pelvis, B (derecha) y C (izquierda). */
function figuraEjes() {
  return `<div class="ie-fig" data-fig="ejes_cuerpo"><svg width="140" height="190" viewBox="0 0 140 190" aria-label="Ejes del cuerpo">
      <g fill="#f4f4f4" stroke="#000" stroke-width="1.1">
        <circle cx="70" cy="20" r="12"/>
        <path d="M58 36 Q70 32 82 36 L96 44 L106 92 L99 94 L88 56 L86 96 L90 170 L78 172 L71 108 L69 108 L62 172 L50 170 L54 96 L52 56 L41 94 L34 92 L44 44 Z"/>
      </g>
      <g stroke="#000" stroke-width="1.3" fill="none">
        <line x1="70" y1="2" x2="70" y2="178" stroke-dasharray="4 3"/>
        <line x1="22" y1="112" x2="118" y2="88"/>
        <line x1="22" y1="88" x2="118" y2="112"/>
      </g>
      <g font-family="Arial" font-size="13" font-weight="bold"><text x="64" y="189">A</text><text x="122" y="92">B</text><text x="8" y="92">C</text></g>
    </svg></div>`;
}
export const figura = img => !img ? '' : img.tipo === 'ejes_cuerpo' ? figuraEjes() : figuraCuadrantes(img.leyenda || []);

/* Letras de la respuesta del candidato, una por renglón de la izquierda */
const letrasPorRenglon = (q, v) => {
  if (!v) return [];
  if (q.correcta[0]?.letras) return String(v).split('|').map(g => g.split(',').map(x => x.trim()).filter(Boolean).join(', '));
  return String(v).split(',').map(x => x.trim());
};
/* Etiqueta tal como se imprime; si trae «( )», ahí va la letra elegida */
const etiquetaCon = (et, letra) => esc(et).replace(/\(\s*\)/, () => `(<span class="par">${letra ? ' ' + esc(letra) + ' ' : '&nbsp; &nbsp;'}</span>)`);

function pregunta(q, cuest, g) {
  const v = normalizarRespuesta(q, cuest[q.n]);
  /* 136: el enunciado ES la instrucción del grupo y ya va impreso arriba */
  const stem = q.pregunta === g.instruccion ? '' : `<p class="st">${etiquetaCon(q.etiqueta || '', q.tipo === 'relacionar_columnas' ? '' : v)}${esc(q.pregunta)}</p>`;
  if (q.tipo === 'relacionar_columnas') {
    const l = letrasPorRenglon(q, v);
    const izq = q.izquierda.map((t, i) => `<div>(<span class="par">${l[i] ? ' ' + esc(l[i]) + ' ' : '&nbsp; &nbsp; &nbsp;'}</span>) ${esc(String(t).replace(/^\(\s*\)\s*/, ''))}</div>`).join('');
    return `<div class="ie-q" data-b data-q="${q.n}">${stem}${figura(q.imagen)}
      <div class="ie-rel"><div class="iz">${izq}</div><div class="de">${q.opciones.map(o => `<div>${esc(o)}</div>`).join('')}</div></div></div>`;
  }
  const op = q.opciones.map(o => { const eleg = v && String(o).trim().startsWith(v); return `<div${eleg ? ' class="eleg"' : ''}>${esc(o) || '&nbsp;'}</div>`; });
  return `<div class="ie-q" data-b data-q="${q.n}">${stem}${figura(q.imagen)}<div class="op">${op.join('')}</div></div>`;
}

function cuestionario(num, resp, obs, cuest) {
  return GRUPOS_CUESTIONARIO.filter(g => g.cuestionario === num).map(g => {
    const v = resp[g.reactivo];
    const tabla = `<table class="ie-t" data-b data-junto>${ENC_TABLA}
      <tbody><tr><td class="cod">${esc(g.cod)}</td><td>${esc(g.tema)}${g.subtemas.length ? '<br>' + g.subtemas.map(esc).join('<br>') : ''}</td>
      <td class="sn">${v === 'si' ? '✓' : ''}</td><td class="sn">${v === 'no' ? '✓' : ''}</td><td class="ps">${peso(g.peso)}</td><td class="ob">${esc(obs[g.reactivo] || '')}</td></tr></tbody></table>`;
    return tabla + `<p class="ie-p" data-b data-junto>${esc(g.instruccion)}</p>`
      + CUESTIONARIO.filter(q => q.reactivo === g.reactivo).map(q => pregunta(q, cuest, g)).join('');
  }).join('');
}

function seccionIV(resp, obs, cuest) {
  const orden = [...REACTIVOS].sort((a, b) => a.n - b.n);
  return `<div class="ie-banda" data-b data-salto data-junto>IV.&nbsp;&nbsp;&nbsp;&nbsp; TABLA DE APLICACIÓN DEL IEC</div>`
    + INSTRUMENTOS_IEC.map(i => cabezaInstrumento(i) + (i.tipo === 'cuest'
      ? cuestionario(i.titulo.endsWith('1') ? 1 : 2, resp, obs, cuest)
      : tablaReactivos(orden.filter(r => r.n >= i.de && r.n <= i.a), resp, obs))).join('');
}

function seccionVyVI(c) {
  const comp = c.completo && c.juicio === 'COMPETENTE', noComp = c.completo && c.juicio !== 'COMPETENTE';
  return `<div data-b data-salto>
    <div class="ie-banda">V .&nbsp;&nbsp;&nbsp;&nbsp; INSTRUCCIONES PARA LA CUANTIFICACIÓN DE LOS PESOS RELATIVOS DE LOS REACTIVOS</div>
    <table class="ie-v" style="width:100%">
      <tr><td>1. Indique el peso obtenido de los reactivos cumplidos en el IEC (todos los “SI”):</td><td class="val">${peso(c.puntos)}</td></tr>
      <tr><td>2. Indique el peso total de los reactivos correspondientes a Actitudes/Hábitos/Valores que no se presentaron (el valor negativo):</td><td class="val">${peso(c.penalizacion)}</td></tr>
      <tr><td>3. Reste al peso total obtenido de los reactivos cumplidos (resultado del punto 1), el correspondiente a los reactivos de Actitudes/Hábitos/Valores que no se presentaron (resultado del punto 2):</td><td class="val">${peso(c.total)}</td></tr>
    </table>
    <div class="ie-banda" style="margin-top:5mm">VI.&nbsp;&nbsp;&nbsp;&nbsp; JUICIO DE COMPETENCIA</div>
    <p class="ie-p">EMISIÓN DEL JUICIO DE COMPETENCIA. De acuerdo con el resultado obtenido durante la evaluación del candidato y en la cuantificación de los pesos relativos de los reactivos, identifique en cuál de los siguientes dos supuestos se ubica el candidato:</p>
    <p class="ie-p">Se considera como un CANDIDATO COMPETENTE cuando <i>cumple con los siguientes dos criterios (indispensable que haya cumplido con los dos):</i></p>
    <ul class="ie-l pto"><li>La suma total del peso relativo a los reactivos del IEC que le fue aplicado es igual o mayor a: <b><u>${peso(c.umbral)}</u></b></li>
      <li>Existe al menos un reactivo cumplido para cada Criterio de Evaluación.</li></ul>
    <p class="ie-p">Se considera como un CANDIDATO TODAVÍA NO COMPETENTE cuando <i>presenta cualquiera o todos de los siguientes criterios:</i></p>
    <ul class="ie-l pto"><li>La suma total del peso relativo de los reactivos del IEC que le fue aplicado se encuentra dentro del rango de: <b><u>0 a ${peso(c.umbral - 0.01)}</u></b></li>
      <li>No existe al menos un reactivo cumplido para todos y cada uno de los Criterios de Evaluación.</li></ul>
    <p class="ie-p" style="text-align:center;margin-top:4mm"><u>Marque el Juicio de Competencia correspondiente</u></p>
    <div class="ie-juicio"><span><b>${comp ? 'X' : '&nbsp;'}</b>COMPETENTE</span><span><b>${noComp ? 'X' : '&nbsp;'}</b>TODAVÍA NO COMPETENTE</span></div>
  </div>`;
}

/* Anexo 1: observaciones del evaluador. Las que el evaluador escribió van
   aquí también, con su código, para que no dependan del ancho de la celda. */
function anexo1(obs) {
  const cods = Object.fromEntries(REACTIVOS.map(r => [r.n, r.cod]));
  GRUPOS_CUESTIONARIO.forEach(g => { cods[g.reactivo] = g.cod; });
  const filas = Object.entries(obs).filter(([, t]) => String(t || '').trim()).sort((a, b) => a[0] - b[0])
    .map(([n, t]) => `<tr><td>${esc(cods[n] || n)}</td><td>${esc(t)}</td></tr>`).join('');
  return `<div data-b data-salto data-anexo1><div class="ie-banda">ANEXO 1. OBSERVACIONES DEL EVALUADOR</div>
    <div class="ie-inst">En caso de ser necesario, utilice el siguiente espacio para el registro de sus observaciones.</div>
    <table class="ie-a1"><thead><tr><th style="width:25%">Código del Reactivo</th><th>OBSERVACIONES</th></tr></thead>
      <tbody>${filas}<tr><td style="height:${filas ? 60 : 145}mm"></td><td></td></tr></tbody></table></div>`;
}

/* Anexo 2: la celda del código abarca todas las filas de su reactivo (se
   dibuja sin bordes internos para que sobreviva al partir la tabla); las
   preguntas van en el orden del cuestionario y con su misma etiqueta. */
const corchete = c => `[${c.letras ? c.letras.join(', ') : c.letra}]`;
function anexo2() {
  const filas = GRUPOS_CUESTIONARIO.map(g => {
    let primera = true;
    const cod = () => { const h = primera ? `<td class="cod rs ini">${esc(g.cod)}</td>` : '<td class="cod rs"></td>'; primera = false; return h; };
    const tema = `<tr class="gr">${cod()}<td colspan="2">${esc(g.tema)}${g.subtemas.length ? '<br>' + g.subtemas.map(esc).join('<br>') : ''}</td></tr>`;
    return tema + CUESTIONARIO.filter(q => q.reactivo === g.reactivo).map(q => {
      const enunciado = `${esc(q.etiqueta || '')}${esc(q.pregunta)}`;
      if (q.tipo !== 'relacionar_columnas') return `<tr>${cod()}<td>${enunciado}</td><td class="res">${esc(q.correcta)}</td></tr>`;
      return `<tr>${cod()}<td colspan="2">${enunciado}</td></tr>` + q.correcta.map(c =>
        `<tr>${cod()}<td>${esc(String(c.item).replace(/^\(\s*\)\s*/, ''))}</td><td class="res">${esc(corchete(c))}</td></tr>`).join('');
    }).join('');
  }).join('');
  return `<div data-b data-salto data-junto><div class="ie-banda">ANEXO 2. RESPUESTAS A LOS REACTIVOS DE CONOCIMIENTO</div>
    <div class="ie-inst">Utilice la siguiente tabla de respuestas para la calificación de los reactivos correspondientes a la evaluación de conocimientos cuando aplique.</div></div>
    <table class="ie-t a2" data-tabla><thead><tr><th style="width:23mm">Código del Reactivo</th><th>Reactivo</th><th style="width:34mm">Respuesta Correcta</th></tr></thead><tbody>${filas}</tbody></table>`;
}

/* Plantilla de página: encabezado del CONOCER, cuerpo y firmas al pie
   (candidato a la izquierda, evaluador a la derecha). En la primera página
   el paginador agrega .primera: se ve el nombre y dice «NOMBRE Y FIRMA». */
function plantilla({ evaluador, candidato, firmaEval, firmaCand }) {
  const logo = CONFIG.centroEvaluacion?.logos?.izq;
  const lado = (quien, nombre, firma) => `<div><div class="rub"><div class="f">${firmaHtml(firma, 50)}</div><div class="n">${esc(nombre)}</div></div>
      <div class="nom"><span class="p1">NOMBRE Y </span>FIRMA DEL ${quien}</div>`;
  return `<template id="iecPlantilla"><section class="pag-iec">
    <div class="ie-enc"><div class="logo">${logo ? `<img src="${abs(logo)}" alt="CONOCER">` : '<b>CONOCER</b>'}</div>
      <div class="tit">INSTRUMENTO DE EVALUACIÓN DE COMPETENCIA<br><span class="pg">Página &nbsp; de &nbsp;</span></div></div>
    <div class="ie-cuerpo"></div>
    <div class="ie-pie">
      ${lado('CANDIDATO', candidato, firmaCand)}<div class="fmt">Formato de Instrumento de Evaluación de Competencia<br>N-FO-03</div></div>
      ${lado('EVALUADOR', evaluador, firmaEval)}<div class="fmt" style="text-align:right">Versión<br>2.0</div></div>
    </div></section></template>`;
}

/* Paginador: corre dentro del documento abierto. Vacía los bloques del
   #iecFuente en páginas; las tablas [data-tabla] se parten por renglón, un
   renglón de grupo nunca se queda solo al final y los bloques [data-junto]
   (títulos, instrucciones) se van a la página siguiente con lo que les sigue. */
const PAGINADOR = `<script>
(function () {
  function paginar() {
    var fuente = document.getElementById('iecFuente'), tpl = document.getElementById('iecPlantilla');
    if (!fuente || !tpl) return;
    var pags = [], cuerpo = null;
    function nueva() { var p = tpl.content.firstElementChild.cloneNode(true); fuente.parentNode.insertBefore(p, fuente); pags.push(p); cuerpo = p.querySelector('.ie-cuerpo'); }
    function llena() { return cuerpo.scrollHeight > cuerpo.clientHeight + 1; }
    /* Los [data-junto] que quedaron justo antes de «el» en esta página */
    function pegados(el) {
      var j = [], x = el.previousElementSibling;
      while (x && x.hasAttribute('data-junto')) { j.unshift(x); x = x.previousElementSibling; }
      return x ? j : [];
    }
    function mudar(el) { var j = pegados(el); nueva(); j.forEach(function (x) { cuerpo.appendChild(x); }); cuerpo.appendChild(el); }
    nueva();
    Array.prototype.slice.call(fuente.children).forEach(function (b) {
      if (b.hasAttribute('data-salto') && cuerpo.children.length) nueva();
      if (b.hasAttribute('data-tabla')) {
        var filas = Array.prototype.slice.call(b.tBodies[0].rows);
        var cascaron = function () { var t = b.cloneNode(false); t.appendChild(b.tHead.cloneNode(true)); t.appendChild(document.createElement('tbody')); return t; };
        var t = cascaron(); cuerpo.appendChild(t);
        filas.forEach(function (f) {
          t.tBodies[0].appendChild(f);
          if (!llena()) return;
          var tb = t.tBodies[0], mover = [f];
          var prev = f.previousElementSibling;
          if (prev && prev.classList.contains('gr')) mover.unshift(prev);
          if (tb.rows.length === mover.length) { if (cuerpo.children.length === 1) return; mudar(t); }
          else { nueva(); t = cascaron(); cuerpo.appendChild(t); }
          mover.forEach(function (m) { t.tBodies[0].appendChild(m); });
        });
        return;
      }
      cuerpo.appendChild(b);
      if (llena() && cuerpo.children.length > 1) mudar(b);
    });
    pags.forEach(function (p, i) { p.querySelector('.pg').textContent = 'Página ' + (i + 1) + ' de ' + pags.length; });
    if (pags[0]) pags[0].classList.add('primera');
    fuente.remove();
    document.documentElement.setAttribute('data-iec-paginas', pags.length);
  }
  if (document.readyState === 'complete') paginar(); else window.addEventListener('load', paginar);
})();
<\/script>`;

/* Documento del IEC completo (fragmento para meter en el portafolio o en
   un documento suelto con envolverOficial). */
export function htmlIecOficial(ev = {}, { candidato = '', evaluador = '' } = {}) {
  const d = ev.iec || {}, resp = d.respuestas || {}, obs = d.observaciones || {}, cuest = d.cuestionario || {};
  const c = calificarIec(resp);
  return `<style>${estilosIec()}</style>
  ${plantilla({ evaluador, candidato, firmaEval: ev.firmas?.iec, firmaCand: ev.firma_candidato })}
  <div id="iecFuente">
    ${seccionI({ evaluador, candidato, fecha: d.fecha })}
    ${seccionII()}
    ${seccionIII()}
    ${seccionIV(resp, obs, cuest)}
    ${seccionVyVI(c)}
    ${anexo1(obs)}
    ${anexo2()}
  </div>${PAGINADOR}`;
}

export { correctaTexto };
