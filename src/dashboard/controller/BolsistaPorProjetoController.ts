import BolsistaPorProjeto from '../model/BolsistaPorProjeto';
import BolsistaPorProjetoRepository from '../model/repositories/BolsistaPorProjetoRepository';
import type IController from './generic/IController';


export default class BolsistaPorProjetoController implements IController {
  items: any;
  deleteItem(Id: any) {
    throw new Error('Method not implemented.');
  }
  bolsistaPorProjetoRepository: BolsistaPorProjetoRepository;

  constructor() {
    this.bolsistaPorProjetoRepository = new BolsistaPorProjetoRepository();
  }

  async getAll(filter?: string): Promise<any> {
    return await this.bolsistaPorProjetoRepository.fetchAllBolsistaProjeto(filter);
  }

  async getById(id: string | number): Promise<any> {
    if (!id) throw new Error("ID is required");
    return await this.bolsistaPorProjetoRepository.fetchBolsistaProjetoById(id);
  }

  async create(data: any): Promise<any> {
    if (!data) throw new Error("Data is required to create a new Pessoa");

    const bolsista = new BolsistaPorProjeto(data.id, data.nome, data.status, data.siglaBolsa, data.cotasPagas, data.cotasAPagar, data.valorBolsa, data.valorAPagar, data.alocacaoBolsistaProjetoId, data.alocacaoBolsistaPessoaId, data.coordenadorAtual);
    
    if (import.meta.env.VITE_DEV_MOCK == 'true') {
      return bolsista.id = '10';
    }
    return await this.bolsistaPorProjetoRepository.createBolsistaProjeto(data);
  }

  async update(id: string, data: any): Promise<any> {
    if (!id || !data) throw new Error("ID and data are required for update");

    const pessoa = new BolsistaPorProjeto(data.id, data.nome, data.status, data.siglaBolsa, data.cotasPagas, data.cotasAPagar, data.valorBolsa, data.valorAPagar, data.alocacaoBolsistaProjetoId, data.alocacaoBolsistaPessoaId, data.coordenadorAtual);

    if (import.meta.env.VITE_DEV_MOCK == "true") {
      return id;
    }

    return await this.bolsistaPorProjetoRepository.updateBolsistaProjeto(id, data);
  }

  async delete(id: string | number): Promise<any> {
    if (!id) throw new Error("ID is required to delete a Pessoa");
    return await this.bolsistaPorProjetoRepository.deleteBolsistaProjeto(id);
  }

  async filter(route: string) {
    if (!route) throw new Error("Route is required for filter");
    return await this.bolsistaPorProjetoRepository.filter(route);
  }
}


