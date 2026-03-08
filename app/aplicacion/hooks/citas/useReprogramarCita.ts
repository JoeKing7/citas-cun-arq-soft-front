import type { Cita } from '~/negocio/entidades/Cita';
import * as repo from '~/repositorio/implementaciones/CitaRepository';
import { validadorCita } from '~/negocio/validadores/validadorCita';

export async function updateCitaAsync(
  id: string,
  updates: Partial<Cita>,
): Promise<void> {
  validadorCita.validarActualizacion(updates);
  return repo.updateCita(id, updates);
}
