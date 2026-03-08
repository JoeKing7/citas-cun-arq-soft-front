// Estado global de médicos implementar con Zustand, Redux u otro manejador de estado según preferencia.
import type { Medico } from '~/negocio/entidades/Medico';

let _medicos: Medico[] = [];

export function getMedicosStore(): Medico[] {
  return _medicos;
}

export function setMedicosStore(list: Medico[]): void {
  _medicos = list;
}
