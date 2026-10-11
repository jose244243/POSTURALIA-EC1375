/* POSTURALIA · data-guion-impreso.js — v60
   El Guion Maestro de Sesión tal como lo imprime Paideia (19 secciones,
   ACCIÓN / diálogo / usuario / nota / listas / casillas, y la «Lista de
   control antes de terminar»). Solo lo usa la versión para imprimir o
   guardar en PDF de guion-maestro.html, para que la hoja salga igual. */
export const GUION_IMPRESO = [
 {num:1,titulo:"Preparación del espacio",items:[
  {t:"accion",x:"Acondicionar el área antes de recibir al usuario."},
  {t:"checklist",x:["Disponer de material, herramientas, mobiliario y equipo suficientes.","Mantener espacio suficiente para el desplazamiento libre y la distancia entre usuario y prestador.","Contar con archivero o medio digital para resguardar la documentación.","Mantener el área ventilada y sin corrientes de aire.","Contar con energía eléctrica e iluminación natural.","Verificar colores claros en paredes y techo.","Disponer depósitos para basura orgánica e inorgánica.","Disponer el depósito correspondiente para residuos peligrosos biológico-infecciosos.","Contar con un lugar específico para las pertenencias del usuario.","Verificar que herramientas y materiales estén limpios, desinfectados/sanitizados, protegidos y en condiciones de uso."]},
  {t:"subtitulo",x:"Equipo y materiales a tener disponibles"},
  {t:"lista",x:["Escritorio o mesa para atención y sillas.","Lavabo de manos.","Mesa de apoyo para herramientas y materiales.","Banco de altura.","Báscula.","Estadímetro.","Baumanómetro o monitor de presión arterial de brazo.","Oxímetro.","Termómetro digital.","Tapete sanitizante.","Archivero o computadora.","Música ambiental para relajación.","Perchero."]},
  {t:"subtitulo",x:"Protocolo sanitario"},
  {t:"checklist",x:["Lavarse las manos conforme al protocolo señalado en el estándar.","Colocarse cubrebocas quirúrgico de triple capa.","Verificar tapete sanitizante con solución desinfectante en el ingreso.","Disponer gel antibacterial en el ingreso.","Tener disponible el termómetro digital."]}]},
 {num:2,titulo:"Recepción del usuario",items:[
  {t:"dialogo",x:"Buenos días. Bienvenido."},
  {t:"accion",x:"Aplicar gel antibacterial en las manos del usuario."},
  {t:"dialogo",x:"Antes de pasar, voy a tomarle la temperatura."},
  {t:"accion",x:"Tomar la temperatura con termómetro digital."},
  {t:"dialogo",x:"Mi nombre es [NOMBRE COMPLETO] y mi función es [FUNCIÓN]. Muchas gracias por acompañarnos el día de hoy. ¿Me puede proporcionar su nombre completo, por favor?"},
  {t:"usuario",x:"[NOMBRE COMPLETO]."},
  {t:"dialogo",x:"Muchas gracias, [NOMBRE]. Por favor, acompáñeme al área de recepción."},
  {t:"accion",x:"Conducirlo a recepción/antesala y ofrecer un lugar cómodo previamente sanitizado."},
  {t:"dialogo",x:"Puede tomar asiento aquí, por favor. El lugar ha sido previamente sanitizado."}]},
 {num:3,titulo:"Explicación inicial y documentación",items:[
  {t:"dialogo",x:"Antes de comenzar quiero explicarle cómo vamos a llevar a cabo su atención."},
  {t:"dialogo",x:"Los servicios auxiliares tradicionales y complementarios tienen como objetivo contribuir a la recuperación de las condiciones físicas y socioemocionales de las personas."},
  {t:"dialogo",x:"La información que usted nos proporcione será manejada bajo principios de discreción y confidencialidad. Sus datos personales están protegidos conforme a la Ley Federal de Protección de Datos Personales en Posesión de Particulares."},
  {t:"dialogo",x:"Vamos a integrar su ficha de registro de atención de condiciones físicas y socioemocionales."},
  {t:"dialogo",x:"Posteriormente realizaremos una exploración física y tomaremos sus signos vitales. Para realizar estos procedimientos necesitaremos previamente su autorización mediante la firma correspondiente en su ficha de registro."},
  {t:"dialogo",x:"¿Hasta este momento tiene alguna duda?"},
  {t:"usuario",x:"No."},
  {t:"dialogo",x:"Perfecto. Si durante el proceso surge cualquier duda, puede comentármela."}]},
 {num:4,titulo:"Aviso de privacidad e identificación",items:[
  {t:"accion",x:"Presentar/comentar el Aviso de Privacidad."},
  {t:"dialogo",x:"Este es nuestro Aviso de Privacidad. Una vez que ha sido informado sobre el manejo de sus datos personales, necesito su firma de enterado, por favor."},
  {t:"accion",x:"Recabar firma."},
  {t:"dialogo",x:"Ahora necesito corroborar su nombre completo con una identificación oficial vigente, por favor."},
  {t:"accion",x:"Revisar identificación y corroborar nombre."}]},
 {num:5,titulo:"Ficha de registro",items:[
  {t:"dialogo",x:"Vamos a completar su ficha de registro. Le voy a solicitar algunos datos y antecedentes necesarios para su atención."},
  {t:"accion",x:"Recabar la información de manera verbal y presencial."},
  {t:"lista",x:["Fecha, folio, nombre completo, edad, fecha de nacimiento y dirección.","Peso y estatura.","Datos del médico tratante/profesional de la salud.","Antecedentes físicos, fisiológicos, socioemocionales y heredofamiliares.","Enfermedades crónicas, degenerativas y alergias.","Información toxicológica.","Hábitos personales, sueño, alimentación, higiene y actividad física/deportiva.","Consumo de sustancias farmacológicas y/o adictivas.","Interés, necesidad o malestar por el que solicita el servicio.","Diagnóstico emitido por médico tratante/profesional de la salud, cuando corresponda."]},
  {t:"subtitulo",x:"Preguntas naturales de ejemplo"},
  {t:"dialogo",x:"¿Actualmente lo atiende algún médico o profesional de la salud?"},
  {t:"dialogo",x:"¿Tiene algún antecedente físico o alguna condición que considere importante mencionar?"},
  {t:"dialogo",x:"¿Existen enfermedades importantes dentro de sus antecedentes familiares?"},
  {t:"dialogo",x:"¿Padece alguna enfermedad crónica o degenerativa?"},
  {t:"dialogo",x:"¿Tiene alguna alergia conocida?"},
  {t:"dialogo",x:"Cuénteme un poco sobre sus hábitos de alimentación y sueño."},
  {t:"dialogo",x:"¿Realiza alguna actividad física?"},
  {t:"dialogo",x:"¿Consume actualmente algún medicamento o alguna otra sustancia que debamos registrar?"},
  {t:"dialogo",x:"¿Cuál es el motivo principal por el que solicita la atención el día de hoy?"},
  {t:"accion",x:"Registrar las respuestas."},
  {t:"dialogo",x:"Quiero señalarle también que los servicios tradicionales y complementarios que ofrecemos no cubren ni sustituyen las indicaciones de su médico tratante o profesional de la salud."},
  {t:"dialogo",x:"Muchas gracias por proporcionarme esta información."}]},
 {num:6,titulo:"Peso y estatura",items:[
  {t:"nota",x:"El EC1375 incluye báscula y estadímetro dentro del equipo mínimo y exige peso y estatura en la documentación, aunque no describe un protocolo específico de medición."},
  {t:"dialogo",x:"Ahora voy a registrar su peso y estatura como parte de sus datos."},
  {t:"accion",x:"Utilizar la báscula y registrar el peso."},
  {t:"accion",x:"Utilizar el estadímetro y registrar la estatura."}]},
 {num:7,titulo:"Saturación de oxígeno y pulso",items:[
  {t:"dialogo",x:"Ahora voy a medir su saturación de oxígeno y su pulso utilizando el oxímetro."},
  {t:"accion",x:"Limpiar la superficie del sensor con paño suave o algodón y solución desinfectante, conforme a las recomendaciones del fabricante."},
  {t:"dialogo",x:"Por favor, coloque el dedo en el sensor de esta manera."},
  {t:"dialogo",x:"Durante la medición le pido permanecer sin movimientos, porque podrían alterar el resultado."},
  {t:"accion",x:"Activar el oxímetro conforme a las instrucciones del fabricante."},
  {t:"dialogo",x:"Tenemos una saturación de oxígeno de [VALOR REAL] y un pulso de [VALOR REAL]."},
  {t:"accion",x:"Registrar SpO2 y pulso en la ficha."}]},
 {num:8,titulo:"Observación postural",items:[
  {t:"dialogo",x:"Ahora realizaré una observación visual de su postura. Le voy a pedir que permanezca en la posición que le indique mientras observo diferentes segmentos de su cuerpo."},
  {t:"accion",x:"Revisar visualmente cabeza, cuello, tórax, extremidades y pelvis."},
  {t:"accion",x:"Registrar los hallazgos en la ficha."},
  {t:"nota",x:"Importante: En esta parte el criterio solicita observación visual y registro; no es necesario inventar un diagnóstico."}]},
 {num:9,titulo:"Frecuencia respiratoria",items:[
  {t:"dialogo",x:"Ahora voy a registrar su frecuencia respiratoria. Por favor permanezca sentado y en reposo."},
  {t:"accion",x:"Contar las elevaciones del tórax y abdomen durante un minuto completo."},
  {t:"accion",x:"Registrar el resultado."}]},
 {num:10,titulo:"Presión arterial",items:[
  {t:"dialogo",x:"A continuación voy a verificar su presión arterial con el monitor de presión arterial de brazo."},
  {t:"dialogo",x:"Le voy a colocar el brazalete y le pediré que adopte la posición indicada para realizar correctamente la medición."},
  {t:"accion",x:"Colocar el brazalete y posicionar al usuario conforme a las indicaciones del fabricante."},
  {t:"dialogo",x:"Manténgase en esta posición, por favor."},
  {t:"accion",x:"Activar el equipo y obtener la lectura."},
  {t:"dialogo",x:"Su presión arterial registrada es [VALOR REAL OBTENIDO]."},
  {t:"accion",x:"Registrar el resultado en la ficha."}]},
 {num:11,titulo:"Verificar que puede recibir la atención",items:[
  {t:"accion",x:"Con la información recabada y la exploración realizada, identificar que no exista impedimento para recibir la atención tradicional y complementaria."},
  {t:"dialogo",x:"Con la información que hemos recabado podemos continuar con la atención programada."},
  {t:"dialogo",x:"Es importante mencionar que su participación y compromiso con las indicaciones forman parte del proceso para buscar un resultado satisfactorio."}]},
 {num:12,titulo:"Explicación de la terapia manual",items:[
  {t:"dialogo",x:"De acuerdo con los hallazgos que encontramos durante la inspección y exploración, el procedimiento que se ha designado para esta sesión consiste en [DESCRIBIR ATENCIÓN]."},
  {t:"dialogo",x:"Esta atención busca [OBJETIVO DE LA SESIÓN]."},
  {t:"dialogo",x:"Entre sus bondades, beneficios o ventajas se encuentran [DESCRIBIR], dentro del alcance propio de este servicio."},
  {t:"dialogo",x:"Durante la atención podría experimentar [SENSACIONES/REACCIONES POSIBLES] y posteriormente podrían presentarse [EFECTOS O SENSACIONES POSTERIORES]."},
  {t:"dialogo",x:"Para realizar la atención se recomienda utilizar [VESTIMENTA RECOMENDADA]."},
  {t:"dialogo",x:"¿Tiene alguna duda o comentario sobre el procedimiento que vamos a realizar?"}]},
 {num:13,titulo:"Consentimiento informado",items:[
  {t:"accion",x:"Presentar el consentimiento antes de iniciar la atención."},
  {t:"dialogo",x:"Antes de comenzar necesito presentarle el documento de consentimiento informado y aceptación del servicio."},
  {t:"dialogo",x:"En este documento se describe la atención que vamos a realizar, las técnicas que se aplicarán, las zonas del cuerpo que podrán ser abordadas, las posibles reacciones físicas, las condiciones de preparación, las limitantes del servicio, el número y duración de las sesiones y los objetivos que buscamos alcanzar."},
  {t:"dialogo",x:"Si está de acuerdo con lo que hemos explicado y no tiene dudas, le solicito su firma de aceptación."},
  {t:"accion",x:"Recabar firma/huella del usuario, firmar quien otorga el servicio e integrar el consentimiento al expediente."}]},
 {num:14,titulo:"Atención tradicional/complementaria",items:[
  {t:"accion",x:"Preparar al usuario conforme a la técnica indicada y realizar la terapia manual programada."},
  {t:"nota",x:"Importante: El EC1375 no especifica una técnica particular de terapia manual ni prescribe maniobras quiroprácticas concretas. La técnica demostrada debe corresponder a lo previamente explicado y consentido."}]},
 {num:15,titulo:"Finalización de la atención",items:[
  {t:"dialogo",x:"Hemos finalizado la atención."},
  {t:"dialogo",x:"Puede permanecer unos momentos sobre la mesa antes de incorporarse."},
  {t:"dialogo",x:"¿Cómo se siente después de la atención que recibió?"},
  {t:"dialogo",x:"¿Tiene alguna duda o quiere comentarme algo sobre lo que acaba de experimentar?"},
  {t:"dialogo",x:"Durante las siguientes veinticuatro horas pueden presentarse [EFECTOS CORRESPONDIENTES A LA TÉCNICA APLICADA]."},
  {t:"dialogo",x:"Ahora le voy a explicar cómo incorporarse."},
  {t:"accion",x:"Explicar y acompañar la incorporación conforme a los protocolos de higiene de columna."},
  {t:"accion",x:"Cuando corresponda, dejar el área para permitir al usuario vestirse."}]},
 {num:16,titulo:"Encuesta de satisfacción",items:[
  {t:"dialogo",x:"Antes de terminar le voy a proporcionar una encuesta de satisfacción."},
  {t:"dialogo",x:"Por favor, lea las indicaciones y registre su opinión respecto al servicio recibido."},
  {t:"accion",x:"Entregar/aplicar la encuesta y recibir comentarios."},
  {t:"dialogo",x:"Muchas gracias por sus comentarios y por su colaboración."}]},
 {num:17,titulo:"Programa de seguimiento",items:[
  {t:"dialogo",x:"Ahora vamos a establecer su programa de seguimiento."},
  {t:"dialogo",x:"El objetivo que buscamos alcanzar en las siguientes sesiones será [OBJETIVO POR SESIÓN]."},
  {t:"dialogo",x:"La propuesta es realizar [NÚMERO DE SESIONES], con una frecuencia de [FRECUENCIA] y una duración aproximada de [DURACIÓN] por sesión."},
  {t:"dialogo",x:"Tengo disponibles [FECHA Y HORARIO] o [FECHA Y HORARIO]. ¿Cuál le resulta más conveniente?"},
  {t:"dialogo",x:"Perfecto. Entonces dejamos programada su próxima atención para [FECHA Y HORA ACORDADAS]."},
  {t:"dialogo",x:"Recuerde también las recomendaciones indicadas para su tratamiento: [RECOMENDACIONES]."},
  {t:"dialogo",x:"Para realizar en casa tendrá las siguientes actividades, tareas o ejercicios: [ACTIVIDADES INDICADAS]."},
  {t:"dialogo",x:"Si posteriormente tiene alguna duda, inquietud o necesita consultar información respecto al servicio recibido, podremos atenderla."},
  {t:"dialogo",x:"¿Quedó alguna duda pendiente que no hayamos resuelto?"}]},
 {num:18,titulo:"Medio de contacto",items:[
  {t:"dialogo",x:"Para darle seguimiento, ¿cuál es el medio de contacto que le resulta más conveniente: teléfono, celular, correo electrónico o alguna plataforma digital?"},
  {t:"accion",x:"Registrar el medio de contacto."},
  {t:"dialogo",x:"Le proporciono también los datos de nuestro Centro de Atención Tradicional y Complementaria y nuestro medio de atención telefónica para cualquier duda relacionada con su servicio."}]},
 {num:19,titulo:"Cierre y despedida",items:[
  {t:"subtitulo",x:"Verificar el Plan de Seguimiento"},
  {t:"lista",x:["Fechas y horarios.","Medio de contacto.","Número de sesiones, frecuencia y duración.","Plan de sesión.","Nombre y firma/huella del usuario y de quien otorga el servicio."]},
  {t:"subtitulo",x:"Verificar el Plan de Sesión"},
  {t:"lista",x:["Número de sesión, fecha, hora de inicio y término.","Registro de signos vitales.","Actividades/intervenciones/atención.","Notas de evolución.","Pronóstico del número de sesiones.","Actividades, tareas o ejercicios para casa."]},
  {t:"dialogo",x:"Con esto concluimos su atención del día de hoy. Muchas gracias por su asistencia, por su disposición y por la confianza."},
  {t:"dialogo",x:"Nos vemos en su próxima sesión el [FECHA] a las [HORA]. Que tenga un excelente día."}]},
];

export const CHECKLIST_IMPRESO = ["Preparación y condiciones del espacio","Lavado de manos","Cubrebocas quirúrgico de triple capa","Tapete sanitizante","Gel antibacterial","Termómetro digital","Recepción cordial","Presentación con nombre completo y función","Nombre completo del usuario","Asiento previamente sanitizado","Explicación inicial del servicio","Discreción y confidencialidad","Protección de datos personales","Aviso de Privacidad y firma de enterado","Identificación oficial vigente","Ficha de registro","Autorización para exploración y signos vitales","Peso","Estatura","Oxímetro: SpO2 y pulso","Limpieza del sensor del oxímetro","Observación de cabeza, cuello, tórax, extremidades y pelvis","Frecuencia respiratoria durante un minuto","Presión arterial","Registro de las mediciones","Verificación de que no exista impedimento","Explicación de la técnica","Beneficios/bondades/ventajas y alcance","Posibles reacciones, sensaciones y efectos","Objetivo","Vestimenta recomendada","Resolución de dudas","Consentimiento informado antes del servicio","Firma de aceptación","Atención tradicional/complementaria","Aviso de finalización","Preguntar cómo se siente","Resolver dudas posteriores","Explicar efectos dentro de las siguientes 24 horas","Incorporación conforme a higiene de columna","Privacidad para vestirse","Encuesta de satisfacción","Comentarios del usuario","Programa de seguimiento","Objetivos por sesión","Propuesta y acuerdo de fechas y horarios","Recomendaciones","Actividades/tareas/ejercicios para casa","Medio de contacto","Datos del Centro de Atención","Confirmación de dudas resueltas","Agradecimiento y despedida"];

/* HTML para imprimir: el mismo marcado y estilo de impresión que Paideia */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const casilla = t => `<div class="gi-chk"><span class="gi-box"></span><span>${esc(t)}</span></div>`;
function item(i) {
  if (i.t === 'accion') return `<div class="gi-accion"><span class="gi-tag">ACCIÓN</span><span>${esc(i.x)}</span></div>`;
  if (i.t === 'dialogo') return `<div class="gi-dialogo">"${esc(i.x)}"</div>`;
  if (i.t === 'usuario') return `<div class="gi-dialogo gi-usuario">USUARIO: "${esc(i.x)}"</div>`;
  if (i.t === 'nota') return `<div class="gi-nota">💡 ${esc(i.x)}</div>`;
  if (i.t === 'subtitulo') return `<div class="gi-sub">${esc(i.x)}</div>`;
  if (i.t === 'lista') return `<ul class="gi-lista">${i.x.map(l => `<li>${esc(l)}</li>`).join('')}</ul>`;
  if (i.t === 'checklist') return `<div class="gi-mini">${i.x.map(casilla).join('')}</div>`;
  return '';
}
export function guionImpresoHtml() {
  return `<h1 class="gi-titulo">Guion Maestro de Sesión</h1>
  <p class="gi-desc"><strong>Objetivo:</strong> guiarte para cubrir todos los criterios que evalúa el estándar durante tu atención simulada — qué hacer (ACCIÓN) y qué decir (en cursiva). Puedes cambiar la redacción del diálogo siempre que no omitas el criterio.</p>
  ${GUION_IMPRESO.map(s => `<div class="gi-sec"><h3><span class="gi-num">${s.num}</span> ${esc(s.titulo)}</h3>${s.items.map(item).join('')}</div>`).join('')}
  <div class="gi-final"><h2>✅ Lista de control antes de terminar</h2>${CHECKLIST_IMPRESO.map(casilla).join('')}</div>`;
}
export const ESTILO_IMPRESO = `
  .guion-impreso, .gi-marca { display: none }
  @media print {
    @page { size: letter; margin: 10mm 11mm }
    body > *:not(.guion-impreso):not(.gi-marca) { display: none !important }
    html { font-size: 12px } body { margin: 0 !important; padding: 0 !important; background: #fff !important; color: #000 !important }
    .guion-impreso { display: block !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.26; font-size: 9pt; color: #000 }
    .gi-titulo { font-size: 14pt; margin: 0 0 4px; font-weight: 700 }
    .gi-desc { font-size: 8.5pt; color: #333; margin: 0 0 6px }
    .gi-sec { border-top: 1px solid #999; padding-top: 4px; margin: 0 0 6px }
    .gi-sec h3 { font-size: 10.5pt; margin: 0 0 4px; break-after: avoid; break-inside: avoid }
    .gi-num { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 50%; font-size: 7.5pt;
      background: #000 !important; color: #fff !important; vertical-align: -3px; margin-right: 4px; -webkit-print-color-adjust: exact; print-color-adjust: exact }
    .gi-sub { font-size: 8pt; font-weight: 700; margin: 5px 0 2px; text-transform: uppercase; letter-spacing: .3px; break-after: avoid }
    .gi-accion { display: flex; gap: 5px; align-items: flex-start; font-size: 8.8pt; margin-bottom: 2px }
    .gi-tag { font-size: 6.5pt; font-weight: 700; padding: 0 4px; margin-top: 1px; border: 1px solid #555; border-radius: 6px; flex-shrink: 0 }
    .gi-dialogo { font-size: 8.8pt; font-style: italic; padding: 1px 0 1px 7px; margin: 0 0 2px; border-left: 2px solid #666; color: #222 }
    .gi-usuario { margin-left: 12px }
    .gi-nota { font-size: 8.3pt; padding: 2px 6px; margin: 3px 0; border: 1px dashed #888; border-radius: 8px; color: #222 }
    .gi-lista { font-size: 8.5pt; margin: 1px 0 4px 16px; padding: 0; columns: 2; column-gap: 18px }
    .gi-lista li { margin-bottom: 1px; break-inside: avoid }
    .gi-mini { columns: 2; column-gap: 18px; margin: 1px 0 4px }
    .gi-chk { display: flex; gap: 5px; align-items: flex-start; padding: 1px 0; font-size: 8.5pt; break-inside: avoid }
    .gi-box { width: 10px; height: 10px; border: 1px solid #333; border-radius: 2px; flex-shrink: 0; margin-top: 2px }
    .gi-final { columns: 3; column-gap: 14px; margin-top: 4px } .gi-final h2 { column-span: all; font-size: 10.5pt; margin: 4px 0 3px }
    .gi-marca { display: block !important; position: fixed; inset: 0; z-index: 9999; pointer-events: none; background-repeat: repeat;
      background-size: 460px 300px; opacity: .16; -webkit-print-color-adjust: exact; print-color-adjust: exact }
  }`;
/* Marca de agua con el nombre, correo y fecha del candidato en cada hoja */
export function marcaAgua(nombre, correo) {
  const x = v => String(v || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const fecha = new Date().toLocaleDateString('es-MX', { timeZone: 'America/Mexico_City', day: '2-digit', month: '2-digit', year: 'numeric' });
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="460" height="300"><g transform="rotate(-28 230 150)" font-family="Helvetica,Arial,sans-serif" fill="#0f1428">' +
    `<text x="230" y="140" text-anchor="middle" font-size="22" font-weight="700">${x(nombre)}</text>` +
    `<text x="230" y="166" text-anchor="middle" font-size="12">${x(correo)} · ${x(fecha)}</text></g></svg>`;
  return 'url("data:image/svg+xml;utf8,' + encodeURIComponent(svg) + '")';
}
