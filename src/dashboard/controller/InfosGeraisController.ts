import InfosGeraisAreaTecnica from '../model/InfosGeraisAreaTecnica';
import InfosGeraisRepository from '../model/repositories/InfosGeraisRepository';
import type { BaseConfig } from '../model/repositories/apiRoutes/BaseConfig';
import type IController from './generic/IController';


export default class InfosGeraisController implements IController {
  items: any;
  deleteItem(Id: any) {
    throw new Error('Method not implemented.');
  }
  infosgeraisRepository: InfosGeraisRepository;

  constructor() {
    this.infosgeraisRepository = new InfosGeraisRepository();
  }
  getAll(filter?: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  getById(id: string | number): Promise<any> {
    throw new Error('Method not implemented.');
  }
  create(data: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  update(id: string | number, data: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  delete(id: string | number): Promise<any> {
    throw new Error('Method not implemented.');
  }

  // Método para buscar todos as alocacões dos bolsistas com filtro opcional
  // Busca todos as alocacões dos bolsistas com um filtro opcional.
  async getAllAreaTecnica(filter?: string): Promise<any> {
    return await this.infosgeraisRepository.fetchAllInfosGeraisAreaTecnica(filter);
  }

  // Método para buscar uma alocação por ID
  async getAreaTecnicaById(id: string | number): Promise<any> {
    if (!id) throw new Error("ID is required");
    return await this.infosgeraisRepository.fetchInfosGeraisAreaTecnicaById(id);
  }

  async getAllEdital(filter?: string): Promise<any> {
    return await this.infosgeraisRepository.fetchAllInfosGeraisEdital(filter);
  }

  async getEditalById(id: string | number): Promise<any> {
    if (!id) throw new Error("ID is required");
    return await this.infosgeraisRepository.fetchInfosGeraisEditalById(id);
  }

  async getAllProjeto(filter?: string): Promise<any> {
    return await this.infosgeraisRepository.fetchAllInfosGeraisProjeto(filter);
  }

  async getProjetoById(id: string | number): Promise<any> {
    if (!id) throw new Error("ID is required");
    return await this.infosgeraisRepository.fetchInfosGeraisProjetoById(id);
  }
  
  async filter(route: string) {
    if (!route) throw new Error("Route is required for filter");
    return await this.infosgeraisRepository.filterInfosGeraisAreaTecnica(route);
  }

  async paginacao(config: BaseConfig, filter?: string) {
    return await this.infosgeraisRepository.fetchPaginatedInfosGeraisAreaTecnica(config, filter);
  }

  async count() {
    return await this.infosgeraisRepository.countInfosGeraisAreaTecnica();
  }
}


