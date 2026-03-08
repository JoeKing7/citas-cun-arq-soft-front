import type { Medico } from '~/negocio/entidades/Medico';

function isValidName(name: string) {
  return /^[A-Za-zÀ-ÿ\s]{3,150}$/.test(name);
}

export const validadorMedico = {
  validar(m: Medico): void {
    if (!m.nombre || !m.especialidad || !m.num_licencia) {
      throw new Error('Campos requeridos faltantes para médico');
    }
    if (!isValidName(m.nombre)) throw new Error('Nombre inválido');
    if (!(m.num_licencia && m.num_licencia.trim().length >= 3)) {
      throw new Error('Número de licencia inválido');
    }
  },

  sanitizar(m: Medico): Medico {
    return {
      ...m,
      nombre: m.nombre.trim(),
      especialidad: m.especialidad.trim(),
      num_licencia: String(m.num_licencia).trim(),
    };
  },
};
