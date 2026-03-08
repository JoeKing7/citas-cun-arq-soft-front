import type { Medico } from '../repository';
import { isValidName, isNumericString } from './validators';

export function validateMedico(m: Medico) {
  if (!m.nombre || !m.especialidad || !m.num_licencia) {
    throw new Error('Campos requeridos faltantes para médico');
  }
  if (!isValidName(m.nombre)) throw new Error('Nombre inválido');
  // allow license with letters/digits/hyphens but ensure at least 3 chars
  if (!(m.num_licencia && m.num_licencia.trim().length >= 3))
    throw new Error('Número de licencia inválido');
  return true;
}

export function sanitizeMedico(m: Medico): Medico {
  return {
    ...m,
    nombre: m.nombre.trim(),
    especialidad: m.especialidad.trim(),
    num_licencia: String(m.num_licencia).trim(),
  };
}
