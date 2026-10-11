/* ============================================================================
   POSTURALIA · doc-portafolio-oficial.js — Secciones del portafolio con el
   texto y el acomodo de los formatos oficiales

   Complementa doc-portafolio.js con las hojas que el expediente aprobado de
   referencia (143 págs.) trae completas y que antes salían resumidas o no
   salían:
     · Autodiagnóstico en formato CONOCER (portada, índice y presentación,
       datos personales, propósito e instrucciones, aplicación por elemento,
       valoración, resultado con la regla del 90% y firmas).
     · Ficha de Registro del SII / RENAP.
     · Tríptico de Derechos y Obligaciones (texto íntegro) con su recibí.
     · Formato de Atención a Usuarios y Cédula de Evaluación del Servicio.
     · Acuses de recibido (tríptico, cédula y plan) y contraportada.
   Los textos son los oficiales, con sus erratas.
   ========================================================================== */
import { CONFIG } from './config.js';
import { hoja, fechaFormato, escOficial as esc } from './doc-plan-oficial.js';
import { firmaHtml } from './firma-simple.js';
import { reactivosPlanos, respuestasVigentes } from './data-autodiagnostico.js';
import { FORMATO_ATENCION as FA, CEDULA_SERVICIO as CS } from './data-portafolio.js';
import { domicilioCompleto } from './registro.js';

const ce = () => CONFIG.centroEvaluacion || {};
const EC = 'EC1375 - Prestación de servicios auxiliares en la contribución tradicional y complementaria de la recuperación de las condiciones físicas y socioemocionales de las personas.';
const EC_CORTO = 'Prestación de servicios auxiliares en la contribución tradicional y complementaria de la recuperación de las condiciones físicas y socioemocionales de las personas.';
const firmaCaja = (f, alto = 46) => `<div style="height:${alto + 4}px;display:flex;align-items:flex-end;justify-content:center">${firmaHtml(f, alto)}</div>`;

export function estilosPortafolioOficial() {
  return `
  /* v54: como el FORMATO 2026 (pág. 7): letras grandes azul marino y dos filetes azules */
  .ad-portada { text-align: center; padding-top: 8mm; color: #0f2a6b }
  .ad-portada h2 { font-size: 34pt; font-weight: normal; margin: 0; letter-spacing: .01em }
  .ad-portada .ec { font-size: 26pt; font-weight: bold; margin: 0 0 2mm }
  .ad-portada .nom { font-size: 24pt; margin: 0 6mm 12mm; line-height: 1.3 }
  .ad-portada hr { border: 0; border-top: 1.5px solid #2a4a8a; margin: 2mm 4mm }
  .ad-portada .lema { font-style: italic; margin: 14mm 18mm 0; font-size: 12pt; line-height: 1.5 }
  .ad-portada .lema b { color: #b91c1c; font-weight: normal }
  .barra-n { background: #000; color: #fff; font-weight: bold; padding: 1.5mm 3mm; margin: 4mm 0 2mm; font-size: 11pt }
  .barra-g { background: #bfbfbf; font-weight: bold; padding: 1.2mm 3mm; margin: 3mm 0 2mm; font-size: 10.5pt }
  .ad-ind { width: 100%; font-size: 11pt; border-collapse: collapse; margin: 2mm 0 5mm } .ad-ind td { padding: 1.2mm 0 }
  .ad-ind td:last-child { text-align: right; width: 12mm }
  .ad-ind td.pts { border-bottom: 1px dotted #000 }
  table.ad-t { width: 100%; border-collapse: collapse; margin: 0 0 3mm; font-size: 10pt }
  table.ad-t td, table.ad-t th { border: 1px solid #000; padding: 1.2mm 2mm; vertical-align: top }
  table.ad-t th { background: #d9d9d9; text-align: left }
  table.ad-t .sn { width: 11mm; text-align: center; font-weight: bold }
  table.ad-t .num { width: 8mm; text-align: center }
  .ad-caja { border: 1px solid #000; padding: 3mm; flex: 1 }
  .ad-caja h4 { margin: 0 0 2mm; font-size: 11pt }
  .ficha-t { width: 100%; border-collapse: collapse; font-size: 8.5pt } .ficha-t td { border: 1px solid #000; padding: .8mm 1.6mm; vertical-align: top }
  .ficha-t .lb { background: #e5e5e5; font-weight: bold; width: 32mm }
  .letra-chica { font-size: 7pt; text-align: justify; line-height: 1.22; margin: 0 0 1.5mm }
  .trip h3 { font-size: 11pt; margin: 3mm 0 1.5mm; color: #7f1d1d }
  .trip ul { margin: 0 0 2mm 5mm; padding: 0 } .trip li { margin: 0 0 1mm; text-align: justify; font-size: 9.5pt }
  .trip p { font-size: 9.5pt; text-align: justify; margin: 0 0 2mm }
  .trip-cols { columns: 2; column-gap: 8mm }
  @page trip-h { size: letter landscape; margin: 0 }
  .trip-hoja { page: trip-h; break-before: page; break-after: page; display: flex; align-items: center; justify-content: center; height: 215mm; width: 279mm; overflow: hidden }
  .trip-lienzo { position: relative; width: 271mm }
  .trip-img { display: block; width: 100%; height: auto }
  @media screen { .trip-hoja { width: auto; height: auto; padding: 6mm 0; margin: 0 0 18mm } .trip-lienzo { width: 100% } }
  @media print { .trip-hoja { margin: 0 -16mm } }
  .fmt-t { width: 100%; border-collapse: collapse; font-size: 9.5pt; margin: 0 0 3mm } .fmt-t td { border: 1px solid #000; padding: 1.3mm 2mm; vertical-align: middle }
  .fmt-t .lb { background: #e5e5e5; font-weight: bold } .fmt-t .x { width: 16mm; text-align: center; font-weight: bold }
  .fmt-t .cap { font-size: 7.5pt; color: #333 }
  .acuse-t td { padding: 2.5mm 3mm !important }
  .acuse-barra { background: #bfbfbf; border: 1px solid #000; padding: 3mm; font-weight: bold; text-align: center; margin: 8mm 0 0 }
  .acuse-firma { border: 1px solid #000; border-top: 0; padding: 6mm 4mm 3mm; text-align: center; min-height: 40mm }
  .contra { min-height: 190mm; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10mm }
  .contra .gris { width: 100%; height: 80mm; background: #a6a6a6 }
  .contra img { max-height: 30mm } .contra p { font-size: 13pt; margin: 0; text-align: center; line-height: 1.6 }`;
}

/* ── Autodiagnóstico en formato CONOCER ──────────────────────────────── */
const ETIQ_TIPO = { 'Desempeño': 'Desempeños', 'Producto': 'Productos', 'Conocimiento': 'Conocimientos', 'Actitud': 'Actitud/Hábitos y Valores' };
const PREG_TIPO = {
  'Desempeño': 'Con relación a este elemento ¿Puede usted realizar los siguientes DESEMPEÑOS?',
  'Producto': 'Con relación a este elemento ¿Usted puede obtener los siguientes PRODUCTOS?',
  'Conocimiento': 'Con relación a este elemento ¿Usted cuenta con los siguientes CONOCIMIENTOS?',
  'Actitud': 'Con relación a este elemento ¿Usted cuenta con los siguientes ACTITUDES, HÁBITOS y VALORES?',
};
const ELEM_BULLETS = { 1: ['DESEMPEÑOS', 'PRODUCTOS', 'CONOCIMIENTOS', 'ACTITUDES/HÁBITOS/VALORES'], 2: ['DESEMPEÑOS', 'PRODUCTOS', 'CONOCIMIENTOS', 'ACTITUDES/HÁBITOS/VALORES'], 3: ['DESEMPEÑOS', 'PRODUCTOS'], 4: ['DESEMPEÑOS', 'PRODUCTOS'] };

export function resultadoAutodiagnostico(auto = {}) {
  const resp = respuestasVigentes(auto), todos = reactivosPlanos();
  const si = todos.filter(r => resp[r.clave] === 'SI').length, no = todos.filter(r => resp[r.clave] === 'NO').length;
  const pct = todos.length ? Math.round((si / todos.length) * 10000) / 100 : 0;
  return { si, no, total: todos.length, pct, sugerencia: si + no === todos.length ? (pct >= 90 ? 'Evaluarse' : 'Asesorarse') : '' };
}

export function autodiagnosticoOficial(auto = {}, c = {}, { firmaCandidato = null, firmaEvaluador = null, evaluador = '', decision = '' } = {}) {
  const resp = respuestasVigentes(auto), todos = reactivosPlanos();
  const elementos = [...new Set(todos.map(r => r.elemento))];
  const res = resultadoAutodiagnostico(auto);
  const x = (r, v) => resp[r.clave] === v ? 'x' : '';

  const portada = hoja('Autodiagnóstico', `<div class="ad-portada">
      <h2>AUTODIAGNÓSTICO</h2><div class="ec">EC1375</div><div class="nom">${EC_CORTO}</div><hr><hr>
      <p class="lema">Un <b>Sistema Nacional de Competencias de las Personas</b> para Desarrollar el Potencial Productivo, Educativo y el Progreso Social del Capital Humano de México.</p></div>`, { sinTitulo: true, sinPie: true, sinFilete: true });

  const ind = [['PRESENTACIÓN', '01'], ['DATOS PERSONALES', '02'], ['PROPÓSITO DEL DIAGNÓSTICO', '03'], ['PERFIL RECOMENDADO DEL CANDIDATO A ELABORAR EL DIAGNÓSTICO', '03'], ['INSTRUCCIONES', '03'], ['APLICACIÓN DEL DIAGNÓSTICO', '04'], ['VALORACIÓN', '11']];
  const presentacion = hoja('Autodiagnóstico', `
    <h3 style="text-align:center;margin:0 0 3mm">ÍNDICE</h3>
    <table class="ad-ind">${ind.map(([t, p]) => `<tr><td class="pts">${t}</td><td>${p}</td></tr>`).join('')}</table>
    <div class="barra-n">PRESENTACIÓN</div>
    <p class="just">El presente Diagnóstico se realiza con base en el Estándar de competencia ${EC}</p>
    <p class="just">Los criterios que se diagnostican para la evaluar la competencia del candidato son:</p>
    ${elementos.map(e => { const nom = todos.find(r => r.elemento === e).elementoNombre;
      return `<div class="barra-g">Elemento ${e} de 4</div><p class="just" style="margin:0 0 1mm">${esc(nom)}.</p>
        <p style="margin:0 0 2mm 6mm">${ELEM_BULLETS[e].map(b => `• ${b}`).join('&nbsp;&nbsp;&nbsp; ')}</p>`; }).join('')}`, { sinTitulo: true, sinLogos: true, sinPie: true, filete: true });

  const fila = (k, v) => `<tr><td class="lb" style="background:#e5e5e5;font-weight:bold;width:52mm">${k}</td><td>${v}</td></tr>`;
  const datos = hoja('Autodiagnóstico', `
    <div class="barra-n">Datos personales</div>
    <table class="ad-t">${fila('Nombre Completo', esc(c.nombre || ''))}${fila('Curp', esc(c.curp || ''))}${fila('Domicilio', esc(domicilioCompleto(c)))}
      ${fila('Último grado de estudios', esc(c.escolaridad || ''))}${fila('Teléfono de casa', esc(c.telefonoCasa || ''))}${fila('Teléfono de celular', esc(c.telefonoCelular || ''))}
      ${fila('Correo electrónico', esc(c.email || ''))}${fila('Fecha de aplicación', esc(fechaFormato(c.fechaAplicacion || auto.fecha || '')))}
      ${fila('Firma', firmaCaja(firmaCandidato, 40))}</table>`, { sinTitulo: true, sinLogos: true, sinPie: true, filete: true });

  const proposito = hoja('Autodiagnóstico', `
    <div class="barra-n">PROPÓSITO DEL DIAGNÓSTICO</div>
    <p class="just">Servir como referente para la evaluación y certificación de las personas que prestan servicios de apoyo en la recuperación tradicional y complementaria de las condiciones físicas y socioemocionales de las personas, preparando el espacio de atención, disponiendo e introduciendo al usuario que recibirá los servicios y dando seguimiento a su atenci</p>
    <div class="barra-n">PERFIL RECOMENDADO DEL CANDIDATO A ELABORAR EL DIAGNÓSTICO:</div>
    <p style="margin:0 0 1mm"><b>Módulo/Ocupacional:</b></p>
    <ul style="margin:0 0 3mm 6mm"><li>Servicios de salud y asistencia social.</li><li>Servicios médicos de consulta externa y servicios relacionados.</li></ul>
    <div class="barra-n">IMPORTANTE</div>
    <p class="just">El Diagnóstico de competencia laboral es un documento personal, particular y confidencial del candidato a evaluación y certificación, sus resultados sólo se darán a conocer de manera personal.</p>
    <p class="just">Con esta información el candidato decidirá si ingresa a los procesos de evaluación y certificación de la competencia laboral o asiste a un taller de capacitación final.</p>
    <div class="barra-n">INSTRUCCIONES</div>
    <ol style="margin:0 0 0 6mm;padding:0;list-style:none">
      <li class="just">1) Lea cuidadosamente cada uno de los apartados del Diagnóstico tomando en cuenta las actividades que usted sabe hacer, bajo qué condiciones las ha realizado, cómo las ha demostrado y qué conocimientos tiene de su actividad.</li>
      <li class="just">2) Lea cuidadosamente la pregunta de las actividades que se enuncian y marque con una “X” en la columna SI cuando considere que sabe hacer o ha hecho el desempeño, producto, Actitudes / Hábitos / Valores o tiene el conocimiento y/o pueda mostrar las evidencias correspondientes y en la columna NO en caso contrario.</li>
      <li class="just">3) Una vez que haya leído todo el Diagnóstico, revise sus respuestas las veces que considere necesario.</li>
      <li class="just">4) Tiempo máximo para elaborar el diagnóstico: 30 minutos</li></ol>`, { sinTitulo: true, sinLogos: true, sinPie: true, filete: true });

  /* Aplicación: una hoja por elemento, grupo por grupo con SI / NO */
  const aplicacion = elementos.map(e => {
    const lista = todos.filter(r => r.elemento === e);
    const tipos = [...new Set(lista.map(r => r.tipo))];
    return hoja('Autodiagnóstico', `
      ${e === 1 ? '<h3 style="text-align:center;margin:0 0 2mm">APLICACIÓN DEL DIAGNÓSTICO</h3>' : ''}
      <div class="barra-n">Elemento ${e} de 4: ${esc(lista[0].elementoNombre)}.</div>
      <p style="text-align:center;font-weight:bold;margin:1mm 0">CRITERIOS A DIAGNOSTICAR</p>
      ${tipos.map(t => {
        const deTipo = lista.filter(r => r.tipo === t);
        const grupos = [...new Set(deTipo.map(r => r.grupo))];
        return `<div class="barra-g">${PREG_TIPO[t] || esc(t)}</div>` + grupos.map(g => {
          const items = deTipo.filter(r => r.grupo === g);
          return `<table class="ad-t"><thead><tr><th colspan="2">${esc(String(g).replace(/:?\s*$/, ':'))}</th><th class="sn">SI</th><th class="sn">NO</th></tr></thead><tbody>
            ${items.map((r, i) => `<tr><td class="num">${i + 1}.</td><td>${esc(r.texto)}</td><td class="sn">${x(r, 'SI')}</td><td class="sn">${x(r, 'NO')}</td></tr>`).join('')}</tbody></table>`;
        }).join('');
      }).join('')}`, { sinTitulo: true, sinLogos: true, sinPie: true, filete: true });
  }).join('');

  /* Valoración por elemento */
  const valoracion = hoja('Autodiagnóstico', `
    <div class="barra-n" style="text-align:center">VALORACIÓN</div>
    ${elementos.map(e => {
      const lista = todos.filter(r => r.elemento === e);
      const tipos = [...new Set(lista.map(r => r.tipo))];
      return `<table class="ad-t"><thead><tr><th colspan="5" style="background:#000;color:#fff">Elemento ${e} de 4: ${esc(lista[0].elementoNombre)}</th></tr>
        <tr><th></th><th class="sn" style="width:30mm">TOTAL DE REACTIVOS</th><th class="sn">SI</th><th class="sn">NO</th><th class="sn">TOTAL</th></tr></thead><tbody>
        ${tipos.map(t => { const d = lista.filter(r => r.tipo === t); const s = d.filter(r => resp[r.clave] === 'SI').length, n = d.filter(r => resp[r.clave] === 'NO').length;
          return `<tr><td>${ETIQ_TIPO[t] || esc(t)}</td><td class="sn">${d.length}</td><td class="sn">${s}</td><td class="sn">${n}</td><td class="sn">${s + n}</td></tr>`; }).join('')}</tbody></table>`;
    }).join('')}
    <p style="text-align:right;font-weight:bold">Total: ${todos.length}</p>`, { sinTitulo: true, sinLogos: true, sinPie: true, filete: true });

  const resultado = hoja('Autodiagnóstico', `
    <div class="barra-n">Instrucciones para aplicar la valoración</div>
    <table class="ad-t">
      <tr><td>1. Cuente el número de respuestas afirmativas (Sí) que obtuvo y anótelas:</td><td class="sn" style="width:22mm">${res.si}</td></tr>
      <tr><td>2. Cuente el número de respuestas negativas (No) que obtuvo y anótelas:</td><td class="sn">${res.no}</td></tr>
      <tr><td>3. Verifique que la suma de las respuestas afirmativas (SI) y negativas (NO) sea igual al total de reactivos ( ${res.total} ).</td><td class="sn">${res.si + res.no}</td></tr>
      <tr><td>4. Divida las respuestas afirmativas que obtuvo entre el total de respuestas y multiplique por 100 para que su resultado sea en porcentaje.</td><td class="sn">${res.si + res.no ? res.pct.toFixed(2) : ''}</td></tr></table>
    <table class="ad-t"><tr><td class="lb" style="background:#e5e5e5;font-weight:bold;width:30mm;vertical-align:middle">Conclusión</td><td>
      Ø Si cumplió un porcentaje igual o mayor a 90% de los reactivos cumplidos se le recomienda <b>EVALUARSE</b>.<br>
      Ø Si resulta menor al 90% se le sugiere <b>ASESORARSE</b> con su Centro Evaluador o Evaluador Independiente.</td></tr></table>
    <div style="display:flex;gap:6mm;margin-top:6mm">
      <div class="ad-caja"><h4>Resultado</h4><p>Respuestas Correctas: <b>${res.si}</b></p><p>Sugerencia: <b>${esc(res.sugerencia)}</b></p>
        ${firmaCaja(firmaEvaluador)}<p style="text-align:center;border-top:1px solid #000;margin:0;padding-top:1mm"><b>${esc(String(evaluador).toUpperCase())}</b><br>Firma Evaluadora:</p></div>
      <div class="ad-caja"><h4>Decisión del Candidato/a</h4><p>Decisión: <b>${esc(decision)}</b></p><p>&nbsp;</p>
        ${firmaCaja(firmaCandidato)}<p style="text-align:center;border-top:1px solid #000;margin:0;padding-top:1mm"><b>${esc(String(c.nombre || '').toUpperCase())}</b><br>Firma Candidata/o:</p></div>
    </div>`, { sinTitulo: true, sinLogos: true, sinPie: true, filete: true });

  return portada + presentacion + datos + proposito + aplicacion + valoracion + resultado;
}

/* ── Ficha de Registro (SII / RENAP) ─────────────────────────────────── */
const ENTIDADES = { AS: 'Aguascalientes', BC: 'Baja California', BS: 'Baja California Sur', CC: 'Campeche', CL: 'Coahuila', CM: 'Colima', CS: 'Chiapas', CH: 'Chihuahua',
  DF: 'Ciudad de México', DG: 'Durango', GT: 'Guanajuato', GR: 'Guerrero', HG: 'Hidalgo', JC: 'Jalisco', MC: 'Estado de México', MN: 'Michoacán', MS: 'Morelos',
  NT: 'Nayarit', NL: 'Nuevo León', OC: 'Oaxaca', PL: 'Puebla', QT: 'Querétaro', QR: 'Quintana Roo', SP: 'San Luis Potosí', SL: 'Sinaloa', SR: 'Sonora',
  TC: 'Tabasco', TS: 'Tamaulipas', TL: 'Tlaxcala', VZ: 'Veracruz', YN: 'Yucatán', ZS: 'Zacatecas', NE: 'Nacido en el extranjero' };
/* Lugar de nacimiento y nacionalidad salen de la CURP (posiciones 12–13) */
export function nacimientoDeCurp(curp) {
  const k = String(curp || '').toUpperCase().slice(11, 13);
  if (!ENTIDADES[k]) return { lugar: '', nacionalidad: '' };
  return { lugar: ENTIDADES[k], nacionalidad: k === 'NE' ? '' : 'Mexicana' };
}

export function fichaRenap(c = {}, { foto = '', firma = null } = {}) {
  const nac = nacimientoDeCurp(c.curp);
  const cp = c.cp || (String(c.domicilio || '').match(/\b\d{5}\b/) || [''])[0];
  const f = (k, v) => `<tr><td class="lb">${k}</td><td>${esc(v || '')}</td></tr>`;
  return hoja('Ficha de Registro', `
    <table class="ficha-t" style="margin-bottom:3mm"><tr><td class="lb">Estándar de</td><td>${EC}</td><td style="width:36mm"><b>Fecha :</b> ${esc(c.fechaAplicacion || '')}</td></tr></table>
    <p style="margin:0 0 1mm"><b>DATOS PERSONALES :</b></p>
    <p class="letra-chica" style="font-size:8.5pt">El Consejo Nacional de Normalización y Certificación de Competencias Laborales (CONOCER) solicita al candidato la autorización para la publicación de los datos personales a fin de dar cumplimiento a lo dispuesto en el capítulo séptimo de las Reglas Generales y criterios para la integración del Sistema Nacional de Competencias, referente al “Registro Nacional de Personas Con Competencias Certificadas” (RENAP) (1) por medio del cual las personas con competencias certificadas, pueden voluntariamente dar a conocer sus datos personales, para facilitar su localización, en caso de que organizaciones sindicales, empresas, sector académico, sector social o público, o alguna otra institución pública o privada, requieran personal con competencias certificadas en determinada función individual.</p>
    <p style="margin:1mm 0 2mm;font-weight:bold">SI ( ${c.renapAutorizado ? 'X' : '&nbsp;'} ) &nbsp;&nbsp; NO ( ${c.renapAutorizado === false ? 'X' : '&nbsp;'} )</p>
    <table style="width:100%;border-collapse:collapse"><tr>
      <td style="width:52mm;vertical-align:top;padding-right:3mm"><p class="letra-chica">Doy mi consentimiento al CONOCER para que, en términos del artículo 21 (2) de la Ley Federal de Transparencia y Acceso a la Información Pública Gubernamental, difunda, distribuya y publique la información contenida en el documento que se inscribe, para los propósitos del RENAP. Lo anterior, sin perjuicio de que estoy enterado de que en términos del artículo 22, fracción III (3) de la misma Ley, no es necesario mi consentimiento respecto de información que se transmita entre sujetos obligados o entre dependencias y entidades, cuando los datos respectivos se utilicen para el ejercicio de facultades propias de los mismos.</p>
        ${firmaCaja(firma, 40)}<p style="text-align:center;border-top:1px solid #000;margin:0;font-size:9pt">Firma</p></td>
      <td style="width:34mm;vertical-align:top"><div style="width:32mm;height:40mm;border:1px solid #000;display:flex;align-items:center;justify-content:center;font-size:8pt;color:#555">${foto ? `<img src="${foto}" alt="Fotografía" style="width:100%;height:100%;object-fit:cover">` : 'Fotografía'}</div></td>
      <td style="vertical-align:top;padding-left:3mm"><table class="ficha-t">
        ${f('Nombre :', c.nombre)}${f('Lugar de nacimiento', nac.lugar)}${f('Nacionalidad :', nac.nacionalidad)}${f('CURP :', String(c.curp || '').toUpperCase())}
        ${f('Género :', c.genero)}${f('Fecha de nacimiento :', c.fechaNacimiento)}
        <tr><td colspan="2" style="background:#bfbfbf;font-weight:bold">Domicilio Particular</td></tr>
        ${f('Calle y Número', c.domicilio)}${f('CP', cp)}${f('Colonia', c.colonia)}${f('Ciudad', c.ciudad || c.municipio)}${f('Entidad Federativa', c.estado)}
        ${f('E mail', c.email)}${f('Teléfono', c.telefonoCasa)}${f('Celular', c.telefonoCelular)}</table></td></tr></table>
    <p class="letra-chica" style="margin-top:3mm">Los datos personales recabados serán protegidos y serán incorporados y tratados en el Sistema de datos personales RENAP con fundamento en las reglas generales y criterios para integración y operación del Sistema Nacional de Competencias y cuya finalidad es integrar una base de datos con información sobre las personas que han obtenido uno o más Certificados de Competencia, con base en Estándares de Competencia inscritos en el Registro Nacional de Estándares de Competencia, el cual fue registrado en el Listado de Sistemas de Datos Personales ante el Instituto Federal de Acceso a la Información Pública (www.ifai.org.mx) y podrán ser trasmitidos a sujetos obligados o dependencias y entidades con la finalidad del uso en facultades propias de las mismas. Además de otras transmisiones previstas en Ley. La Unidad Administrativa responsable del Sistema es el Consejo Nacional de Normalización y Certificación de Competencias Laborales y la dirección donde el usuario podrá ejercer los derechos de acceso y corrección ante la misma es Av. Barranca del Muerto 275 Col. San José Insurgentes C.P. 03900, Ciudad de México. Lo anterior se informa en cumplimiento del Decimoséptimo de los lineamientos de protección de Datos Personales, publicados en el Diario Oficial de la Federación el 30 de septiembre de 2005. El CONOCER deberá informar al Instituto, dentro de los primeros diez días hábiles de enero y julio de cada año, lo siguiente: a) Los sistemas de datos personales, b) Cualquier modificación o cancelación de dichos sistemas, c) Cualquier transmisión de sistemas de datos personales de conformidad a los dispuesto por los Lineamientos Vigésimo quinto y Vigésimo sexto de los Lineamientos de protección de Datos Personales.</p>
    <p class="letra-chica">(1) EL RENAP, tiene como objetivo fundamental integrar una base de datos con información sobre las personas que han obtenido uno o más Certificados de Competencia, con base en Estándares de Competencia inscritos en el Registro Nacional de estándares de Competencias.</p>
    <p class="letra-chica">(2) Los sujetos obligados no podrán difundir, distribuir o comercializar los datos personales contenidos en los sistemas de información, desarrollados en el ejercicio de sus funciones, salvo que haya mediado el consentimiento expreso, por escrito o por un medio de autenticación similar, de los individuos a que haga referencia la información.</p>`);
}

/* ── Tríptico de Derechos y Obligaciones (texto íntegro) ─────────────── */
/* v54 · El tríptico oficial del CONOCER, como en el FORMATO 2026 (pág. 20):
   el folleto a color en una hoja horizontal, con el nombre, la fecha y la
   firma del candidato sobre la línea «Recibí derechos y obligaciones».
   Antes salía solo el texto. */
export function triptico(c = {}, { firma = null, fecha = '' } = {}) {
  const src = new URL('formatos/triptico-conocer.avif', location.href).href;
  const f = firma?.dataUrl ? `<img src="${firma.dataUrl}" alt="Firma" style="position:absolute;left:22%;top:86.8%;width:8.5%;height:4.6%;object-fit:contain;object-position:center bottom">`
    : firma?.typedName ? `<div style="position:absolute;left:22%;top:86.8%;width:8.5%;height:4.6%;display:flex;align-items:flex-end;justify-content:center;font:italic 11pt 'Brush Script MT','Segoe Script',cursive">${esc(firma.typedName)}</div>` : '';
  const txt = `${esc(c.nombre || '')}${fecha ? ' · ' + esc(fechaFormato(fecha)) : ''}`;
  return `<div class="trip-hoja"><div class="trip-lienzo">
    <img class="trip-img" src="${src}" alt="Tríptico de Derechos y Obligaciones del CONOCER">
    ${txt ? `<div style="position:absolute;left:.8%;top:90.2%;width:21%;font:6.3pt Arial,sans-serif;line-height:1;white-space:nowrap;overflow:hidden">${txt}</div>` : ''}${f}
  </div></div>`;
}

/* ── Formato de Atención a Usuarios ──────────────────────────────────── */
const marca = v => v ? 'X' : '';
export function formatoAtencion(enc = {}, c = {}, { folio = '', lugar = '', evaluador = '', firmaCandidato = null, firmaEvaluador = null } = {}) {
  /* v55 (Humberto, 11-oct): igual al formato oficial y a la pág. 2 de los
     portafolios de Paideia: «Folio:» del SII bajo el título, Medio de
     Contacto en rejilla 2×2, Lugar y Fecha, y las cinco preguntas con
     Bueno / Regular / Malo y la X debajo. */
  const a = enc.atencion || {}, r = a.r || {};
  const fecha = fechaFormato(String(enc.fecha || '').slice(0, 10));
  const cp = c.cp || (String(c.domicilio || '').match(/\b\d{5}\b/) || [''])[0];
  const m = a.medio || '';
  const val = {
    Presencial: m === 'Presencial' ? 'X' : '',
    'Telefónico': m === 'Telefónico' ? 'X' : m === 'Watsapp empresarial' ? 'Watsapp empresarial' : '',
    'E-Mail': m === 'E-Mail' ? (c.email ? esc(c.email) : 'X') : '',
    Otro: m === 'Otro' ? esc(a.otro || 'X') : '',
  };
  const g = (w = '') => `class="lb" style="font-weight:normal;text-align:center;${w}"`;
  const dato = (w = '') => `style="font-weight:bold;text-align:center;font-family:Arial,sans-serif;${w}"`;
  return hoja('Formato de Atención a Usuarios', `
    <div style="text-align:center;line-height:1.35;margin:0 0 2mm">
      <b style="font-size:11pt">Sistema Nacional de Competencia en la operación de la Evaluación y Certificación</b><br>
      ${FA.titulo}<br>Folio: <b>${esc(folio)}</b></div>
    <table class="fmt-t" style="border:0"><tr>
      <td rowspan="2" ${g('width:28mm;font-weight:normal;text-align:center')}>Medio de<br>Contacto</td>
      <td style="border:0;width:3mm"></td>
      <td ${g('width:30mm;font-weight:normal;text-align:center')}>Presencial</td><td style="width:42mm">${val.Presencial}</td>
      <td ${g('width:30mm;font-weight:normal;text-align:center')}>Telefónico</td><td>${val['Telefónico']}</td></tr>
      <tr><td style="border:0"></td><td ${g()}>E-Mail</td><td>${val['E-Mail']}</td><td ${g()}>Otro (Escriba el medio)</td><td>${val.Otro}</td></tr></table>
    <table class="fmt-t"><tr><td ${g('width:28mm;font-weight:normal;text-align:center')}>Lugar</td><td ${dato()}>${esc(String(lugar).toUpperCase())}</td>
      <td ${g('width:30mm;font-weight:normal;text-align:center')}>Fecha</td><td ${dato('width:45mm;font-weight:bold;text-align:center')}>${esc(fecha)}</td></tr></table>
    <p style="font-size:10pt;margin:0 0 1mm"><b>Estimado usuario</b>, le agradeceremos que conteste el siguiente cuestionario para mejorar nuestro servicio.</p>
    <table class="fmt-t"><tr><td colspan="4" class="lb" style="text-align:center">DATOS GENERALES DEL USUARIO</td></tr>
      <tr><td ${g()} rowspan="2" style="width:28mm;font-weight:normal;text-align:center">NOMBRE</td><td colspan="3" ${dato()}>${esc(String(c.nombre || '').toUpperCase())}</td></tr>
      <tr><td colspan="3" ${g()}>Apellidos Paterno, Materno y Nombre (s)</td></tr>
      <tr><td ${g()} rowspan="2">Domicilio</td><td colspan="3" ${dato()}>${esc(String(c.domicilio || '').toUpperCase())}</td></tr>
      <tr><td colspan="3" ${g()}>(Calle; numero exterior y en su caso número interior)</td></tr>
      <tr><td ${g()}>Colonia</td><td ${dato()}>${esc(String(c.colonia || '').toUpperCase())}</td><td ${g('width:30mm;font-weight:normal;text-align:center')}>Código Postal</td><td ${dato()}>${esc(cp)}</td></tr>
      <tr><td ${g()}>Delegación o Municipio</td><td ${dato()}>${esc(String(c.municipio || '').toUpperCase())}</td><td ${g()}>Estado</td><td ${dato()}>${esc(String(c.estado || '').toUpperCase())}</td></tr>
      <tr><td ${g()}>Ciudad</td><td ${dato()}>${esc(String(c.ciudad || c.municipio || '').toUpperCase())}</td><td ${g()}>Fax</td><td></td></tr>
      <tr><td ${g()}>Teléfonos (s) Incluyendo Clave Lada</td><td ${dato()}>${esc([c.telefonoCelular, c.telefonoCasa].filter(Boolean).join(' / '))}</td><td ${g()}>E-Mail</td><td ${dato()}>${esc(c.email || '')}</td></tr>
      <tr><td colspan="4" class="lb" style="text-align:center">EC o área de interés ${esc(String(CONFIG.marca?.estandar || 'EC1375').replace(/^EC\s*/i, ''))}</td></tr>
      <tr><td colspan="2" style="height:24mm;text-align:center;vertical-align:bottom">${firmaCaja(firmaCandidato, 36)}<b>${esc(String(c.nombre || '').toUpperCase())}</b><br><span class="cap">Nombre y firma del usuario (Solo para atención presencial)</span></td>
        <td colspan="2" style="text-align:center;vertical-align:bottom">${firmaCaja(firmaEvaluador, 36)}<b>${esc(String(evaluador).toUpperCase())}</b><br><span class="cap">Nombre y firma de la persona que atendió al usuario.</span></td></tr></table>
    <p style="font-size:10pt;margin:0 0 1mm">Tache la opción que defina la forma en que recibió la atención.</p>
    <table class="fmt-t">${FA.preguntas.map((p, i) => `<tr style="background:#e5e5e5"><td>${esc(p)}</td>${FA.escala.map((e, k) => `<td class="x" style="vertical-align:top;font-weight:normal">${e}<br><b style="font-size:11pt">${marca(r[i] === k)}</b></td>`).join('')}</tr>`).join('')}</table>`, { sinTitulo: true });
}

/* ── Cédula de Evaluación del Servicio a usuarios ────────────────────── */
export function cedulaServicio(enc = {}, c = {}, { evaluador = '', firmaCandidato = null } = {}) {
  const s = enc.servicio || {}, r = s.r || {};
  return hoja('Cédula de Evaluación del Servicio', `
    <p style="text-align:center;margin:0 0 1mm">Sistema Nacional de Competencia en la operación de la Evaluación y Certificación</p>
    <p style="text-align:center;font-weight:bold;font-size:12pt;margin:0 0 3mm">${CS.titulo}</p>
    <table class="fmt-t"><tr><td colspan="3" class="lb" style="text-align:center">DATOS GENERALES DEL USUARIO</td></tr>
      <tr><td class="lb" style="width:40mm">Nombre y firma del usuario</td><td>${esc(String(c.nombre || '').toUpperCase())}<br><span class="cap">Apellidos Paterno, Materno y Nombre (s)</span></td>
        <td style="width:50mm;text-align:center">${firmaCaja(firmaCandidato, 32)}<span class="cap">Firma</span></td></tr>
      <tr><td class="lb">Nombre completo del lugar o persona que realizó su evaluación.</td><td colspan="2">${esc(evaluador)}</td></tr></table>
    <table class="fmt-t"><tr><td class="lb" colspan="${CS.medios.length}">Medio por el cual contactó a la organización o persona que le realizó la evaluación.</td></tr>
      <tr>${CS.medios.map(m => `<td style="text-align:center">${m === 'Otro' ? 'Otro (Indique cuál en las líneas de abajo)' : m}<br><b>${marca(s.medio === m) || '&nbsp;'}</b></td>`).join('')}</tr>
      ${s.medio === 'Otro' ? `<tr><td colspan="${CS.medios.length}">${esc(s.otro || '')}</td></tr>` : ''}</table>
    <p style="font-size:9.5pt">Marque con un X la opción que usted considere adecuada de acuerdo a su opinión. Si alguno de los aspectos a evaluar no aplica escriba NA en la columna “Bueno”</p>
    <table class="fmt-t"><tr><td class="lb">Aspecto a calificar</td>${CS.escala.slice(0, 3).map(e => `<td class="lb x">${e}</td>`).join('')}</tr>
      ${CS.aspectos.map((p, i) => `<tr><td>${esc(p)}</td><td class="x">${r[i] === 3 ? 'NA' : marca(r[i] === 0)}</td><td class="x">${marca(r[i] === 1)}</td><td class="x">${marca(r[i] === 2)}</td></tr>`).join('')}</table>
    <p style="margin:2mm 0 1mm"><b>Comentarios y/o sugerencias:</b></p>
    <div style="border-bottom:1px solid #000;min-height:18mm;font-size:10pt">${esc(s.comentarios || '')}</div>
    <p style="font-size:9.5pt;margin-top:4mm">Gracias por su tiempo de llenado de este formato, su opinión es valiosa para mejorar nuestro servicio.<br>
      Si requiere ampliar la información escriba a contacto@conocer.gob.mx, con gusto le atenderemos.</p>`);
}

/* ── Acuses de recibido ──────────────────────────────────────────────── */
const ACUSES = {
  triptico: ['ACUSE DE RECIBIDO TRÍPTICO DE DERECHOS Y OBLIGACIONES DEL USUARIO', 'ACUSO DE RECIBIDO CON CONFORMIDAD UN TRÍPTICO DE DERECHOS Y OBLIGACIONES DEL USUARIO'],
  cedula: ['ACUSE DE RECIBIDO CÉDULA DE EVALUACIÓN', 'ACUSO DE RECIBIDO CON CONFORMIDAD LA CÉDULA DE EVALUACIÓN DE COMPETENCIA'],
  plan: ['ACUSE DE RECIBIDO PLAN DE EVALUACIÓN', 'ACUSO DE RECIBIDO CON CONFORMIDAD COPIA DEL PLAN DE EVALUACIÓN'],
};
export function acuse(tipo, { evaluador = '', candidato = '', fecha = '', firma = null } = {}) {
  const [titulo, texto] = ACUSES[tipo];
  const fila = (k, v) => `<tr><td class="gris der" style="width:52mm">${k}</td><td>${v}</td></tr>`;
  return hoja(titulo, `
    <table class="t acuse-t" style="margin-top:10mm">${fila('Evaluadora/Evaluador:', esc(evaluador))}${fila('Centro de Evaluación:', esc(`${ce().clave || ''} ${ce().nombre || ''}`))}
      ${fila('Candidato/a:', `<b>${esc(String(candidato).toUpperCase())}</b>`)}${fila('Estándar de Competencia:', EC)}${fila('Fecha:', esc(fechaFormato(String(fecha || '').slice(0, 10))))}</table>
    <div class="acuse-barra">${texto}</div>
    <div class="acuse-firma">${firmaCaja(firma, 60)}<p style="margin:2mm 0 0;border-top:1px solid #000;display:inline-block;padding:1mm 20mm 0">Nombre completo y firma<br><b>${esc(String(candidato).toUpperCase())}</b></p></div>`);
}

/* ── Contraportada ───────────────────────────────────────────────────── */
/* v54: como el FORMATO 2026 (pág. 45): los tres logos arriba, el bloque gris
   y abajo a la izquierda red CONOCER con la página y el teléfono. */
export function contraportada() {
  const rc = new URL('formatos/logos/redconocer.webp', location.href).href;
  return hoja('Contraportada', `<div style="width:150mm;height:122mm;background:#aeaaaa;margin:14mm auto 6mm"></div>
    <div style="width:150mm;margin:0 auto;font:9pt Arial,sans-serif;line-height:1.25">
      <img src="${rc}" alt="red CONOCER · Centro de Evaluación" style="width:38mm;display:block">
      <a style="color:#1155cc;text-decoration:underline">www.conocer.gob.mx</a><br>01 800 288 26 66</div>`, { sinTitulo: true, sinPie: true, sinFilete: true });
}
