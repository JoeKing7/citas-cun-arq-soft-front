import type { Cita } from '~/negocio/entidades/Cita';
import { fetchJson } from '../http/axiosClient';

function normalize(c: any): Cita & { medicoObj?: any; pacienteObj?: any } {
  return {
    id: String(c.id),
    // El backend anida medico/paciente como objetos; también soporta campos planos.
    id_medico: c.medico
      ? String(c.medico.id)
      : String(c.idMedico ?? c.id_medico ?? ''),
    id_paciente: c.paciente
      ? String(c.paciente.id)
      : String(c.idPaciente ?? c.id_paciente ?? ''),
    fecha_hora: c.fechaHora ?? c.fecha_hora,
    duracion_min: c.duracionMin ?? c.duracion_min ?? 30,
    estado: c.estado ?? 'ACTIVA',
    motivo: c.motivo ?? null,
    // Preserva los objetos anidados para que la UI pueda mostrar nombre/especialidad
    medicoObj: c.medico ?? null,
    pacienteObj: c.paciente ?? null,
  } as Cita & { medicoObj?: any; pacienteObj?: any };
}

export async function getCitas(): Promise<Cita[]> {
  const raw: any[] = await fetchJson('/citas');
  return raw.map(normalize);
}

export async function createCita(c: Cita): Promise<Cita> {
  const payload: any = {
    idMedico: Number((c as any).id_medico ?? (c as any).idMedico),
    idPaciente: Number((c as any).id_paciente ?? (c as any).idPaciente),
    fechaHora: (c as any).fecha_hora ?? (c as any).fechaHora,
  };
  if ((c as any).duracion_min ?? (c as any).duracionMin)
    payload.duracionMin = (c as any).duracion_min ?? (c as any).duracionMin;
  if ((c as any).motivo) payload.motivo = c.motivo;
  const created: any = await fetchJson('/citas', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });
  return normalize(created);
}

export async function cancelCita(id: string): Promise<void> {
  await fetchJson(`/citas/${id}/cancelar`, { method: 'PUT' });
}

export async function updateCita(
  id: string,
  updates: Partial<Cita>,
): Promise<void> {
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

export async function deleteCita(id: string): Promise<void> {
  await fetchJson(`/citas/${id}`, { method: 'DELETE' });
}

export async function getCitasByPaciente(idPaciente: string): Promise<Cita[]> {
  const raw: any[] = await fetchJson(`/citas/paciente/${idPaciente}`);
  return raw.map(normalize);
}

export async function getCitasByMedico(idMedico: string): Promise<Cita[]> {
  const raw: any[] = await fetchJson(`/citas/medico/${idMedico}`);
  return raw.map(normalize);
}
