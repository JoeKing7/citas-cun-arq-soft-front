import type { Medico } from '~/domain/types';
import { read, write, KEY_MEDICOS } from './common';

export function getMedicos(): Medico[] {
  return read<Medico>(KEY_MEDICOS);
}

export function saveMedico(m: Medico) {
  const items = getMedicos();
  items.push(m);
  write(KEY_MEDICOS, items);
}

export function findMedicoByLicense(license: string) {
  return getMedicos().find((m) => m.num_licencia === license);
}
