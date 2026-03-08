// Objeto de transferencia de datos para creación/actualización de citas
export interface CitaDTO {
  idMedico: number;
  idPaciente: number;
  fechaHora: string;
  duracionMin?: number;
  motivo?: string;
}
