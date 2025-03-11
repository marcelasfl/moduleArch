import log from '@/logger';
import fileApi from '../generic/api';
import RetornoRemessaRoutes from './apiRoutes/RetornoRemessa';

export default class EditalRepository{
    apiClient;

    constructor() {
        this.apiClient = fileApi;
    }

    createDt1Route() {
        return new RetornoRemessaRoutes({}).uploadDp1;
    }

    createDt9Route() {
        return new RetornoRemessaRoutes({}).uploadDp9;
    }

    async uploadDp1(data: FormData) {
        try {
            const response = await this.apiClient.post(this.createDt1Route(), data);
            return response.data;
        } catch (error) {
            log.error("Erro ao enviar DT1", error);
            throw error;
        }
    }

    async uploadDp9(data: FormData) {
        try {
            const response = await this.apiClient.post(this.createDt9Route(), data);
            return response.data;
        } catch (error) {
            log.error("Erro ao enviar DT9", error);
            throw error;
        }
    }

}