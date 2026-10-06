/* ============================================================================
   POSTURALIA · cuenta.js — Inicio de sesión como en Paideia

   El mismo recorrido que auth.js de Paideia (12-sep-2026):
     1. Correo electrónico → Continuar
     2. "Ya tengo contraseña" · "Es mi primera vez aquí" · "Usar otro correo"
     3a. Contraseña + "Mantener mi sesión iniciada en este dispositivo"
         → Iniciar sesión · ¿Olvidaste tu contraseña? · ← Regresar
     3b. Crear contraseña (mínimo 6) + confirmarla → Crear contraseña y continuar
   Y para el equipo, el mismo gate con rol: 'admin' ve todo el panel,
   'evaluador' solo Candidatos (sin dinero).

   Dos motores, misma pantalla:
     · NUBE (Supabase configurado en config.js): signInWithPassword / signUp /
       resetPasswordForEmail; el rol sale de la tabla `evaluadores`.
     · LOCAL (sin Supabase): la cuenta vive en ESTE navegador. La contraseña
       nunca se guarda: se guarda PBKDF2-SHA256 (150,000 vueltas) con sal
       aleatoria. Sirve para separar personas en un mismo equipo y para que
       el flujo sea idéntico al de producción; no sustituye a un servidor.

   Diferencia deliberada con Paideia: NO hay contraseña maestra.
   ========================================================================== */
import { CONFIG, NS } from './config.js';

const K_CUENTAS = 'posturalia.cuentas.v1';
const K_SESION  = 'posturalia.sesion.v1';
const K_EQUIPO  = 'posturalia.equipo.v1';
const VUELTAS = 150000;

const enNube = () => !!(CONFIG.supabase?.url && CONFIG.supabase?.anonKey);
const leer = (k, def) => { try { return JSON.parse(localStorage.getItem(k)) ?? def; } catch { return def; } };
const escribir = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } };
const norm = c => String(c || '').trim().toLowerCase();
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const correoValido = c => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(norm(c));

/* ── Contraseñas (local) ─────────────────────────────────────────────── */
const hex = b => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
async function derivar(contrasena, salHex) {
  const sal = new Uint8Array(salHex.match(/../g).map(h => parseInt(h, 16)));
  const llave = await crypto.subtle.importKey('raw', new TextEncoder().encode(contrasena), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: sal, iterations: VUELTAS }, llave, 256);
  return hex(bits);
}
/* Comparación sin cortocircuito: no delata cuántos caracteres coinciden */
const iguales = (a, b) => { if (a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; };

export function existeCuentaLocal(correo) { return !!leer(K_CUENTAS, {})[norm(correo)]; }

async function crearLocal(correo, contrasena) {
  const cuentas = leer(K_CUENTAS, {});
  const c = norm(correo);
  if (cuentas[c]) return { ok: false, existe: true };
  const sal = hex(crypto.getRandomValues(new Uint8Array(16)));
  cuentas[c] = { sal, hash: await derivar(contrasena, sal), creada: new Date().toISOString() };
  return escribir(K_CUENTAS, cuentas) ? { ok: true } : { ok: false, motivo: 'sin-espacio' };
}
async function verificarLocal(correo, contrasena) {
  const cu = leer(K_CUENTAS, {})[norm(correo)];
  if (!cu) return false;
  return iguales(await derivar(contrasena, cu.sal), cu.hash);
}
export async function restablecerLocal(correo, nueva) {
  const cuentas = leer(K_CUENTAS, {});
  const c = norm(correo);
  const sal = hex(crypto.getRandomValues(new Uint8Array(16)));
  cuentas[c] = { ...(cuentas[c] || {}), sal, hash: await derivar(nueva, sal), cambiada: new Date().toISOString() };
  return escribir(K_CUENTAS, cuentas);
}

/* ── Equipo (quién es admin / evaluador) ─────────────────────────────────
   Nube: tabla `evaluadores`. Local: CONFIG.equipo (fijo en el código) más
   lo que se dé de alta en "Acceso del equipo" en este navegador. Si todavía
   no hay NADIE en el equipo, la primera cuenta que entra al panel queda
   como administradora — sin eso, un panel recién instalado no tendría por
   dónde entrar. */
export function equipoLocal() {
  const fijo = (CONFIG.equipo || []).map(m => ({ ...m, correo: norm(m.correo), fijo: true }));
  const extra = leer(K_EQUIPO, []).filter(m => !fijo.some(f => f.correo === norm(m.correo)));
  return [...fijo, ...extra];
}
export function guardarMiembro(correo, rol, nombre = '') {
  const c = norm(correo); if (!correoValido(c)) return false;
  const lista = leer(K_EQUIPO, []).filter(m => norm(m.correo) !== c);
  lista.push({ correo: c, rol: rol === 'admin' ? 'admin' : 'evaluador', nombre: String(nombre).trim(), alta: new Date().toISOString() });
  return escribir(K_EQUIPO, lista);
}
export function quitarMiembro(correo) {
  return escribir(K_EQUIPO, leer(K_EQUIPO, []).filter(m => norm(m.correo) !== norm(correo)));
}
/* Rol en el equipo sin esperar a la nube: equipo local de este navegador */
export function rolLocal(correo) {
  return equipoLocal().find(m => m.correo === norm(correo))?.rol || null;
}
/* Equipo central: huellas SHA-256 en CONFIG.equipoCentral (ver config.js) */
export async function huellaCorreo(correo) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('posturalia-equipo:' + norm(correo)));
  return hex(b);
}
export async function rolCentral(correo) {
  const lista = CONFIG.equipoCentral || [];
  if (!lista.length || !correo) return null;
  try { const h = await huellaCorreo(correo); return lista.find(m => m.h === h)?.rol || null; } catch { return null; }
}
/* Una sesión abierta sin rol (entró por el lado del candidato, o antes de
   que su correo estuviera en el equipo) toma su rol en cuanto se sabe. */
export async function asegurarRol() {
  const s = sesion();
  if (!s || s.rol) return false;
  let rol = null; try { rol = await rolDe(s.correo); } catch {}
  if (!rol) return false;
  const s2 = { ...s, rol };
  const enLocal = (() => { try { return !!localStorage.getItem(K_SESION); } catch { return false; } })();
  if (enLocal) escribir(K_SESION, s2); else { try { sessionStorage.setItem(K_SESION, JSON.stringify(s2)); } catch {} }
  return true;
}
async function rolDe(correo) {
  if (enNube()) { const { Auth } = await import('./nube.js'); return (await Auth.rolEquipo()) || (await rolCentral(correo)); }
  return equipoLocal().find(m => m.correo === norm(correo))?.rol || (await rolCentral(correo));
}

/* ── Sesión ──────────────────────────────────────────────────────────── */
export function sesion() {
  return leer(K_SESION, null) || (() => { try { return JSON.parse(sessionStorage.getItem(K_SESION)); } catch { return null; } })();
}
function abrirSesion(datos, recordar) {
  const s = { ...datos, desde: new Date().toISOString(), motor: enNube() ? 'nube' : 'local' };
  try { localStorage.removeItem(K_SESION); sessionStorage.removeItem(K_SESION); } catch {}
  if (recordar) escribir(K_SESION, s); else { try { sessionStorage.setItem(K_SESION, JSON.stringify(s)); } catch {} }
  /* Sin la nube, la cuenta y el avance viven en este navegador. Se le pide
     que no los borre por su cuenta cuando le falte espacio (5 oct). */
  if (recordar) { try { navigator.storage?.persist?.()?.catch?.(() => {}); } catch {} }
  window.dispatchEvent(new CustomEvent('cuenta:cambio', { detail: s }));
  return s;
}
export async function cerrarSesion() {
  try { localStorage.removeItem(K_SESION); sessionStorage.removeItem(K_SESION); } catch {}
  if (enNube()) { try { const { Auth } = await import('./nube.js'); await Auth.salir(); } catch {} }
  window.dispatchEvent(new CustomEvent('cuenta:cambio', { detail: null }));
}
export const iniciales = s => (s?.nombre || s?.correo || '?').split(/[\s@.]+/).filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');

/* ── Gate (la misma pieza para candidato y equipo) ────────────────────────
   opciones.equipo: true → exige rol (admin, o evaluador si permitirEvaluador)
   onListo(sesion) se llama al entrar.
   opciones.correoInicial: el correo ya se pidió antes (liga de registro):
   arranca en crear contraseña o en entrar, sin volver a preguntarlo.       */
export function montarGate(cont, { equipo = false, permitirEvaluador = false, titulo = '', correoInicial = '', pasoInicial = '', onListo = () => {} } = {}) {
  let correo = correoValido(correoInicial) ? norm(correoInicial) : '';
  /* En modo local cada navegador y cada dirección (posturalia.com.mx, la de
     .netlify.app, una vista previa de Netlify…) guardan sus propias cuentas.
     Quien ya se dio de alta en otro lado volvía a ver «Es mi primera vez» y
     creía que la plataforma no le guardaba la contraseña (5 oct). */
  const avisoLocal = () => (enNube() || existeCuentaLocal(correo)) ? '' :
    `<p class="cg-txt cg-aviso" data-aviso-local>En <strong>${esc(location.host || 'este equipo')}</strong> no hay una contraseña creada para este correo en este navegador.
      Mientras la plataforma no esté conectada a la nube, cada navegador y cada dirección guardan sus propias cuentas:
      si te diste de alta en otra dirección o en otro navegador, aquí toca crearla otra vez con «Es mi primera vez aquí».</p>`;
  const pintar = (paso, msg = '') => {
    const err = msg ? `<p class="cg-err">${msg}</p>` : '';
    const recordar = `<label class="cg-chk"><input type="checkbox" id="cgRecordar" checked> Mantener mi sesión iniciada en este dispositivo</label>`;
    const V = {
      correo: `
        <label class="cg-lbl" for="cgCorreo">Correo electrónico</label>
        <input class="cg-in" type="email" id="cgCorreo" placeholder="tu@email.com" autocomplete="email" value="${esc(correo)}">
        ${err}<button class="cg-btn cg-pri" data-a="continuar">Continuar</button>`,
      elegir: `
        <p class="cg-txt">${equipo ? 'Correo del equipo' : 'Correo'}: <strong>${esc(correo)}</strong></p>${avisoLocal()}${err}
        <button class="cg-btn cg-pri" data-a="a-entrar">Ya tengo contraseña</button>
        <button class="cg-btn" data-a="a-crear">Es mi primera vez aquí</button>
        <button class="cg-btn" data-a="a-correo">Usar otro correo</button>`,
      entrar: `
        <p class="cg-txt">Inicia sesión con <strong>${esc(correo)}</strong></p>
        <label class="cg-lbl" for="cgPass">Contraseña</label>
        <input class="cg-in" type="password" id="cgPass" placeholder="Tu contraseña" autocomplete="current-password">
        ${recordar}${err}
        <button class="cg-btn cg-pri" data-a="entrar">Iniciar sesión</button>
        <button class="cg-btn" data-a="olvide">¿Olvidaste tu contraseña?</button>
        <button class="cg-btn" data-a="a-elegir">← Regresar</button>`,
      crear: `
        <p class="cg-txt">Crea tu contraseña para <strong>${esc(correo)}</strong></p>
        <label class="cg-lbl" for="cgPass">Contraseña (mínimo 6 caracteres)</label>
        <input class="cg-in" type="password" id="cgPass" placeholder="Crea tu contraseña" autocomplete="new-password">
        <label class="cg-lbl" for="cgPass2">Confirma tu contraseña</label>
        <input class="cg-in" type="password" id="cgPass2" placeholder="Repite tu contraseña" autocomplete="new-password">
        ${recordar}${err}
        <button class="cg-btn cg-pri" data-a="crear">Crear contraseña y continuar</button>
        <button class="cg-btn" data-a="a-elegir">← Regresar</button>`,
      enviado: `
        <p class="cg-txt">Si <strong>${esc(correo)}</strong> tiene cuenta, te enviamos un correo para poner tu contraseña. Revisa tu bandeja (y spam).</p>
        <button class="cg-btn" data-a="a-correo">Usar otro correo</button>`,
      local: `
        <p class="cg-txt">Esta plataforma está en <strong>modo local</strong>: tu contraseña vive solo en este navegador y no hay correo de recuperación.</p>
        <p class="cg-txt">${equipo ? 'Pide a otra persona administradora que te la restablezca en <em>Acceso del equipo</em>.' : 'Para ponerle una nueva, confirma la CURP que registraste en tus datos generales.'}</p>
        ${equipo ? '' : `<label class="cg-lbl" for="cgCurp">CURP</label><input class="cg-in" id="cgCurp" maxlength="18" style="text-transform:uppercase">
        <label class="cg-lbl" for="cgPass">Nueva contraseña</label><input class="cg-in" type="password" id="cgPass" autocomplete="new-password">`}
        ${err}${equipo ? '' : '<button class="cg-btn cg-pri" data-a="reset-local">Guardar nueva contraseña</button>'}
        <button class="cg-btn" data-a="a-entrar">← Regresar</button>`,
      noEquipo: `
        <p class="cg-txt">El correo <strong>${esc(correo)}</strong> no es parte del equipo${permitirEvaluador ? '' : ' con acceso de administrador'}.</p>
        <p class="cg-txt" style="color:var(--muted)">Si eres evaluador o socio, pide que te den de alta en <em>Acceso del equipo</em>.</p>
        ${sesion()?.correo && norm(sesion().correo) === correo ? '<a class="cg-btn" href="index.html" style="text-align:center;text-decoration:none">Ir a mi proceso</a>' : ''}
        <button class="cg-btn" data-a="a-correo">Usar otro correo</button>`,
      espera: `<p class="cg-txt" style="text-align:center">Entrando…</p>`,
    };
    cont.innerHTML = `<div class="cg">${titulo ? `<h2 class="cg-tit">${titulo}</h2>` : ''}${V[paso]}</div>`;
    cont.querySelector('input:not([type=checkbox])')?.focus();
  };

  const terminar = async (datos, recordar) => {
    if (equipo) {
      let rol = await rolDe(datos.correo);
      /* Panel recién instalado sin nadie dado de alta: el primero es admin */
      if (!rol && !enNube() && !equipoLocal().length && !(CONFIG.equipoCentral || []).length) { guardarMiembro(datos.correo, 'admin'); rol = 'admin'; }
      /* Un evaluador que entra por una página de dinero sí abre sesión: la
         página que lo llamó lo manda a Candidatos. */
      if (!rol) {
        if (enNube()) { const { Auth } = await import('./nube.js'); await Auth.salir(); }
        return pintar('noEquipo');
      }
      datos.rol = rol;
    } else {
      /* Quien es del equipo y entra por el lado del candidato conserva su
         rol: así ve «Volver al panel de administrador» sin volver a entrar. */
      try { const rol = await rolDe(datos.correo); if (rol) datos.rol = rol; } catch {}
    }
    onListo(abrirSesion(datos, recordar));
  };

  cont.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const pri = cont.querySelector('.cg-pri'); if (pri) { e.preventDefault(); pri.click(); }
  });
  cont.addEventListener('click', async e => {
    const b = e.target.closest('[data-a]'); if (!b) return;
    const a = b.dataset.a;
    const recordar = cont.querySelector('#cgRecordar')?.checked !== false;
    if (a === 'a-correo') return pintar('correo');
    if (a === 'a-elegir') return pintar('elegir');
    if (a === 'a-entrar') return pintar('entrar');
    if (a === 'a-crear')  return pintar('crear');
    if (a === 'continuar') {
      correo = norm(cont.querySelector('#cgCorreo').value);
      if (!correoValido(correo)) return pintar('correo', 'Escribe un correo válido.');
      /* En local se sabe si la cuenta existe: se salta la pregunta */
      if (!enNube()) return pintar(existeCuentaLocal(correo) ? 'entrar' : 'elegir');
      return pintar('elegir');
    }
    if (a === 'entrar') {
      const pass = cont.querySelector('#cgPass').value;
      if (!pass) return pintar('entrar', 'Escribe tu contraseña.');
      pintar('espera');
      if (enNube()) {
        const { Auth } = await import('./nube.js');
        const r = await Auth.conContrasena(correo, pass);
        if (!r.ok) return pintar('entrar', 'Contraseña incorrecta, o todavía no la has creado — usa "¿Olvidaste tu contraseña?" para ponerla.');
        return terminar({ correo }, recordar);
      }
      if (!existeCuentaLocal(correo)) return pintar('elegir', 'Este correo todavía no tiene contraseña en este navegador: elige "Es mi primera vez aquí".');
      if (!(await verificarLocal(correo, pass))) return pintar('entrar', 'Contraseña incorrecta.');
      return terminar({ correo }, recordar);
    }
    if (a === 'crear') {
      const p1 = cont.querySelector('#cgPass').value, p2 = cont.querySelector('#cgPass2').value;
      if (p1.length < 6) return pintar('crear', 'La contraseña debe tener al menos 6 caracteres.');
      if (p1 !== p2) return pintar('crear', 'Las contraseñas no coinciden.');
      pintar('espera');
      if (enNube()) {
        const { Auth } = await import('./nube.js');
        const r = await Auth.crearContrasena(correo, p1);
        if (!r.ok) return pintar('crear', r.motivo === 'confirmar-correo'
          ? 'Cuenta creada. Revisa tu correo para confirmarla y vuelve a iniciar sesión.'
          : 'Este correo ya tiene cuenta — usa "Ya tengo contraseña", o "¿Olvidaste tu contraseña?" si no la recuerdas.');
        return terminar({ correo }, recordar);
      }
      const r = await crearLocal(correo, p1);
      if (!r.ok) return pintar('crear', r.existe ? 'Este correo ya tiene contraseña en este navegador — usa "Ya tengo contraseña".' : 'No se pudo guardar (el navegador no tiene espacio).');
      return terminar({ correo }, recordar);
    }
    if (a === 'olvide') {
      if (!enNube()) return pintar('local');
      const { Auth } = await import('./nube.js');
      await Auth.pedirRestablecer(correo, new URL('restablecer-password.html', location.href).href);
      return pintar('enviado');
    }
    if (a === 'reset-local') {
      const curp = String(cont.querySelector('#cgCurp').value || '').trim().toUpperCase();
      const pass = cont.querySelector('#cgPass').value;
      let registrada = '';
      try { registrada = String(JSON.parse(localStorage.getItem(`${NS}.candidato`))?.curp || '').toUpperCase(); } catch {}
      if (!registrada || curp !== registrada) return pintar('local', 'La CURP no coincide con la registrada en este navegador.');
      if (pass.length < 6) return pintar('local', 'La contraseña debe tener al menos 6 caracteres.');
      await restablecerLocal(correo, pass);
      return pintar('entrar', 'Listo: ya puedes entrar con tu nueva contraseña.');
    }
  });

  if (!document.getElementById('cg-estilo')) {
    const st = document.createElement('style'); st.id = 'cg-estilo';
    st.textContent = `
      .cg{max-width:420px;margin:0 auto}
      .cg-tit{margin:0 0 14px;font-size:1.15rem}
      .cg-lbl{display:block;font-size:.84rem;font-weight:600;margin:8px 0 5px;color:var(--dark,#0f172a)}
      .cg-in{width:100%;padding:11px 13px;border:1.5px solid var(--border,#e2e8f0);border-radius:10px;font:inherit;font-size:.95rem;background:var(--white,#fff);color:var(--dark,#0f172a)}
      .cg-chk{display:flex;gap:8px;align-items:center;font-size:.84rem;margin:12px 0;cursor:pointer;color:var(--mid,#334155)}
      .cg-btn{display:block;width:100%;margin-top:9px;padding:11px 14px;border-radius:10px;border:1.5px solid var(--border,#e2e8f0);background:var(--white,#fff);font:inherit;font-weight:700;cursor:pointer;color:var(--dark,#0f172a)}
      .cg-pri{background:#0d2a6e;border-color:#0d2a6e;color:#fff}
      .cg-txt{font-size:.9rem;line-height:1.6;margin:0 0 10px;color:var(--mid,#334155)}
      .cg-err{color:#B91C1C;font-size:.85rem;margin:8px 0 0}
      .cg-aviso{font-size:.82rem;background:#FEF9E7;border:1px solid #F4D27A;border-radius:10px;padding:9px 11px;color:#5B4A12}`;
    document.head.appendChild(st);
  }
  if (pasoInicial && correo) pintar(pasoInicial);
  else if (!correo) pintar('correo');
  else if (!enNube()) pintar(existeCuentaLocal(correo) ? 'entrar' : 'crear');
  else pintar('elegir');
}

/* Pantalla completa de acceso, encima de la página (candidato o equipo) */
export function exigirSesion({ equipo = false, permitirEvaluador = false } = {}) {
  const s = sesion();
  if (s && (!equipo || (s.rol === 'admin' || (s.rol === 'evaluador' && permitirEvaluador)))) return Promise.resolve(s);
  /* Sesión abierta del lado del candidato por alguien del equipo: se le
     reconoce el rol sin pedirle la contraseña otra vez. */
  if (s && equipo && !s.rol) {
    return rolDe(s.correo).catch(() => null).then(rol => {
      if (rol === 'admin' || (rol === 'evaluador' && permitirEvaluador)) {
        const s2 = { ...s, rol };
        const enLocal = (() => { try { return !!localStorage.getItem(K_SESION); } catch { return false; } })();
        if (enLocal) escribir(K_SESION, s2); else { try { sessionStorage.setItem(K_SESION, JSON.stringify(s2)); } catch {} }
        return s2;
      }
      return pedirAcceso(equipo, permitirEvaluador);
    });
  }
  return pedirAcceso(equipo, permitirEvaluador);
}
function pedirAcceso(equipo, permitirEvaluador) {
  return new Promise(res => {
    const velo = document.createElement('div');
    velo.id = 'veloAcceso';
    velo.style.cssText = 'position:fixed;inset:0;z-index:400;background:var(--bg,#f1f5f9);overflow:auto;display:flex;align-items:flex-start;justify-content:center;padding:8vh 16px';
    velo.innerHTML = `<div style="width:100%;max-width:460px;background:var(--white,#fff);border-radius:18px;padding:28px 24px;box-shadow:0 20px 50px rgba(13,42,110,.12)">
      <div style="text-align:center;margin-bottom:18px">
        <div style="font-weight:800;letter-spacing:.06em;color:#0d2a6e">POSTURALIA</div>
        <div style="font-size:.82rem;color:var(--muted,#64748b)">${equipo ? 'Acceso del equipo · ' : 'Certificación '}${esc(CONFIG.marca?.estandar || 'EC1375')}</div>
      </div><div id="veloGate"></div></div>`;
    document.body.appendChild(velo);
    document.documentElement.style.overflow = 'hidden';
    /* Con sesión abierta ya se sabe quién es: no se le vuelve a pedir el
       correo ni la contraseña. Si entra al panel sin ser del equipo, se le
       dice de una vez (antes tecleaba su contraseña para enterarse). */
    const s = sesion();
    const yaDentro = equipo && s?.correo && !(s.rol === 'admin' || (s.rol === 'evaluador' && permitirEvaluador));
    montarGate(velo.querySelector('#veloGate'), {
      correoInicial: s?.correo || '', pasoInicial: yaDentro ? 'noEquipo' : '',
      equipo, permitirEvaluador, titulo: equipo ? 'Acceso del equipo' : 'Entra a tu proceso',
      onListo: s2 => { velo.remove(); document.documentElement.style.overflow = ''; res(s2); },
    });
  });
}
