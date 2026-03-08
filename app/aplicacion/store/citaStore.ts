// Estado global de citas implementar con Zustand, Redux u otro manejador de estado según preferencia.
import type { Cita } from '~/negocio/entidades/Cita';

let _citas: Cita[] = [];

export function getCitasStore(): Cita[] {
  return _citas;
}

export function setCitasStore(list: Cita[]): void {
  _citas = list;
}
