import type { IAlocacaoBolsista } from '../AlocacaoBolsista';
import AlocacaoBolsista from '../AlocacaoBolsista';
import type { BaseConfig } from './apiRoutes/BaseConfig';

export default interface IAlocacaoBolsistaRepository {
  // Busca todos os planos mensais, com filtro opcional
  fetchAllAlocacaoBolsista(filter?: string): Promise<{ alocacoes: AlocacaoBolsista[]; odata: any }>;

  // Busca um plano mensal específico pelo ID
  fetchAlocacaoBolsistaById(id: string | number): Promise<AlocacaoBolsista>;

  // Cria um novo plano mensal
  createAlocacaoBolsista(data: IAlocacaoBolsista): Promise<IAlocacaoBolsista>;

  // Atualiza um plano mensal específico pelo ID
  updateAlocacaoBolsista(id: string | number, data: Partial<IAlocacaoBolsista>): Promise<IAlocacaoBolsista>;

  // Deleta um plano mensal específico pelo ID
  deleteAlocacaoBolsista(id: string | number): Promise<boolean>;
  
  // Busca todas as alocações de bolsistas paginadas
  fetchPaginatedAlocacaoBolsista(config: BaseConfig, filter?: string): Promise<AlocacaoBolsista[]>;

  // Busca a quantidade de alocações de bolsistas
  countAlocacaoBolsista(): Promise<number>;
}
