import type { Medico } from '~/negocio/entidades/Medico';
import { fetchJson } from '../http/axiosClient';

export async function getMedicos(): Promise<Medico[]> {
  const raw: any[] = await fetchJson('/medicos');
  return raw.map((m) => ({
    id: String(m.id),
    nombre: m.nombre,
    especialidad: m.especialidad,
    num_licencia: m.numLicencia ?? m.num_licencia,
    estado: m.estado ?? 'ACTIVO',
  }));
}

export async function createMedico(m: Medico): Promise<Medico> {
  const payload: any = {
    nombre: m.nombre,
    especialidad: m.especialidad,
    numLicencia: (m as any).num_licencia ?? (m as any).numLicencia,
  };
  const created: any = await fetchJson('/medicos', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });
  return {
    id: String(created.id),
    nombre: created.nombre,
    especialidad: created.especialidad,
    num_licencia: created.numLicencia ?? created.num_licencia,
    estado: created.estado ?? 'ACTIVO',
  } as Medico;
}

export async function inactivateMedico(id: string): Promise<void> {
  await fetchJson(`/medicos/${id}/inactivar`, { method: 'PUT' });
}
