//O controller gerencia a lógica de negócios relacionada à "Alocacao Bolsista" e conecta as camadas de dados e a interface do usuário.
// Ele usa o AlocacaoBolsistalRepository para lidar com as operações de dados.
//Esse controller lida com chamadas de API através do AlocacaoBolsistalRepository para realizar operações CRUD e também possui lógica condicional 
//para ativar mocks no modo de desenvolvimento (VITE_DEV_MOCK).

import AlocacaoBolsista from '../../pagamento/model/AlocacaoBolsista';
import AlocacaoBolsistaRepository from '../model/repositories/AlocacaoBolsistaRepository';
import type { BaseConfig } from '../model/repositories/apiRoutes/BaseConfig';
import type IController from './generic/IController';


export default class AlocacaoBolsistaController implements IController {
  items: any;
  deleteItem(Id: any) {
    throw new Error('Method not implemented.');
  }
  alocacaoBolsistaRepository: AlocacaoBolsistaRepository;

  constructor() {
    this.alocacaoBolsistaRepository = new AlocacaoBolsistaRepository();
  }

  // Método para buscar todos as alocacões dos bolsistas com filtro opcional
  // Busca todos as alocacões dos bolsistas com um filtro opcional.
  async getAll(filter?: string): Promise<{ alocacoes: AlocacaoBolsista[]; odata: any }> {
    return await this.alocacaoBolsistaRepository.fetchAllAlocacaoBolsista(filter);
  }

  async getAllPessoaAlocada(filter?: string): Promise<AlocacaoBolsista[]> {
    return await this.alocacaoBolsistaRepository.fetchAllPessoaAlocada(filter);
  }

  // Método para buscar uma alocação por ID
  async getById(id: string | number): Promise<any> {
    if (!id) throw new Error("ID is required");
    return await this.alocacaoBolsistaRepository.fetchAlocacaoBolsistaById(id);
  }

  // Método para criar uma nova alocação 
  async create(data: any): Promise<any> {
    if (!data) throw new Error("Data is required to create a new AlocacaoBolsista");

    const alocacaoBolsista = new AlocacaoBolsista(data.Id, data.InicioAtividade, data.DataPrevistaFimAtividade, data.QtdeCotas, data.QtdeCotasPagas, data.Status, data.Projeto, data.VersaoNivel, data.Pessoa);
    
    if (import.meta.env.VITE_DEV_MOCK == 'true') {
      return alocacaoBolsista.Id = '10';
    }
    return await this.alocacaoBolsistaRepository.createAlocacaoBolsista(data);
  }

  // Método para atualizar uma alocação por ID
  async update(id: string, data: any): Promise<any> {
    if (!id || !data) throw new Error("ID and data are required for update");

    const alocacaoBolsista = new AlocacaoBolsista(id, data.InicioAtividade, data.DataPrevistaFimAtividade, data.QtdeCotas, data.QtdeCotasPagas, data.Status, data.Projeto, data.VersaoNivel, data.Pessoa);

    if (import.meta.env.VITE_DEV_MOCK == "true") {
      return id;
    }

    return await this.alocacaoBolsistaRepository.updateAlocacaoBolsista(id, data);
  }

  // Método para deletar uma alocação por ID
  async delete(id: string | number): Promise<any> {
    if (!id) throw new Error("ID is required to delete a AlocacaoBolsista");
    return await this.alocacaoBolsistaRepository.deleteAlocacaoBolsista(id);
  }

  async filter(route: string) {
    if (!route) throw new Error("Route is required for filter");
    return await this.alocacaoBolsistaRepository.filterAlocacaoBolsista(route);
  }

  async paginacao(config: BaseConfig, filter?: string) {
    return await this.alocacaoBolsistaRepository.fetchPaginatedAlocacaoBolsista(config, filter);
  }

  async count() {
    return await this.alocacaoBolsistaRepository.countAlocacaoBolsista();
  }

  async countByProjetoId(id: string) {
    return await this.alocacaoBolsistaRepository.countAlocacaoByProjetoId(id);
  }
}


