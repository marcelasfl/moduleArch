//Responsável pela interação com a API, ele lida com o envio e recebimento de dados para o backend.
//Esse repositório encapsula as chamadas à API, separando a lógica de acesso aos dados da lógica de negócios.


import log from '@/logger';
import api from '@/services/api';
import type { IPlanoMensal } from '../../../pagamento/model/PlanoMensal';
import PlanoMensal from '../../../pagamento/model/PlanoMensal';
import PlanoMensalRoutes from './apiRoutes/PlanoMensal';
import type IRepository from './IRepository';

export default class PlanoMensalRepository implements IRepository {
  apiClient;

  constructor() {
    this.apiClient = api;
  }

  createBaseRoute() {
    return new PlanoMensalRoutes({}).entity;
  }

  createOrderRoute() {
    return new PlanoMensalRoutes({}).orderByMonth;
  }

  createBulkRoute() {
    return new PlanoMensalRoutes({}).bulk;
  }

  createFilterByYearRoute() {
    return new PlanoMensalRoutes({}).filterByYear;
  }

  // Método para buscar todos os planos mensais com filtro opcional
  async fetchAllPlanoMensal(filter?: string) {
    try {
      const baseRoute = this.createOrderRoute();
      const response = await this.apiClient.get(baseRoute, {
        params: filter ? { filter } : {},
      });
      if (response.status === 200) {
        
      }
      const itens = response.data.value;
      let planos = itens
        ? itens.map(
            (planoMensal: IPlanoMensal) =>
              new PlanoMensal(
                planoMensal.Id,
                planoMensal.Mes,
                planoMensal.MarcoSolicitacaoBolsa.split('T')[0],
                planoMensal.MarcoGeracaoFolha.split('T')[0],
                planoMensal.MarcoPagamento.split('T')[0],
                planoMensal.EhAtual
              )
          )
        : [];
      
      return planos;
    } catch (error) {
      log.error("Erro ao buscar planos mensais", error);
      return [];
    }
  }

// Método para buscar um plano mensal específico por ID
async fetchPlanoMensalById(id: string | number): Promise<PlanoMensal> {
  try {
    const baseRoute = `${this.createBaseRoute()}/${id}`;
    const response = await this.apiClient.get(baseRoute);

    if (response.status === 200 && response.data) {
      const planoMensal = response.data;
      return new PlanoMensal(
        planoMensal.Id,
        planoMensal.Mes,
        planoMensal.MarcoSolicitacaoBolsa,
        planoMensal.MarcoGeracaoFolha,
        planoMensal.MarcoPagamento,
        planoMensal.EhAtual
      );
    } else {
      throw new Error(`Plano Mensal com ID ${id} não encontrado.`);
    }
  } catch (error) {
    log.error("Erro ao buscar plano mensal por ID:", error);
    throw new Error(`Erro ao buscar Plano Mensal com ID ${id}: ${error}`);
  }
}

  // Método para criar um novo plano mensal
  async createPlanoMensal(data: IPlanoMensal) {
    try {
      const baseRoute = this.createBaseRoute();
      const response = await this.apiClient.post(baseRoute, data);
      return response.data;
    } catch (error) {
      log.error("Erro ao criar plano mensal", error);
      throw error;
    }
  }

  // Método para atualizar um plano mensal específico por ID
  async updatePlanoMensal(id: string | number, data: Partial<IPlanoMensal>) {
    try {
      const baseRoute = `${this.createBaseRoute()}/${id}`;
      const response = await this.apiClient.put(baseRoute, data);
      return response.data;
    } catch (error) {
      log.error("Erro ao atualizar plano mensal", error);
      throw error;
    }
  }

  // Método para deletar um plano mensal específico por ID
  async deletePlanoMensal(id: string | number) {
    try {
      const baseRoute = `${this.createBaseRoute()}/${id}`;
      const response = await this.apiClient.delete(baseRoute);
      return response.status === 200;
    } catch (error) {
      log.error("Erro ao deletar plano mensal", error);
      throw error;
    }
  }

  // Método para buscar planos mensais de filtro
  async filterPlanoMensal(route: string){
    try {
      const response = await this.apiClient.get(route);
      const itens = response.data.value;
      let planos = itens
        ? itens.map(
            (planoMensal: IPlanoMensal) =>
              new PlanoMensal(
                planoMensal.Id,
                planoMensal.Mes,
                planoMensal.MarcoSolicitacaoBolsa.split('T')[0],
                planoMensal.MarcoGeracaoFolha.split('T')[0],
                planoMensal.MarcoPagamento.split('T')[0],
                planoMensal.EhAtual
              )
          )
        : [];
      return planos;
    } catch (error) {
      log.error("Erro ao buscar planos mensais", error);
      throw error;
    }
  }

  // Método para criar em bulk
  async createBulkPlanoMensal(data: IPlanoMensal[]) {
    try {
      const bulkRoute = this.createBulkRoute();
      const response = await this.apiClient.post(`${bulkRoute}`, data);
      return response.data;
    } catch (error) {
      log.error("Erro ao criar plano mensal", error);
      throw error;
    }
  }

  // Método para update em bulk
  async updateBulkPlanoMensal(data: IPlanoMensal[]) {
    try {
      const bulkRoute = this.createBulkRoute();
      const response = await this.apiClient.put(`${bulkRoute}`, data);
      return response.data;
    } catch (error) {
      log.error("Erro ao criar plano mensal", error);
      throw error;
    }
  }
}
