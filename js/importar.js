/* ============================================================================
   POSTURALIA · importar.js — Cargar candidatos, precios y pagos desde una lista

   Para traer lo que el equipo ya tiene en otro sistema (Paideia, un Excel,
   una exportación de Supabase) sin capturarlo a mano. Todo ocurre en el
   navegador del Centro: el archivo no sale de la computadora.

   Acepta:
     · CSV (coma, punto y coma o tabulador; con o sin BOM; «Guardar como CSV»
       de Excel sirve tal cual).
     · JSON: una lista de objetos, o { filas|rows|data: [...] }.

   Dos formas de tabla, y se pueden mezclar en el mismo archivo:
     · Ancha: una fila por candidato, con columnas por fase
       (precio_alineacion, pagado_alineacion, fecha_alineacion…).
     · Larga: una fila por pago (correo, fase, monto, fecha). Las filas del
       mismo correo se juntan.

   Los encabezados se reconocen sin importar acentos, mayúsculas ni
   espacios, y en español o inglés (email/correo, full_name/nombre…).
   ========================================================================== */
import { CONFIG } from './config.js';

export const FASES_IMP = CONFIG.fases.map(f => f.id);

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

/* Sinónimos de cada fase, como pueden venir escritas en otro sistema */
const FASE_SIN = {
  registro:   ['registro', 'inscripcion', 'apartado', 'anticipo', 'autodiagnostico', 'fase1', 'fase_1'],
  alineacion: ['alineacion', 'alineamiento', 'capacitacion', 'fase2', 'fase_2'],
  evaluacion: ['evaluacion', 'examen', 'fase3', 'fase_3'],
  entrega:    ['entrega', 'certificado', 'certificacion', 'fase4', 'fase_4'],
};
export function faseDe(texto) {
  const t = norm(texto);
  if (!t) return null;
  for (const f of FASES_IMP) if ((FASE_SIN[f] || [f]).some(s => t === s || t.includes(s))) return f;
  return null;
}

const CAMPOS = {
  correo:   ['correo', 'email', 'e_mail', 'mail', 'correo_electronico', 'user_email', 'usuario'],
  nombre:   ['nombre', 'nombre_completo', 'full_name', 'name', 'candidato', 'alumno'],
  telefono: ['telefono', 'celular', 'tel', 'phone', 'whatsapp', 'telefono_celular', 'movil'],
  curp:     ['curp'],
  lote:     ['lote', 'batch', 'cohorte', 'grupo', 'generacion'],
  estado:   ['estado', 'estatus', 'status', 'situacion', 'estado_comercial'],
  motivo:   ['nota', 'notas', 'motivo', 'comentario', 'comentarios', 'observaciones'],
  fase:     ['fase', 'etapa', 'phase', 'concepto'],
  monto:    ['monto', 'importe', 'amount', 'pago', 'cantidad', 'pagado_monto'],
  fecha:    ['fecha', 'fecha_pago', 'pagado_el', 'paid_at', 'created_at', 'autorizado_en', 'date'],
  total:    ['total', 'total_acordado', 'precio_total'],
};
const PREF = {
  precio: ['precio', 'monto', 'costo', 'price', 'importe'],
  pagado: ['pagado', 'pago', 'paid', 'liberado', 'autorizado', 'cobrado'],
  fecha:  ['fecha', 'date', 'pagado_el', 'paid_at'],
};

/* Qué es cada columna. Devuelve { columna: 'correo' | 'precio:alineacion' | … } */
export function detectarColumnas(columnas) {
  const mapa = {};
  const usados = new Set();
  columnas.forEach(col => {
    const c = norm(col);
    if (!c) return;
    /* Por fase: precio_alineacion, pagado_evaluacion, fecha_entrega, alineacion (sola = pagado) */
    const f = faseDe(c.replace(/^(precio|monto|costo|price|importe|pagado|pago|paid|liberado|autorizado|cobrado|fecha|date|pagado_el|paid_at)_|_(precio|monto|costo|price|importe|pagado|pago|paid|liberado|autorizado|cobrado|fecha|date)$/g, ''));
    const tipoFase = f && Object.entries(PREF).find(([, ps]) => ps.some(p => c.startsWith(p + '_') || c.endsWith('_' + p)))?.[0];
    const exacto = Object.entries(CAMPOS).find(([, ss]) => ss.includes(c))?.[0];
    if (exacto && !usados.has(exacto)) { mapa[col] = exacto; usados.add(exacto); return; }
    if (f && tipoFase) { mapa[col] = `${tipoFase}:${f}`; return; }
    if (f && FASE_SIN[f].includes(c)) { mapa[col] = `pagado:${f}`; return; }
    const parcial = Object.entries(CAMPOS).find(([k, ss]) => !usados.has(k) && ss.some(s => s.length > 3 && c.includes(s)))?.[0];
    if (parcial) { mapa[col] = parcial; usados.add(parcial); }
  });
  return mapa;
}

/* ── Lectura del archivo ─────────────────────────────────────────────── */
function partirCsv(texto) {
  const t = texto.replace(/^﻿/, '');
  const primera = t.split(/\r?\n/, 1)[0] || '';
  const cuenta = ch => (primera.match(new RegExp('\\' + ch, 'g')) || []).length;
  const sep = [';', '\t', ','].sort((a, b) => cuenta(b) - cuenta(a))[0];
  const filas = []; let fila = [], campo = '', comillas = false;
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (comillas) {
      if (ch === '"') { if (t[i + 1] === '"') { campo += '"'; i++; } else comillas = false; }
      else campo += ch;
    } else if (ch === '"' && campo === '') comillas = true;
    else if (ch === sep) { fila.push(campo); campo = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && t[i + 1] === '\n') i++;
      fila.push(campo); campo = '';
      if (fila.some(x => x.trim() !== '')) filas.push(fila);
      fila = [];
    } else campo += ch;
  }
  fila.push(campo); if (fila.some(x => x.trim() !== '')) filas.push(fila);
  return filas;
}

export function leerTabla(texto, nombre = '') {
  const t = String(texto || '').trim();
  if (!t) return { ok: false, motivo: 'El archivo está vacío.' };
  if (/\.json$/i.test(nombre) || /^[[{]/.test(t)) {
    let j; try { j = JSON.parse(t); } catch { return { ok: false, motivo: 'No es un JSON válido.' }; }
    const lista = Array.isArray(j) ? j : (j.filas || j.rows || j.data || j.candidatos || null);
    if (!Array.isArray(lista) || !lista.length || typeof lista[0] !== 'object')
      return { ok: false, motivo: 'El JSON no trae una lista de registros.' };
    const columnas = [...new Set(lista.flatMap(o => Object.keys(o || {})))];
    return { ok: true, columnas, filas: lista.map(o => Object.fromEntries(columnas.map(c => [c, o?.[c] ?? '']))) };
  }
  const m = partirCsv(t);
  if (m.length < 2) return { ok: false, motivo: 'La lista necesita un renglón de encabezados y al menos un candidato.' };
  const columnas = m[0].map(c => c.trim());
  return { ok: true, columnas, filas: m.slice(1).map(r => Object.fromEntries(columnas.map((c, i) => [c, (r[i] ?? '').trim()]))) };
}

/* ── Valores ─────────────────────────────────────────────────────────── */
export function numero(v) {
  if (typeof v === 'number') return v;
  const t = String(v ?? '').replace(/[$\s]|MXN|mxn/g, '');
  if (!t) return null;
  /* 1.500,50 (europeo) · 1,500.50 · 1500 */
  const n = /,\d{1,2}$/.test(t) && !/\.\d{1,2}$/.test(t) ? t.replace(/\./g, '').replace(',', '.') : t.replace(/,/g, '');
  const x = Number(n);
  return Number.isFinite(x) ? x : null;
}
const SI = ['si', 's', 'yes', 'y', 'true', '1', 'x', 'pagado', 'pagada', 'liberado', 'liberada', 'ok', 'autorizado', 'autorizada', 'completo'];
const NO = ['no', 'n', 'false', '0', '', 'pendiente', 'sin_pago', 'no_pagado'];
/* ¿Está pagada? Acepta sí/no, una fecha o un monto mayor a cero */
export function pagadoDe(v) {
  if (typeof v === 'boolean') return v;
  const t = norm(v);
  if (SI.includes(t)) return true;
  if (NO.includes(t)) return false;
  if (fechaISO(v)) return true;
  const n = numero(v);
  return n != null ? n > 0 : null;
}
/* 2026-09-01, 01/09/2026 (día/mes, como en México), 2026-09-01T10:00:00Z */
export function fechaISO(v) {
  const t = String(v ?? '').trim();
  let m = t.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/);
  if (m) { const d = new Date(t.length > 10 ? t : t + 'T12:00:00'); return isNaN(d) ? null : d.toISOString(); }
  m = t.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  if (m) { const d = new Date(`${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}T12:00:00`); return isNaN(d) ? null : d.toISOString(); }
  return null;
}
const ESTADOS = {
  activo: ['activo', 'activa', 'active', 'inscrito', 'inscrita', 'en_proceso', 'vigente'],
  desistio: ['desistio', 'baja', 'cancelado', 'cancelada', 'inactivo', 'inactiva', 'abandono'],
  cambio_lote: ['cambio_lote', 'cambio_de_lote', 'cambio', 'reprogramado'],
  administrador: ['administrador', 'admin', 'equipo', 'staff'],
};
export const estadoDe = v => { const t = norm(v); if (!t) return null; return Object.entries(ESTADOS).find(([, ss]) => ss.includes(t))?.[0] || null; };
const correoValido = c => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c);

/* ── Interpretar ─────────────────────────────────────────────────────────
   Devuelve { registros, errores }. Cada registro:
   { correo, nombre, telefono, curp, lote, estado, motivo,
     montos: { fase: n }, pagos: { fase: { monto, fecha } }, fila }        */
export function interpretar(filas, mapa) {
  const porCorreo = new Map(), errores = [];
  const col = campo => Object.keys(mapa).find(k => mapa[k] === campo);
  filas.forEach((f, i) => {
    const fila = i + 2;   // la 1 es el encabezado
    const val = campo => { const c = col(campo); return c == null ? '' : f[c]; };
    const correo = String(val('correo') || '').toLowerCase().trim();
    if (!correo) { errores.push({ fila, motivo: 'no trae correo' }); return; }
    if (!correoValido(correo)) { errores.push({ fila, motivo: `correo inválido: ${correo}` }); return; }
    const r = porCorreo.get(correo) || { correo, nombre: '', telefono: '', curp: '', lote: null, estado: null, motivo: '', montos: {}, pagos: {}, filas: [] };
    r.filas.push(fila);
    const s = campo => String(val(campo) ?? '').trim();
    if (s('nombre')) r.nombre = s('nombre');
    if (s('telefono')) r.telefono = s('telefono');
    if (s('curp')) r.curp = s('curp').toUpperCase();
    if (s('motivo')) r.motivo = s('motivo');
    const l = numero(val('lote')); if (l != null && l >= 1) r.lote = Math.floor(l);
    if (s('estado')) { const e = estadoDe(s('estado')); if (e) r.estado = e; else errores.push({ fila, motivo: `estado no reconocido «${s('estado')}» (se deja como estaba)` }); }

    /* Columnas por fase (tabla ancha) */
    Object.entries(mapa).forEach(([c, m]) => {
      const [tipo, fase] = m.split(':'); if (!fase) return;
      const v = f[c];
      if (tipo === 'precio') { const n = numero(v); if (n != null) r.montos[fase] = Math.max(0, Math.round(n)); }
      if (tipo === 'pagado') {
        const p = pagadoDe(v);
        if (p === true) { r.pagos[fase] = { ...(r.pagos[fase] || {}), fecha: r.pagos[fase]?.fecha || fechaISO(v) || null };
          const n = numero(v); if (n != null && n > 1 && !fechaISO(v)) r.pagos[fase].monto = Math.round(n); }
        else if (p === null) errores.push({ fila, motivo: `no se entiende si ${fase} está pagada: «${v}»` });
      }
      if (tipo === 'fecha') { const d = fechaISO(v); if (d) r.pagos[fase] = { ...(r.pagos[fase] || {}), fecha: d }; }
    });

    /* Una fila por pago (tabla larga) */
    if (col('fase') != null && s('fase')) {
      const fase = faseDe(s('fase'));
      if (!fase) errores.push({ fila, motivo: `fase no reconocida «${s('fase')}»` });
      else {
        const n = numero(val('monto'));
        r.pagos[fase] = { monto: n != null ? Math.round(n) : r.pagos[fase]?.monto, fecha: fechaISO(val('fecha')) || r.pagos[fase]?.fecha || null };
        if (n != null && r.montos[fase] == null) r.montos[fase] = Math.round(n);
      }
    }
    porCorreo.set(correo, r);
  });
  return { registros: [...porCorreo.values()], errores };
}

/* Resumen para la vista previa, comparado con lo que ya hay */
export function resumen(registros, existentes = new Set()) {
  const nuevos = registros.filter(r => !existentes.has(r.correo)).length;
  const pagos = registros.reduce((s, r) => s + Object.keys(r.pagos).length, 0);
  return { total: registros.length, nuevos, actualizados: registros.length - nuevos, pagos };
}

/* Plantilla con las columnas que se reconocen */
export function plantillaCsv() {
  const cab = ['correo', 'nombre', 'telefono', 'curp', 'lote', 'estado',
    ...FASES_IMP.flatMap(f => [`precio_${f}`, `pagado_${f}`, `fecha_${f}`]), 'notas'];
  const ej = ['ana.perez@ejemplo.mx', 'Ana Pérez López', '5512345678', '', '3', 'activo',
    ...FASES_IMP.flatMap((f, i) => i < 2 ? ['2500', 'sí', '01/09/2026'] : ['4000', 'no', '']), 'ejemplo: borra este renglón'];
  return '﻿' + [cab, ej].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\r\n');
}
