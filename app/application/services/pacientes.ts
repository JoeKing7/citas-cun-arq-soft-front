import type { Paciente } from '../../domain/types';
import { fetchJson } from '../../config/api';

export async function getPacientesAsync(): Promise<Paciente[]> {
  return fetchJson('/pacientes');
}

export async function createPacienteAsync(p: Paciente): Promise<Paciente> {
  // Backend expects payload without internal `id` and with camelCase field names as documented
  const payload: any = {
    nombre: p.nombre,
    documento: p.documento,
    correo: p.correo,
  };
  if (p.telefono) payload.telefono = p.telefono;
  return fetchJson('/pacientes', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function deletePacienteAsync(id: string): Promise<void> {
  await fetchJson(`/pacientes/${id}/inactivar`, { method: 'PUT' });
}
