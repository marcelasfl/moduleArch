//O controller gerencia a lógica de negócios relacionada à "Alocacao Bolsista" e conecta as camadas de dados e a interface do usuário.
// Ele usa o AlocacaoBolsistalRepository para lidar com as operações de dados.
//Esse controller lida com chamadas de API através do AlocacaoBolsistalRepository para realizar operações CRUD e também possui lógica condicional 
//para ativar mocks no modo de desenvolvimento (VITE_DEV_MOCK).

import AreaTecnica from '../model/AreaTecnica';
import AreaTecnicaRepository from '../model/repositories/AreaTecnicaRepository';
import type { BaseConfig } from '../../dashboard/model/repositories/apiRoutes/BaseConfig';
import type IController from './generic/IController';


export default class AreaTecnicaController implements IController {
  items: any;
  deleteItem(Id: any) {
    throw new Error('Method not implemented.');
  }
  areaTecnicaRepository: AreaTecnicaRepository;

  constructor() {
    this.areaTecnicaRepository = new AreaTecnicaRepository();
  }

  // Método para buscar todos as alocacões dos bolsistas com filtro opcional
  // Busca todos as alocacões dos bolsistas com um filtro opcional.
  async getAll(filter?: string): Promise<any> {
    return await this.areaTecnicaRepository.fetchAllAreaTecnica(filter);
  }

  // Método para buscar uma alocação por ID
  async getById(id: string | number): Promise<any> {
    if (!id) throw new Error("ID is required");
    return await this.areaTecnicaRepository.fetchAreaTecnicaById(id);
  }

  // Método para criar uma nova alocação 
  async create(data: any): Promise<any> {
    if (!data) throw new Error("Data is required to create a new AlocacaoBolsista");

    const areaTecnica = new AreaTecnica(data.Id, data.Nome, data.Descricao, data.Editais, data.AreaTecnicaEditalId);
    
    if (import.meta.env.VITE_DEV_MOCK == 'true') {
      return areaTecnica.Id = '10';
    }
    return await this.areaTecnicaRepository.createAreaTecnica(data);
  }

  // Método para atualizar uma alocação por ID
  async update(id: string, data: any): Promise<any> {
    if (!id || !data) throw new Error("ID and data are required for update");

    const areaTecnica = new AreaTecnica(id, data.Nome, data.Descricao, data.Editais, data.AreaTecnicaEditalId);

    if (import.meta.env.VITE_DEV_MOCK == "true") {
      return id;
    }

    return await this.areaTecnicaRepository.updateAreaTecnica(id, data);
  }

  // Método para deletar uma alocação por ID
  async delete(id: string | number): Promise<any> {
    if (!id) throw new Error("ID is required to delete a AlocacaoBolsista");
    return await this.areaTecnicaRepository.deleteAreaTecnica(id);
  }

  async filter(route: string) {
    if (!route) throw new Error("Route is required for filter");
    return await this.areaTecnicaRepository.filterAreaTecnica(route);
  }

  async paginacao(config: BaseConfig, filter?: string) {
    return await this.areaTecnicaRepository.fetchPaginatedAreaTecnica(config, filter);
  }

  async count() {
    return await this.areaTecnicaRepository.countAreaTecnica();
  }
}


