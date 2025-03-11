import log from '@/logger';
import api from '@/services/api';
import type { IBolsistaTempo } from '../BolsistaPorTempo';
import BolsistaTempo from '../BolsistaPorTempo';
import BolsistaPorTempoRoutes from './apiRoutes/BolsistaPorTempo';
import type IBolsistaPorTempoRepository from './IBolsistaPorTempoRepository';

export default class BolsistaPorTempoRepository implements IBolsistaPorTempoRepository{
    apiClient;

    constructor() {
        this.apiClient = api;
    }

    createEditalBaseRoute() {
        return new BolsistaPorTempoRoutes({}).entity;
    }
    
    count() {
        return new BolsistaPorTempoRoutes({}).count;
    }
    
    async fetchAllBolsistaTempo(filter?: string): Promise<BolsistaTempo[]> {
        try {
            const baseRoute = this.createEditalBaseRoute();
            const response = await this.apiClient.get(baseRoute, {
                params: filter ? { filter } : {},
            });
            if (response.status === 200) {
                log.info("Busca realizada com sucesso");
            }
            const bolsistas = response.data
                ? response.data.map(
                    (bolsistas: IBolsistaTempo) =>
                        new BolsistaTempo(
                            bolsistas.id,
                            bolsistas.projetoId,
                            bolsistas.mesReferencia,
                            bolsistas.qtdAtivos,
                            bolsistas.qtdSairam,
                            bolsistas.qtdEntraram
                        )
                    )
                : [];
            
            return bolsistas;
        } catch (error) {
            log.error("Erro ao buscar quantidade de bolsas", error);
            return [];
        }
    }

    async fetchBolsistaTempoById(id: string | number): Promise<BolsistaTempo> {
        try {
            const baseRoute = `${this.createEditalBaseRoute()}/${id}`;
            const response = await this.apiClient.get(baseRoute);

            if (response.status === 200) {
                const bolsistas = response.data;
                return new BolsistaTempo(
                    bolsistas.id,
                    bolsistas.projetoId,
                    bolsistas.mesReferencia,
                    bolsistas.qtdAtivos,
                    bolsistas.qtdSairam,
                    bolsistas.qtdEntraram
                );
            }
            return {} as BolsistaTempo;
        } catch (error) {
            log.error("Erro ao buscar quantidade de bolsas", error);
            return {} as BolsistaTempo;
        }
    }


    async createBolsistaTempo(data: IBolsistaTempo): Promise<IBolsistaTempo> {
        try {
            const baseRoute = this.createEditalBaseRoute();
            const response = await this.apiClient.post(baseRoute, data);
            return response.data;
        } catch (error) {
            log.error("Erro ao cadastrar quantidade de bolsas", error);
            return {} as IBolsistaTempo;
        }
    }

    async updateBolsistaTempo(id: string | number, data: Partial<IBolsistaTempo>): Promise<IBolsistaTempo> {
        try {
            const baseRoute = `${this.createEditalBaseRoute()}/${id}`;
            const response = await this.apiClient.put(baseRoute, data);
            return response.data;
        } catch (error) {
            log.error("Erro ao atualizar quantidade de bolsas", error);
            return {} as IBolsistaTempo;
        }
    }

    async deleteBolsistaTempo(id: string | number): Promise<boolean> {
        try {
            const baseRoute = `${this.createEditalBaseRoute()}/${id}`;
            const response = await this.apiClient.delete(baseRoute);
            return response.status === 200;
        } catch (error) {
            log.error("Erro ao deletar quantidade de bolsas", error);
            return false;
        }
    }

    async filter(route: string){
        try {
            const response = await this.apiClient.get(route);
            const itens = response.data.value;
            let bolsas = itens
            ? itens.map(
                (bolsistas: IBolsistaTempo) =>
                    new BolsistaTempo(
                        bolsistas.id,
                        bolsistas.projetoId,
                        bolsistas.mesReferencia,
                        bolsistas.qtdAtivos,
                        bolsistas.qtdSairam,
                        bolsistas.qtdEntraram
                    )
                )
            : [];
            return bolsas;
        } catch (error) {
            log.error("Erro ao buscar quantidade de bolsas", error);
            throw error;
        }
    }
}