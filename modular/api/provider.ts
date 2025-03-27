import { inject, provide } from 'vue';
import { AxiosHttpClient } from './adapters/http/axios.client';
import { API_CONFIG } from './config';
import { type HttpClientInterface } from './interface';

export const API_CLIENT_KEY = Symbol('apiClient');

export class ApiProvider {
    private static instance: ApiProvider;
    private httpClient: HttpClientInterface;

    private constructor(httpClient: HttpClientInterface) {
        this.httpClient = httpClient;
    }

    public static getInstance(): ApiProvider {
        if (!ApiProvider.instance) {
            ApiProvider.instance = new ApiProvider(new AxiosHttpClient(API_CONFIG.BASE_URL));
        }
        return ApiProvider.instance;
    }

    getHttpClient(): HttpClientInterface {
        return this.httpClient;
    }
    public postHttpClient(): HttpClientInterface {
        return new AxiosHttpClient(API_CONFIG.BASE_URL);
    }
}

// Exporta instância singleton
export const apiProvider = ApiProvider.getInstance();

// Função para prover serviços no Vue
export function provideApiServices() {
    const httpClient = apiProvider.getHttpClient();
    provide(API_CLIENT_KEY, httpClient);
}

// Helper para componentes Vue
export function useApiClient(): HttpClientInterface {
    return inject(API_CLIENT_KEY) as HttpClientInterface;
}
