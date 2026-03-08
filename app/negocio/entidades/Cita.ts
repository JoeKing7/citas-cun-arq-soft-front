// Entidad del dominio: Cita
export type Cita = {
  id: string;
  id_medico: string;
  id_paciente: string;
  fecha_hora: string; // ISO 8601
  duracion_min: number;
  estado?: string;
  motivo?: string;
};
