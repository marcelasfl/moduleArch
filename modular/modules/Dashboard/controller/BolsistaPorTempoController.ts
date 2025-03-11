import BolsistaPorTempo from '../model/BolsistaPorTempo';
import BolsistaPorTempoRepository from '../model/repositories/BolsistaPorTempoRepository';
import type IController from './generic/IController';


export default class BolsistaPorTempoController implements IController {
  items: any;
  deleteItem(Id: any) {
    throw new Error('Method not implemented.');
  }
  bolsistaPorTempoRepository: BolsistaPorTempoRepository;

  constructor() {
    this.bolsistaPorTempoRepository = new BolsistaPorTempoRepository();
  }

  async getAll(filter?: string): Promise<any> {
    return await this.bolsistaPorTempoRepository.fetchAllBolsistaTempo(filter);
  }

  async getById(id: string | number): Promise<any> {
    if (!id) throw new Error("ID is required");
    return await this.bolsistaPorTempoRepository.fetchBolsistaTempoById(id);
  }

  async create(data: any): Promise<any> {
    if (!data) throw new Error("Data is required to create a new Pessoa");

    const bolsista = new BolsistaPorTempo(data.id, data.projetoId, data.mesReferencia, data.qtdAtivos, data.qtdSairam, data.qtdEntraram);
    
    if (import.meta.env.VITE_DEV_MOCK == 'true') {
      return bolsista.id = '10';
    }
    return await this.bolsistaPorTempoRepository.createBolsistaTempo(data);
  }

  async update(id: string, data: any): Promise<any> {
    if (!id || !data) throw new Error("ID and data are required for update");

    const pessoa = new BolsistaPorTempo(data.id, data.projetoId, data.mesReferencia, data.qtdAtivos, data.qtdSairam, data.qtdEntraram);

    if (import.meta.env.VITE_DEV_MOCK == "true") {
      return id;
    }

    return await this.bolsistaPorTempoRepository.updateBolsistaTempo(id, data);
  }

  async delete(id: string | number): Promise<any> {
    if (!id) throw new Error("ID is required to delete a Pessoa");
    return await this.bolsistaPorTempoRepository.deleteBolsistaTempo(id);
  }

  async filter(route: string) {
    if (!route) throw new Error("Route is required for filter");
    return await this.bolsistaPorTempoRepository.filter(route);
  }
}


