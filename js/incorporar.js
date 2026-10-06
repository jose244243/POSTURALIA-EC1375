/* ============================================================================
   POSTURALIA · incorporar.js — Meter expedientes de candidatos al panel

   Lo que antes vivía dentro de admin-candidatos.html (procesar), sacado a un
   módulo para que las tres puertas por donde llega un expediente pasen por
   el mismo camino:
     · «Importar respaldo» (el .json que manda el candidato),
     · «Traer el avance de este navegador» (modo local),
     · la nube: cada candidato registrado en Supabase (centro-nube.js).
   El mismo camino significa la misma limpieza (leerRespaldo → seguro.js) y
   el mismo manejo de fotos pesadas (a IndexedDB, no a localStorage).

   entradas: [{ nombre, texto }]  (texto = el JSON del respaldo)
   Devuelve { errores: [{archivo, motivo}], nuevos: n }
   ========================================================================== */
import { actualizar } from './admin-data.js';
import { leerRespaldo } from './expediente.js';
import { aligerar } from './almacen-grande.js';

export async function incorporarRespaldos(entradas) {
  const errores = [];
  const nuevos = [];
  let sinAlmacen = 0;

  for (const e of entradas) {
    const r = leerRespaldo(e.texto, e.nombre);
    if (!r.ok) { errores.push(r); continue; }

    /* Las fotos salen del expediente antes de que toque localStorage.

       Un expediente con sus cuatro evidencias pesa ~1.3 MB, y localStorage
       da 5. El quinto candidato ya no cabía — y como `actualizar()` no
       miraba si había guardado, la tabla mostraba los doce y al recargar
       quedaba uno. Ahora el archivo se va a IndexedDB y en localStorage solo
       queda su ficha: unos KB, así que caben cientos.                      */
    const est = r.expediente.estado || {};
    const mods = Object.fromEntries(
      Object.entries(est).map(([k, v]) => [k, v?.datos]).filter(([, v]) => v));

    if (r.expediente.candidato) mods.__candidato = r.expediente.candidato;
    const { modulos, fallados } = await aligerar(r.expediente.id, mods);
    Object.entries(modulos).forEach(([k, v]) => {
      if (est[k]) est[k].datos = v;
    });
    if (modulos.__candidato) r.expediente.candidato = modulos.__candidato;
    sinAlmacen += fallados;

    nuevos.push(r.expediente);
  }

  const res = actualizar(d => {
    nuevos.forEach(x => {
      const correo = (x.correo || '').toLowerCase();
      /* Mismo candidato aunque cambie el id: un alta manual (id = correo) o
         un respaldo viejo sin correo (la clave era el nombre). Lo cobrado y
         lo acordado se mudan a la clave nueva para no perderse. */
      let i = d.expedientes.findIndex(v => v.id === x.id);
      if (i < 0 && correo) i = d.expedientes.findIndex(v => (v.correo || '').toLowerCase() === correo);
      if (i >= 0 && correo) {
        const vieja = ((d.expedientes[i].correo || d.expedientes[i].nombre || '') + '').toLowerCase().trim();
        if (vieja && vieja !== correo) {
          if (d.precio[vieja] && !d.precio[correo]) { d.precio[correo] = d.precio[vieja]; delete d.precio[vieja]; }
          d.pagos.forEach(p => { if (p.email === vieja) p.email = correo; });
          if (d.evaluaciones?.[vieja] && !d.evaluaciones[correo]) { d.evaluaciones[correo] = d.evaluaciones[vieja]; delete d.evaluaciones[vieja]; }
        }
        if (d.expedientes[i].manual) { d.expedientes[i] = x; return; }
      }
      // Si ya estaba, gana el respaldo más reciente
      if (i >= 0) {
        if ((x.respaldadoEl || '') >= (d.expedientes[i].respaldadoEl || '')) d.expedientes[i] = x;
      } else d.expedientes.push(x);
    });
  });

  /* Si aun así no cupo, se dice. Un panel que reporta éxito y pierde el
     expediente es peor que uno que falla de frente. */
  if (res.__guardado === false) {
    errores.push({
      archivo: `${nuevos.length} expediente${nuevos.length === 1 ? '' : 's'}`,
      motivo: res.__error === 'cuota'
        ? 'no se pudo guardar: el almacenamiento de este navegador está lleno. ' +
          'Quita expedientes ya atendidos, o usa "Vaciar el panel" tras respaldarlos.'
        : 'no se pudo guardar en este navegador.',
    });
  } else if (sinAlmacen) {
    errores.push({
      archivo: 'Archivos',
      motivo: `${sinAlmacen} archivo(s) no se pudieron guardar en este navegador ` +
              `(suele pasar en modo privado). Del resto del expediente no se perdió nada, ` +
              `pero esos archivos habrá que pedirlos aparte.`,
    });
  }
  return { errores, nuevos: nuevos.length };
}
