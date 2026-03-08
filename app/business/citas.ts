import type { Cita } from '~/domain/types';

export function validateCita(c: Cita) {
  if (!c.id_medico || !c.id_paciente || !c.fecha_hora) {
    throw new Error('Campos requeridos faltantes para cita');
  }
  const dt = new Date(c.fecha_hora);
  if (isNaN(dt.getTime())) throw new Error('Fecha inválida');
  if (dt < new Date()) throw new Error('No se puede agendar en el pasado');
  if (!c.duracion_min || c.duracion_min < 15 || c.duracion_min > 120)
    throw new Error('Duración debe estar entre 15 y 120 minutos');
  // Conflict check must be done against backend data (application service)
  return true;
}

export function validateCitaUpdate(updates: Partial<Cita>) {
  if (updates.fecha_hora) {
    const dt = new Date(updates.fecha_hora as string);
    if (isNaN(dt.getTime())) throw new Error('Fecha inválida');
    if (dt < new Date()) throw new Error('No se puede agendar en el pasado');
  }
  if (
    updates.duracion_min &&
    (updates.duracion_min < 15 || updates.duracion_min > 120)
  )
    throw new Error('Duración debe estar entre 15 y 120 minutos');
  return true;
}
