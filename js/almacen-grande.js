/* ============================================================================
   POSTURALIA · Plataforma de Certificación
   almacen-grande.js — Dónde viven los archivos pesados del panel

   El problema, con números: desde que las evidencias son archivos de verdad,
   un expediente con sus cuatro fotos pesa alrededor de 1.3 MB. localStorage
   da entre 5 y 10 MB por sitio. El evaluador arrastra el quinto candidato y
   se acabó — y lo hacía en silencio: la tabla mostraba los doce, al recargar
   quedaba uno.

   IndexedDB existe exactamente para esto: la cuota se mide en cientos de MB
   y crece con el disco disponible. El reparto queda así:

     localStorage   la ficha de cada archivo: nombre, peso, tipo. Unos pocos
                    KB por expediente, así que cientos de candidatos caben.
     IndexedDB      el archivo y su miniatura, que es todo el peso.

   La miniatura también se va aquí y no allá. Parece exagerado —son 10 KB—
   pero 4 miniaturas × 100 candidatos son 4 MB, y volveríamos a lo mismo un
   año después, cuando ya nadie se acuerde de por qué.

   Todo es asíncrono. La tabla del panel no lo toca: solo la ficha, al
   abrirse, que es cuando de verdad hace falta ver los archivos.
   ========================================================================== */

const BASE   = 'posturalia.archivos';
const TIENDA = 'archivos';
const VERSION = 1;

let conexion = null;

function abrir() {
  if (conexion) return conexion;

  conexion = new Promise((ok, mal) => {
    let req;
    try { req = indexedDB.open(BASE, VERSION); }
    catch (e) { return mal(e); }

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(TIENDA)) db.createObjectStore(TIENDA);
    };
    req.onsuccess = () => ok(req.result);
    req.onerror   = () => mal(req.error);
    /* En modo privado de algunos navegadores, open() ni falla ni responde.
       Sin este tiempo límite, la ficha se quedaría cargando para siempre. */
    setTimeout(() => mal(new Error('IndexedDB no respondió')), 4000);
  }).catch(e => { conexion = null; throw e; });

  return conexion;
}

function operar(modo, fn) {
  return abrir().then(db => new Promise((ok, mal) => {
    const tx = db.transaction(TIENDA, modo);
    const req = fn(tx.objectStore(TIENDA));
    tx.onerror = () => mal(tx.error);
    if (req) { req.onsuccess = () => ok(req.result); req.onerror = () => mal(req.error); }
    else tx.oncomplete = () => ok(true);
  }));
}

export const disponible = () => {
  try { return typeof indexedDB !== 'undefined' && !!indexedDB; } catch { return false; }
};

export const guardarGrande = (clave, valor) =>
  operar('readwrite', t => t.put(valor, clave));

export const leerGrande = clave =>
  operar('readonly', t => t.get(clave)).catch(() => null);

export const borrarGrande = clave =>
  operar('readwrite', t => t.delete(clave)).catch(() => false);

/* Borrar todo lo de un expediente: cuando el evaluador lo quita del panel,
   sus archivos se van con él. Si no, la base crecería para siempre con
   fotos de gente que ya ni aparece en la tabla. */
export async function borrarDeExpediente(id) {
  try {
    const db = await abrir();
    return await new Promise(ok => {
      const tx = db.transaction(TIENDA, 'readwrite');
      const st = tx.objectStore(TIENDA);
      const cur = st.openKeyCursor();
      cur.onsuccess = () => {
        const c = cur.result;
        if (!c) return;
        if (String(c.key).startsWith(id + '|')) st.delete(c.key);
        c.continue();
      };
      tx.oncomplete = () => ok(true);
      tx.onerror = () => ok(false);
    });
  } catch { return false; }
}

export const claveDe = (idExpediente, modulo, documento) =>
  `${idExpediente}|${modulo}|${documento}`;

/* ── Separar lo pesado de lo ligero ───────────────────────────────────────
   Recibe los módulos de un expediente recién importado, saca de ahí todo lo
   que pese (el archivo y su miniatura), lo manda a IndexedDB y devuelve los
   módulos ya livianos, con una marca de dónde quedó cada cosa.

   Si IndexedDB no está disponible —modo privado, políticas del equipo— NO se
   inventa nada: se devuelve `enAlmacen: false` y el panel dice que de ese
   archivo solo tiene la ficha. Es preferible a guardarlo en localStorage y
   volver a llenar la cuota sin avisar.                                     */
export async function aligerar(idExpediente, modulos) {
  const salida = {};
  let movidos = 0, fallados = 0;

  /* Un archivo: su peso a IndexedDB, su ficha se queda. v47: un documento
     puede ser una lista (INE frente y reverso, varias capturas) y cada
     archivo lleva su propia llave. Lo que ya viene «enAlmacen» sin dato (el
     avance de este mismo navegador) se deja tal cual: su archivo ya está
     aquí, y volver a guardarlo sin dato lo borraría. */
  const mover = async (v, k) => {
    if (!v || typeof v !== 'object' || (!v.dato && !v.miniatura)) return v;
    if (!v.dato && v.enAlmacen && v.clave) {
      /* Viene sin el archivo y apuntando a un almacén: solo sirve si ese
         archivo está en ESTE navegador (el avance traído del mismo equipo).
         Si llegó de otro lado —la nube, un respaldo armado a mano—, se marca
         perdido para que el panel lo pida en vez de dar por hecho que está. */
      const hay = await leerGrande(v.clave).catch(() => null);
      return hay ? v : { ...v, enAlmacen: false, perdido: true };
    }
    const { dato, miniatura, ...ficha } = v;
    try {
      await guardarGrande(k, { dato: dato || null, miniatura: miniatura || null });
      movidos++;
      return { ...ficha, enAlmacen: true, clave: k };
    } catch {
      fallados++;
      return { ...ficha, enAlmacen: false };
    }
  };

  for (const [mod, datos] of Object.entries(modulos || {})) {
    if (!datos?.documentos) { salida[mod] = datos; continue; }

    const docs = {};
    for (const [clave, v] of Object.entries(datos.documentos)) {
      const k = claveDe(idExpediente, mod, clave);
      docs[clave] = Array.isArray(v)
        ? await Promise.all(v.map((x, i) => mover(x, `${k}|${i}`)))
        : await mover(v, k);
    }
    salida[mod] = { ...datos, documentos: docs };
  }

  return { modulos: salida, movidos, fallados };
}

/* Devuelve {dato, miniatura} de un documento ya aligerado */
export async function recuperar(doc) {
  if (!doc?.enAlmacen || !doc.clave) return null;
  return (await leerGrande(doc.clave)) || null;
}
