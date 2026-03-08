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
  return fetchJson('/medicos');
}

export async function createMedicoAsync(m: Medico): Promise<Medico> {
  if (!BASE) {
    const created = business.createMedico(m);
    return Promise.resolve(created);
  }
  return fetchJson('/medicos', {
    method: 'POST',
    body: JSON.stringify(m),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function deleteMedicoAsync(id: string): Promise<void> {
  if (!BASE) {
    business.deleteMedico(id);
    return Promise.resolve();
  }
  await fetchJson(`/medicos/${id}`, { method: 'DELETE' });
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
  return fetchJson('/pacientes', {
    method: 'POST',
    body: JSON.stringify(p),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function deletePacienteAsync(id: string): Promise<void> {
  if (!BASE) {
    business.deletePaciente(id);
    return Promise.resolve();
  }
  await fetchJson(`/pacientes/${id}`, { method: 'DELETE' });
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
  return fetchJson('/citas', {
    method: 'POST',
    body: JSON.stringify(c),
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
  await fetchJson(`/citas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
    headers: { 'Content-Type': 'application/json' },
  });
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
  const res = await fetch(`${BASE}/citas/check-conflict`, {
    method: 'POST',
    body: JSON.stringify({ id_medico, fecha_hora, duracion_min, excludeId }),
    headers: { 'Content-Type': 'application/json' },
  });
  return res.ok && (await res.json()).conflict === true;
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
