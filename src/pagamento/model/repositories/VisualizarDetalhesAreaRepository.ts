import api from '@/services/api';
import VisualizarDetalhesArea from './apiRoutes/VisualizarDetalhesArea';
import type { IAreaTecnica } from '../AreaTecnica';
import AreaTecnica from '../AreaTecnica';

export default class VisualizarDetalhesAreaRepository {
    apiClient;
    constructor() {
      this.apiClient = api;
    }
  
    createBaseRoute() {
      return new VisualizarDetalhesArea({}).visualizarDetalhesArea;
    }
  
    createIdRoute(id: string) {
      return new VisualizarDetalhesArea({id: id}).getById;
    }
  
    async fetchAllDetalhesArea() {
      try {
        const baseRoute = this.createBaseRoute();
        const response = await this.apiClient.get(baseRoute);
        return response.data.value.map((areaTecnica: IAreaTecnica) => new AreaTecnica(areaTecnica.Id, areaTecnica.Nome));
      } catch (error) {
        console.error("Erro ao buscar áreas técnicas", error);
        return [];
      }
    }
}