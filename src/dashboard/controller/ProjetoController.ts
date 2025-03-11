import Projeto from '../model/Projeto';
import ProjetoRepository from '../model/repositories/ProjetoRepository';
import type IController from './generic/IController';


export default class ProjetoController implements IController {
  items: any;
  deleteItem(Id: any) {
    throw new Error('Method not implemented.');
  }
  projetoRepository: ProjetoRepository;

  constructor() {
    this.projetoRepository = new ProjetoRepository();
  }

  // Método para buscar todos os projetos com filtro opcional
  // Busca todos os projetos com um filtro opcional.
  async getAll(filter?: string): Promise<any> {
    return await this.projetoRepository.fetchAllProjeto(filter);
  }

  // Método para buscar um projeto por ID
  async getById(id: string | number): Promise<any> {
    if (!id) throw new Error("ID is required");
    return await this.projetoRepository.fetchProjetoById(id);
  }

  async getAlocacoesInProjeto(filter?: string): Promise<any> {
    return await this.projetoRepository.fetchAlocacoesInProjeto(filter);
  }

  async getAlocacoesInProjetoById(id: string | number): Promise<any> {
    if (!id) throw new Error("ID is required");
    return await this.projetoRepository.fetchAlocacoesInProjetoById(id);
  }

  async getSaldoBolsasProjeto(filter?: string): Promise<any> {
    return await this.projetoRepository.fetchSaldoBolsasProjeto(filter);
  }

  async getSaldoBolsasProjetoById(id: string | number): Promise<any> {
    if (!id) throw new Error("ID is required");
    return await this.projetoRepository.fetchSaldoBolsasProjetoById(id);
  }
  
  // Método para criar um novo projeto 
  async create(data: any): Promise<any> {
    if (!data) throw new Error("Data is required to create a new Projeto");

    const projeto = new Projeto(data.Id, data.Nome);
    
    if (import.meta.env.VITE_DEV_MOCK == 'true') {
      return projeto.Id = '10';
    }
    return await this.projetoRepository.createProjeto(data);
  }

  // Método para atualizar um projeto por ID
  async update(id: string, data: any): Promise<any> {
    if (!id || !data) throw new Error("ID and data are required for update");

    const projeto = new Projeto(data.Id, data.Nome);

    if (import.meta.env.VITE_DEV_MOCK == "true") {
      return id;
    }

    return await this.projetoRepository.updateProjeto(id, data);
  }

  // Método para deletar um projeto por ID
  async delete(id: string | number): Promise<any> {
    if (!id) throw new Error("ID is required to delete a Projeto");
    return await this.projetoRepository.deleteProjeto(id);
  }

  async filter(route: string) {
    if (!route) throw new Error("Route is required for filter");
    return await this.projetoRepository.filterProjeto(route);
  }
}


