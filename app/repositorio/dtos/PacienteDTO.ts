// Objeto de transferencia de datos para creación/actualización de pacientes
export interface PacienteDTO {
  nombre: string;
  documento: string;
  correo: string;
  telefono?: string;
}
