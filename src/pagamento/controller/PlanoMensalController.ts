//O controller gerencia a lógica de negócios relacionada ao "Plano Mensal" e conecta as camadas de dados e a interface do usuário.
// Ele usa o PlanoMensalRepository para lidar com as operações de dados.
//Esse controller lida com chamadas de API através do PlanoMensalRepository para realizar operações CRUD e também possui lógica condicional 
//para ativar mocks no modo de desenvolvimento (VITE_DEV_MOCK).

import PlanoMensal from '../model/PlanoMensal';
import PlanoMensalRepository from '../model/repositories/PlanoMensalRepository';
import type IController from './store/generic/IController';


export default class PlanoMensalController implements IController {
  items: any;
  deleteItem(Id: any) {
    throw new Error('Method not implemented.');
  }
  planoMensalRepository: PlanoMensalRepository;
  constructor() {
    this.planoMensalRepository = new PlanoMensalRepository();
  }

  // Método para buscar todos os planos mensais com filtro opcional
  // Busca todos os planos mensais com um filtro opcional.
  async getAll(filter?: string): Promise<any> {
    return await this.planoMensalRepository.fetchAllPlanoMensal(filter);
  }

  // Método para buscar um plano mensal por ID
  async getById(id: string | number): Promise<any> {
    if (!id) throw new Error("ID is required");
    return await this.planoMensalRepository.fetchPlanoMensalById(id);
  }

  // Método para criar um novo plano mensal
  async create(data: any): Promise<any> {
    if (!data) throw new Error("Data is required to create a new PlanoMensal");

    const planoMensal = new PlanoMensal(data.Id, data.Mes, data.MarcoSolicitacaoBolsa, data.MarcoGeracaoFolha, data.MarcoPagamento, data.EhAtual);
    
    if (import.meta.env.VITE_DEV_MOCK == 'true') {
      return planoMensal.Id = '10';
    }
    return await this.planoMensalRepository.createPlanoMensal(data);
  }

  // Método para atualizar um plano mensal por ID
  async update(id: string, data: any): Promise<any> {
    if (!id || !data) throw new Error("ID and data are required for update");

    const planoMensal = new PlanoMensal(id, data.Mes, data.MarcoSolicitacaoBolsa, data.MarcoGeracaoFolha, data.MarcoPagamento, data.EhAtual);

    if (import.meta.env.VITE_DEV_MOCK == "true") {
      return id;
    }

    return await this.planoMensalRepository.updatePlanoMensal(id, data);
  }

  // Método para deletar um plano mensal por ID
  async delete(id: string | number): Promise<any> {
    if (!id) throw new Error("ID is required to delete a PlanoMensal");
    return await this.planoMensalRepository.deletePlanoMensal(id);
  }

  // Método de filtro que recebe a rota
  async filter(route: string) {
    if (!route) throw new Error("Route is required for filter");
    return await this.planoMensalRepository.filterPlanoMensal(route);
  }

  // Método para criar em bulk
  async createBulk(data: any) {
    if (!data) throw new Error("Data is required to create a new PlanoMensal");

    data["calendario"].forEach((item: any) => {
      const planoMensal = new PlanoMensal(item.Id, item.Mes, item.MarcoSolicitacaoBolsa, item.MarcoGeracaoFolha, item.MarcoPagamento, item.EhAtual);
    })

    if (import.meta.env.VITE_DEV_MOCK == 'true') return '10';
    return await this.planoMensalRepository.createBulkPlanoMensal(data)
  }

  // Método para alterar em bulk
  async updateBulk(data: any) {
    if (!data) throw new Error("Data is required to update a new PlanoMensal");

    data["calendario"].forEach((item: any) => {
      const planoMensal = new PlanoMensal(item.Id, item.Mes, item.MarcoSolicitacaoBolsa, item.MarcoGeracaoFolha, item.MarcoPagamento, item.EhAtual);
    })

    if (import.meta.env.VITE_DEV_MOCK == 'true') return '10';
    return await this.planoMensalRepository.updateBulkPlanoMensal(data)
  }

  async fetchAtual() {
    return await this.planoMensalRepository.getPlanoMensalAtual();
  }
  
  async fetchAnterior(mes: string | number) {
    return await this.planoMensalRepository.getPlanoMensalAnterior(mes);
  }
  
  async fetchPosterior(mes: string | number) {
    return await this.planoMensalRepository.getPlanoMensalPosterior(mes);
  }
}
