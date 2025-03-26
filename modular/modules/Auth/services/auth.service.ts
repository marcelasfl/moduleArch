import { AuthServiceInterface } from "../api/interface";

import { HttpClientInterface } from "../../../api/interface";
import type { LoginRequest, LoginResponse, RegisterRequest } from "../api/interface";
import { AuthStorageService } from "./storage.service";

// Serviço responsável apenas pelas operações de autenticação
export class AuthService implements AuthServiceInterface {
  private storageService: AuthStorageService;
  private httpClient: HttpClientInterface;
  
  constructor(httpClient: HttpClientInterface) {
    this.storageService = new AuthStorageService();
    this.httpClient = httpClient;
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.httpClient.post<LoginResponse>('/auth/login', data);
  }

  async register(data: RegisterRequest): Promise<void> {
    return this.httpClient.post<void>('/auth/register', data);
  }

  async logout(): Promise<void> {
    return this.httpClient.post<void>('/auth/logout');
  }

  async forgotPassword(email: string): Promise<void> {
    return this.httpClient.post<void>('/auth/forgot-password', { email });
  }

  isAuthenticated(token?: string): boolean {
    const authToken = token || this.storageService.getAuthToken();
    return !!authToken;
  }
  
  clearAuthData(): void {
    this.storageService.removeAuthToken();
    this.storageService.removeRefreshToken();
    this.storageService.removeUser();
  }
}
