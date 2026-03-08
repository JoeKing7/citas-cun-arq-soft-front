import type { Medico } from '~/negocio/entidades/Medico';
import * as repo from '~/repositorio/implementaciones/MedicoRepository';

export async function getMedicosAsync(): Promise<Medico[]> {
  return repo.getMedicos();
}

export async function createMedicoAsync(m: Medico): Promise<Medico> {
  return repo.createMedico(m);
}

export async function deleteMedicoAsync(id: string): Promise<void> {
  return repo.inactivateMedico(id);
}
