/* ============================================================================
   POSTURALIA · Plataforma de Certificación
   store.js — Capa de persistencia

   Guarda en localStorage hoy. Cuando configures Supabase en config.js, las
   mismas funciones sincronizan contra la nube sin cambiar el resto del código:
   toda la app habla con Store, nunca con localStorage directamente.
   ========================================================================== */

import { hoyLocal } from './fechas.js';
import { NS, CONFIG, modoLocal } from './config.js';
import { espejo, enEspejo } from './sesion.js';

const clave = (modulo) => `${NS}.${modulo}`;

/* ── Lectura / escritura segura ──────────────────────────────────────────
   localStorage lanza excepción en modo privado, con cookies bloqueadas o
   en algunos iframes. Nunca dejamos que eso tumbe la página.             */

function leerLocal(modulo) {
  try {
    const crudo = localStorage.getItem(clave(modulo));
    return crudo ? JSON.parse(crudo) : null;
  } catch {
    return null;
  }
}

function escribirLocal(modulo, datos) {
  try {
    localStorage.setItem(clave(modulo), JSON.stringify(datos));
    return true;
  } catch {
    return false;   // cuota llena o almacenamiento bloqueado
  }
}

export const Store = {

  /* Devuelve los datos de un módulo, o el valor por defecto.

     Con el espejo encendido lee del expediente que el evaluador abrió, no de
     este navegador: es la única forma de que vea el proceso del candidato y
     no el suyo propio.                                                      */
  get(modulo, porDefecto = {}) {
    if (enEspejo()) {
      const esp = espejo();
      if (modulo === '__autorizaciones') {
        return esp?.autorizaciones ?? structuredClone(porDefecto);
      }
      return esp?.modulos?.[modulo] ?? structuredClone(porDefecto);
    }
    const datos = leerLocal(modulo);
    return datos ?? structuredClone(porDefecto);
  },

  /* Guarda los datos de un módulo. Devuelve false si no se pudo.

     En espejo no se guarda NADA. El evaluador está mirando un expediente
     ajeno; si al abrir el examen para revisarlo quedara guardada su primera
     respuesta, estaría alterando la evaluación de otra persona sin saberlo. */
  set(modulo, datos) {
    if (enEspejo()) return false;
    const conSello = { ...datos, _actualizado: new Date().toISOString() };
    const ok = escribirLocal(modulo, conSello);
    if (ok) window.dispatchEvent(new CustomEvent('store:cambio', { detail: { modulo } }));
    return ok;
  },

  /* ¿Se puede escribir ahora mismo? Las páginas lo consultan para deshabilitar
     sus controles en vez de dejar que el usuario haga clic sin efecto.      */
  get soloLectura() { return enEspejo(); },

  /* Cuándo se tocó el expediente por última vez.

     Cada módulo ya venía guardando su propio `_actualizado` en set(); lo que
     faltaba era poder preguntarlo sin abrir los diez. El panel lo usa para
     decir "guardado hace 3 min" en vez de un "sincronizado" fijo que no
     distingue entre un expediente vivo y uno abandonado hace un mes.       */
  selloDeTiempo() {
    let ultimo = null;
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(NS + '.'))
        .forEach(k => {
          try {
            const f = JSON.parse(localStorage.getItem(k))?._actualizado;
            if (f && (!ultimo || f > ultimo)) ultimo = f;
          } catch {}
        });
    } catch {}
    return ultimo;
  },

  /* Actualiza parcialmente sin pisar el resto */
  merge(modulo, parcial) {
    return Store.set(modulo, { ...Store.get(modulo), ...parcial });
  },

  /* Borra un módulo */
  clear(modulo) {
    if (enEspejo()) return;
    try { localStorage.removeItem(clave(modulo)); } catch {}
  },

  /* Borra TODO lo de esta plataforma (no toca nada de otros sistemas,
     porque filtramos estrictamente por nuestro namespace) */
  clearAll() {
    if (enEspejo()) return;
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(NS + '.'))
        .forEach(k => localStorage.removeItem(k));
    } catch {}
  },

  /* Exporta todo el progreso como objeto — útil para respaldo o migración.

     Incluye una cabecera `candidato` con el nombre y el evaluador que el
     candidato capturó en el Plan de Evaluación. Sin eso, el panel del
     evaluador recibe archivos sin saber de quién es cada uno.              */
  exportar() {
    const plan = leerLocal('plan') || {};
    const salida = {
      _ns: NS,
      _fecha: new Date().toISOString(),
      _version: 2,
      candidato: {
        nombre:    (plan.fCandidato || '').trim(),
        evaluador: (plan.fEvaluador || '').trim(),
        fecha:     plan.fFecha || '',
        lugar:     (plan.fLugar || '').trim(),
      },
      modulos: {},
    };
    CONFIG.flujo.forEach(m => {
      const d = leerLocal(m.id);
      if (d) salida.modulos[m.id] = d;
    });
    /* También lo que no es paso del flujo pero el Centro necesita: los datos
       generales (Ficha de Registro: nombre, CURP, domicilio, foto,
       certificados), la firma y lo leído en la Biblioteca. Antes el respaldo
       no los llevaba y el portafolio salía sin Ficha de Registro. */
    ['candidato', 'firma', 'biblioteca'].forEach(id => {
      const d = leerLocal(id);
      if (d) salida.modulos[id] = d;
    });
    const cand = leerLocal('candidato') || {};
    if (!salida.candidato.nombre && cand.nombre) salida.candidato.nombre = String(cand.nombre).trim();
    if (cand.email) salida.candidato.correo = String(cand.email).trim();
    return salida;
  },

  /* v47: el respaldo con TODOS los archivos dentro. Los PDF y las fotos que
     pasan de 900 KB viven en IndexedDB de este navegador (archivos.js); aquí
     se leen y se meten al .json, para que al Centro le lleguen completos. Si
     alguno ya no está (el navegador lo borró), se queda la ficha y se marca
     `perdido` para que el panel lo diga en vez de fingir que llegó. */
  async exportarCompleto() {
    const salida = Store.exportar();
    let leer = null;
    try { leer = (await import('./almacen-grande.js')).leerGrande; } catch {}
    for (const datos of Object.values(salida.modulos)) {
      const docs = datos?.documentos;
      if (!docs) continue;
      for (const [k, v] of Object.entries(docs)) {
        const lista = Array.isArray(v) ? v : [v];
        const nueva = [];
        for (const a of lista) {
          if (a && typeof a === 'object' && a.enAlmacen && a.clave && !a.dato) {
            const g = leer ? await leer(a.clave).catch(() => null) : null;
            const { enAlmacen, clave, ...ficha } = a;
            nueva.push(g?.dato ? { ...ficha, dato: g.dato, miniatura: ficha.miniatura || g.miniatura || null } : { ...ficha, perdido: true });
          } else nueva.push(a);
        }
        docs[k] = Array.isArray(v) ? nueva : nueva[0];
      }
    }
    return salida;
  },

  /* Descarga el respaldo como archivo .json. El nombre del archivo lleva el
     del candidato cuando lo tenemos, para que el evaluador no reciba diez
     archivos llamados igual. */
  async descargarRespaldo() {
    const datos = await Store.exportarCompleto();
    const slug = (datos.candidato?.nombre || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `posturalia-${slug || 'progreso'}-${hoyLocal()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  /* Restaura desde un respaldo previamente exportado */
  importar(objeto) {
    if (enEspejo()) return false;
    if (!objeto || objeto._ns !== NS) return false;
    Object.entries(objeto.modulos || {}).forEach(([id, datos]) => escribirLocal(id, datos));
    return true;
  },

  get esLocal() { return modoLocal(); },

  /* ── Sincronización con la nube ───────────────────────────────────────
     Solo hace algo si config.js tiene credenciales de Supabase. El resto
     de la app llama a esto y no le importa si hay nube o no.

     El orden importa: escribimos en localStorage primero y sincronizamos
     después. Si la red falla a medias, el candidato no pierde nada y lo
     suyo sube cuando vuelva la conexión.                                 */
  async sincronizar() {
    if (modoLocal()) return { ok: true, modo: 'local' };

    const { Nube } = await import('./nube.js');
    if (!Nube.disponible()) return { ok: true, modo: 'local' };

    /* Antes solo se juntaban los pasos del flujo: la firma, el nombre, la
       Biblioteca y la fecha límite no subían en una sincronización completa
       — solo si se volvían a tocar. */
    const { MODULOS_NUBE } = await import('./mapeo-nube.js');
    const locales = {};
    /* __autorizaciones va para poder compararla con la nube (no se sube:
       nube.js la descarta al escribir); si el Centro revocó una fase, así
       se entera este dispositivo. */
    [...new Set([...CONFIG.flujo.map(m => m.id), ...MODULOS_NUBE, '__autorizaciones'])].forEach(id => {
      const d = leerLocal(id);
      if (d) locales[id] = d;
    });

    const r = await Nube.sincronizar(locales);
    if (!r.ok) return { ok: false, modo: 'nube', motivo: r.motivo };

    // Lo que ganó en la nube baja a local
    r.bajados.forEach(m => {
      if (r.remotos[m]) escribirLocal(m, r.remotos[m]);
    });

    if (r.bajados.length) {
      window.dispatchEvent(new CustomEvent('store:sincronizado', { detail: r }));
    }
    return { ok: true, modo: 'nube', ...r };
  },
};

/* ── Escritura diferida a la nube ─────────────────────────────────────────
   Cada Store.set encola el módulo y dispara un envío con retardo, para no
   mandar una petición por cada clic en un reactivo. */
let temporizador = null;

if (!modoLocal()) {
  /* Cada módulo que cambia se anota al momento; lo que se retrasa es el
     envío. Antes se anotaba solo el ÚLTIMO módulo del lapso: guardar dos
     seguidos (el nombre y luego el Acuerdo, en la liga de registro) subía
     el Acuerdo y el nombre se quedaba sin subir. */
  window.addEventListener('store:cambio', e => {
    try {
      const cola = new Set(JSON.parse(localStorage.getItem(`${NS}.__cola`) || '[]'));
      cola.add(e.detail.modulo);
      localStorage.setItem(`${NS}.__cola`, JSON.stringify([...cola]));
    } catch {}
    clearTimeout(temporizador);
    temporizador = setTimeout(async () => {
      const { Nube } = await import('./nube.js');
      if (!Nube.disponible()) return;
      await Nube.drenarCola(leerLocal);
    }, 1500);
  });

  // Al recuperar conexión, sube lo que quedó pendiente
  window.addEventListener('online', async () => {
    const { Nube } = await import('./nube.js');
    if (Nube.disponible()) await Nube.drenarCola(leerLocal);
  });
}

/* Aviso visible una sola vez si el navegador no permite guardar nada */
export function verificarAlmacenamiento() {
  const prueba = `${NS}.__test`;
  try {
    localStorage.setItem(prueba, '1');
    localStorage.removeItem(prueba);
    return true;
  } catch {
    return false;
  }
}


/* ----------------------------------------------------------------------------
   comoLista(v) — blindaje contra datos guardados con formato inesperado.

   El avance vive en localStorage, y ahí puede quedar basura: un respaldo viejo
   de otra versión, una edición manual, un fallo al escribir. Sin esto, un
   `new Set(<algo que no es lista>)` revienta el módulo entero y el candidato ve
   una pantalla en blanco sin explicación. Preferimos perder ese dato y seguir.
   -------------------------------------------------------------------------- */
export function comoLista(v) {
  if (Array.isArray(v)) return v;
  if (v == null) return [];
  if (typeof v?.[Symbol.iterator] === 'function' && typeof v !== 'string') {
    try { return [...v]; } catch { return []; }
  }
  return [];
}
