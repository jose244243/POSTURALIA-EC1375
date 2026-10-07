/* ============================================================================
   POSTURALIA · Plataforma de Certificación
   archivos-nube.js — Los archivos del candidato viven en Supabase Storage

   ── El problema ────────────────────────────────────────────────────────────
   Con la nube encendida, el avance del candidato viaja en la fila `progreso`.
   Hasta v47 los archivos (INE, CURP, capturas, diplomas) viajaban DENTRO de
   esa fila como texto base64, y los de más de 900 KB no viajaban: se quedaban
   en IndexedDB del navegador del candidato y el Centro solo recibía la ficha.
   Además, cada vez que el Centro abría el panel bajaba la fila completa de
   todos los candidatos, con todos sus archivos dentro: con unas decenas de
   candidatos eso se come la salida de datos del plan gratis de Supabase.

   ── Ahora ─────────────────────────────────────────────────────────────────
   Al subir el avance, cada archivo se manda una sola vez al bucket privado
   `expedientes`, en `<id del usuario>/<sha-256 del archivo>`, y en la fila
   viaja solo su ficha con la ruta (`nube`). El Centro baja el archivo cuando
   lo abre, no antes. Lo que ya está en la nube no se vuelve a subir: la ruta
   es la huella del contenido.

   En este navegador nada cambia: el archivo sigue en el registro o en
   IndexedDB, como antes. Solo cambia la copia que viaja.

   Si la subida falla (sin red, sin el SQL del bucket), el archivo viaja como
   antes. Nunca se pierde un archivo por intentar ahorrar espacio.

   Requiere el bucket y sus políticas: ver `supabase-storage.sql`.
   ========================================================================== */

import { NS } from './config.js';
import { archivoSeguro } from './seguro.js';

export const BUCKET = 'expedientes';
const RE_RUTA = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[0-9a-f]{64}$/;
export const rutaValida = r => typeof r === 'string' && RE_RUTA.test(r);

/* ── Memoria de lo ya subido ─────────────────────────────────────────────
   Para no volver a leer ni a calcular la huella de un PDF de 8 MB en cada
   sincronización: ficha del archivo → ruta en la nube.                    */
const LLAVE_MEMORIA = `${NS}.__nube_archivos`;
const leerMemoria = () => { try { return JSON.parse(localStorage.getItem(LLAVE_MEMORIA)) || {}; } catch { return {}; } };
const anotar = (huella, ruta) => {
  try { const m = leerMemoria(); m[huella] = ruta; localStorage.setItem(LLAVE_MEMORIA, JSON.stringify(m)); } catch {}
};
const huellaDe = (uid, a) => [uid, a.clave || '', a.nombre || '', a.bytes || 0, a.fecha || '', (a.dato || '').length].join('|');

/* ¿Este archivo de este navegador ya llegó a la nube? (para no pedirle al
   candidato que mande su respaldo por un archivo que el Centro ya tiene) */
export function yaEnLaNube(a) {
  if (!a || typeof a !== 'object') return false;
  if (rutaValida(a.nube)) return true;
  const sufijo = '|' + [a.clave || '', a.nombre || '', a.bytes || 0, a.fecha || ''].join('|') + '|';
  return Object.keys(leerMemoria()).some(k => k.includes(sufijo));
}

async function sha256(texto) {
  const bytes = new TextEncoder().encode(texto);
  const h = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function dataUrlABlob(dato) {
  const coma = dato.indexOf(',');
  const tipo = dato.slice(5, dato.indexOf(';')) || 'application/octet-stream';
  const bin = atob(dato.slice(coma + 1));
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return new Blob([u8], { type: tipo });
}

const blobADataUrl = blob => new Promise((ok, mal) => {
  const r = new FileReader();
  r.onload = () => ok(r.result);
  r.onerror = () => mal(r.error);
  r.readAsDataURL(blob);
});

/* Sube un data URL y devuelve su ruta. Si ya existía, es el mismo archivo. */
async function subirDato(cliente, uid, dato) {
  const ruta = `${uid}/${await sha256(dato)}`;
  const blob = dataUrlABlob(dato);
  const { error } = await cliente.storage.from(BUCKET).upload(ruta, blob, { upsert: false, contentType: blob.type });
  if (error && !/exist|duplicate|409/i.test(`${error.message} ${error.statusCode || ''} ${error.error || ''}`)) throw error;
  return ruta;
}

/* Un archivo: devuelve la ficha que viaja (sin el archivo, con su ruta) o
   el mismo registro si no hay nada que subir o la subida falló.          */
async function ficharEnNube(cliente, uid, a) {
  if (!a || typeof a !== 'object' || a.liga || rutaValida(a.nube)) return a;
  const tieneDato = typeof a.dato === 'string' && a.dato.startsWith('data:');
  const enEsteEquipo = !a.dato && a.enAlmacen && a.clave;
  if (!tieneDato && !enEsteEquipo) return a;

  const huella = huellaDe(uid, a);
  let ruta = leerMemoria()[huella];
  let miniatura = a.miniatura || null;
  if (!rutaValida(ruta)) {
    let dato = tieneDato ? a.dato : null;
    if (!dato) {
      const { leerGrande } = await import('./almacen-grande.js');
      const g = await leerGrande(a.clave).catch(() => null);
      dato = g?.dato || null;
      miniatura ||= g?.miniatura || null;
    }
    if (!dato) return a;
    ruta = await subirDato(cliente, uid, dato);
    anotar(huella, ruta);
  }
  const { dato, enAlmacen, clave, ...ficha } = a;
  return { ...ficha, miniatura, nube: ruta };
}

/* Recorre los módulos que van a subir y cambia cada archivo por su ficha
   con ruta. Devuelve copias: lo de este navegador no se toca.            */
export async function prepararParaNube(cliente, uid, modulos) {
  if (!cliente?.storage || !uid) return modulos;
  const salida = {};
  for (const [mod, datos] of Object.entries(modulos || {})) {
    if (!datos?.documentos || typeof datos.documentos !== 'object') { salida[mod] = datos; continue; }
    const docs = {};
    for (const [k, v] of Object.entries(datos.documentos)) {
      const uno = async a => { try { return await ficharEnNube(cliente, uid, a); } catch { return a; } };
      docs[k] = Array.isArray(v) ? await Promise.all(v.map(uno)) : await uno(v);
    }
    salida[mod] = { ...datos, documentos: docs };
  }
  return salida;
}

/* Baja un archivo de la nube como data URL (solo PDF o imagen). */
export async function bajarDato(ruta) {
  if (!rutaValida(ruta)) return null;
  try {
    const { clienteNube } = await import('./nube.js');
    const c = await clienteNube();
    if (!c?.storage) return null;
    const { data, error } = await c.storage.from(BUCKET).download(ruta);
    if (error || !data) return null;
    return archivoSeguro(await blobADataUrl(data)) || null;
  } catch { return null; }
}
