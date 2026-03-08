import type { Paciente } from '~/negocio/entidades/Paciente';
import { fetchJson } from '../http/axiosClient';

export async function getPacientes(): Promise<Paciente[]> {
  const raw: any[] = await fetchJson('/pacientes');
  return raw.map((p) => ({
    id: String(p.id),
    nombre: p.nombre,
    documento: p.documento,
    correo: p.correo,
    telefono: p.telefono ?? null,
    estado: p.estado ?? 'ACTIVO',
  }));
}

export async function createPaciente(p: Paciente): Promise<Paciente> {
  const payload: any = {
    nombre: p.nombre,
    documento: p.documento,
    correo: p.correo,
  };
  if (p.telefono) payload.telefono = p.telefono;
  const created: any = await fetchJson('/pacientes', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });
  return {
    id: String(created.id),
    nombre: created.nombre,
    documento: created.documento,
    correo: created.correo,
    telefono: created.telefono ?? null,
    estado: created.estado ?? 'ACTIVO',
  } as Paciente;
}

export async function inactivatePaciente(id: string): Promise<void> {
  await fetchJson(`/pacientes/${id}/inactivar`, { method: 'PUT' });
}

export async function findPacienteByDocumento(
  documento: string,
): Promise<Paciente | null> {
  try {
    const found: any = await fetchJson(`/pacientes/${documento}`);
    return {
      id: String(found.id),
      nombre: found.nombre,
      documento: found.documento,
      correo: found.correo,
      telefono: found.telefono ?? null,
      estado: found.estado ?? 'ACTIVO',
    } as Paciente;
  } catch (_) {
    return null;
  }
}
