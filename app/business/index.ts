import {
  type Medico,
  type Paciente,
  type Cita,
  getMedicos as repoGetMedicos,
  getPacientes as repoGetPacientes,
  getCitas as repoGetCitas,
  saveMedico as repoSaveMedico,
  savePaciente as repoSavePaciente,
  saveCita as repoSaveCita,
  updateCita as repoUpdateCita,
  cancelCita as repoCancelCita,
  hasConflict as repoHasConflict,
  findMedicoByLicense,
  findPacienteByDocumento,
} from '../repository/storage';

export type { Medico, Paciente, Cita };

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function getMedicos(): Medico[] {
  return repoGetMedicos();
}

export function createMedico(m: Medico) {
  if (!m.nombre || !m.especialidad || !m.num_licencia) {
    throw new Error('Campos requeridos faltantes para médico');
  }
  const existing = findMedicoByLicense(m.num_licencia);
  if (existing) throw new Error('Número de licencia ya registrado');
  repoSaveMedico(m);
  return m;
}

export function deleteMedico(id: string) {
  const items = getMedicos().filter((x) => x.id !== id);
  localStorage.setItem('app_medicos_v1', JSON.stringify(items));
}

export function getPacientes(): Paciente[] {
  return repoGetPacientes();
}

export function createPaciente(p: Paciente) {
  if (!p.nombre || !p.documento || !p.correo) {
    throw new Error('Campos requeridos faltantes para paciente');
  }
  if (!isValidEmail(p.correo)) throw new Error('Correo inválido');
  const existing = findPacienteByDocumento(p.documento);
  if (existing) throw new Error('Documento ya registrado');
  repoSavePaciente(p);
  return p;
}

export function deletePaciente(id: string) {
  const items = getPacientes().filter((x) => x.id !== id);
  localStorage.setItem('app_pacientes_v1', JSON.stringify(items));
}

export function getCitas(): Cita[] {
  return repoGetCitas();
}

export function createCita(c: Cita) {
  if (!c.id_medico || !c.id_paciente || !c.fecha_hora) {
    throw new Error('Campos requeridos faltantes para cita');
  }
  const dt = new Date(c.fecha_hora);
  if (isNaN(dt.getTime())) throw new Error('Fecha inválida');
  if (dt < new Date()) throw new Error('No se puede agendar en el pasado');
  if (!c.duracion_min || c.duracion_min < 15 || c.duracion_min > 120)
    throw new Error('Duración debe estar entre 15 y 120 minutos');
  if (repoHasConflict(c.id_medico, c.fecha_hora, c.duracion_min))
    throw new Error('Conflicto con otra cita');
  repoSaveCita(c);
  return c;
}

export function cancelCita(id: string) {
  return repoCancelCita(id);
}

export function updateCita(id: string, updates: Partial<Cita>) {
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
  return repoUpdateCita(id, updates);
}

export function hasConflict(
  id_medico: string,
  fecha_hora: string,
  duracion_min: number,
  excludeId?: string,
) {
  return repoHasConflict(id_medico, fecha_hora, duracion_min, excludeId);
}
