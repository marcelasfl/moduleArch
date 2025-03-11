import type { AxiosInstance } from 'axios';
import type { IAreaTecnicaDashboard } from '../../entities/AreaTecnicaDashboards';

export class AreaTecnicaService {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;  
  }

  async getAreasTecnicas() {
    try {
      return await this.api.get<IAreaTecnicaDashboard>('dashboards/areatecnica');
    } catch (error: unknown) {
      return ("errorFactory((error as AxiosError).response?.status);")
    }
  }
}
