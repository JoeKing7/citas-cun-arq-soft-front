import type { Paciente } from '~/negocio/entidades/Paciente';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidName(name: string) {
  return /^[A-Za-zÀ-ÿ\s]{3,150}$/.test(name);
}

export const validadorPaciente = {
  validar(p: Paciente): void {
    if (!p.nombre || !p.documento || !p.correo) {
      throw new Error('Campos requeridos faltantes para paciente');
    }
    if (!isValidName(p.nombre)) throw new Error('Nombre inválido');
    if (!isValidEmail(p.correo)) throw new Error('Correo inválido');
  },

  sanitizar(p: Paciente): Paciente {
    return {
      ...p,
      nombre: p.nombre.trim(),
      documento: String(p.documento).trim(),
      correo: p.correo.trim(),
      telefono: p.telefono ? String(p.telefono).trim() : undefined,
    };
  },
};
