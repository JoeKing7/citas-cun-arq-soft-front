export type Medico = {
  id: string;
  nombre: string;
  especialidad: string;
  num_licencia: string;
  estado?: string;
};

export type Paciente = {
  id: string;
  nombre: string;
  documento: string;
  correo: string;
  telefono?: string;
  estado?: string;
};

export type Cita = {
  id: string;
  id_medico: string;
  id_paciente: string;
  fecha_hora: string; // ISO
  duracion_min: number;
  estado?: string;
  motivo?: string;
};

const KEY_MEDICOS = 'app_medicos_v1';
const KEY_PACIENTES = 'app_pacientes_v1';
const KEY_CITAS = 'app_citas_v1';

function read<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, items: T[]) {
  localStorage.setItem(key, JSON.stringify(items));
}

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
