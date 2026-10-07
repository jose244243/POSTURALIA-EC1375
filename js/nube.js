/* ============================================================================
   POSTURALIA · Plataforma de Certificación
   nube.js — Adaptador de Supabase

   ⚠️  ESTADO: escrito y probado contra un doble de Supabase, NO contra un
   proyecto real. Antes de usarlo con candidatos hay que correr el guion SQL
   de `supabase.sql`, poner las credenciales en config.js y probar el ciclo
   completo con una cuenta de prueba. Mientras `CONFIG.supabase.url` esté
   vacío, nada de este archivo se ejecuta.

   Diseño: la app nunca habla con Supabase, habla con Store. Store delega
   aquí cuando hay credenciales. Por eso el resto del código no cambia ni una
   línea al encender la nube.

   Estrategia offline: escribimos SIEMPRE en localStorage primero y luego
   sincronizamos. Si la red falla, el candidato sigue trabajando y lo suyo
   sube en cuanto vuelva. En una certificación, perder una hora de respuestas
   por un wifi malo no es aceptable.
   ========================================================================== */

import { CONFIG, NS } from './config.js';
import { aFila, aModulos, columnaDe } from './mapeo-nube.js';

const TABLA = 'progreso';
let cliente = null;
let sesion = null;

/* ── Carga diferida del SDK ─────────────────────────────────────────────
   Solo se descarga si hay credenciales: en modo local no pesa nada.      */
/* Se guarda la PROMESA, no el cliente: dos llamadas casi al mismo tiempo
   (el panel pide sesiones y centro a la vez) creaban dos clientes, y
   supabase-js avisa que dos clientes con la misma sesión pueden pisarse. */
function obtenerCliente() {
  const { url, anonKey } = CONFIG.supabase;
  if (!url || !anonKey) return Promise.resolve(null);
  cliente ||= import('https://esm.sh/@supabase/supabase-js@2')
    .then(({ createClient }) => createClient(url, anonKey))
    .catch(e => { cliente = null; throw e; });
  return cliente;
}

/* ── Sesión ─────────────────────────────────────────────────────────────
   Enlace mágico por correo: sin contraseñas que recordar ni recuperar.   */
export const Auth = {
  async actual() {
    const c = await obtenerCliente();
    if (!c) return null;
    const { data } = await c.auth.getSession();
    sesion = data?.session ?? null;
    return sesion;
  },

  async entrar(correo) {
    const c = await obtenerCliente();
    if (!c) return { ok: false, motivo: 'La plataforma está en modo local.' };
    const { error } = await c.auth.signInWithOtp({
      email: correo,
      options: { emailRedirectTo: location.origin + location.pathname },
    });
    return error ? { ok: false, motivo: error.message } : { ok: true };
  },

  async salir() {
    const c = await obtenerCliente();
    if (c) await c.auth.signOut();
    sesion = null;
  },

  /* ── Contraseña (como Paideia desde el 12-sep) ─────────────────────────
     correo → "Ya tengo contraseña" (signInWithPassword) o "Es mi primera
     vez" (signUp). "¿Olvidaste tu contraseña?" manda el correo de
     restablecer, que también sirve para quien entraba con enlace mágico y
     nunca puso contraseña. Sin contraseña maestra: Paideia tiene una; aquí
     no, porque una llave que abre todas las cuentas es la primera que se
     filtra. */
  async conContrasena(correo, contrasena) {
    const c = await obtenerCliente();
    if (!c) return { ok: false, motivo: 'modo-local' };
    const { data, error } = await c.auth.signInWithPassword({ email: correo, password: contrasena });
    if (error || !data.session) return { ok: false, motivo: error?.message || 'sin-sesion' };
    sesion = data.session; return { ok: true, sesion };
  },
  async crearContrasena(correo, contrasena) {
    const c = await obtenerCliente();
    if (!c) return { ok: false, motivo: 'modo-local' };
    const { data, error } = await c.auth.signUp({ email: correo, password: contrasena });
    if (error) return { ok: false, motivo: error.message, existe: /registered|exists/i.test(error.message) };
    if (!data.session) return { ok: false, motivo: 'confirmar-correo' };
    sesion = data.session; return { ok: true, sesion };
  },
  async pedirRestablecer(correo, destino) {
    const c = await obtenerCliente();
    if (!c) return { ok: false, motivo: 'modo-local' };
    try { await c.auth.resetPasswordForEmail(correo, { redirectTo: destino }); } catch {}
    return { ok: true };   // nunca se revela si la cuenta existe
  },
  async cambiarContrasena(nueva) {
    const c = await obtenerCliente();
    if (!c) return { ok: false, motivo: 'modo-local' };
    const { error } = await c.auth.updateUser({ password: nueva });
    return error ? { ok: false, motivo: error.message } : { ok: true };
  },
  /* Rol del equipo ('admin' | 'evaluador' | null) desde la tabla `equipo`
     (ver supabase.sql). Falla cerrado. */
  async rolEquipo() {
    const c = await obtenerCliente();
    if (!c) return null;
    try {
      const { data, error } = await c.rpc('rol_equipo');
      return error ? null : (data || null);
    } catch { return null; }
  },
};

export const clienteNube = obtenerCliente;

/* ── Lectura y escritura ────────────────────────────────────────────────
   Una fila por (usuario, módulo). `datos` es el mismo objeto que hoy vive
   en localStorage, así que no hay que migrar nada: el primer sync lo sube
   tal cual.                                                              */
export const Nube = {

  disponible() { return !!(CONFIG.supabase.url && CONFIG.supabase.anonKey); },

  async leerTodo() {
    const c = await obtenerCliente();
    const s = await Auth.actual();
    if (!c || !s) return null;

    const { data, error } = await c
      .from(TABLA).select('*').eq('user_id', s.user.id).maybeSingle();

    if (error) return { error: error.message };

    /* La fila viene con la forma de Paideia; la traducimos a nuestros módulos
       y le ponemos a cada uno la marca de tiempo de la fila. */
    /* Cada módulo conserva SU marca de tiempo, que viaja dentro del JSON.
       Antes se les ponía a todos la de la fila: escribir la práctica desde
       el celular hacía que TODOS los módulos remotos parecieran recién
       tocados, y la computadora bajaba encima de su examen a medias —sin
       subir— una versión vieja. La de la fila queda solo de respaldo. */
    /* Sin fila todavía (recién registrado): no hay módulos, pero sus
       autorizaciones sí pueden existir (pagó antes de crear su cuenta). */
    const mods = data ? aModulos(data) : {};
    Object.keys(mods).forEach(m => {
      mods[m] = { ...mods[m], _actualizado: mods[m]?._actualizado || data.updated_at };
    });
    delete mods.__autorizaciones;   // la copia vieja dentro del JSON no manda

    // Las autorizaciones NO vienen del JSON del candidato: son tabla aparte
    const { data: auth, error: errAuth } = await c
      .from('autorizaciones').select('fase').eq('user_id', s.user.id);
    if (!errAuth) {
      /* Siempre, aunque venga vacía: que el Centro revoque una fase también
         tiene que llegar. La marca de tiempo es la de ahora porque la tabla
         manda (el candidato no la puede escribir); ver sincronizar(). */
      mods.__autorizaciones = {
        ...Object.fromEntries((auth || []).map(a => [a.fase, true])),
        _actualizado: new Date().toISOString(),
      };
    }
    return mods;
  },

  async escribir(modulo, datos) {
    return Nube.escribirVarios({ [modulo]: datos });
  },

  /* Una sola fila por candidato: conviene escribirla completa de una vez en
     lugar de mandar una petición por módulo. */
  async escribirVarios(modulos) {
    const c = await obtenerCliente();
    const s = await Auth.actual();
    if (!c || !s) return { ok: false, motivo: 'Sin sesión' };

    /* Las autorizaciones se omiten a propósito: solo el evaluador las escribe,
       y la política de la base de datos rechazaría el intento de todos modos. */
    const { __autorizaciones, ...resto } = modulos;
    if (!Object.keys(resto).length) return { ok: true };

    /* Las columnas que guardan varios módulos se mandan ENTERAS: lo que no
       se está subiendo se toma de lo que ya hay en la nube. Ver columnaDe()
       en mapeo-nube.js. Queda una ventana entre leer y escribir en la que
       dos dispositivos a la vez podrían pisarse; para cerrarla del todo hace
       falta una función en la base que mezcle el JSONB del lado del
       servidor (pendiente para cuando se encienda Supabase). */
    const { data: actual, error: errLeer } = await c
      .from(TABLA).select('*').eq('user_id', s.user.id).maybeSingle();
    if (errLeer) return { ok: false, motivo: errLeer.message };

    /* Los archivos viajan aparte, a Supabase Storage; en la fila va solo su
       ficha con la ruta. Ver archivos-nube.js. Si algo falla, viajan como
       antes, dentro de la fila. */
    let paraSubir = resto;
    try {
      const { prepararParaNube } = await import('./archivos-nube.js');
      paraSubir = await prepararParaNube(c, s.user.id, resto);
    } catch {}

    const remotos = actual ? aModulos(actual) : {};
    const completa = aFila({ ...remotos, ...paraSubir }, { user_id: s.user.id });

    const fila = { user_id: s.user.id, updated_at: completa.updated_at };
    const columnas = new Set(Object.keys(resto).map(columnaDe).filter(Boolean));
    columnas.forEach(col => { if (col in completa) fila[col] = completa[col]; });
    if (resto.plan && completa.nombre) fila.nombre = completa.nombre;

    const { error } = await c.from(TABLA).upsert(fila, { onConflict: 'user_id' });

    return error ? { ok: false, motivo: error.message } : { ok: true };
  },

  /* ── Sincronización ───────────────────────────────────────────────────
     Gana el más reciente por módulo, comparando `_actualizado`. No
     fusionamos campo por campo a propósito: mezclar dos versiones de un
     autodiagnóstico a medias produciría un resultado que el candidato
     nunca contestó.                                                      */
  async sincronizar(locales) {
    const remotos = await Nube.leerTodo();
    if (!remotos || remotos.error) return { ok: false, motivo: remotos?.error || 'Sin sesión' };

    const subidos = [], bajados = [];
    const modulos = new Set([...Object.keys(locales), ...Object.keys(remotos)]);

    for (const m of modulos) {
      const l = locales[m], r = remotos[m];
      /* Las autorizaciones las escribe solo el Centro: se toma lo de la nube
         si cambió, sin comparar fechas, y nunca se suben. */
      if (m === '__autorizaciones') {
        const fases = x => JSON.stringify(Object.keys(x || {}).filter(k => k !== '_actualizado' && x[k] === true).sort());
        if (r && fases(l) !== fases(r)) bajados.push(m);
        continue;
      }
      const tl = l?._actualizado || '', tr = r?._actualizado || '';

      if (l && !r)        { subidos.push(m); }
      else if (!l && r)   { bajados.push(m); }
      else if (tl > tr)   { subidos.push(m); }
      else if (tr > tl)   { bajados.push(m); }
    }

    if (subidos.length) {
      const paquete = Object.fromEntries(subidos.map(m => [m, locales[m]]));
      const r = await Nube.escribirVarios(paquete);
      if (!r.ok) return { ok: false, motivo: r.motivo };
    }

    return { ok: true, subidos, bajados, remotos };
  },

  /* Cola de escrituras que no salieron por falta de red */
  colaPendiente() {
    try { return JSON.parse(localStorage.getItem(`${NS}.__cola`)) || []; } catch { return []; }
  },

  encolar(modulo) {
    const cola = new Set(Nube.colaPendiente());
    cola.add(modulo);
    try { localStorage.setItem(`${NS}.__cola`, JSON.stringify([...cola])); } catch {}
  },

  vaciarCola() {
    try { localStorage.removeItem(`${NS}.__cola`); } catch {}
  },

  /* Reintenta lo que quedó pendiente. Se llama al recuperar conexión. */
  async drenarCola(leerLocal) {
    const cola = Nube.colaPendiente();
    if (!cola.length) return { ok: true, enviados: 0 };

    const paquete = {};
    cola.forEach(m => { const d = leerLocal(m); if (d) paquete[m] = d; });

    const r = await Nube.escribirVarios(paquete);
    if (!r.ok) {
      try { localStorage.setItem(`${NS}.__cola`, JSON.stringify(cola)); } catch {}
      return { ok: false, enviados: 0, fallidos: cola, motivo: r.motivo };
    }

    Nube.vaciarCola();
    return { ok: true, enviados: cola.length, fallidos: [] };
  },
};

/* ── Evaluación del Centro (IEC, Cédula, etapas) ─────────────────────────
   Tabla `evaluaciones`: una fila por candidato (correo) que solo el equipo
   lee y escribe. El candidato NO la lee directo: pide `mi_evaluacion()`,
   que le devuelve su Cédula publicada, las etapas y su firma, y firma con
   `firmar_cedula()`, que solo acepta firmar una Cédula publicada y sin
   firma. Ver supabase.sql.                                               */
export const Evaluaciones = {
  async subir(correo, ev) {
    const c = await obtenerCliente(); if (!c) return null;
    const { combinarEvaluaciones } = await import('./evaluacion.js');
    const { data: remoto } = await c.from('evaluaciones').select('datos').eq('correo', correo).maybeSingle();
    /* Lo que acaba de editar el equipo manda, pero una firma que el
       candidato puso desde su celular sobre la misma Cédula se conserva. */
    const datos = combinarEvaluaciones({ ...ev, actualizado_at: new Date().toISOString() }, remoto?.datos || null);
    const { error } = await c.from('evaluaciones').upsert({ correo, datos, actualizado_at: datos.actualizado_at });
    if (error) throw new Error(error.message || 'No se pudo subir la evaluación');
    return datos;
  },
  async todas() {
    const c = await obtenerCliente(); if (!c) return {};
    const { data, error } = await c.from('evaluaciones').select('correo, datos');
    if (error) throw new Error(error.message || 'No se pudieron leer las evaluaciones');
    return Object.fromEntries((data || []).map(r => [String(r.correo).toLowerCase(), r.datos || {}]));
  },
  async mia() {
    const c = await obtenerCliente(); if (!c) return null;
    try { const { data, error } = await c.rpc('mi_evaluacion'); return error ? null : (data || null); }
    catch { return null; }
  },
  async firmar(firma) {
    const c = await obtenerCliente(); if (!c) throw new Error('modo-local');
    const { data, error } = await c.rpc('firmar_cedula', { firma });
    if (error) throw new Error(error.message || 'No se pudo guardar tu firma');
    return data;
  },
};
