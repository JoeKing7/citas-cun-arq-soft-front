import * as repo from '~/repositorio/implementaciones/CitaRepository';

export async function cancelCitaAsync(id: string): Promise<void> {
  return repo.cancelCita(id);
}
