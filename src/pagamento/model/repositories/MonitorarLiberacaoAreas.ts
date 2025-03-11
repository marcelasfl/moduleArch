// src/repositories/ProductRepository.js
import api from '@/services/api';
import MonitorarLiberacaoAreasRoutes from './apiRoutes/MonitorarLiberacaoAreas';
import log from '@/logger';

export default class MonitorarLiberacaoAreasRepository {
  apiClient;
  constructor() {
    this.apiClient = api;
  }

  createMonitorarLiberacaoAreasRoute() {
    return new MonitorarLiberacaoAreasRoutes({}).monitorarLiberacaoEdital;
  }

  async fetchAllMonitorarEditais() {
    try {
      const baseRoute = this.createMonitorarLiberacaoAreasRoute();
      const response = await this.apiClient.get(baseRoute);
      return response.data;
    } catch (error) {
      log.error("Erro ao buscar editais competencia", error);
      return [];
    }
  }
}