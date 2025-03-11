// src/repositories/ProductRepository.js
import api from '@/services/api';
import type { ILiberarEditaisPagamento } from '../LiberarEditaisPagamento';
import LiberarEditaisPagamento from '../LiberarEditaisPagamento';
import LiberarEditaisRoutes from './apiRoutes/LiberarEditaisPagamento';
import log from '@/logger';

export default class LiberarEditaisRepository {
  apiClient;
  constructor() {
    this.apiClient = api;
  }

  createBaseRoute() {
    return new LiberarEditaisRoutes({}).entity;
  }

  createLiberarEditalExpandAllRoute() {
    return new LiberarEditaisRoutes({}).liberarEdital;
  }

  createMonitorarEditaisExpandAllRoute() {
    return new LiberarEditaisRoutes({}).monitorarEdital;
  }

  createBulkRoute() {
    return new LiberarEditaisRoutes({}).bulk;
  }

  createMonitorarLiberacaoEditaisRoute() {
    return new LiberarEditaisRoutes({}).monitorarLiberacaoEdital;
  }

  createConfirmarGeracaoFolhaRoute() {
    return new LiberarEditaisRoutes({}).confirmarGeracaoFolha;
  }

  createVisualizarLiberacaoRoute(id: string) {
    return new LiberarEditaisRoutes({id: id}).visualizarLiberacao
  }

  async filterLiberarEditais(route: string){
    try {
      const response = await this.apiClient.get(route);
      return response.data.value;
      // return response.data.value.map((liberarEditais: ILiberarEditaisPagamento) => new LiberarEditaisPagamento(liberarEditais.Id, 
      //   liberarEditais.Edital, liberarEditais.BolsasVigentes, liberarEditais.BolsasPendentes, 
      //   liberarEditais.ValorPrevisto, liberarEditais.Status, liberarEditais.PlanoMensal, liberarEditais.DecisaoLiberacoes));
    } catch (error) {
      log.error("Erro ao buscar editais competencia", error);
      return [];
    }
  }

  async filterLiberarEditaisByArea(id: string){
    try {
      const response = await this.apiClient.get(this.createVisualizarLiberacaoRoute(id));
      return response.data;
    } catch (error) {
      log.error("Erro ao buscar editais competencia", error);
      return [];
    }
  }

  async fetchAllLiberarEditais() {
    try {
      const baseRoute = this.createLiberarEditalExpandAllRoute();
      const response = await this.apiClient.get(baseRoute);
      return response.data;
      // return response.data.value.map((liberarEditais: ILiberarEditaisPagamento) => new LiberarEditaisPagamento(liberarEditais.Id, 
      //   liberarEditais.Edital, liberarEditais.BolsasVigentes, liberarEditais.BolsasPendentes, 
      //   liberarEditais.ValorPrevisto, liberarEditais.Status, liberarEditais.PlanoMensal, liberarEditais.DecisaoLiberacoes));
    } catch (error) {
      log.error("Erro ao buscar editais competencia", error);
      return [];
    }
  }

  async fetchAllMonitorarEditais() {
    try {
      const baseRoute = this.createMonitorarLiberacaoEditaisRoute();
      const response = await this.apiClient.get(baseRoute);
      return response.data;
    } catch (error) {
      log.error("Erro ao buscar editais competencia", error);
      return [];
    }
  }

  async fetchAllConfirmarGeracaoFolha() {
    try {
      const baseRoute = this.createConfirmarGeracaoFolhaRoute();
      const response = await this.apiClient.get(baseRoute);
      return response.data;
    } catch (error) {
      log.error("Erro ao buscar editais competencias", error);
      return [];
    }
  }

  // Método para update em bulk
  async updateBulkLiberarEditais(data: any) {
    try {
      const bulkRoute = this.createBulkRoute();
      const response = await this.apiClient.put(`${bulkRoute}`, data);
      return response.data;
    } catch (error) {
      log.error("Erro ao fazer bulk de liberar editais", error);
      throw error;
    }
  }

}