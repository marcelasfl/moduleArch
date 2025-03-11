import PagamentoBolsista from '../model/PagamentoBolsista';
import PagamentoBolsistaRepository from '../model/repositories/PagamentoBolsista';
import type IController from './generic/IController';


export default class PagamentoBolsistaController implements IController {
  items: any;
  deleteItem(Id: any) {
    throw new Error('Method not implemented.');
  }
  pagamentoBolsistaRepository: PagamentoBolsistaRepository;

  constructor() {
    this.pagamentoBolsistaRepository = new PagamentoBolsistaRepository();
  }

  async getAll(filter?: string): Promise<any> {
    return await this.pagamentoBolsistaRepository.fetchAllPagamentoBolsista(filter);
  }

  async getById(id: string | number): Promise<any> {
    if (!id) throw new Error("ID is required");
    return await this.pagamentoBolsistaRepository.fetchPagamentoBolsistaById(id);
  }

  async create(data: any): Promise<any> {
    if (!data) throw new Error("Data is required to create a new Projeto");

    const pagamentoBolsista = new PagamentoBolsista(data.Id, data.Ordem, data.DataPagamento, data.ValorPago, data.Status, data.MesCompetencia, data.PagamentoBolsistaAlocacaoBolsistaId, data.AlocacaoBolsista);
    
    if (import.meta.env.VITE_DEV_MOCK == 'true') {
      return pagamentoBolsista.Id = '10';
    }
    return await this.pagamentoBolsistaRepository.createPagamentoBolsista(data);
  }

  async update(id: string, data: any): Promise<any> {
    if (!id || !data) throw new Error("ID and data are required for update");

    const pagamento = new PagamentoBolsista(data.Id, data.Ordem, data.DataPagamento, data.ValorPago, data.Status, data.MesCompetencia, data.PagamentoBolsistaAlocacaoBolsistaId, data.AlocacaoBolsista);

    if (import.meta.env.VITE_DEV_MOCK == "true") {
      return id;
    }

    return await this.pagamentoBolsistaRepository.updatePagamentoBolsista(id, data);
  }

  async delete(id: string | number): Promise<any> {
    if (!id) throw new Error("ID is required to delete a Projeto");
    return await this.pagamentoBolsistaRepository.deletePagamentoBolsista(id);
  }

  async filter(route: string) {
    if (!route) throw new Error("Route is required for filter");
    return await this.pagamentoBolsistaRepository.filter(route);
  }
}