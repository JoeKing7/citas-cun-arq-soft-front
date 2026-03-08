// Estado global de pacientes implementar con Zustand, Redux u otro manejador de estado según preferencia.
import type { Paciente } from '~/negocio/entidades/Paciente';

let _pacientes: Paciente[] = [];

export function getPacientesStore(): Paciente[] {
  return _pacientes;
}

export function setPacientesStore(list: Paciente[]): void {
  _pacientes = list;
}
