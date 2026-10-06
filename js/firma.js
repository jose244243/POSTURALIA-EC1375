/* ============================================================================
   POSTURALIA · Plataforma de Certificación
   firma.js — La firma del candidato, capturada una vez

   El expediente CONOCER lleva firma del candidato en más de un punto: la
   declaración de autenticidad de las evidencias, el acuse del Plan, la
   encuesta. Pedirle que vuelva a firmar cada vez, con el dedo, en un celular,
   es la clase de fricción que hace que alguien abandone a tres pantallas del
   final.

   Así que se captura una vez y se reutiliza, y cada uso queda sellado con su
   propia fecha: la firma es la misma, pero "firmó la declaración de
   evidencias el 20 de septiembre" es un hecho distinto de "firmó el acuse del
   Plan el 2 de octubre", y el expediente necesita los dos por separado.

   Dos maneras de firmar, porque con una sola siempre queda gente fuera:
     trazo  con el dedo o el mouse. Es lo que la mayoría espera.
     texto  escribiendo su nombre. Para quien firma desde una laptop sin
            pantalla táctil, donde trazar con el mouse sale como un garabato
            que no se parece a su firma.

   Se guarda como PNG en data URL. Una firma trazada pesa entre 4 y 20 KB, así
   que cabe de sobra en el respaldo sin inflarlo.
   ========================================================================== */

import { Store } from './store.js';

const CLAVE = 'firma';

/* ── Lo guardado ──────────────────────────────────────────────────────── */
export function firmaGuardada() {
  const f = Store.get(CLAVE, {});
  return f.dato ? f : null;
}

export function guardarFirma({ dato, tipo, nombre = '' }) {
  if (!dato) return false;
  return Store.set(CLAVE, {
    dato, tipo, nombre,
    fecha: new Date().toISOString(),
  });
}

export function borrarFirma() { Store.clear(CLAVE); }

/* ── Sellar un uso concreto ───────────────────────────────────────────────
   Devuelve lo que hay que guardar en el módulo que pidió la firma: la firma
   en sí más la fecha y el texto que se estaba aceptando. Guardar solo un
   `firmado: true` no sirve de nada el día que alguien pregunte qué fue
   exactamente lo que esa persona aceptó.                                   */
export function sellar(textoAceptado) {
  const f = firmaGuardada();
  if (!f) return null;
  return {
    firma: f.dato,
    tipoFirma: f.tipo,
    nombre: f.nombre,
    fecha: new Date().toISOString(),
    acepto: textoAceptado,
  };
}

/* ── Trazar ───────────────────────────────────────────────────────────────
   Punteros y no ratón: `pointerdown` cubre dedo, lápiz y mouse con el mismo
   código. Con eventos de ratón, en celular no se dibujaba nada — que es
   justo donde la gente firma.                                              */
function conectarLienzo(canvas) {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth || 600, h = canvas.clientHeight || 180;
  canvas.width = w * ratio;
  canvas.height = h * ratio;

  const ctx = canvas.getContext('2d');
  ctx.scale(ratio, ratio);
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#0F172A';

  let trazando = false, hayTrazo = false, ux = 0, uy = 0;

  const punto = e => {
    const r = canvas.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };

  canvas.addEventListener('pointerdown', e => {
    e.preventDefault();
    trazando = true; hayTrazo = true;
    [ux, uy] = punto(e);

    /* Capturar el puntero sirve para no perder el trazo si el dedo se sale
       del recuadro, pero va después de marcar el trazo y dentro de un try:
       setPointerCapture puede lanzar si el id ya no es válido, y si lo
       hiciera desde la primera línea se llevaría consigo el resto del
       manejador — la persona vería su firma en pantalla y al guardar no
       pasaría nada, sin ningún mensaje. No vale la pena arriesgar la firma
       por una comodidad. */
    try { canvas.setPointerCapture(e.pointerId); } catch {}
    /* Un toque sin arrastrar tiene que dejar marca: sin esto, el punto sobre
       la i de una firma simplemente no aparecía. */
    ctx.beginPath(); ctx.arc(ux, uy, 1.1, 0, Math.PI * 2); ctx.fill();
  });

  canvas.addEventListener('pointermove', e => {
    if (!trazando) return;
    e.preventDefault();
    const [x, y] = punto(e);
    ctx.beginPath(); ctx.moveTo(ux, uy); ctx.lineTo(x, y); ctx.stroke();
    [ux, uy] = [x, y];
  });

  const soltar = () => { trazando = false; };
  canvas.addEventListener('pointerup', soltar);
  canvas.addEventListener('pointercancel', soltar);
  canvas.addEventListener('pointerleave', soltar);

  return {
    limpiar() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hayTrazo = false;
    },
    vacio: () => !hayTrazo,
    /* Se recorta al contenido real: sin esto, la firma sale como una tira
       ancha con el trazo perdido en una esquina. */
    aPNG() { return recortar(canvas); },
  };
}

/* Recorta el lienzo a lo que de verdad se dibujó, con un margen */
function recortar(canvas) {
  const ctx = canvas.getContext('2d');
  const { width: W, height: H } = canvas;
  let datos;
  try { datos = ctx.getImageData(0, 0, W, H).data; }
  catch { return canvas.toDataURL('image/png'); }

  let x0 = W, y0 = H, x1 = 0, y1 = 0, hay = false;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (datos[(y * W + x) * 4 + 3] > 8) {
        hay = true;
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
    }
  }
  if (!hay) return canvas.toDataURL('image/png');

  const m = 10;
  x0 = Math.max(0, x0 - m); y0 = Math.max(0, y0 - m);
  x1 = Math.min(W - 1, x1 + m); y1 = Math.min(H - 1, y1 + m);

  const corte = document.createElement('canvas');
  corte.width = x1 - x0 + 1;
  corte.height = y1 - y0 + 1;
  corte.getContext('2d').drawImage(canvas, x0, y0, corte.width, corte.height,
                                   0, 0, corte.width, corte.height);
  return corte.toDataURL('image/png');
}

/* ── Escribir el nombre ───────────────────────────────────────────────── */
function nombreAPNG(texto) {
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  const fuente = '38px "Segoe Script", "Bradley Hand", "Snell Roundhand", cursive';

  ctx.font = fuente;
  const ancho = Math.ceil(ctx.measureText(texto).width) + 40;

  c.width = Math.max(ancho, 120);
  c.height = 80;
  const c2 = c.getContext('2d');
  c2.font = fuente;
  c2.fillStyle = '#0F172A';
  c2.textBaseline = 'middle';
  c2.fillText(texto, 20, 42);
  return c.toDataURL('image/png');
}

/* ── La interfaz ──────────────────────────────────────────────────────────
   Se monta dentro del contenedor que se le pase y avisa por `onCambio`
   cada vez que hay (o deja de haber) una firma válida.                     */
export function montarFirma(contenedor, { onCambio = () => {}, nombreSugerido = '' } = {}) {
  if (!contenedor) return;

  const yaHay = firmaGuardada();

  contenedor.innerHTML = `
    <div class="fm">
      ${yaHay ? `
        <div class="fm-guardada">
          <img src="${yaHay.dato}" alt="Tu firma">
          <div class="fm-guardada-txt">
            <strong>Ya tienes una firma guardada</strong>
            <small>Se usará aquí. Si prefieres firmar distinto, cámbiala abajo.</small>
          </div>
          <button type="button" class="fm-btn" data-accion="rehacer">Cambiar</button>
        </div>` : ''}

      <div class="fm-captura" ${yaHay ? 'hidden' : ''}>
        <div class="fm-tabs" role="tablist">
          <button type="button" class="fm-tab fm-tab--on" data-modo="trazo" role="tab">Dibujar</button>
          <button type="button" class="fm-tab" data-modo="texto" role="tab">Escribir mi nombre</button>
        </div>

        <div class="fm-panel" data-panel="trazo">
          <canvas class="fm-lienzo" aria-label="Área para dibujar tu firma"></canvas>
          <p class="fm-ayuda">Firma con el dedo o con el mouse dentro del recuadro.</p>
        </div>

        <div class="fm-panel" data-panel="texto" hidden>
          <input type="text" class="fm-nombre" placeholder="Escribe tu nombre completo"
                 value="${nombreSugerido.replace(/"/g, '&quot;')}">
          <div class="fm-vista" aria-live="polite"></div>
          <p class="fm-ayuda">Tu nombre escrito cuenta como firma electrónica simple.</p>
        </div>

        <div class="fm-acciones">
          <button type="button" class="fm-btn" data-accion="limpiar">Borrar</button>
          <button type="button" class="fm-btn fm-btn--ok" data-accion="guardar">Guardar firma</button>
        </div>
      </div>
    </div>`;

  const $ = s => contenedor.querySelector(s);
  const lienzo = conectarLienzo($('.fm-lienzo'));
  let modo = 'trazo';

  const vistaTexto = () => {
    const n = $('.fm-nombre').value.trim();
    $('.fm-vista').innerHTML = n
      ? `<img src="${nombreAPNG(n)}" alt="Vista previa de tu firma">` : '';
  };

  contenedor.addEventListener('input', e => {
    if (e.target.closest('.fm-nombre')) vistaTexto();
  });

  contenedor.addEventListener('click', e => {
    const tab = e.target.closest('[data-modo]');
    if (tab) {
      modo = tab.dataset.modo;
      contenedor.querySelectorAll('.fm-tab').forEach(t =>
        t.classList.toggle('fm-tab--on', t.dataset.modo === modo));
      contenedor.querySelectorAll('[data-panel]').forEach(p =>
        p.hidden = p.dataset.panel !== modo);
      if (modo === 'texto') vistaTexto();
      return;
    }

    const acc = e.target.closest('[data-accion]')?.dataset.accion;
    if (!acc) return;

    if (acc === 'rehacer') {
      $('.fm-guardada')?.setAttribute('hidden', '');
      $('.fm-captura').hidden = false;
    }

    if (acc === 'limpiar') {
      lienzo.limpiar();
      $('.fm-nombre').value = '';
      $('.fm-vista').innerHTML = '';
    }

    if (acc === 'guardar') {
      let dato = null, tipo = modo, nombre = '';

      if (modo === 'trazo') {
        if (lienzo.vacio()) return avisar(contenedor, 'Todavía no has dibujado nada.');
        dato = lienzo.aPNG();
      } else {
        nombre = $('.fm-nombre').value.trim();
        if (nombre.length < 3) return avisar(contenedor, 'Escribe tu nombre completo.');
        dato = nombreAPNG(nombre);
      }

      if (Store.soloLectura) return avisar(contenedor, 'Estás viendo un expediente ajeno: no se puede firmar aquí.');

      guardarFirma({ dato, tipo, nombre });
      montarFirma(contenedor, { onCambio, nombreSugerido });
      onCambio(firmaGuardada());
    }
  });
}

function avisar(contenedor, txt) {
  let aviso = contenedor.querySelector('.fm-aviso');
  if (!aviso) {
    aviso = document.createElement('p');
    aviso.className = 'fm-aviso';
    contenedor.querySelector('.fm-acciones')?.after(aviso);
  }
  aviso.textContent = txt;
}
