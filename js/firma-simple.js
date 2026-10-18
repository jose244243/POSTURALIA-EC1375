/* ============================================================================
   POSTURALIA · firma-simple.js — Firma dibujada o escrita (evaluador / acto)

   Como la de Paideia (admin-evaluacion.html y documentos-sesion.html):
   "Dibujar firma" · "Escribir mi nombre" · "Adjuntar firma" · "Borrar firma".
   Devuelve { mode: 'draw', dataUrl } o { mode: 'type', typedName }. Una
   imagen adjunta (v66, para sesiones a distancia o la firma en papel) se
   reduce y queda como { mode: 'draw', dataUrl, subida: true }: así la leen
   igual todos los documentos y validaciones que ya entienden 'draw'. No toca la firma guardada del candidato
   (firma.js): cada firma aquí es de un documento concreto.
   ========================================================================== */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* Imagen de firma → JPEG con fondo blanco, máx. 600 × 240 px */
const achicar = f => new Promise((ok, mal) => {
  const url = URL.createObjectURL(f), img = new Image();
  img.onload = () => {
    URL.revokeObjectURL(url);
    const k = Math.min(1, 600 / (img.naturalWidth || 1), 240 / (img.naturalHeight || 1));
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(img.naturalWidth * k)); c.height = Math.max(1, Math.round(img.naturalHeight * k));
    const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
    ok(c.toDataURL('image/jpeg', 0.88));
  };
  img.onerror = () => { URL.revokeObjectURL(url); mal(new Error('imagen')); };
  img.src = url;
});

export function montarFirmaSimple(cont, { valor = null, nombreSugerido = '', onCambio = () => {},
  ayudaSubir = 'Sube una foto o imagen de la firma (PNG o JPG, menos de 5 MB).' } = {}) {
  let modo = valor?.subida ? 'upload' : (valor?.mode || 'draw'), actual = valor || null;
  const sug = () => String(typeof nombreSugerido === 'function' ? nombreSugerido() : nombreSugerido || '');
  const pintar = () => {
    cont.innerHTML = `
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">
        <button type="button" class="btn-a ${modo === 'draw' ? 'btn-a--pri' : 'btn-a--sec'}" data-m="draw">Dibujar firma</button>
        <button type="button" class="btn-a ${modo === 'type' ? 'btn-a--pri' : 'btn-a--sec'}" data-m="type">Escribir mi nombre</button>
        <button type="button" class="btn-a ${modo === 'upload' ? 'btn-a--pri' : 'btn-a--sec'}" data-m="upload">Adjuntar firma</button>
        <button type="button" class="btn-a btn-a--sec" data-m="borrar">Borrar firma</button>
      </div>
      ${modo === 'upload'
        ? `<p style="font-size:.84rem;color:var(--muted);margin:0 0 8px">${esc(ayudaSubir)}</p>
           ${actual?.subida ? `<img src="${actual.dataUrl}" alt="Firma" style="max-height:90px;border:1px dashed var(--border);border-radius:8px;background:#fff;padding:4px;display:block;margin-bottom:8px">` : ''}
           <label class="btn-a btn-a--sec" style="cursor:pointer;display:inline-block">${actual?.subida ? 'Cambiar imagen' : 'Subir imagen de la firma'}<input type="file" accept="image/png,image/jpeg,image/webp" data-subir hidden></label>
           <small data-err style="display:block;color:#b42318;margin-top:6px"></small>`
        : modo === 'draw'
        ? (actual?.mode === 'draw' ? `<img src="${actual.dataUrl}" alt="Firma" style="max-height:90px;border:1px dashed var(--border);border-radius:8px;background:#fff;padding:4px">`
          : `<canvas style="width:100%;max-width:520px;height:150px;border:1px dashed var(--border);border-radius:8px;background:#fff;touch-action:none"></canvas>
             <div><button type="button" class="btn-a btn-a--pri" data-m="usar" style="margin-top:6px">Usar esta firma</button></div>`)
        : `<input type="text" data-nombre value="${esc(actual?.typedName || sug())}" placeholder="Nombre completo"
             style="width:100%;max-width:520px;padding:10px 12px;border:1px solid var(--border);border-radius:8px;font:italic 1.4rem 'Brush Script MT','Segoe Script',cursive">`}`;
    const cv = cont.querySelector('canvas');
    if (cv) {
      const r = Math.min(devicePixelRatio || 1, 2);
      cv.width = cv.clientWidth * r; cv.height = cv.clientHeight * r;
      const ctx = cv.getContext('2d'); ctx.scale(r, r); ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.strokeStyle = '#0b1b33';
      let abajo = false; cv._trazo = false;
      const pos = e => { const b = cv.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
      cv.onpointerdown = e => { abajo = true; cv.setPointerCapture(e.pointerId); ctx.beginPath(); ctx.moveTo(...pos(e)); };
      cv.onpointermove = e => { if (!abajo) return; ctx.lineTo(...pos(e)); ctx.stroke(); cv._trazo = true; };
      cv.onpointerup = () => { abajo = false; };
    }
    const sub = cont.querySelector('[data-subir]');
    if (sub) sub.onchange = async () => {
      const f = sub.files?.[0], err = cont.querySelector('[data-err]');
      if (!f) return;
      if (!/^image\//.test(f.type)) { err.textContent = 'Sube una imagen PNG o JPG.'; return; }
      if (f.size > 5 * 1024 * 1024) { err.textContent = 'La imagen pesa más de 5 MB.'; return; }
      try { actual = { mode: 'draw', dataUrl: await achicar(f), subida: true }; onCambio(actual); pintar(); }
      catch { err.textContent = 'No se pudo leer la imagen. Prueba con otra foto.'; }
    };
    const n = cont.querySelector('[data-nombre]');
    if (n) n.oninput = () => { const t = n.value.trim(); actual = t.length >= 3 ? { mode: 'type', typedName: t } : null; onCambio(actual); };
  };
  cont.addEventListener('click', e => {
    const b = e.target.closest('[data-m]'); if (!b) return;
    const m = b.dataset.m;
    if (m === 'borrar') { actual = null; onCambio(null); return pintar(); }
    if (m === 'usar') {
      const cv = cont.querySelector('canvas');
      if (!cv?._trazo) return;
      actual = { mode: 'draw', dataUrl: cv.toDataURL('image/png') }; onCambio(actual); return pintar();
    }
    modo = m;
    if (modo === 'type' && sug().trim().length >= 3 && actual?.mode !== 'type') { actual = { mode: 'type', typedName: sug().trim() }; onCambio(actual); }
    pintar();
  });
  pintar();
  return { valor: () => actual };
}

/* La firma como HTML para un documento impreso */
export const firmaHtml = (f, alto = 56) => !f ? '' : f.mode === 'draw'
  ? `<img src="${f.dataUrl}" alt="Firma" style="max-height:${alto}px;display:block;margin:0 auto">`
  : `<div style="font:italic ${Math.round(alto / 2.4)}px 'Brush Script MT','Segoe Script',cursive;text-align:center">${esc(f.typedName)}</div>`;
