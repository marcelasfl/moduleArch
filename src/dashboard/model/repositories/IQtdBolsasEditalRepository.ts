import type { IQtdBolsasEdital } from "../QtdBolsasEdital";
import QtdBolsasEdital from "../QtdBolsasEdital";

export default interface IQtdBolsasRepository {
  
  fetchAllQtdBolsas(filter?: string): Promise<QtdBolsasEdital[]>;
  
  fetchQtdBolsasById(id: string | number): Promise<QtdBolsasEdital>;

  createQtdBolsas(data: IQtdBolsasEdital): Promise<IQtdBolsasEdital>;

  updateQtdBolsas(id: string | number, data: Partial<IQtdBolsasEdital>): Promise<IQtdBolsasEdital>;

  deleteQtdBolsas(id: string | number): Promise<boolean>;
}
