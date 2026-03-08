import type { Medico, Paciente, Cita } from '../../repository/storage';
import * as business from '../../business';

// ─── Dashboard types ───────────────────────────────────────────────────────────

export interface DashboardStats {
  citasHoy: number;
  medicosActivos: number;
  totalPacientes: number;
  citasSemana: number;
  tendencias: {
    citasHoy: string; // e.g. "+3% ayer"
    medicos: string; // e.g. "+1 este mes"
    pacientes: string; // e.g. "+18 semana"
  };
}

export interface WeeklyOverviewItem {
  name: string; // "Lun" | "Mar" | "Mié" | ...
  activas: number;
  canceladas: number;
}

export interface YearlyBreakup {
  activas: number;
  canceladas: number;
  year: number;
}

export interface MonthlyEarnings {
  total: number; // citas en el mes
  sparkline: number[]; // 12 puntos (un valor por mes anterior o días del mes)
  porcentaje?: string; // e.g. "+12% mes anterior"
}

export interface ActividadItem {
  id: string;
  tipo:
    | 'cita_creada'
    | 'cita_cancelada'
    | 'medico_agregado'
    | 'paciente_registrado'
    | 'cita_reprogramada';
  descripcion: string;
  tiempo: string; // "Hace 10 min", "Ayer a las 3pm"
  usuario?: string;
}

export interface ProximaCita {
  id: string;
  hora: string; // "09:00"
  pacienteNombre: string;
  medicoNombre: string;
  especialidad: string;
  duracion_min: number;
  estado: 'ACTIVA' | 'CANCELADA' | 'REPROGRAMADA';
}

const BASE = import.meta.env.VITE_API_URL || '';

async function fetchJson(path: string, opts?: RequestInit) {
  if (!BASE) throw new Error('No backend configured');
  const res = await fetch(`${BASE}${path}`, opts);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export async function getMedicosAsync(): Promise<Medico[]> {
  if (!BASE) return Promise.resolve(business.getMedicos());
  const raw: any[] = await fetchJson('/medicos');
  // Map backend camelCase fields to local storage shape
  return raw.map((m) => ({
    id: String(m.id),
    nombre: m.nombre,
    especialidad: m.especialidad,
    num_licencia: m.numLicencia ?? m.num_licencia,
    estado: m.estado ?? 'ACTIVO',
  }));
}

export async function createMedicoAsync(m: Medico): Promise<Medico> {
  if (!BASE) {
    const created = business.createMedico(m);
    return Promise.resolve(created);
  }
  // Backend expects camelCase payload: { nombre, especialidad, numLicencia }
  const payload: any = {
    nombre: m.nombre,
    especialidad: m.especialidad,
    numLicencia: (m as any).num_licencia ?? (m as any).numLicencia,
  };
  const created = await fetchJson('/medicos', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });
  // Normalize response to local Medico shape
  return {
    id: String(created.id),
    nombre: created.nombre,
    especialidad: created.especialidad,
    num_licencia: created.numLicencia ?? created.num_licencia,
    estado: created.estado ?? 'ACTIVO',
  } as Medico;
}

export async function deleteMedicoAsync(id: string): Promise<void> {
  if (!BASE) {
    business.deleteMedico(id);
    return Promise.resolve();
  }
  const res = await fetch(`${BASE}/medicos/${id}/inactivar`, {
    method: 'PUT',
  });
  let body: any = null;
  try {
    body = await res.json();
  } catch (_) {
    body = null;
  }
  if (!res.ok) {
    // Propagate backend error body (e.g. { message: '...', error: 'Bad Request' })
    throw body || new Error(`API error ${res.status}`);
  }
}

export async function getPacientesAsync(): Promise<Paciente[]> {
  if (!BASE) return Promise.resolve(business.getPacientes());
  return fetchJson('/pacientes');
}

export async function createPacienteAsync(p: Paciente): Promise<Paciente> {
  if (!BASE) {
    const created = business.createPaciente(p);
    return Promise.resolve(created);
  }
  // Backend expects payload without internal `id` and with camelCase field names as documented
  const payload: any = {
    nombre: p.nombre,
    documento: p.documento,
    correo: p.correo,
  };
  if (p.telefono) payload.telefono = p.telefono;
  return fetchJson('/pacientes', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function deletePacienteAsync(id: string): Promise<void> {
  if (!BASE) {
    business.deletePaciente(id);
    return Promise.resolve();
  }
  const res = await fetch(`${BASE}/pacientes/${id}/inactivar`, {
    method: 'PUT',
  });
  let body: any = null;
  try {
    body = await res.json();
  } catch (_) {
    body = null;
  }
  if (!res.ok) {
    // throw parsed backend error (e.g. { message: '...', error: 'Bad Request' })
    throw body || new Error(`API error ${res.status}`);
  }
}

export async function getCitasAsync(): Promise<Cita[]> {
  if (!BASE) return Promise.resolve(business.getCitas());
  return fetchJson('/citas');
}

export async function createCitaAsync(c: Cita): Promise<Cita> {
  if (!BASE) {
    const created = business.createCita(c);
    return Promise.resolve(created);
  }
  // Backend expects camelCase payload without internal fields like `id` or `estado`.
  const payload: any = {
    idMedico: Number((c as any).id_medico ?? (c as any).idMedico),
    idPaciente: Number((c as any).id_paciente ?? (c as any).idPaciente),
    fechaHora: (c as any).fecha_hora ?? (c as any).fechaHora,
  };
  if ((c as any).duracion_min ?? (c as any).duracionMin)
    payload.duracionMin = (c as any).duracion_min ?? (c as any).duracionMin;
  if ((c as any).motivo) payload.motivo = c.motivo;
  return fetchJson('/citas', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function cancelCitaAsync(id: string): Promise<void> {
  if (!BASE) {
    business.cancelCita(id);
    return Promise.resolve();
  }
  await fetchJson(`/citas/${id}/cancelar`, { method: 'PUT' });
}

export async function updateCitaAsync(
  id: string,
  updates: Partial<Cita>,
): Promise<void> {
  if (!BASE) {
    business.updateCita(id, updates);
    return Promise.resolve();
  }
  // Convert partial updates to backend camelCase shape
  const payload: any = {};
  if ((updates as any).fecha_hora || (updates as any).fechaHora)
    payload.fechaHora =
      (updates as any).fecha_hora ?? (updates as any).fechaHora;
  if ((updates as any).duracion_min || (updates as any).duracionMin)
    payload.duracionMin =
      (updates as any).duracion_min ?? (updates as any).duracionMin;
  if ((updates as any).motivo) payload.motivo = updates.motivo;
  await fetchJson(`/citas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function deleteCitaAsync(id: string): Promise<void> {
  if (!BASE) {
    business.cancelCita(id);
    return Promise.resolve();
  }
  await fetchJson(`/citas/${id}`, { method: 'DELETE' });
}

export async function getCitasByPacienteAsync(
  idPaciente: string,
): Promise<Cita[]> {
  if (!BASE)
    return Promise.resolve(
      business.getCitas().filter((c) => c.id_paciente === idPaciente),
    );
  return fetchJson(`/citas/paciente/${idPaciente}`);
}

export async function getCitasByMedicoAsync(idMedico: string): Promise<Cita[]> {
  if (!BASE)
    return Promise.resolve(
      business.getCitas().filter((c) => c.id_medico === idMedico),
    );
  return fetchJson(`/citas/medico/${idMedico}`);
}

export async function hasConflictAsync(
  id_medico: string,
  fecha_hora: string,
  duracion_min: number,
  excludeId?: string,
): Promise<boolean> {
  if (!BASE)
    return Promise.resolve(
      business.hasConflict(id_medico, fecha_hora, duracion_min, excludeId),
    );
  // Backend does not expose /citas/check-conflict. Fetch citas del médico y compute locally.
  try {
    const citas: any[] = await fetchJson(`/citas/medico/${id_medico}`);
    const toMs = (v?: string) => (v ? new Date(v).getTime() : NaN);
    const newStart = toMs(fecha_hora);
    const newEnd = newStart + duracion_min * 60 * 1000;
    for (const c of citas) {
      const cid = String(c.id);
      if (excludeId && cid === String(excludeId)) continue;
      if (c.estado === 'CANCELADA') continue;
      const existingStart = toMs(c.fechaHora ?? c.fecha_hora);
      const existingDur = c.duracionMin ?? c.duracion_min ?? 30;
      const existingEnd = existingStart + existingDur * 60 * 1000;
      if (isNaN(existingStart) || isNaN(newStart)) continue;
      if (newStart < existingEnd && existingStart < newEnd) return true;
    }
    return false;
  } catch (err) {
    // If backend fails, fall back to optimistic (no conflict)
    console.warn('Conflict check failed; assuming no conflict', err);
    return false;
  }
}

// ─── Dashboard endpoints ───────────────────────────────────────────────────────

function computeLocalStats(): DashboardStats {
  const hoy = new Date().toISOString().slice(0, 10);
  const citas = business.getCitas();
  const citasHoy = citas.filter(
    (c) => c.fecha_hora.startsWith(hoy) && c.estado !== 'CANCELADA',
  ).length;
  const semanaMs = 7 * 24 * 60 * 60 * 1000;
  const citasSemana = citas.filter((c) => {
    const d = new Date(c.fecha_hora).getTime();
    return (
      d >= Date.now() && d <= Date.now() + semanaMs && c.estado !== 'CANCELADA'
    );
  }).length;
  return {
    citasHoy,
    medicosActivos: business.getMedicos().length,
    totalPacientes: business.getPacientes().length,
    citasSemana,
    tendencias: { citasHoy: '+0% ayer', medicos: '—', pacientes: '—' },
  };
}

export async function getDashboardStatsAsync(): Promise<DashboardStats> {
  if (!BASE) return Promise.resolve(computeLocalStats());
  return fetchJson('/dashboard/stats');
}

function computeLocalOverview(): WeeklyOverviewItem[] {
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const map: Record<string, { activas: number; canceladas: number }> = {};
  for (const d of days) map[d] = { activas: 0, canceladas: 0 };
  business.getCitas().forEach((c) => {
    const day = days[new Date(c.fecha_hora).getDay()];
    if (c.estado === 'CANCELADA') map[day].canceladas++;
    else map[day].activas++;
  });
  const today = new Date().getDay();
  return Array.from({ length: 7 }, (_, i) => {
    const d = days[(today - 6 + i + 7) % 7];
    return { name: d, ...map[d] };
  });
}

export async function getWeeklyOverviewAsync(): Promise<WeeklyOverviewItem[]> {
  if (!BASE) return Promise.resolve(computeLocalOverview());
  return fetchJson('/dashboard/overview');
}

function computeLocalYearly(): YearlyBreakup {
  const citas = business.getCitas();
  const activas = citas.filter((c) => c.estado !== 'CANCELADA').length;
  return {
    activas,
    canceladas: citas.length - activas,
    year: new Date().getFullYear(),
  };
}

export async function getYearlyBreakupAsync(): Promise<YearlyBreakup> {
  if (!BASE) return Promise.resolve(computeLocalYearly());
  return fetchJson('/dashboard/yearly-breakup');
}

export async function getMonthlyEarningsAsync(): Promise<MonthlyEarnings> {
  if (!BASE) {
    const total = business.getCitas().length;
    return Promise.resolve({
      total,
      sparkline: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, total],
    });
  }
  return fetchJson('/dashboard/monthly');
}

export async function getActividadRecienteAsync(): Promise<ActividadItem[]> {
  if (!BASE) return Promise.resolve([]);
  return fetchJson('/dashboard/actividad-reciente');
}

export async function getProximasCitasAsync(): Promise<ProximaCita[]> {
  if (!BASE) {
    const hoy = new Date().toISOString().slice(0, 10);
    const citas = business
      .getCitas()
      .filter((c) => c.fecha_hora.startsWith(hoy));
    const medicos = business.getMedicos();
    const pacientes = business.getPacientes();
    return Promise.resolve(
      citas.map((c) => {
        const m = medicos.find((x) => x.id === c.id_medico);
        const p = pacientes.find((x) => x.id === c.id_paciente);
        return {
          id: c.id,
          hora: new Date(c.fecha_hora).toLocaleTimeString('es-CO', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          pacienteNombre: p?.nombre ?? 'Desconocido',
          medicoNombre: m?.nombre ?? 'Desconocido',
          especialidad: m?.especialidad ?? '—',
          duracion_min: c.duracion_min,
          estado: (c.estado as ProximaCita['estado']) ?? 'ACTIVA',
        };
      }),
    );
  }
  return fetchJson('/dashboard/proximas-citas');
}
