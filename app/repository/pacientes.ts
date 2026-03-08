import type { Paciente } from '~/domain/types';
import { read, write, KEY_PACIENTES } from './common';

export function getPacientes(): Paciente[] {
  return read<Paciente>(KEY_PACIENTES);
}

export function savePaciente(p: Paciente) {
  const items = getPacientes();
  items.push(p);
  write(KEY_PACIENTES, items);
}

export function findPacienteByDocumento(doc: string) {
  return getPacientes().find((p) => p.documento === doc);
}
