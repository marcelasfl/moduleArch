import type { IPessoa } from '../Pessoa';
import Pessoa from '../Pessoa';

export default interface IPessoaRepository {
  // Busca todos os planos mensais, com filtro opcional
  fetchAllPessoa(filter?: string): Promise<Pessoa[]>;

  // Busca um plano mensal específico pelo ID
  fetchPessoaById(id: string | number): Promise<Pessoa>;

  // Cria um novo plano mensal
  createPessoa(data: IPessoa): Promise<IPessoa>;

  // Atualiza um plano mensal específico pelo ID
  updatePessoa(id: string | number, data: Partial<IPessoa>): Promise<IPessoa>;

  // Deleta um plano mensal específico pelo ID
  deletePessoa(id: string | number): Promise<boolean>;
}
