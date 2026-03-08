import type { Medico } from '../../domain/types';
import { fetchJson } from '../../config/api';

export async function getMedicosAsync(): Promise<Medico[]> {
  const raw: any[] = await fetchJson('/medicos');
  // Map backend camelCase fields to local storage shape
  return raw.map((m) => ({
    id: String(m.id),
    nombre: m.nombre,
    especialidad: m.especialidad,
    num_licencia: m.numLicencia ?? m.num_licencia,
    estado: m.estado ?? 'ACTIVO',
  }));
}

export async function createMedicoAsync(m: Medico): Promise<Medico> {
  // Backend expects camelCase payload: { nombre, especialidad, numLicencia }
  const payload: any = {
    nombre: m.nombre,
    especialidad: m.especialidad,
    numLicencia: (m as any).num_licencia ?? (m as any).numLicencia,
  };
  const created = await fetchJson('/medicos', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });
  // Normalize response to local Medico shape
  return {
    id: String(created.id),
    nombre: created.nombre,
    especialidad: created.especialidad,
    num_licencia: created.numLicencia ?? created.num_licencia,
    estado: created.estado ?? 'ACTIVO',
  } as Medico;
}

export async function deleteMedicoAsync(id: string): Promise<void> {
  await fetchJson(`/medicos/${id}/inactivar`, { method: 'PUT' });
}
