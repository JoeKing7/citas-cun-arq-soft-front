import type { Cita } from '~/negocio/entidades/Cita';

export const validadorCita = {
  /** Valida una cita antes de persistirla (reglas de negocio del cliente) */
  validarAntesDePersistir(c: Cita): void {
    if (!c.id_medico || !c.id_paciente || !c.fecha_hora) {
      throw new Error('Campos requeridos faltantes para cita');
    }
    const dt = new Date(c.fecha_hora);
    if (isNaN(dt.getTime())) throw new Error('Fecha inválida');
    if (dt < new Date()) throw new Error('No se puede agendar en el pasado');
    if (!c.duracion_min || c.duracion_min < 15 || c.duracion_min > 120) {
      throw new Error('Duración debe estar entre 15 y 120 minutos');
    }
  },

  validarActualizacion(updates: Partial<Cita>): void {
    if (updates.fecha_hora) {
      const dt = new Date(updates.fecha_hora as string);
      if (isNaN(dt.getTime())) throw new Error('Fecha inválida');
      if (dt < new Date()) throw new Error('No se puede agendar en el pasado');
    }
    if (
      updates.duracion_min &&
      (updates.duracion_min < 15 || updates.duracion_min > 120)
    ) {
      throw new Error('Duración debe estar entre 15 y 120 minutos');
    }
  },
};
