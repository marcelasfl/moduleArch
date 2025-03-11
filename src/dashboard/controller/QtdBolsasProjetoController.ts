import QtdBolsasProjeto from '../model/QtdBolsasProjeto';
import QtdBolsasProjetoRepository from '../model/repositories/QtdBolsasProjetoRepository';
import type IController from './generic/IController';


export default class QtdBolsasProjetoController implements IController {
  items: any;
  deleteItem(Id: any) {
    throw new Error('Method not implemented.');
  }
  qtdBolsasProjetoRepository: QtdBolsasProjetoRepository;

  constructor() {
    this.qtdBolsasProjetoRepository = new QtdBolsasProjetoRepository();
  }

  async getAll(filter?: string): Promise<any> {
    return await this.qtdBolsasProjetoRepository.fetchAllQtdBolsas(filter);
  }

  async getById(id: string | number): Promise<any> {
    if (!id) throw new Error("ID is required");
    return await this.qtdBolsasProjetoRepository.fetchQtdBolsasById(id);
  }

  async create(data: any): Promise<any> {
    if (!data) throw new Error("Data is required to create a new Projeto");

    const qtdBolsasProjeto = new QtdBolsasProjeto(data.Id, data.Nome, data.IdProjeto, data.Modalidades);
    
    if (import.meta.env.VITE_DEV_MOCK == 'true') {
      return qtdBolsasProjeto.id = '10';
    }
    return await this.qtdBolsasProjetoRepository.createQtdBolsas(data);
  }

  async update(id: string, data: any): Promise<any> {
    if (!id || !data) throw new Error("ID and data are required for update");

    const qtdBolsasProjeto = new QtdBolsasProjeto(data.Id, data.Nome, data.IdProjeto, data.Modalidades);

    if (import.meta.env.VITE_DEV_MOCK == "true") {
      return id;
    }

    return await this.qtdBolsasProjetoRepository.updateQtdBolsas(id, data);
  }

  async delete(id: string | number): Promise<any> {
    if (!id) throw new Error("ID is required to delete a Projeto");
    return await this.qtdBolsasProjetoRepository.deleteQtdBolsas(id);
  }

  async filter(route: string) {
    if (!route) throw new Error("Route is required for filter");
    return await this.qtdBolsasProjetoRepository.filter(route);
  }
}


