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

// Dashboard / UI types
export interface DashboardStats {
  citasHoy: number;
  medicosActivos: number;
  totalPacientes: number;
  citasSemana: number;
  tendencias: {
    citasHoy: string;
    medicos: string;
    pacientes: string;
  };
}

export interface WeeklyOverviewItem {
  name: string;
  activas: number;
  canceladas: number;
}

export interface YearlyBreakup {
  activas: number;
  canceladas: number;
  year: number;
}

export interface MonthlyEarnings {
  total: number;
  sparkline: number[];
  porcentaje?: string;
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
  tiempo: string;
  usuario?: string;
}

export interface ProximaCita {
  id: string;
  hora: string;
  pacienteNombre: string;
  medicoNombre: string;
  especialidad: string;
  duracion_min: number;
  estado: 'ACTIVA' | 'CANCELADA' | 'REPROGRAMADA';
}
