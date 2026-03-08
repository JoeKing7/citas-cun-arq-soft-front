// Entidad del dominio: Paciente
export type Paciente = {
  id: string;
  nombre: string;
  documento: string;
  correo: string;
  telefono?: string;
  estado?: string;
};
