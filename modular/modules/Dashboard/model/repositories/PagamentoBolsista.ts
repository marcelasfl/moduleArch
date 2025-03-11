import log from '@/logger';
import api from '@/services/api';
import type { IPagamentoBolsista } from '../PagamentoBolsista';
import PagamentoBolsista from '../PagamentoBolsista';
import type IPagamentoBolsistaRepository from './IPagamentoBolsistaRepository';
import BaseRoute from './apiRoutes/BaseRoute';
import BaseModule from './apiRoutes/BaseModule';

export default class PagamentoBolsistaRepository implements IPagamentoBolsistaRepository{
    apiClient;

    constructor() {
        this.apiClient = api;
    }
    
    createBaseRoute() {
        return new BaseModule("pagamentobolsista", {}).entity;
    }

    async fetchAllPagamentoBolsista(filter?: string): Promise<PagamentoBolsista[]> {
        try {
            const baseRoute = this.createBaseRoute();
            let response = await this.apiClient.get(baseRoute, {
                params: filter ? { filter } : {},
            });

            if (response.status === 200) {
                log.info("Busca realizada com sucesso");
            }
            const itens = response.data.value;
            let pagamentos = itens
                ? itens.map(
                    (pagamento: IPagamentoBolsista) =>
                        new PagamentoBolsista(
                            pagamento.Id,
                            pagamento.Ordem,
                            pagamento.DataPagamento,
                            pagamento.ValorPago,
                            pagamento.MesCompetencia,
                            pagamento.Status,
                            pagamento.PagamentoBolsistaAlocacaoBolsistaId,
                            pagamento.AlocacaoBolsista
                        )
                    )
                : [];
            while (response.data['@odata.nextLink']) {
                //console.log("NextLink", response.data['@odata.nextLink']);
                response = await this.apiClient.get(response.data['@odata.nextLink']);
                pagamentos = [...pagamentos, ...response.data.value];
            }
            return pagamentos;
        } catch (error) {
            log.error("Erro ao buscar pagamento de bolsistas", error);
            return [];
        }
    }

    async fetchPagamentoBolsistaById(id: string | number): Promise<PagamentoBolsista> {
        try {
            const baseRoute = `${this.createBaseRoute()}/${id}`;
            const response = await this.apiClient.get(baseRoute);

            if (response.status === 200) {
                const pagamento = response.data;
                return new PagamentoBolsista(
                    pagamento.Id,
                    pagamento.Ordem,
                    pagamento.DataPagamento,
                    pagamento.ValorPago,
                    pagamento.MesCompetencia,
                    pagamento.Status,
                    pagamento.PagamentoBolsistaAlocacaoBolsistaId,
                    pagamento.AlocacaoBolsista
                );
            }
            return {} as PagamentoBolsista;
        } catch (error) {
            log.error("Erro ao buscar pagamento de bolsistas", error);
            return {} as PagamentoBolsista;
        }
    }

    async createPagamentoBolsista(data: IPagamentoBolsista): Promise<IPagamentoBolsista> {
        try {
            const baseRoute = this.createBaseRoute();
            const response = await this.apiClient.post(baseRoute, data);
            return response.data;
        } catch (error) {
            log.error("Erro ao cadastrar pagamento bolsistas", error);
            return {} as IPagamentoBolsista;
        }
    }

    async updatePagamentoBolsista(id: string | number, data: Partial<IPagamentoBolsista>): Promise<IPagamentoBolsista> {
        try {
            const baseRoute = `${this.createBaseRoute()}/${id}`;
            const response = await this.apiClient.put(baseRoute, data);
            return response.data;
        } catch (error) {
            log.error("Erro ao atualizar pagamento de bolsistas", error);
            return {} as IPagamentoBolsista;
        }
    }

    async deletePagamentoBolsista(id: string | number): Promise<boolean> {
        try {
            const baseRoute = `${this.createBaseRoute()}/${id}`;
            const response = await this.apiClient.delete(baseRoute);
            return response.status === 200;
        } catch (error) {
            log.error("Erro ao deletar pagamento de bolsa", error);
            return false;
        }
    }

    async filter(route: string){
        try {
            const response = await this.apiClient.get(route);
            const itens = response.data.value;
            let pagamentos = itens
            ? itens.map(
                (pagamento: IPagamentoBolsista) =>
                    new PagamentoBolsista(
                        pagamento.Id,
                        pagamento.Ordem,
                        pagamento.DataPagamento,
                        pagamento.ValorPago,
                        pagamento.MesCompetencia,
                        pagamento.Status,
                        pagamento.PagamentoBolsistaAlocacaoBolsistaId,
                        pagamento.AlocacaoBolsista
                    )
                )
            : [];
            return pagamentos;
        } catch (error) {
            log.error("Erro ao buscar quantidade de bolsas", error);
            throw error;
        }
    }
}