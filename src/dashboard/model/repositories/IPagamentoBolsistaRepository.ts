import type { IPagamentoBolsista } from "../PagamentoBolsista";
import PagamentoBolsista from "../PagamentoBolsista";

export default interface IPagamentoBolsistaRepository {
  
  fetchAllPagamentoBolsista(filter?: string): Promise<PagamentoBolsista[]>;
  
  fetchPagamentoBolsistaById(id: string | number): Promise<PagamentoBolsista>;

  createPagamentoBolsista(data: IPagamentoBolsista): Promise<IPagamentoBolsista>;

  updatePagamentoBolsista(id: string | number, data: Partial<IPagamentoBolsista>): Promise<IPagamentoBolsista>;

  deletePagamentoBolsista(id: string | number): Promise<boolean>;
}
