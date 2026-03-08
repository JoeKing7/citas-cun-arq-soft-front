import type { Cita } from '../../domain/types';
import { fetchJson } from '../../config/api';

export async function getCitasAsync(): Promise<Cita[]> {
  return fetchJson('/citas');
}

export async function createCitaAsync(c: Cita): Promise<Cita> {
  // Backend expects camelCase payload without internal fields like `id` or `estado`.
  const payload: any = {
    idMedico: Number((c as any).id_medico ?? (c as any).idMedico),
    idPaciente: Number((c as any).id_paciente ?? (c as any).idPaciente),
    fechaHora: (c as any).fecha_hora ?? (c as any).fechaHora,
  };
  if ((c as any).duracion_min ?? (c as any).duracionMin)
    payload.duracionMin = (c as any).duracion_min ?? (c as any).duracionMin;
  if ((c as any).motivo) payload.motivo = c.motivo;
  return fetchJson('/citas', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function cancelCitaAsync(id: string): Promise<void> {
  await fetchJson(`/citas/${id}/cancelar`, { method: 'PUT' });
}

export async function updateCitaAsync(
  id: string,
  updates: Partial<Cita>,
): Promise<void> {
  // Convert partial updates to backend camelCase shape
  // Convert partial updates to backend camelCase shape
  const payload: any = {};
  if ((updates as any).fecha_hora || (updates as any).fechaHora)
    payload.fechaHora =
      (updates as any).fecha_hora ?? (updates as any).fechaHora;
  if ((updates as any).duracion_min || (updates as any).duracionMin)
    payload.duracionMin =
      (updates as any).duracion_min ?? (updates as any).duracionMin;
  if ((updates as any).motivo) payload.motivo = updates.motivo;
  await fetchJson(`/citas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function deleteCitaAsync(id: string): Promise<void> {
  await fetchJson(`/citas/${id}`, { method: 'DELETE' });
}

export async function getCitasByPacienteAsync(
  idPaciente: string,
): Promise<Cita[]> {
  return fetchJson(`/citas/paciente/${idPaciente}`);
}

export async function getCitasByMedicoAsync(idMedico: string): Promise<Cita[]> {
  return fetchJson(`/citas/medico/${idMedico}`);
}

export async function hasConflictAsync(
  id_medico: string,
  fecha_hora: string,
  duracion_min: number,
  excludeId?: string,
): Promise<boolean> {
  // Backend does not expose /citas/check-conflict. Fetch citas del médico y compute locally.
  try {
    const citas: any[] = await fetchJson(`/citas/medico/${id_medico}`);
    const toMs = (v?: string) => (v ? new Date(v).getTime() : NaN);
    const newStart = toMs(fecha_hora);
    const newEnd = newStart + duracion_min * 60 * 1000;
    for (const c of citas) {
      const cid = String(c.id);
      if (excludeId && cid === String(excludeId)) continue;
      if (c.estado === 'CANCELADA') continue;
      const existingStart = toMs(c.fechaHora ?? c.fecha_hora);
      const existingDur = c.duracionMin ?? c.duracion_min ?? 30;
      const existingEnd = existingStart + existingDur * 60 * 1000;
      if (isNaN(existingStart) || isNaN(newStart)) continue;
      if (newStart < existingEnd && existingStart < newEnd) return true;
    }
    return false;
  } catch (err) {
    // If backend fails, fall back to optimistic (no conflict)
    console.warn('Conflict check failed; assuming no conflict', err);
    return false;
  }
}
