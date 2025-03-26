import { apiProvider } from '../../../api/provider';
import { AuthService } from '../services/auth.service';
import { AuthServiceInterface } from './interface';

export class AuthServiceFactory {
  private static instance: AuthServiceInterface;

  static getService(): AuthServiceInterface {
    if (!AuthServiceFactory.instance) {
      const httpClient = apiProvider.getHttpClient();
      AuthServiceFactory.instance = new AuthService(httpClient);
    }
    return AuthServiceFactory.instance;
  }
}

export const authService = AuthServiceFactory.getService();

