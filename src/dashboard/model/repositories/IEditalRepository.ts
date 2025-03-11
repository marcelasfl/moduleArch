import type { IEdital } from '../Edital';
import Edital from '../Edital';

export default interface IEditalRepository {
  fetchAllEdital(filter?: string): Promise<Edital[]>;

  fetchEditalById(id: string | number): Promise<Edital>;

  createEdital(data: IEdital): Promise<Edital>;

  updateEdital(id: string | number, data: Partial<Edital>): Promise<IEdital>;

  deleteEdital(id: string | number): Promise<boolean>;
}
