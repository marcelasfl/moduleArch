import type { IBolsistaProjeto } from '../BolsistaPorProjeto';
import BolsistaProjeto from '../BolsistaPorProjeto';

export default interface IBolsistaProjetoRepository {
  fetchAllBolsistaProjeto(filter?: string): Promise<{ bolsistas: BolsistaProjeto[]; odata: any }>;

  fetchBolsistaProjetoById(id: string | number): Promise<BolsistaProjeto>;

  createBolsistaProjeto(data: IBolsistaProjeto): Promise<IBolsistaProjeto>;

  updateBolsistaProjeto(id: string | number, data: Partial<IBolsistaProjeto>): Promise<IBolsistaProjeto>;

  deleteBolsistaProjeto(id: string | number): Promise<boolean>;
}
