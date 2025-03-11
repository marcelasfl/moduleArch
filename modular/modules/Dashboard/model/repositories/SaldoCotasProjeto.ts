import log from '@/logger';
import api from '@/services/api';
import type { ISaldoCotasProjeto } from '../SaldoCotasProjeto';
import SaldoCotasProjeto from '../SaldoCotasProjeto';
import CotasRemanescentes from './apiRoutes/CotasRemanescentes';
import type ISaldoCotasProjetoRepository from './ISaldoCotasProjetoRepository';

export default class SaldoCotasProjetoRepository implements ISaldoCotasProjetoRepository {
    apiClient;

    constructor() {
        this.apiClient = api;
    }
    createBaseRoute() {
        return new CotasRemanescentes({}).entity;
    }

    async fetchAllSaldoCotasProjeto(filter?: string): Promise<SaldoCotasProjeto[]> {
        try {
            const baseRoute = this.createBaseRoute();
            let response = await this.apiClient.get(baseRoute, {
                params: filter ? { filter } : {}
            });

            if (response.status === 200) {
                log.info('Busca realizada com sucesso');
            }
            console.log('response', response);
            let dashboards = response.data.map((dashboard: ISaldoCotasProjeto) => {
                return new SaldoCotasProjeto(
                    dashboard.projetoId,
                    dashboard.sigla,
                    dashboard.qtdPlanejada,
                    dashboard.qtdAlocada,
                    dashboard.qtdDisponivel,
                    dashboard.valorUnitario,
                    dashboard.versaoNivelId
                );
            });
        
            return dashboards;
        } catch (error) {
            log.error('Erro ao buscar pagamento de bolsistas', error);
            return [];
        }
    }

    async fetchSaldoCotasProjetoById(id: string | number): Promise<SaldoCotasProjeto> {
        try {
            const baseRoute = `${this.createBaseRoute()}/${id}`;
            const response = await this.apiClient.get(baseRoute);

            if (response.status === 200) {
                const dashboards = response.data;
                return new SaldoCotasProjeto(
                    dashboards.projetoId,
                    dashboards.sigla,
                    dashboards.qtdPlanejada,
                    dashboards.qtdAlocada,
                    dashboards.qtdDisponivel,
                    dashboards.valorUnitario,
                    dashboards.versaoNivelId
                );
            }
            return {} as SaldoCotasProjeto;
        } catch (error) {
            log.error('Erro ao buscar pagamento de bolsistas', error);
            return {} as SaldoCotasProjeto;
        }
    }

    async createSaldoCotasProjeto(data: ISaldoCotasProjeto): Promise<ISaldoCotasProjeto> {
        try {
            const baseRoute = this.createBaseRoute();
            const response = await this.apiClient.post(baseRoute, data);
            return response.data;
        } catch (error) {
            log.error('Erro ao cadastrar cotas de bolsistas', error);
            return {} as ISaldoCotasProjeto;
        }
    }

    async updateSaldoCotasProjeto(id: string | number, data: Partial<ISaldoCotasProjeto>): Promise<ISaldoCotasProjeto> {
        try {
            const baseRoute = `${this.createBaseRoute()}/${id}`;
            const response = await this.apiClient.put(baseRoute, data);
            return response.data;
        } catch (error) {
            log.error('Erro ao atualizar cotas de bolsistas', error);
            return {} as ISaldoCotasProjeto;
        }
    }

    async deleteSaldoCotasProjeto(id: string | number): Promise<boolean> {
        try {
            const baseRoute = `${this.createBaseRoute()}/${id}`;
            const response = await this.apiClient.delete(baseRoute);
            return response.status === 200;
        } catch (error) {
            log.error('Erro ao deletar cotas de bolsa', error);
            return false;
        }
    }

    async filter(route: string) {
        try {
            const response = await this.apiClient.get(route);
            const itens = response.data.value;
            let dashboards = itens
                ? itens.map(
                      (dashboards: ISaldoCotasProjeto) =>
                          new SaldoCotasProjeto(
                              dashboards.projetoId,
                              dashboards.sigla,
                              dashboards.qtdPlanejada,
                              dashboards.qtdAlocada,
                              dashboards.qtdDisponivel,
                              dashboards.valorUnitario,
                              dashboards.versaoNivelId
                          )
                  )
                : [];
            return dashboards;
        } catch (error) {
            log.error('Erro ao buscar quantidade de bolsas', error);
            throw error;
        }
    }
}
