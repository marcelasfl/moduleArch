import type { ISaldoCotasProjeto } from "../SaldoCotasProjeto";
import SaldoCotasProjeto from "../SaldoCotasProjeto";

export default interface ISaldoCotasProjetoRepository {
  
  fetchAllSaldoCotasProjeto(filter?: string): Promise<SaldoCotasProjeto[]>;
  
  fetchSaldoCotasProjetoById(id: string | number): Promise<SaldoCotasProjeto>;

  createSaldoCotasProjeto(data: ISaldoCotasProjeto): Promise<ISaldoCotasProjeto>;

  updateSaldoCotasProjeto(id: string | number, data: Partial<ISaldoCotasProjeto>): Promise<ISaldoCotasProjeto>;

  deleteSaldoCotasProjeto(id: string | number): Promise<boolean>;
}
