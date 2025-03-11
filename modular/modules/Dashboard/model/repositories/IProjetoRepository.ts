import type { IProjeto } from '../Projeto';
import Projeto from '../Projeto';

export default interface IProjetoRepository {
  // Busca todos os planos mensais, com filtro opcional
  fetchAllProjeto(filter?: string): Promise<Projeto[]>;

  // Busca um plano mensal específico pelo ID
  fetchProjetoById(id: string | number): Promise<Projeto>;

  // Cria um novo plano mensal
  createProjeto(data: IProjeto): Promise<IProjeto>;

  // Atualiza um plano mensal específico pelo ID
  updateProjeto(id: string | number, data: Partial<IProjeto>): Promise<IProjeto>;

  // Deleta um plano mensal específico pelo ID
  deleteProjeto(id: string | number): Promise<boolean>;
}
