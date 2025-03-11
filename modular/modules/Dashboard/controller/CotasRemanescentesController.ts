import SaldoCotasProjeto from '../model/SaldoCotasProjeto';
import SaldoCotasProjetoRepository from '../model/repositories/SaldoCotasProjeto';
import type IController from './generic/IController';


//esse constructor é diferente dos demais, não exclua os parâmetros
export default class SaldoCotasProjetoController implements IController {
  items: any;
  deleteItem(Id: any) {
    throw new Error('Method not implemented.');
  }
  saldoCotasProjetoRepository: SaldoCotasProjetoRepository;

  constructor() {
    this.saldoCotasProjetoRepository = new SaldoCotasProjetoRepository();
  }

  async getAll(filter?: string): Promise<any> {
    return await this.saldoCotasProjetoRepository.fetchAllSaldoCotasProjeto(filter);
  }

  async getById(id: string | number): Promise<any> {
    if (!id) throw new Error("ID is required");
    return await this.saldoCotasProjetoRepository.fetchSaldoCotasProjetoById(id);
  }

  async create(data: any): Promise<any> {
    if (!data) throw new Error("Data is required to create a new Projeto");

    const saldoCotasProjeto = new SaldoCotasProjeto(data.projetoId, data.sigla, data.qtdPlanejada, data.qtdAlocada, data.qtdDisponivel, data.valorUnitario, data.versaoNivelId);
    
    if (import.meta.env.VITE_DEV_MOCK == 'true') {
      return saldoCotasProjeto.projetoId = '10';
    }
    return await this.saldoCotasProjetoRepository.createSaldoCotasProjeto(data);
  }

  async update(id: string, data: any): Promise<any> {
    if (!id || !data) throw new Error("ID and data are required for update");

    const saldoCotasProjeto = new SaldoCotasProjeto(data.projetoId, data.sigla, data.qtdPlanejada, data.qtdAlocada, data.qtdDisponivel, data.valorUnitario, data.versaoNivelId);

    if (import.meta.env.VITE_DEV_MOCK == "true") {
      return id;
    }

    return await this.saldoCotasProjetoRepository.updateSaldoCotasProjeto(id, data);
  }

  async delete(id: string | number): Promise<any> {
    if (!id) throw new Error("ID is required to delete a Projeto");
    return await this.saldoCotasProjetoRepository.deleteSaldoCotasProjeto(id);
  }

  async filter(route: string) {
    if (!route) throw new Error("Route is required for filter");
    return await this.saldoCotasProjetoRepository.filter(route);
  }
}