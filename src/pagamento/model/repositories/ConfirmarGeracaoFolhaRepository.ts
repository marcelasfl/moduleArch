// src/repositories/ProductRepository.js
import api from '@/services/api';
import ConfirmarGeracaoFolhaRoutes from './apiRoutes/ConfirmarGeracaoFolha';
import log from '@/logger';

export default class LiberarEditaisRepository {
  apiClient;
  constructor() {
    this.apiClient = api;
  }

  createConfirmarGeracaoFolhaRoute() {
    return new ConfirmarGeracaoFolhaRoutes({}).confirmarGeracaoFolha;
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


}