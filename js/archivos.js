/* ============================================================================
   POSTURALIA · Plataforma de Certificación
   archivos.js — Archivos que el candidato entrega de verdad

   Antes, "entregar una evidencia" era oprimir un botón que decía "Ya lo
   entregué". El expediente quedaba con un `true` y nada más: el Centro
   Evaluador no recibía el INE, recibía la afirmación de que existe.

   Ahora el archivo entra a la plataforma y viaja dentro del respaldo, que es
   el mismo .json que el candidato ya descarga y el Centro ya arrastra al
   panel (o, con la nube, el mismo expediente que el Centro ve).

   ── v47: los PDF y los archivos grandes también viajan ────────────────────
   Hasta v46, un PDF (la CURP de gob.mx, un INE escaneado, un certificado) se
   quedaba en la ficha: nombre y peso, sin el archivo. Y una foto que aun
   comprimida pasaba de 900 KB, igual. El Centro armaba el portafolio con
   hojas «pendiente» de documentos que el candidato sí había entregado.

   Ahora:
     · Hasta 10 MB por archivo, foto o PDF.
     · Lo que cabe (≤ 900 KB) vive junto al avance, como antes.
     · Lo que no, se guarda en IndexedDB de este navegador (cientos de MB) y
       se mete al respaldo al descargarlo (Store.exportarCompleto).
     · Cada archivo se revisa al subirlo (ver revisar*): un PDF dañado o con
       contraseña, un archivo de 30 MB o una foto de diploma en PDF se
       rechazan con la razón; lo dudoso (la CURP del documento no es la del
       registro, una foto muy chica, fondo que no es blanco) se guarda con un
       aviso que ven el candidato y el Centro.
     · INE, capturas y certificados aceptan varios archivos (frente y
       reverso, varias capturas, varios diplomas).

   ── Por qué se comprimen las imágenes ─────────────────────────────────────
   La foto de un INE tomada con un celular de hoy pesa entre 3 y 8 MB. A 1400
   px de lado mayor y calidad 0.72 queda perfectamente legible —se leen la
   CURP y el nombre— y pesa entre 150 y 300 KB.
   ========================================================================== */

import { Store } from './store.js';

/* Hasta aquí el archivo vive junto al avance (localStorage); arriba de esto
   se va a IndexedDB para no llenar la cuota a media entrega. */
const TOPE_POR_ARCHIVO = 900 * 1024;           // 900 KB en data URL
export const LIMITE_BYTES = 10 * 1024 * 1024;  // 10 MB por PDF
const LIMITE_FOTO = 40 * 1024 * 1024;          // una foto se comprime: hasta 40 MB

/* Evidencias que aceptan varios archivos */
export const MULTIPLES = new Set(['ine', 'zoom', 'certificados']);
/* Las que tienen que ser foto, no PDF */
const SOLO_IMAGEN = new Set(['fotoDiploma', 'fotoRegistro']);

export const esImagen = tipo => /^image\//.test(tipo || '');
const esPdfArchivo = f => f.type === 'application/pdf' || /\.pdf$/i.test(f.name || '');
const TIPOS_IMAGEN = /^image\/(jpeg|png|webp|gif|bmp)$/;

export const pesoLegible = n =>
  n < 1024 ? `${n} B`
  : n < 1024 * 1024 ? `${(n / 1024).toFixed(0)} KB`
  : `${(n / 1048576).toFixed(1)} MB`;

const RE_CURP = /[A-Z][AEIOUX][A-Z]{2}\d{6}[HM][A-Z]{2}[B-DF-HJ-NP-TV-Z]{3}[A-Z0-9]\d/g;
export const curpsEnTexto = t => [...new Set((String(t || '').toUpperCase().replace(/\s+/g, ' ').match(RE_CURP) || []))];

const leerComoDataUrl = file => new Promise((ok, mal) => {
  const r = new FileReader();
  r.onload = () => ok(r.result);
  r.onerror = () => mal(r.error);
  r.readAsDataURL(file);
});

/* ── Leer, revisar y preparar ────────────────────────────────────────────
   opciones: { modulo, clave, curp }  (curp = la del registro, para cotejar)
   Devuelve el registro listo para guardarArchivo(), o { rechazo: '…' }.  */
export async function prepararArchivo(file, { modulo = '', clave = '', curp = '' } = {}) {
  const base = {
    nombre: file.name,
    tipo:   file.type || (esPdfArchivo(file) ? 'application/pdf' : 'application/octet-stream'),
    bytes:  file.size,
    fecha:  new Date().toISOString(),
  };

  if (!file.size) return { rechazo: 'El archivo está vacío. Vuelve a elegirlo.' };
  const pdf = esPdfArchivo(file);
  if (pdf && file.size > LIMITE_BYTES)
    return { rechazo: `El PDF pesa ${pesoLegible(file.size)} y el máximo es ${pesoLegible(LIMITE_BYTES)}. Escanéalo a menor resolución o en blanco y negro.` };
  if (!pdf && file.size > LIMITE_FOTO)
    return { rechazo: `La foto pesa ${pesoLegible(file.size)}; el máximo es ${pesoLegible(LIMITE_FOTO)}. Tómala con menor resolución.` };

  if (pdf && SOLO_IMAGEN.has(clave))
    return { rechazo: 'Aquí va una foto (JPG o PNG), no un PDF.' };
  if (!pdf && !TIPOS_IMAGEN.test(file.type || ''))
    return { rechazo: /heic|heif/i.test(file.type + file.name)
      ? 'Las fotos HEIC del iPhone no se pueden leer aquí. En el iPhone: Ajustes → Cámara → Formatos → «Más compatible», o comparte la foto como JPG.'
      : 'Solo se aceptan fotos (JPG, PNG) o PDF.' };

  return pdf ? prepararPdf(file, base, { modulo, clave, curp }) : prepararImagen(file, base, { modulo, clave });
}

async function prepararPdf(file, base, { modulo, clave, curp }) {
  const { revisarPdf, miniaturaPdf } = await import('./pdf-util.js');
  let dato;
  try { dato = await leerComoDataUrl(file); } catch { return { rechazo: 'No se pudo leer el archivo. Intenta de nuevo.' }; }
  dato = 'data:application/pdf;base64,' + dato.slice(dato.indexOf(',') + 1);

  const r = await revisarPdf(dato);
  if (!r.ok) return { rechazo: r.motivo === 'contrasena'
    ? 'El PDF tiene contraseña y el Centro no lo podría abrir. Guárdalo sin contraseña y vuelve a subirlo.'
    : 'El PDF está dañado o no es un PDF de verdad. Descárgalo o escanéalo otra vez.' };

  const notas = [];
  let nivel = 'ok';
  notas.push(`PDF de ${r.paginas} página${r.paginas === 1 ? '' : 's'}`);

  if (clave === 'curp') {
    const encontradas = curpsEnTexto(r.texto);
    const mia = String(curp || '').toUpperCase().trim();
    if (encontradas.length && mia) {
      if (encontradas.includes(mia)) notas.push(`Trae tu CURP ${mia}`);
      else { nivel = 'aviso'; notas.push(`El documento trae la CURP ${encontradas[0]} y en tu registro dice ${mia}. Revisa cuál es la correcta.`); }
    } else if (encontradas.length) notas.push(`Trae la CURP ${encontradas[0]}`);
    else notas.push('No se pudo leer la CURP del documento (parece escaneado): tu evaluador lo revisa.');
  }
  if (clave === 'ine' && r.paginas < 2) notas.push('Si en esta página no vienen los dos lados, sube también el reverso.');

  const miniatura = await miniaturaPdf(dato);
  return guardarPesado({ ...base, paginas: r.paginas, miniatura, revision: { nivel, notas } }, dato, { modulo, clave });
}

async function prepararImagen(file, base, { modulo, clave }) {
  let grande, chica, info;
  try {
    info = await analizarImagen(file);
    grande = await comprimir(file, 1400, 0.72);
    chica  = await comprimir(file, 260, 0.6);
  } catch {
    return { rechazo: 'No se pudo leer la imagen. Intenta con otra foto o con un PDF.' };
  }

  const notas = [], corto = Math.min(info.w, info.h);
  let nivel = 'ok';
  notas.push(`Foto de ${info.w} × ${info.h} px`);
  if (corto < 500) { nivel = 'aviso'; notas.push('Se ve muy chica: puede que no se lea al imprimir. Si puedes, súbela con más calidad.'); }
  if (clave === 'fotoDiploma' || clave === 'fotoRegistro') {
    if (info.w > info.h * 1.05) { nivel = 'aviso'; notas.push('La foto está acostada: tiene que ser vertical, de frente.'); }
    if (!info.bordeClaro) { nivel = 'aviso'; notas.push('El fondo no parece blanco. El CONOCER la pide con fondo blanco y liso.'); }
  }
  if (clave === 'ine') notas.push('Sube el frente y el reverso (pueden ser dos fotos).');

  if (grande.length > TOPE_POR_ARCHIVO) {
    const media = await comprimir(file, 1000, 0.6).catch(() => grande);
    if (media.length <= TOPE_POR_ARCHIVO) grande = media;
  }
  return guardarPesado({ ...base, ancho: info.w, alto: info.h, miniatura: chica, revision: { nivel, notas } }, grande, { modulo, clave });
}

/* Lo que cabe va en el registro; lo que no, a IndexedDB de este navegador.
   Si IndexedDB no está (modo privado de algunos navegadores) se rechaza con
   la razón, en vez de guardar una ficha sin archivo que parezca entregada. */
async function guardarPesado(registro, dato, { modulo, clave }) {
  if (dato.length <= TOPE_POR_ARCHIVO) return { ...registro, dato, viaja: true };
  try {
    const { guardarGrande, disponible } = await import('./almacen-grande.js');
    if (!disponible()) throw new Error('sin IndexedDB');
    const k = `yo|${modulo || 'x'}|${clave || 'x'}|${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    await guardarGrande(k, { dato, miniatura: registro.miniatura || null });
    return { ...registro, dato: null, viaja: true, enAlmacen: true, clave: k };
  } catch {
    return { rechazo: 'Este navegador no deja guardar archivos grandes (¿ventana privada?). Ábrelo en una ventana normal o sube un archivo de menos de 900 KB.' };
  }
}

/* Tamaño y si el borde de la foto es claro (fondo blanco) */
function analizarImagen(file) {
  return new Promise((ok, mal) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
      let bordeClaro = true;
      try {
        const n = 60, c = document.createElement('canvas');
        c.width = n; c.height = n;
        const x = c.getContext('2d', { willReadFrequently: true });
        x.drawImage(img, 0, 0, n, n);
        const d = x.getImageData(0, 0, n, n).data;
        let suma = 0, cuenta = 0;
        for (let i = 0; i < n; i++) for (const [px, py] of [[i, 0], [i, n - 1], [0, i], [n - 1, i]]) {
          const o = (py * n + px) * 4;
          suma += (d[o] + d[o + 1] + d[o + 2]) / 3; cuenta++;
        }
        bordeClaro = suma / cuenta >= 200;
      } catch {}
      ok({ w, h, bordeClaro });
    };
    img.onerror = () => { URL.revokeObjectURL(url); mal(new Error('imagen ilegible')); };
    img.src = url;
  });
}

/* Redibuja la imagen a un lado máximo y la saca como JPEG */
function comprimir(file, ladoMax, calidad) {
  return new Promise((ok, mal) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      const escala = Math.min(1, ladoMax / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width  = Math.round(img.width  * escala);
      c.height = Math.round(img.height * escala);

      const ctx = c.getContext('2d');
      /* Fondo blanco: un PNG con transparencia pasado a JPEG deja las zonas
         transparentes en negro, y una credencial escaneada así se vuelve
         ilegible. */
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0, c.width, c.height);

      ok(c.toDataURL('image/jpeg', calidad));
    };

    img.onerror = () => { URL.revokeObjectURL(url); mal(new Error('imagen ilegible')); };
    img.src = url;
  });
}

/* ── Guardar, con la cuota en mente ───────────────────────────────────────
   { agregar: true } suma el archivo a los que ya había (INE frente y
   reverso, varias capturas). localStorage no avisa de que se va a llenar:
   revienta en la escritura. Si eso pasa, el archivo se manda a IndexedDB
   antes de rendirse.                                                     */
export function guardarArchivo(modulo, clave, registro, { agregar = false } = {}) {
  if (Store.soloLectura) return { ok: false, motivo: 'solo-lectura' };
  if (!registro || registro.rechazo) return { ok: false, motivo: 'rechazado', rechazo: registro?.rechazo };

  const previo = Store.get(modulo).documentos || {};
  const antes = previo[clave];
  const lista = agregar ? [...(Array.isArray(antes) ? antes : (antes && typeof antes === 'object' && !antes.liga ? [antes] : [])), registro] : null;
  const escribir = valor => Store.set(modulo, {
    ...Store.get(modulo),
    documentos: { ...previo, [clave]: valor },
  });

  try {
    if (escribir(lista || registro)) return { ok: true, completo: true, registro };
  } catch {}

  return { ok: false, motivo: 'sin-espacio' };
}

/* Cuando localStorage se llenó: el archivo (y su miniatura) se van a
   IndexedDB y en el avance queda solo la ficha, de unos cientos de bytes.
   Así un navegador lleno no deja al candidato sin entregar. */
export async function mandarAlAlmacen(registro, { modulo = '', clave = '' } = {}) {
  if (!registro || registro.enAlmacen || !(registro.dato || registro.miniatura)) return registro;
  const { guardarGrande, disponible } = await import('./almacen-grande.js');
  if (!disponible()) return null;
  const k = `yo|${modulo || 'x'}|${clave || 'x'}|${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  try { await guardarGrande(k, { dato: registro.dato || null, miniatura: registro.miniatura || null }); }
  catch { return null; }
  const { dato, miniatura, ...ficha } = registro;
  return { ...ficha, dato: null, miniatura: null, viaja: true, enAlmacen: true, clave: k };
}

/* Quita un archivo (o todos los de esa evidencia). Lo que estaba en
   IndexedDB se borra también, para no dejar archivos huérfanos. */
export function quitarArchivo(modulo, clave, indice = null) {
  if (Store.soloLectura) return false;
  const docs = { ...(Store.get(modulo).documentos || {}) };
  const v = docs[clave];
  const lista = Array.isArray(v) ? v : [v];
  const fuera = indice == null ? lista : [lista[indice]];
  if (indice == null || lista.length <= 1) delete docs[clave];
  else docs[clave] = lista.filter((_, i) => i !== indice);
  fuera.filter(a => a?.enAlmacen && a.clave).forEach(a =>
    import('./almacen-grande.js').then(m => m.borrarGrande(a.clave)).catch(() => {}));
  return Store.set(modulo, { ...Store.get(modulo), documentos: docs });
}

/* ── Leer lo guardado ─────────────────────────────────────────────────────
   Tolera las formas que ha tenido un documento a lo largo de las versiones:
   `true` del checklist viejo, una cadena con una liga, la ficha completa y
   la lista de varios archivos. Un expediente exportado hace un mes tiene que
   seguir abriendo.                                                        */
export function leerArchivo(modulo, clave) {
  const v = (Store.get(modulo).documentos || {})[clave];
  if (!v) return null;

  if (v === true)             return { marcado: true, nombre: null };
  if (typeof v === 'string')  return { liga: v, nombre: null };
  if (Array.isArray(v))       return v.length ? { ...v[0], varios: v.length } : null;
  return v;
}

/* Todos los archivos de una evidencia, como lista */
export function leerArchivos(modulo, clave) {
  const v = (Store.get(modulo).documentos || {})[clave];
  if (!v || v === true || typeof v === 'string') return [];
  return (Array.isArray(v) ? v : [v]).filter(a => a && typeof a === 'object' && !a.liga);
}

/* ¿Llega el archivo al Centro? (dato aquí, o en IndexedDB de este equipo) */
export const archivoCompleto = a => !!(a && (a.dato || (a.enAlmacen && a.clave) || a.liga));

/* ¿Cuánto del respaldo se está yendo en archivos? */
export function pesoDeArchivos(modulo) {
  const docs = Store.get(modulo).documentos || {};
  return Object.values(docs).flat().reduce((n, v) => {
    if (!v || typeof v !== 'object') return n;
    return n + (v.dato?.length || (v.enAlmacen ? Math.round((v.bytes || 0) * 1.37) : 0)) + (v.miniatura?.length || 0);
  }, 0);
}
