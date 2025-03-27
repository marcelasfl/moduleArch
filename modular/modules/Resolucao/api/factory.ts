import { apiProvider } from '../../../api/provider';
import { type ResolucaoServiceInterface } from './interface';
import { ResolucaoService } from './services/resolucao.service';

export class ResolucaoServiceFactory {
  private static instance: ResolucaoServiceInterface;

  static getService(): ResolucaoServiceInterface {
    if (!ResolucaoServiceFactory.instance) {
      const httpClient = apiProvider.getHttpClient();
      ResolucaoServiceFactory.instance = new ResolucaoService(httpClient);
    }
    return ResolucaoServiceFactory.instance;
  }

  static saveService(service: ResolucaoServiceInterface) {
    ResolucaoServiceFactory.instance = service;
  }
  
  
}

export const resolucaoService = ResolucaoServiceFactory.getService();