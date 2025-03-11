import type { IBolsistaTempo } from '../BolsistaPorTempo';
import BolsistaTempo from '../BolsistaPorTempo';

export default interface IBolsistaTempoRepository {
  fetchAllBolsistaTempo(filter?: string): Promise<BolsistaTempo[]>;

  fetchBolsistaTempoById(id: string | number): Promise<BolsistaTempo>;

  createBolsistaTempo(data: IBolsistaTempo): Promise<IBolsistaTempo>;

  updateBolsistaTempo(id: string | number, data: Partial<IBolsistaTempo>): Promise<IBolsistaTempo>;

  deleteBolsistaTempo(id: string | number): Promise<boolean>;
}
