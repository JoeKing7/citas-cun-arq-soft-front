import type { Paciente } from '../repository';
import { isValidEmail, isValidName } from './validators';

export function validatePaciente(p: Paciente) {
  if (!p.nombre || !p.documento || !p.correo) {
    throw new Error('Campos requeridos faltantes para paciente');
  }
  if (!isValidName(p.nombre)) throw new Error('Nombre inválido');
  if (!isValidEmail(p.correo)) throw new Error('Correo inválido');
  // Documento uniqueness should be validated on the server
  return true;
}

export function sanitizePaciente(p: Paciente): Paciente {
  return {
    ...p,
    nombre: p.nombre.trim(),
    documento: String(p.documento).trim(),
    correo: p.correo.trim(),
    telefono: p.telefono ? String(p.telefono).trim() : undefined,
  };
}
