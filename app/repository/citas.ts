import type { Cita } from '~/domain/types';
import { read, write, KEY_CITAS } from './common';

export function getCitas(): Cita[] {
  return read<Cita>(KEY_CITAS);
}

export function saveCita(c: Cita) {
  const items = getCitas();
  items.push(c);
  write(KEY_CITAS, items);
}

export function medicoHasConflict(id_medico: string, fecha_hora: string) {
  const citas = getCitas();
  return citas.some(
    (c) =>
      c.id_medico === id_medico &&
      c.fecha_hora === fecha_hora &&
      c.estado !== 'CANCELADA',
  );
}

function toDate(s: string) {
  return new Date(s);
}

export function hasConflict(
  id_medico: string,
  fecha_hora: string,
  duracion_min: number,
  excludeId?: string,
) {
  const newStart = toDate(fecha_hora).getTime();
  const newEnd = newStart + duracion_min * 60 * 1000;
  const citas = getCitas();
  return citas.some((c) => {
    if (c.id_medico !== id_medico) return false;
    if (c.estado === 'CANCELADA') return false;
    if (excludeId && c.id === excludeId) return false;
    const existingStart = toDate(c.fecha_hora).getTime();
    const existingEnd = existingStart + (c.duracion_min || 30) * 60 * 1000;
    return newStart < existingEnd && existingStart < newEnd;
  });
}

export function getCitasByMedico(id_medico: string) {
  return getCitas().filter(
    (c) => c.id_medico === id_medico && c.estado !== 'CANCELADA',
  );
}

export function updateCita(id: string, updates: Partial<Cita>) {
  const items = getCitas();
  const idx = items.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  items[idx] = { ...items[idx], ...updates };
  write(KEY_CITAS, items);
  return true;
}

export function cancelCita(id: string) {
  return updateCita(id, { estado: 'CANCELADA' });
}
