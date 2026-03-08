import type { Medico } from '~/negocio/entidades/Medico';
import type { MedicoDTO } from '../dtos/MedicoDTO';

// Contrato que deben cumplir todas las implementaciones del repositorio de médicos
export interface IMedicoRepository {
  getAll(): Promise<Medico[]>;
  getById(id: string): Promise<Medico | null>;
  create(dto: MedicoDTO): Promise<Medico>;
  inactivate(id: string): Promise<void>;
}
