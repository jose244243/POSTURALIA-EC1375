/* ============================================================================
   POSTURALIA · registro.js — Datos generales del candidato (nuevo alumno)

   Replica el paso "Datos Personales" de la app de registro de Paideia, que
   se llena ANTES del autodiagnóstico: nombre, CURP, domicilio, certificados
   de formación previa escaneados (o "no tengo ninguno"), foto para la Ficha
   de Registro, autorización RENAP, teléfonos, correo y fecha de aplicación.
   Mismos campos obligatorios que Paideia (getMissingFields) y, además:
     · la CURP se valida al capturarla (Paideia solo la valida al hacer el
       PDF, cuando ya es tarde para corregir);
     · el celular se valida a 10 dígitos y el correo con formato.

   Todo vive en el módulo 'candidato' del Store (el panel ya lee de ahí el
   nombre). Los archivos entran con archivos.js — la foto se comprime y viaja
   en el respaldo; un PDF queda registrado con su ficha.
   ========================================================================== */
import { Store } from './store.js';
import { CONFIG } from './config.js';
import { prepararArchivo, guardarArchivo, quitarArchivo, leerArchivo, pesoLegible } from './archivos.js';

const MOD = 'candidato';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const RE_CURP  = /^[A-Z]{4}\d{6}[HMX][A-Z]{5}[A-Z0-9]{2}$/;
export const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const soloDigitos = s => String(s || '').replace(/\D/g, '');

/* Fecha de nacimiento y sexo salen de la CURP (regla de Paideia:
   año > 30 → 19xx; posición 11 = H/M). */
export function datosDeCurp(curp) {
  const c = String(curp || '').toUpperCase();
  if (!RE_CURP.test(c)) return null;
  const aa = +c.slice(4, 6), mm = c.slice(6, 8), dd = c.slice(8, 10);
  const siglo = aa > 30 ? 1900 : 2000;
  return { fechaNacimiento: `${siglo + aa}-${mm}-${dd}`, genero: c[10] === 'H' ? 'Hombre' : c[10] === 'M' ? 'Mujer' : 'No binario' };
}

export const datos = () => Store.get(MOD, {}) || {};

export const ESTADOS_MX = ['Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 'Chihuahua', 'Ciudad de México',
  'Coahuila', 'Colima', 'Durango', 'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'Michoacán', 'Morelos', 'Nayarit',
  'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala',
  'Veracruz', 'Yucatán', 'Zacatecas'];
/* Domicilio completo en una línea (para los formatos que lo piden así) */
export const domicilioCompleto = (d = {}) => [d.domicilio, d.colonia && 'Col. ' + d.colonia, d.cp && 'C.P. ' + d.cp, d.municipio, d.ciudad !== d.municipio && d.ciudad, d.estado]
  .map(x => String(x || '').trim()).filter(Boolean).join(', ');

function certificadosCompletos(d = datos()) {
  const filas = (d.certificados || []).filter(c => (c.nombre || '').trim() || leerArchivo(MOD, `cert_${c.id}`));
  return filas.length > 0 && filas.every(c => (c.nombre || '').trim() && leerArchivo(MOD, `cert_${c.id}`));
}

/* Qué le falta a cada renglón de certificado, en palabras concretas.
   Antes solo decía "sube tus certificados (o marca que no tienes)" aunque
   el candidato YA hubiera subido uno: si le faltaba escribir el nombre, el
   mensaje lo mandaba a marcar "no tengo certificado". */
function pendienteDeCert(c) {
  const nom = (c.nombre || '').trim(), arch = leerArchivo(MOD, `cert_${c.id}`);
  if (nom && !arch) return `Sube el archivo de «${nom}»`;
  if (!nom && arch) return 'Escribe el nombre del certificado que subiste';
  return '';
}

/* Lo que falta, con las mismas palabras que Paideia */
export function faltantes(d = datos()) {
  const f = [];
  if (!(d.nombre || '').trim()) f.push('Nombre completo');
  if (!RE_CURP.test((d.curp || '').toUpperCase())) f.push(d.curp ? 'CURP válida (18 caracteres)' : 'CURP');
  if (!(d.domicilio || '').trim()) f.push('Domicilio');
  if (!(d.sinCertificados || certificadosCompletos(d))) {
    const conAlgo = (d.certificados || []).filter(c => (c.nombre || '').trim() || leerArchivo(MOD, `cert_${c.id}`));
    const concretos = [...new Set(conAlgo.map(pendienteDeCert).filter(Boolean))];
    f.push(...(concretos.length ? concretos
      : ['Subir tus certificados de formación previa (o marcar que no tienes ninguno)']));
  }
  if (!leerArchivo(MOD, 'fotoRegistro')) f.push('Subir tu foto para la Ficha de Registro');
  if (soloDigitos(d.telefonoCelular).length !== 10) f.push('Teléfono celular (10 dígitos)');
  if (!RE_EMAIL.test(d.email || '')) f.push('Correo electrónico');
  if (!d.fechaAplicacion) f.push('Fecha de aplicación');
  return f;
}
export const datosCompletos = () => faltantes().length === 0;

const hoy = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' });

function guardar(cambios) {
  if (Store.soloLectura) return;
  const d = { ...datos(), ...cambios };
  const extra = datosDeCurp(d.curp) || {};
  d.escolaridad = d.sinCertificados ? 'Sin certificaciones previas'
    : (d.certificados || []).map(c => (c.nombre || '').trim()).filter(Boolean).join(', ');
  Store.merge(MOD, { ...cambios, ...extra, escolaridad: d.escolaridad });
}

/* ── Pintado ─────────────────────────────────────────────────────────── */
export function montarDatosCandidato(cont, onCambio = () => {}) {
  if (!datos().fechaAplicacion && !Store.soloLectura) Store.merge(MOD, { fechaAplicacion: hoy() });
  if (!datos().certificados?.length && !datos().sinCertificados && !Store.soloLectura)
    Store.merge(MOD, { certificados: [{ id: Date.now().toString(36), nombre: '' }] });

  const d = datos();
  const campo = (id, etiqueta, oblig, html) => `
    <div class="rg-campo" data-campo="${id}">
      <label for="rg_${id}"><span>${etiqueta}${oblig ? ' <b class="rg-req">*</b>' : ''}</span>
        <small class="rg-estado" data-estado="${id}"></small></label>
      ${html}
    </div>`;

  cont.innerHTML = `
    <h2>Tus datos generales</h2>
    <p class="pn-nota" style="margin-top:0">Como nuevo alumno necesitamos tus datos para tu Ficha de Registro
      oficial (CONOCER). Se guardan solos mientras escribes.</p>
    ${campo('nombre', 'Nombre completo', true, `<input id="rg_nombre" type="text" autocomplete="name" value="${esc(d.nombre)}" placeholder="Ej. María González Pérez">`)}
    ${campo('curp', 'CURP', true, `<input id="rg_curp" type="text" maxlength="18" style="text-transform:uppercase" value="${esc(d.curp)}" placeholder="GOPM850101MDFNRR01">
      <small class="rg-ayuda" id="rg_curpInfo"></small>`)}
    ${campo('domicilio', 'Domicilio: calle y número', true, `<input id="rg_domicilio" type="text" autocomplete="street-address" value="${esc(d.domicilio)}" placeholder="Ej. Av. Juárez 123 Int. 4">
      <div class="rg-dom">
        <label>Colonia <input id="rg_colonia" type="text" value="${esc(d.colonia)}"></label>
        <label>Código postal <input id="rg_cp" type="text" inputmode="numeric" maxlength="5" autocomplete="postal-code" value="${esc(d.cp)}"></label>
        <label>Municipio o alcaldía <input id="rg_municipio" type="text" value="${esc(d.municipio)}"></label>
        <label>Ciudad <input id="rg_ciudad" type="text" autocomplete="address-level2" value="${esc(d.ciudad)}"></label>
        <label>Estado <select id="rg_estado"><option value="">—</option>${ESTADOS_MX.map(e => `<option ${d.estado === e ? 'selected' : ''}>${e}</option>`).join('')}</select></label>
      </div>
      <small class="rg-ayuda">Van en tu Ficha de Registro (RENAP) y en el Formato de Atención a Usuarios.</small>`)}
    ${campo('certificados', 'Certificados de formación previa', true, `
      <small class="rg-ayuda">Sube el certificado o diploma de cada especialidad en la que ya te has formado.
        Escribe el nombre tal cual aparece en el documento.</small>
      <div id="rg_certs"></div>`)}
    ${campo('foto', 'Foto para tu Ficha de Registro', true, `
      <small class="rg-ayuda">Tu evaluador la exige para tu Ficha de Registro oficial (CONOCER). De frente, fondo
        blanco, sin texturas, formal y nítida (JPG, BMP o PNG). Mujeres: frente y orejas descubiertas, sin maquillaje
        ni aretes, blusa clara y lisa. Hombres: orejas descubiertas, pelo corto, sin barba/bigote, camisa clara y lisa.
        Sin retoques. No mayor a 2 meses de antigüedad.</small>
      ${CONFIG.laminaFotoConocer ? `<!-- La lámina oficial del CONOCER con ejemplos, como Paideia: se compara
           más rápido que leer la lista. Se activa en config.js (laminaFotoConocer). -->
      <figure class="rg-lamina" style="margin:8px 0 0;max-width:420px">
        <img src="${esc(CONFIG.laminaFotoConocer)}" alt="Ejemplos oficiales del CONOCER: tres fotografías correctas de 25 × 30 mm y cinco incorrectas — sobreexpuesta, subexpuesta, demasiado cerca, demasiado lejos y con adornos en la cabeza." loading="lazy"
          style="width:100%;border:1px solid var(--border);border-radius:8px">
        <figcaption style="font-size:.74rem;color:var(--muted);margin-top:4px">Ejemplos oficiales del CONOCER. Compara tu foto contra estas antes de subirla.</figcaption>
      </figure>` : ''}
      <div id="rg_foto"></div>`)}
    <label class="ev-check" style="margin:6px 0 2px">
      <input type="checkbox" id="rg_renap" ${d.renapAutorizado ? 'checked' : ''}>
      <span>Autorizo la publicación de mis datos en el RENAP (Registro Nacional de Personas con Competencias Certificadas)</span>
    </label>
    <small class="rg-ayuda" style="display:block;margin-bottom:14px">Es voluntario — permite que empresas u
      organizaciones que buscan tu especialidad certificada te encuentren. Puedes dejarlo sin marcar y seguir normalmente.</small>
    ${campo('telefonoCasa', 'Teléfono de casa', false, `<input id="rg_telefonoCasa" type="tel" value="${esc(d.telefonoCasa)}" placeholder="Opcional">`)}
    ${campo('telefonoCelular', 'Teléfono celular', true, `<input id="rg_telefonoCelular" type="tel" inputmode="numeric" value="${esc(d.telefonoCelular)}" placeholder="10 dígitos">`)}
    ${campo('email', 'Correo electrónico', true, `<input id="rg_email" type="email" autocomplete="email" value="${esc(d.email)}" placeholder="tu@email.com">`)}
    ${campo('fechaAplicacion', 'Fecha de aplicación', true, `<input id="rg_fechaAplicacion" type="date" value="${esc(datos().fechaAplicacion)}">`)}
    <p class="rg-ayuda" style="margin-top:4px">* Campos requeridos para generar tu documento oficial</p>
    <div id="rg_faltan"></div>`;

  const $ = s => cont.querySelector(s);
  if (Store.soloLectura) cont.querySelectorAll('input,textarea,button').forEach(x => x.disabled = true);

  const estados = () => {
    const x = datos(), falt = faltantes(x);
    const ok = {
      nombre: !!(x.nombre || '').trim(), curp: RE_CURP.test((x.curp || '').toUpperCase()),
      domicilio: !!(x.domicilio || '').trim(), certificados: !!(x.sinCertificados || certificadosCompletos(x)),
      foto: !!leerArchivo(MOD, 'fotoRegistro'), telefonoCelular: soloDigitos(x.telefonoCelular).length === 10,
      email: RE_EMAIL.test(x.email || ''), fechaAplicacion: !!x.fechaAplicacion, telefonoCasa: true,
    };
    cont.querySelectorAll('[data-estado]').forEach(s => {
      const k = s.dataset.estado; if (k === 'telefonoCasa') return;
      s.textContent = ok[k] ? '✓ Completado' : '○ Pendiente';
      s.className = 'rg-estado ' + (ok[k] ? 'rg-ok' : 'rg-pend');
      s.closest('.rg-campo').classList.toggle('rg-campo--ok', !!ok[k]);
    });
    const cd = datosDeCurp(x.curp);
    $('#rg_curpInfo').textContent = cd
      ? `Fecha de nacimiento ${cd.fechaNacimiento.split('-').reverse().join('/')} · ${cd.genero}`
      : (x.curp && x.curp.length >= 18 ? 'Esta CURP no tiene un formato válido: revísala contra tu constancia.' : '');
    $('#rg_faltan').innerHTML = falt.length
      ? `<div class="ev-pendiente" style="margin-top:10px">Falta: ${falt.map(esc).join(' · ')}</div>` : '';
    onCambio();
  };

  const texto = k => {
    const el = $(`#rg_${k}`); if (!el) return;
    el.addEventListener('input', () => {
      let v = el.value;
      if (k === 'curp') { v = v.toUpperCase().replace(/\s/g, ''); if (el.value !== v) el.value = v; }
      guardar({ [k]: v }); estados();
    });
  };
  ['nombre', 'curp', 'domicilio', 'colonia', 'cp', 'municipio', 'ciudad', 'estado', 'telefonoCasa', 'telefonoCelular', 'email', 'fechaAplicacion'].forEach(texto);
  $('#rg_estado').addEventListener('change', e => { guardar({ estado: e.target.value }); estados(); });
  $('#rg_renap').addEventListener('change', e => guardar({ renapAutorizado: e.target.checked }));

  /* ── Certificados ── */
  const errores = {};
  const pintarCerts = () => {
    const x = datos(), lista = x.certificados || [];
    $('#rg_certs').innerHTML = `
      <label class="ev-check" style="margin:8px 0">
        <input type="checkbox" id="rg_sinCert" ${x.sinCertificados ? 'checked' : ''}>
        <span>No tengo ningún certificado o diploma de formación previa</span></label>
      <div ${x.sinCertificados ? 'hidden' : ''}>
        ${lista.map(c => {
          const a = leerArchivo(MOD, `cert_${c.id}`);
          return `<div class="rg-cert" data-id="${c.id}">
            <input type="text" class="rg-cert-nom" value="${esc(c.nombre)}" placeholder="Nombre de la certificación tal cual aparece en tu certificado" aria-label="Nombre de la certificación">
            <label class="btn-plat btn-plat--secundario rg-subir">${a ? 'Cambiar archivo' : 'Subir archivo'}
              <input type="file" class="rg-cert-arch" accept=".pdf,image/jpeg,image/png,image/webp" hidden></label>
            <button type="button" class="rg-quitar" title="Quitar">Quitar</button>
            ${a ? `<small class="rg-ok">✓ ${esc(a.nombre || 'Archivo')}${a.bytes ? ' · ' + pesoLegible(a.bytes) : ''}${a.paginas ? ` · PDF de ${a.paginas} pág.` : ''}${a.viaja === false ? ' · de este archivo solo quedó el nombre: vuelve a subirlo' : ''}</small>` : ''}
            ${errores[c.id] ? `<small class="rg-err">⚠ ${esc(errores[c.id])}</small>`
              : pendienteDeCert(c) ? `<small class="rg-err">${esc(pendienteDeCert(c))}</small>` : ''}
          </div>`; }).join('')}
        <button type="button" class="btn-plat btn-plat--secundario" id="rg_addCert" style="margin-top:6px">+ Agregar otro certificado</button>
      </div>`;
    if (Store.soloLectura) { $('#rg_certs').querySelectorAll('input,button').forEach(b => b.disabled = true); return; }
    $('#rg_sinCert').onchange = e => { guardar({ sinCertificados: e.target.checked }); pintarCerts(); estados(); };
    $('#rg_addCert').onclick = () => { guardar({ certificados: [...(datos().certificados || []), { id: Date.now().toString(36), nombre: '' }] }); pintarCerts(); estados(); };
    $('#rg_certs').querySelectorAll('.rg-cert').forEach(fila => {
      const id = fila.dataset.id;
      const lista2 = () => datos().certificados || [];
      fila.querySelector('.rg-cert-nom').oninput = e => {
        guardar({ certificados: lista2().map(c => c.id === id ? { ...c, nombre: e.target.value } : c) }); estados();
        const c = lista2().find(x => x.id === id), txt = c ? pendienteDeCert(c) : '';
        let aviso = fila.querySelector('.rg-err');
        if (!txt) { aviso?.remove(); return; }
        if (!aviso) { aviso = document.createElement('small'); aviso.className = 'rg-err'; fila.appendChild(aviso); }
        aviso.textContent = txt;
      };
      fila.querySelector('.rg-quitar').onclick = () => {
        quitarArchivo(MOD, `cert_${id}`);
        guardar({ certificados: lista2().filter(c => c.id !== id) }); pintarCerts(); estados();
      };
      fila.querySelector('.rg-cert-arch').onchange = async e => {
        const f = e.target.files[0]; if (!f) return;
        delete errores[id];
        /* Un PDF no se guarda completo (solo su ficha) y las imágenes se
           comprimen, así que el tope de 10 MB solo estorbaba: un diploma
           escaneado en PDF suele pesar más y el candidato se quedaba atorado. */
        if (/^image\//.test(f.type) && f.size > 40 * 1024 * 1024) {
          errores[id] = 'La imagen pesa más de 40 MB; tómale una foto con menor resolución.';
          pintarCerts(); estados(); return;
        }
        fila.querySelector('.rg-subir').firstChild.textContent = 'Guardando…';
        /* v47: el PDF del diploma ahora se guarda completo y se revisa
           (dañado, con contraseña, más de 10 MB) — va al portafolio. */
        const reg = await prepararArchivo(f, { modulo: MOD, clave: `cert_${id}` });
        if (reg.rechazo) { errores[id] = reg.rechazo; pintarCerts(); estados(); return; }
        const res = guardarArchivo(MOD, `cert_${id}`, reg);
        if (!res.ok) errores[id] = 'No se pudo guardar en este navegador (sin espacio). Libera espacio o usa otro navegador.';
        /* Si subió el archivo sin escribir el nombre, se propone el del archivo */
        const fila2 = lista2().find(c => c.id === id);
        if (res.ok && fila2 && !(fila2.nombre || '').trim()) {
          const sugerido = f.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim();
          guardar({ certificados: lista2().map(c => c.id === id ? { ...c, nombre: sugerido } : c) });
        }
        pintarCerts(); estados();
      };
    });
  };

  /* ── Foto ── */
  const pintarFoto = () => {
    const a = leerArchivo(MOD, 'fotoRegistro');
    const src = (/^data:image\//.test(a?.dato || '') ? a.dato : '') || a?.miniatura;
    $('#rg_foto').innerHTML = `
      <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-top:8px">
        ${src ? `<img src="${src}" alt="Tu foto" style="width:105px;height:135px;object-fit:cover;border-radius:8px;border:1px solid var(--border)">` : ''}
        <label class="btn-plat btn-plat--secundario rg-subir">${a ? 'Cambiar foto' : 'Subir foto'}
          <input type="file" id="rg_fotoArch" accept="image/jpeg,image/png,image/bmp" hidden></label>
        ${a ? `<small class="rg-ok">✓ ${esc(a.nombre || 'Foto')}</small>` : ''}
      </div>`;
    if (Store.soloLectura) return;
    $('#rg_fotoArch').onchange = async e => {
      const f = e.target.files[0]; if (!f) return;
      if (!/^image\/(jpeg|png|bmp)$/.test(f.type)) { alert('Tipo de archivo no permitido. Usa JPG, PNG o BMP.'); return; }
      if (f.size > 40 * 1024 * 1024) { alert('La foto pesa más de 40 MB; tómala con menor resolución.'); return; }
      const reg = await prepararArchivo(f, { modulo: MOD, clave: 'fotoRegistro' });
      if (reg.rechazo) { alert(reg.rechazo); return; }
      const res = guardarArchivo(MOD, 'fotoRegistro', reg);
      if (!res.ok) alert('No se pudo guardar la foto en este navegador (sin espacio).');
      pintarFoto(); estados();
    };
  };

  if (!document.getElementById('rg-estilo')) {
    const st = document.createElement('style'); st.id = 'rg-estilo';
    st.textContent = `
      .rg-campo{margin:0 0 14px}
      .rg-campo label{display:flex;justify-content:space-between;gap:10px;font-weight:600;font-size:.88rem;margin-bottom:6px;color:var(--dark)}
      .rg-campo input[type=text],.rg-campo input[type=tel],.rg-campo input[type=email],.rg-campo input[type=date],.rg-campo textarea{
        width:100%;padding:10px 12px;border:2px solid #FCA5A5;border-radius:10px;font:inherit;font-size:.92rem;background:var(--white)}
      .rg-campo--ok input[type=text],.rg-campo--ok input[type=tel],.rg-campo--ok input[type=email],.rg-campo--ok input[type=date],.rg-campo--ok textarea{border-color:#6EE7B7}
      .rg-campo[data-campo=telefonoCasa] input{border-color:var(--border)}
      .rg-campo label.ev-check{justify-content:flex-start;font-weight:500}
      .rg-req{color:#DC2626}
      .rg-estado{font-weight:500;font-size:.74rem}.rg-err{color:#B91C1C;font-size:.8rem;font-weight:600}.rg-ok{color:#059669;font-size:.8rem}.rg-pend{color:var(--muted)}
      .rg-ayuda{display:block;color:var(--muted);font-size:.8rem;line-height:1.55;margin:2px 0 4px}
      .rg-cert{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:10px;border:1px dashed var(--border);border-radius:10px;margin-bottom:8px}
      .rg-cert .rg-cert-nom{flex:1 1 260px;border:1px solid var(--border)!important}
      .rg-cert small{flex-basis:100%}
      .rg-subir{cursor:pointer;margin:0}
      .rg-quitar{background:none;border:0;color:var(--muted);text-decoration:underline;cursor:pointer;font-size:.8rem}
      .rg-dom{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px 12px;margin:8px 0 4px}
      .rg-campo .rg-dom label{display:flex;flex-direction:column;gap:4px;font-weight:500;font-size:.82rem;margin:0}
      .rg-campo .rg-dom input,.rg-campo .rg-dom select{width:100%;padding:9px 11px;border:1.5px solid var(--border)!important;border-radius:10px;font:inherit;font-size:.9rem;background:var(--white)}`;
    document.head.appendChild(st);
  }

  pintarCerts(); pintarFoto(); estados();
}
