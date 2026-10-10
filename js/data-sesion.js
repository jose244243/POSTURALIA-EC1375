/* ============================================================================
   POSTURALIA · data-sesion.js — Los documentos que se llenan CON el usuario

   Como «Documentos de Sesión» de Paideia: un recorrido de 19 pasos, uno por
   sección del Guion Maestro, que el candidato llena junto con su usuario
   durante la sesión grabada. Al final salen, llenos y firmados por el
   usuario, los productos del expediente:
     DOC 1 Ficha de Registro de Atención
     DOC 2 Carta de Consentimiento Informado (con el Aviso de Privacidad)
     DOC 3 Plan de Sesión
     DOC 4 Plan de Seguimiento
   y, del checklist de preparación, la Verificación del espacio (E1·P1/P2).

   Aquí solo hay datos y reglas puras; la pantalla es sesion.html y los
   documentos impresos salen de doc-sesion.js.
   ========================================================================== */

/* Los pasos, en orden. `seccion` es la del Guion Maestro (data-guion.js). */
export const PASOS = [
  { id: 'prep',                titulo: 'Preparación del Espacio',    seccion: 1 },
  { id: 'recepcion',           titulo: 'Recepción del Usuario',      seccion: 2 },
  { id: 'explicacion',         titulo: 'Explicación Inicial',        seccion: 3 },
  { id: 'privacidad',          titulo: 'Aviso de Privacidad',        seccion: 4 },
  { id: 'ficha',               titulo: 'Ficha de Registro',          seccion: 5 },
  { id: 'peso_estatura',       titulo: 'Peso y Estatura',            seccion: 6 },
  { id: 'spo2_pulso',          titulo: 'Oxigenación y Pulso',        seccion: 7 },
  { id: 'postura',             titulo: 'Observación Postural',       seccion: 8 },
  { id: 'frec_resp',           titulo: 'Frecuencia Respiratoria',    seccion: 9 },
  { id: 'presion',             titulo: 'Presión Arterial',           seccion: 10 },
  { id: 'verificar',           titulo: 'Verificación y Firma',       seccion: 11 },
  { id: 'terapia_explicacion', titulo: 'Explicación de la Terapia',  seccion: 12 },
  { id: 'consentimiento',      titulo: 'Consentimiento Informado',   seccion: 13 },
  { id: 'atencion',            titulo: 'Atención Tradicional',       seccion: 14 },
  { id: 'finalizacion',        titulo: 'Finalización',               seccion: 15 },
  { id: 'plan_sesion',         titulo: 'Plan de Sesión',             seccion: 17 },
  { id: 'plan_seguimiento',    titulo: 'Sesiones Programadas',       seccion: 18 },
  { id: 'medio_contacto',      titulo: 'Medio de Contacto',          seccion: 19 },
  { id: 'cierre',              titulo: 'Cierre y Firma',             seccion: 20 },
];

export const PREP_ITEMS = [
  'Disponer de material, herramientas, mobiliario y equipo suficientes.',
  'Mantener espacio suficiente para el desplazamiento libre y la distancia entre usuario y prestador.',
  'Contar con archivero o medio digital para resguardar la documentación.',
  'Mantener el área ventilada y sin corrientes de aire.',
  'Contar con energía eléctrica e iluminación natural.',
  'Verificar colores claros en paredes y techo.',
  'Disponer depósitos para basura orgánica e inorgánica.',
  'Disponer el depósito correspondiente para residuos peligrosos biológico-infecciosos.',
  'Contar con un lugar específico para las pertenencias del usuario.',
  'Verificar que herramientas y materiales estén limpios, desinfectados/sanitizados, protegidos y en condiciones de uso.',
];
export const PREP_MATERIALES = [
  'Escritorio o mesa para atención y sillas.', 'Lavabo de manos.', 'Mesa de apoyo para herramientas y materiales.', 'Banco de altura.',
  'Báscula.', 'Estadímetro.', 'Baumanómetro o monitor de presión arterial de brazo.', 'Oxímetro.', 'Termómetro digital.',
  'Tapete sanitizante.', 'Archivero o computadora.', 'Música ambiental para relajación.', 'Perchero.',
];
export const PREP_PROTOCOLO = [
  'Lavarse las manos conforme al protocolo señalado en el estándar.',
  'Colocarse cubrebocas quirúrgico de triple capa.',
  'Verificar tapete sanitizante con solución desinfectante en el ingreso.',
  'Disponer gel antibacterial en el ingreso.',
  'Tener disponible el termómetro digital.',
];
export const TOTAL_PREP = PREP_ITEMS.length + PREP_PROTOCOLO.length;

/* Campos de la Ficha que se llenan junto a la pregunta del guion que los pide */
export const FICHA_CAMPOS = {
  medicoTratante: { label: 'Médico tratante / profesional de la salud que lo atiende', placeholder: "Nombre, o 'Ninguno' si no aplica" },
  resultadosLaboratorio: { label: 'Resumen de resultados de laboratorio y gabinete (si aplica)', tipo: 'textarea', placeholder: 'Ej. No cuenta con estudios recientes' },
  fisiologicos: { label: 'Antecedentes fisiológicos', tipo: 'textarea' },
  socioemocionales: { label: 'Antecedentes socioemocionales', tipo: 'textarea' },
  heredofamiliares: { label: 'Antecedentes heredofamiliares', tipo: 'textarea' },
  enfermedadesCronicas: { label: 'Enfermedades crónicas o degenerativas', placeholder: 'Ej. Ninguna / Hipertensión' },
  alergias: { label: 'Alergias', placeholder: 'Ej. Ninguna conocida / Penicilina' },
  habitosAlimentacionSueno: { label: 'Hábitos de alimentación y sueño', tipo: 'textarea', placeholder: 'Ej. 3 comidas al día, duerme 7 horas' },
  deportivos: { label: 'Actividad física', placeholder: 'Ej. Camina 30 min diario / Ninguna' },
  consumoSustancias: { label: 'Medicamentos o sustancias que consume', placeholder: 'Ej. No / Tabaco ocasional' },
  informacionToxicologica: { label: 'Información toxicológica', placeholder: 'Ej. Sin antecedentes toxicológicos' },
};
/* Qué campos van debajo de qué renglón del guion (sección 5), por el texto
   del renglón: si Humberto cambia el orden del guion, siguen en su lugar. */
export const FICHA_PREGUNTAS = [
  ['Recabar la información de manera verbal', ['@datosGenerales']],
  ['¿Actualmente lo atiende algún médico', ['medicoTratante', 'resultadosLaboratorio']],
  ['¿Tiene algún antecedente físico', ['fisiologicos', 'socioemocionales']],
  ['antecedentes familiares', ['heredofamiliares']],
  ['enfermedad crónica o degenerativa', ['enfermedadesCronicas']],
  ['alergia conocida', ['alergias']],
  ['hábitos de alimentación y sueño', ['habitosAlimentacionSueno']],
  ['¿Realiza alguna actividad física', ['deportivos']],
  ['medicamento o alguna otra sustancia', ['consumoSustancias', 'informacionToxicologica']],
];

export const sesionVacia = (hoy = new Date().toISOString().slice(0, 10)) => ({
  campos: {
    usuarioNombre: '', usuarioEdad: '', usuarioFechaNacimiento: '', usuarioDomicilio: '', usuarioTelefono: '', usuarioCorreo: '', contactoEmergencia: '',
    fisiologicos: '', socioemocionales: '', heredofamiliares: '', deportivos: '', consumoSustancias: '', enfermedadesCronicas: '', alergias: '', habitosAlimentacionSueno: '',
    avisoResponsable: '', avisoDomicilio: '', avisoContacto: '',
    medicoTratante: '', informacionToxicologica: '', resultadosLaboratorio: '',
    presionArterial: '', pulso: '', temperatura: '', oxigenacion: '', peso: '', estatura: '', observacionPostural: '', frecuenciaRespiratoria: '', sintomasNecesidades: '',
    tecnicaAplicar: '', otraTecnica: '', zonasCuerpo: '', vestimentaRecomendada: '', reaccionesFisicas: '',
    expedienteNo: '', fechaConsentimiento: hoy, limitantesServicio: '',
    condicionesPreparacion: '', numeroSesionesPlan: '', duracionSesionPlan: '', objetivosEfectos: '', horaInicio: '', horaTermino: '', fechaSesion: hoy,
    telefonoMovilSeguimiento: '', telefonoFijoSeguimiento: '', correoSeguimiento: '', medioContacto: '',
    notaEvolucion: '', pronostico: '', recomendaciones: '',
  },
  sesiones: [{ numero: '1', frecuencia: '', duracion: '' }],
  firmas: { usuarioFicha: null, usuarioConsentimiento: null, usuarioSeguimiento: null, usuarioEncuesta: null },
  encuesta: { servicioRecibido: '', r: {}, comentarios: {} },   // DOC 5 · F-EC1375-05 (v53)
  prep: {},          // 'prep-0'…, 'proto-0'… → true
  videos: {},        // sección → true («Video de esta sección grabado»)
  paso: 0,
});

/* DOC 5 · Formato F-EC1375-05 «Encuesta de Satisfacción» (v53): el formato
   que Humberto agregó al portafolio. La contesta y firma el USUARIO al
   terminar el servicio (escala 1 muy deficiente … 5 excelente). */
export const ENCUESTA_USUARIO = {
  clave: 'F-EC1375-05',
  escala: [1, 2, 3, 4, 5],
  grupos: [
    { k: 'servicio', t: 'SERVICIO', items: ['PACIENCIA', 'AMABILIDAD', 'HIGIENE', 'CLARIDAD EN LAS EXPLICACIONES', 'MEDIDAS SANITARIAS', 'DISIPACIÓN DE DUDAS'] },
    { k: 'instalaciones', t: 'INSTALACIONES', items: ['ÁREAS COMUNES', 'RECEPCIÓN', 'CONSULTORIO'] },
    { k: 'personal', t: 'PERSONAL', items: ['RECEPCIÓN', 'PERSONAL AUXILIAR', 'ESPECIALISTA EN EL SERVICIO'] },
  ],
};
export const clavesEncuestaUsuario = () => ENCUESTA_USUARIO.grupos.flatMap(g => g.items.map((_, i) => `${g.k}-${i}`));
export const encuestaUsuarioCompleta = s => clavesEncuestaUsuario().every(k => [1, 2, 3, 4, 5].includes(Number(s?.encuesta?.r?.[k])))
  && firmaValida(s?.firmas?.usuarioEncuesta);

export const tecnicaEfectiva = c => c.tecnicaAplicar === 'Otra' ? (c.otraTecnica || '').trim() : (c.tecnicaAplicar || '');
export const firmaValida = f => !!f && ((f.mode === 'draw' && !!f.dataUrl) || (f.mode === 'type' && String(f.typedName || '').trim().length >= 3));
export const prepCompleto = prep => PREP_ITEMS.every((_, i) => prep?.['prep-' + i]) && PREP_PROTOCOLO.every((_, i) => prep?.['proto-' + i]);
export const prepHechos = prep => PREP_ITEMS.filter((_, i) => prep?.['prep-' + i]).length + PREP_PROTOCOLO.filter((_, i) => prep?.['proto-' + i]).length;

/* Lo que cada paso exige para dejar pasar al siguiente (como Paideia) */
export function pasoValido(id, s) {
  const c = s.campos || {};
  if (id === 'prep') return prepCompleto(s.prep);
  if (id === 'ficha') return !!String(c.usuarioNombre || '').trim();
  if (id === 'verificar') return firmaValida(s.firmas?.usuarioFicha);
  if (id === 'terapia_explicacion') return !!tecnicaEfectiva(c);
  if (id === 'consentimiento') return firmaValida(s.firmas?.usuarioConsentimiento);
  if (id === 'plan_sesion') return !!String(c.objetivosEfectos || '').trim();
  if (id === 'cierre') return firmaValida(s.firmas?.usuarioSeguimiento) && encuestaUsuarioCompleta(s);
  return true;
}
export const QUE_FALTA = {
  prep: 'Marca los 15 puntos de preparación y protocolo sanitario.',
  ficha: 'Escribe el nombre completo del usuario.',
  verificar: 'Falta la firma del usuario en su Ficha de Registro.',
  terapia_explicacion: 'Elige la técnica que vas a aplicar.',
  consentimiento: 'Falta la firma del usuario en la Carta de Consentimiento.',
  plan_sesion: 'Escribe los objetivos y efectos generales.',
  cierre: 'Faltan la firma del usuario en el Plan de Seguimiento y su Encuesta de Satisfacción (calificar los 12 puntos y firmar).',
};

/* Hasta qué paso se puede saltar: el primero que falta. La preparación no
   bloquea la navegación (vive en el navegador donde se marcó), igual que en
   Paideia; sí bloquea generar los documentos. Índices sobre PASOS. */
export function pasoMaximo(s) {
  for (let i = 0; i < PASOS.length; i++) if (PASOS[i].id !== 'prep' && !pasoValido(PASOS[i].id, s)) return i;
  return PASOS.length;   // = «Tus documentos»
}
export const todoValido = s => PASOS.every(p => pasoValido(p.id, s));
export const faltantes = s => PASOS.filter(p => !pasoValido(p.id, s)).map(p => ({ id: p.id, titulo: p.titulo, que: QUE_FALTA[p.id] }));

/* Al pasar de la Ficha al seguimiento, los datos de contacto se precargan */
export function precargarSeguimiento(c) {
  const out = {};
  if (!c.telefonoMovilSeguimiento && c.usuarioTelefono) out.telefonoMovilSeguimiento = c.usuarioTelefono;
  if (!c.correoSeguimiento && c.usuarioCorreo) out.correoSeguimiento = c.usuarioCorreo;
  return out;
}

/* Edad cumplida a una fecha (para no pedirla dos veces) */
export function edadDe(nacimiento, hoy = new Date()) {
  const m = String(nacimiento || '').match(/^(\d{4})-(\d{2})-(\d{2})/); if (!m) return '';
  const h = typeof hoy === 'string' ? new Date(hoy) : hoy;
  let e = h.getFullYear() - +m[1];
  if (h.getMonth() + 1 < +m[2] || (h.getMonth() + 1 === +m[2] && h.getDate() < +m[3])) e--;
  return e >= 0 && e < 130 ? String(e) : '';
}

/* ── Textos fijos ────────────────────────────────────────────────────── */
export const NOTA_MEDICO = 'Nota importante: Los servicios tradicionales y complementarios que se ofrecen no cubren, ni sustituyen las indicaciones del médico tratante.';
export const ENTERADO_AVISO = 'El usuario manifiesta que se le presentó el Aviso de Privacidad, conforme a la Ley Federal de Protección de Datos Personales en Posesión de Particulares, y firma de enterado.';
export const textoConsentimiento = nombre => `Yo, ${nombre || '________________________________________'}, expreso mi libre voluntad para autorizar el procedimiento señalado en este documento después de haberme proporcionado la información completa sobre padecimiento o estado actual, la cual fue realizada en forma amplia, precisa y suficiente en un lenguaje claro y sencillo, informándome sobre posibles riesgos, complicaciones y secuelas de igual forma los beneficios. El especialista informó métodos alternativos, el derecho de cambiar mi decisión en cualquier momento y manifestarla antes de cualquier procedimiento. Con el propósito de que mi atención sea adecuada, me comprometo a proporcionar información completa y veraz, así como seguir las indicaciones del especialista. Otorgo mi autorización al personal asistente auxiliar, así como al profesional que brinda los servicios tradicionales y complementarios la atención de contingencias y urgencias derivadas del procedimiento señalado, atendiendo al principio de libertad prescriptiva.`;

const FALTANTE = '[pendiente]';
/* Aviso de Privacidad simplificado. d = { responsable, domicilio, contacto } */
export function avisoPrivacidadBloques(d = {}, { evaluacion = true } = {}) {
  const b = [
    { t: 'titulo', x: 'AVISO DE PRIVACIDAD SIMPLIFICADO' },
    { t: 'p', x: `${d.responsable || FALTANTE}, con domicilio en ${d.domicilio || FALTANTE}, es responsable del tratamiento de los datos personales que usted proporcione, conforme a la Ley Federal de Protección de Datos Personales en Posesión de Particulares.` },
    { t: 'h', x: '¿Qué datos recabamos?' },
    { t: 'p', x: 'Datos de identificación y contacto (nombre, edad, fecha de nacimiento, domicilio, teléfono, correo electrónico y familiar a quien avisar) y datos sobre su salud (antecedentes, signos vitales, observación postural y evolución), que la ley considera datos personales sensibles.' },
    { t: 'h', x: '¿Para qué los usamos?' },
    { t: 'li', x: 'Integrar su ficha de registro y su expediente de atención.' },
    { t: 'li', x: 'Verificar que no exista impedimento para recibir el servicio, brindarle la atención y darle seguimiento.' },
    { t: 'li', x: 'Contactarle para programar y dar seguimiento a sus sesiones.' },
  ];
  if (evaluacion) b.push({ t: 'li', x: 'Integrar la grabación de esta sesión y los documentos de su atención al portafolio de evidencias con el que quien le atiende se evalúa en el Estándar de Competencia EC1375 ante el Centro Evaluador (SEP-CONOCER).' });
  b.push(
    { t: 'h', x: '¿Con quién los compartimos?' },
    { t: 'p', x: evaluacion
      ? 'Solo con el Centro Evaluador, para la finalidad anterior, y con las autoridades que lo requieran conforme a la ley. No vendemos ni cedemos sus datos personales.'
      : 'No compartimos sus datos personales con terceros, salvo con las autoridades que lo requieran conforme a la ley. No vendemos ni cedemos sus datos personales.' },
    { t: 'h', x: 'Sus derechos' },
    { t: 'p', x: `Usted puede acceder a sus datos, rectificarlos, cancelarlos u oponerse a su uso (derechos ARCO), así como revocar su consentimiento, solicitándolo a: ${d.contacto || FALTANTE}.` },
    { t: 'h', x: 'Consentimiento' },
    { t: 'p', x: 'Al firmar de enterado, usted manifiesta que se le informó este aviso y otorga su consentimiento expreso para el tratamiento de sus datos personales, incluidos los sensibles, para las finalidades descritas.' },
  );
  return b;
}
/* Datos del responsable: lo que el candidato ajustó, o su registro */
export const datosAviso = (c = {}, cand = {}) => ({
  responsable: String(c.avisoResponsable || cand.nombre || '').trim(),
  domicilio: String(c.avisoDomicilio || cand.domicilioCompleto || cand.domicilio || '').trim(),
  contacto: String(c.avisoContacto || [cand.telefonoCelular, cand.email].filter(Boolean).join(' · ')).trim(),
});

/* Los documentos que produce el recorrido (clave = la de config.js docs) */
export const DOCS_SESION = [
  { clave: 'ficha', doc: 'DOC 1', titulo: 'Ficha de Registro de Atención', desc: 'Datos y antecedentes del usuario', firma: 'usuarioFicha' },
  { clave: 'consentimiento', doc: 'DOC 2', titulo: 'Carta de Consentimiento Informado', desc: 'Autorización del usuario, con el Aviso de Privacidad', firma: 'usuarioConsentimiento' },
  { clave: 'plan_sesion', doc: 'DOC 3', titulo: 'Plan de Sesión', desc: 'Signos vitales, técnica, evolución y tareas para casa' },
  { clave: 'plan_seguimiento', doc: 'DOC 4', titulo: 'Plan de Seguimiento', desc: 'Contacto y sesiones programadas', firma: 'usuarioSeguimiento' },
  { clave: 'encuesta_usuario', doc: 'DOC 5', titulo: 'Encuesta de Satisfacción (F-EC1375-05)', desc: 'La contesta y firma tu usuario al terminar', firma: 'usuarioEncuesta' },
  { clave: 'verificacion_espacio', doc: 'E1', titulo: 'Verificación del espacio y las herramientas', desc: 'Preparación del espacio y protocolo sanitario' },
];
