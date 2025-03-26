import axios, { AxiosInstance } from 'axios';
import { authInterceptor } from '../../interceptors/auth.interceptor';
import { errorInterceptor } from '../../interceptors/error.interceptor';
import { HttpClientInterface } from '../../interface';

export class AxiosHttpClient implements HttpClientInterface {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({ baseURL });
    
    // Adiciona interceptors de requisição
    this.client.interceptors.request.use(
      authInterceptor,
      (error) => Promise.reject(error)
    );
    
    // Adiciona interceptors de resposta
    this.client.interceptors.response.use(
      (response) => response,
      errorInterceptor
    );
  }

  async get<T>(url: string, params?: Record<string, any>, headers?: Record<string, string>): Promise<T> {
    const response = await this.client.get(url, { params, headers });
    return response.data;
  }

  async post<T>(url: string, data?: any, headers?: Record<string, string>): Promise<T> {
    const response = await this.client.post(url, data, { headers });
    return response.data;
  }

  async put<T>(url: string, data?: any, headers?: Record<string, string>): Promise<T> {
    const response = await this.client.put(url, data, { headers });
    return response.data;
  }

  async delete<T>(url: string, headers?: Record<string, string>): Promise<T> {
    const response = await this.client.delete(url, { headers });
    return response.data;
  }
}

