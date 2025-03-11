import type { IQtdBolsasProjeto } from "../QtdBolsasProjeto";
import QtdBolsasProjeto from "../QtdBolsasProjeto";

export default interface IQtdBolsasRepository {
  
  fetchAllQtdBolsas(filter?: string): Promise<QtdBolsasProjeto[]>;
  
  fetchQtdBolsasById(id: string | number): Promise<QtdBolsasProjeto>;

  createQtdBolsas(data: IQtdBolsasProjeto): Promise<IQtdBolsasProjeto>;

  updateQtdBolsas(id: string | number, data: Partial<IQtdBolsasProjeto>): Promise<IQtdBolsasProjeto>;

  deleteQtdBolsas(id: string | number): Promise<boolean>;
}
