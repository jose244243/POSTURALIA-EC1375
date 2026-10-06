/* ============================================================================
   POSTURALIA · fechas.js — Fechas de calendario en la hora de quien mira

   Dos formas de equivocarse con un día, y la plataforma tenía las dos:

   · `new Date().toISOString().slice(0, 10)` da la fecha en UTC, no en
     México. De las 18:00 en adelante (UTC−6) ya es "mañana": una sesión de
     Alineación de hoy a las 19:00 salía como "Ya pasó" en el panel del
     Centro, y al candidato su propia sesión se le daba por terminada una
     hora antes de empezar.

   · `new Date('2026-10-04')` se interpreta como medianoche UTC; en México
     eso es el sábado 3 a las 18:00. El panel del candidato le anunciaba su
     sesión un día antes de la real.

   Las pruebas no lo veían porque el servidor de pruebas corre en UTC.   */

const dos = n => String(n).padStart(2, '0');

/* 'AAAA-MM-DD' de hoy (o de la fecha dada), en la hora local */
export const hoyLocal = (d = new Date()) =>
  `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;

/* 'AAAA-MM-DD' → Date a la medianoche LOCAL de ese día. Si trae hora, se
   deja como venga: un sello ISO completo sí sabe en qué zona está. */
export function deFechaLocal(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || '').trim());
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date(s);
}
