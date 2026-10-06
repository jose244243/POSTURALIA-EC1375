/* ============================================================================
   POSTURALIA · Plataforma de Certificación
   seguro.js — Lo que entra de fuera no se pinta tal cual

   ── El problema ───────────────────────────────────────────────────────────
   El trabajo diario del evaluador es arrastrar al panel archivos .json que le
   mandan los candidatos. El panel lee esos archivos y pinta su contenido —el
   nombre, el evaluador, los nombres de archivo, el texto de un acuerdo— con
   innerHTML, que interpreta HTML.

   Así que un .json con esto en el nombre:

       Ana<img src=x onerror="…">

   ejecutaba código en el navegador del evaluador en cuanto la tabla se
   pintaba. Se probó con cuatro campos y los cuatro dispararon: el nombre, el
   evaluador, la firma y el texto aceptado.

   Ese navegador es el que guarda los INE y las CURP de todos los candidatos,
   los precios, los pagos y el reparto entre socios. Un solo archivo bastaba
   para leerlo todo o alterar un pago. Y no hace falta mala fe elaborada: el
   archivo llega por WhatsApp, del mismo candidato que lo generó.

   ── Por qué se arregla aquí y no en cada pantalla ─────────────────────────
   Había más de sesenta lugares donde un dato del candidato se interpolaba en
   HTML. Escapar cada uno a mano garantiza que alguno se quede sin escapar, y
   que el próximo cambio reintroduzca el hueco sin que nadie lo note.

   Todo lo de fuera entra por dos puertas: la importación de un respaldo y la
   lectura de la nube. Limpiando ahí, lo que llega a cualquier pantalla ya
   viene limpio — incluidas las pantallas que se escriban el año que entra.

   Y `esc()` queda para lo que el propio evaluador escribe y para cualquier
   dato que no haya pasado por esas dos puertas.
   ========================================================================== */

/* ── Escapar texto ────────────────────────────────────────────────────────
   Para meter texto en HTML, tanto de contenido como dentro de un atributo
   entre comillas.                                                          */
const MAPA = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;' };
export const esc = v => String(v ?? '').replace(/[&<>"'`]/g, c => MAPA[c]);

/* ── Imágenes ─────────────────────────────────────────────────────────────
   Una firma o una evidencia termina en `src="…"`. Si el valor trae una
   comilla, se sale del atributo y agrega los suyos: `x" onerror="…`. Por eso
   no basta con que "parezca" una imagen: tiene que SER un data URL de imagen,
   con base64 limpio y nada más.

   Solo se aceptan data URL de PNG, JPEG, GIF y WebP en base64 — que es lo
   único que la propia plataforma genera. Un blob:, un SVG o un data URL sin
   base64 se descarta: si algún día uno legítimo no pasa, se pierde una
   miniatura, que es mucho mejor que abrir una puerta.                      */
const RE_IMAGEN = /^data:image\/(png|jpe?g|gif|webp);base64,[A-Za-z0-9+/]+=*$/;
export const imagenSegura = v =>
  typeof v === 'string' && v.length < 12_000_000 && RE_IMAGEN.test(v) ? v : '';

/* v47: el archivo de una evidencia (campo `dato`) también puede ser un PDF
   —la CURP de gob.mx, un INE escaneado—. Solo PDF en base64 limpio, hasta
   ~10 MB. Nunca se pinta como src ni como href: el portafolio lo abre con
   pdf.js y lo convierte en imágenes. */
const RE_PDF = /^data:application\/pdf;base64,[A-Za-z0-9+/]+=*$/;
export const archivoSeguro = v =>
  typeof v === 'string' && v.length < 15_000_000 && RE_PDF.test(v) ? v : imagenSegura(v);

/* ── Ligas ────────────────────────────────────────────────────────────────
   Una liga de video termina en `href="…"`. `javascript:alert(1)` es una liga
   perfectamente válida para el navegador, así que no basta con escapar: solo
   se aceptan http y https, sin espacios ni comillas.                        */
const RE_LIGA = /^https?:\/\/[^\s"'<>`]+$/i;
export const ligaSegura = v => typeof v === 'string' && RE_LIGA.test(v.trim()) ? v.trim() : '';

/* ── Texto libre ──────────────────────────────────────────────────────────
   Nombres, correos, lugares, notas. Nadie se llama con un "<" en el nombre,
   ni un correo lleva comillas dobles. Se quitan los caracteres con los que
   se escapa del HTML y del atributo; el apóstrofo se queda, porque sí hay
   apellidos que lo llevan y ningún atributo de la plataforma usa comilla
   simple. También se quitan los caracteres de control, que no se ven pero
   pueden romper una tabla o un CSV exportado.                              */
/* Un texto que empieza con un esquema peligroso se descarta completo. No
   lleva ni "<" ni comillas, así que el filtro de caracteres no lo detiene —
   y una liga `javascript:…` guardada como cadena suelta (la forma vieja de la
   liga del video) llegaba intacta hasta un href. Ningún nombre, correo o nota
   legítima empieza con "javascript:". */
const ESQUEMA_PELIGROSO = /^\s*(javascript|vbscript|data|file|blob)\s*:/i;

export const textoSeguro = v => {
  if (typeof v !== 'string') return v;
  if (ESQUEMA_PELIGROSO.test(v)) return '';
  return v.replace(/[<>"`\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
};

/* Qué hacer con cada campo según su nombre */
/* dataUrl: las firmas en el formato de firma-simple ({ mode, dataUrl }),
   como las del usuario en los Documentos de Sesión (v32). */
const CAMPOS_IMAGEN = new Set(['firma', 'dato', 'miniatura', 'dataUrl']);
const CAMPOS_LIGA   = new Set(['liga', 'enlace', 'url']);

/* ── Limpiar un expediente entero ─────────────────────────────────────────
   Recorre todo el objeto. Lo que no se sabe qué es se trata como texto, que
   es lo más restrictivo que no destruye datos legítimos.

   Devuelve también cuántas cosas quitó: si un respaldo llega con imágenes
   que no son imágenes, el evaluador merece saber que algo raro traía.     */
export function limpiarExpediente(obj) {
  let quitados = 0;

  const limpiar = (v, clave) => {
    if (typeof v === 'string') {
      let r;
      if (clave === 'dato')              r = v === '' ? '' : archivoSeguro(v);
      else if (CAMPOS_IMAGEN.has(clave)) r = v === '' ? '' : imagenSegura(v);
      else if (CAMPOS_LIGA.has(clave))   r = ligaSegura(v);
      else                               r = textoSeguro(v);
      if (r !== v) quitados++;
      return r;
    }
    if (Array.isArray(v)) return v.map(x => limpiar(x, clave));
    if (v && typeof v === 'object') {
      const out = {};
      for (const [k, x] of Object.entries(v)) {
        /* Las claves también se pintan (data-mod="…") y se usan como llaves
           de almacenamiento. Una clave con caracteres raros se descarta. */
        if (!/^[\w.\-áéíóúñÁÉÍÓÚÑ ]{1,80}$/.test(k)) { quitados++; continue; }
        out[k] = limpiar(x, k);
      }
      return out;
    }
    return v;
  };

  return { limpio: limpiar(obj, ''), quitados };
}
