// src/repositories/ProductRepository.js
import api from '@/services/api';
import VisualizarPreviaFolhaRoutes from './apiRoutes/VisualizarPreviaFolha';
import log from '@/logger';

export default class VisualizarPreviaFolhaRepository {
  apiClient;
  constructor() {
    this.apiClient = api;
  }

  createVisualizarPreviaRoute() {
    return new VisualizarPreviaFolhaRoutes({}).visualizarPreviaFolha;
  }

  async fetchAllVisualizarPrevia() {
    try {
      const baseRoute = this.createVisualizarPreviaRoute();
      const response = await this.apiClient.get(baseRoute);
      return response.data;
    } catch (error) {
      log.error("Erro ao buscar editais competencia", error);
      return [];
    }
  }
}