import type { Cita } from '~/negocio/entidades/Cita';
import * as repo from '~/repositorio/implementaciones/CitaRepository';
import { validadorCita } from '~/negocio/validadores/validadorCita';

export async function createCitaAsync(c: Cita): Promise<Cita> {
  validadorCita.validarAntesDePersistir(c);
  return repo.createCita(c);
}

/** Comprueba si existe solapamiento de horario para el médico */
export async function hasConflictAsync(
  id_medico: string,
  fecha_hora: string,
  duracion_min: number,
  excludeId?: string,
): Promise<boolean> {
  try {
    const citas = await repo.getCitasByMedico(id_medico);
    const toMs = (v?: string) => (v ? new Date(v).getTime() : NaN);
    const newStart = toMs(fecha_hora);
    const newEnd = newStart + duracion_min * 60 * 1000;
    for (const c of citas) {
      const cid = String(c.id);
      if (excludeId && cid === String(excludeId)) continue;
      if (c.estado === 'CANCELADA') continue;
      const existingStart = toMs(c.fecha_hora);
      const existingEnd = existingStart + (c.duracion_min ?? 30) * 60 * 1000;
      if (isNaN(existingStart) || isNaN(newStart)) continue;
      if (newStart < existingEnd && existingStart < newEnd) return true;
    }
    return false;
  } catch {
    return false;
  }
}
