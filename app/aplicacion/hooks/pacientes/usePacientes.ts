import type { Paciente } from '~/negocio/entidades/Paciente';
import * as repo from '~/repositorio/implementaciones/PacienteRepository';

export async function getPacientesAsync(): Promise<Paciente[]> {
  return repo.getPacientes();
}

export async function createPacienteAsync(p: Paciente): Promise<Paciente> {
  return repo.createPaciente(p);
}

export async function deletePacienteAsync(id: string): Promise<void> {
  return repo.inactivatePaciente(id);
}
