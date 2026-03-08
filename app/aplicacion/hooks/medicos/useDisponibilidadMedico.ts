import * as repo from '~/repositorio/implementaciones/CitaRepository';

/**
 * Verifica si un médico tiene conflicto de horario antes de agendar una cita.
 * Compara la nueva cita contra todas las citas activas del médico.
 */
export async function checkDisponibilidadMedicoAsync(
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
      if (excludeId && String(c.id) === String(excludeId)) continue;
      if (c.estado === 'CANCELADA') continue;
      const existingStart = toMs(c.fecha_hora);
      const existingEnd = existingStart + (c.duracion_min ?? 30) * 60 * 1000;
      if (isNaN(existingStart) || isNaN(newStart)) continue;
      if (newStart < existingEnd && existingStart < newEnd) return false; // hay conflicto
    }
    return true; // médico disponible
  } catch {
    return true; // si falla, asumimos disponible
  }
}
