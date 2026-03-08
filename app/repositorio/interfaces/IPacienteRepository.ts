import type { Paciente } from '~/negocio/entidades/Paciente';
import type { PacienteDTO } from '../dtos/PacienteDTO';

// Contrato que deben cumplir todas las implementaciones del repositorio de pacientes
export interface IPacienteRepository {
  getAll(): Promise<Paciente[]>;
  getById(id: string): Promise<Paciente | null>;
  findByDocumento(documento: string): Promise<Paciente | null>;
  create(dto: PacienteDTO): Promise<Paciente>;
  inactivate(id: string): Promise<void>;
}
