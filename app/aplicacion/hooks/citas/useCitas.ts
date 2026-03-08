import type { Cita } from '~/negocio/entidades/Cita';
import * as repo from '~/repositorio/implementaciones/CitaRepository';

export async function getCitasAsync(): Promise<Cita[]> {
  return repo.getCitas();
}

export async function getCitasByPacienteAsync(
  idPaciente: string,
): Promise<Cita[]> {
  return repo.getCitasByPaciente(idPaciente);
}

export async function getCitasByMedicoAsync(idMedico: string): Promise<Cita[]> {
  return repo.getCitasByMedico(idMedico);
}
