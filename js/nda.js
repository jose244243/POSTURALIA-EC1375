/* ============================================================================
   POSTURALIA · nda.js — Acuerdo de Confidencialidad del candidato

   Un solo texto para las dos puertas por donde se firma: el paso previo del
   Autodiagnóstico y la liga pública de registro (registro.html, como la de
   Paideia). Se guarda en el mismo lugar (autodiagnostico.nda) con las mismas
   llaves, así que quien firmó en la liga llega al Autodiagnóstico con el
   acuerdo ya firmado y no lo firma dos veces.
   ========================================================================== */

/* Texto del acuerdo (el mismo de Paideia, con POSTURALIA como Centro
   Evaluador). Lo que se sella con la firma es ACUERDO: el texto plano
   completo. Si el texto cambia, las firmas anteriores dejan de valer y se
   pide firmar de nuevo, que es lo correcto. */
export const NDA_HTML = `<p>Entre <b>POSTURALIA</b> (el Centro Evaluador) y <b class="nda-parte">el/la candidato/a</b>, con motivo de su participación en el proceso de certificación del Estándar de Competencia EC1375.</p>
<p><b>1. Qué se considera información confidencial</b></p>
<ul><li>El contenido del Instrumento de Evaluación de Competencia (IEC), incluyendo las preguntas del Cuestionario y los criterios de la Guía de Observación y Lista de Cotejo.</li>
<li>El material de capacitación de POSTURALIA: la Ruta de Estudio, videos, presentaciones y cualquier documento entregado durante la Alineación.</li>
<li>Los datos personales de cualquier otro candidato, paciente o usuario que conozcas durante sesiones grupales, prácticas o videos de evaluación — nombre, condición de salud, información de contacto, o cualquier otro dato personal.</li>
<li>Las grabaciones de las sesiones de evaluación, propias o de otros candidatos.</li></ul>
<p><b>2. Tus obligaciones como candidato/a</b></p>
<ul><li>No compartir, publicar, fotografiar, grabar ni distribuir el contenido del Cuestionario, el IEC o el material de capacitación, por ningún medio.</li>
<li>No divulgar los datos personales de otros candidatos, pacientes o usuarios que conozcas durante el proceso.</li>
<li>Usar el material de capacitación únicamente para tu propia preparación, y las grabaciones de tus propias sesiones únicamente para los fines de tu evaluación.</li>
<li>Avisar de inmediato a POSTURALIA si detectas una fuga o uso indebido de esta información.</li></ul>
<p><b>3. Vigencia y consecuencias</b></p>
<p>Esta confidencialidad aplica durante todo tu proceso de certificación y de forma indefinida respecto al contenido del Cuestionario y del IEC. Incumplirla puede resultar en la cancelación de tu proceso de certificación, sin perjuicio de cualquier otra acción que proceda conforme a la ley.</p>`;
export const ACUERDO = 'Acuerdo de Confidencialidad — Candidato/a EC1375. ' +
  NDA_HTML.replace(/<li>/g, '· ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

/* ¿Hay un acuerdo firmado y es sobre ESTE texto? */
export const ndaVigente = auto => !!(auto?.nda && auto.nda.firma && auto.nda.acepto === ACUERDO);
