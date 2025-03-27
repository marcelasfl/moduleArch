import { apiProvider } from '../../../../api/provider';
import { type BolsistasProjetoServiceInterface } from '../interfaces/BolsistasProjetoInterface';
import { BolsistasProjetoService } from '../services/bolsistasProjeto.service';

export class BolsistasProjetoServiceFactory {
  private static instance: BolsistasProjetoServiceInterface;

  static getService(): BolsistasProjetoServiceInterface {
    if (!BolsistasProjetoServiceFactory.instance) {
      const httpClient = apiProvider.getHttpClient();
      BolsistasProjetoServiceFactory.instance = new BolsistasProjetoService(httpClient);
    }
    return BolsistasProjetoServiceFactory.instance;
  }

  static saveService(service: BolsistasProjetoServiceInterface) {
    BolsistasProjetoServiceFactory.instance = service;
  }
  
  
}

export const bolsistasProjetoService = BolsistasProjetoServiceFactory.getService();