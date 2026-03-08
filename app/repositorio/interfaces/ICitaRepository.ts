import type { Cita } from '~/negocio/entidades/Cita';
import type { CitaDTO } from '../dtos/CitaDTO';

// Contrato que deben cumplir todas las implementaciones del repositorio de citas
export interface ICitaRepository {
  getAll(): Promise<Cita[]>;
  getById(id: string): Promise<Cita | null>;
  getByPaciente(idPaciente: string): Promise<Cita[]>;
  getByMedico(idMedico: string): Promise<Cita[]>;
  create(dto: CitaDTO): Promise<Cita>;
  cancel(id: string): Promise<void>;
  update(id: string, updates: Partial<CitaDTO>): Promise<void>;
  delete(id: string): Promise<void>;
}
