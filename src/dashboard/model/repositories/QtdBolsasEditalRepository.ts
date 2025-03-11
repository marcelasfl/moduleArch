import log from '@/logger';
import api from '@/services/api';
import type { IQtdBolsasEdital } from '../QtdBolsasEdital';
import QtdBolsasEdital from '../QtdBolsasEdital';
import QtdBolsasRoutes from './apiRoutes/QtdBolsasGeneric';
import type IQtdBolsasRepository from './IQtdBolsasEditalRepository';

export default class QtdBolsasRepository implements IQtdBolsasRepository{
    apiClient;

    constructor() {
        this.apiClient = api;
    }

    createEditalBaseRoute() {
        return new QtdBolsasRoutes("qtdmodalidadebolsaedital", {}).entity;
    }
    
    
    async fetchAllQtdBolsas(filter?: string): Promise<QtdBolsasEdital[]> {
        try {
            const baseRoute = this.createEditalBaseRoute();
            const response = await this.apiClient.get(baseRoute, {
                params: filter ? { filter } : {},
            });

            if (response.status === 200) {
                log.info("Busca realizada com sucesso");
            }
            const itens = response.data.value;
            let qtdBolsas = itens
                ? itens.map(
                    (qtdBolsas: IQtdBolsasEdital) =>
                        new QtdBolsasEdital(
                            qtdBolsas.id,
                            qtdBolsas.nome,
                            qtdBolsas.editalAreaTecnicaId,
                            qtdBolsas.modalidades,
                        )
                    )
                : [];
            
            return qtdBolsas;
        } catch (error) {
            log.error("Erro ao buscar quantidade de bolsas", error);
            return [];
        }
    }

    async fetchQtdBolsasById(id: string | number): Promise<QtdBolsasEdital> {
        try {
            const baseRoute = `${this.createEditalBaseRoute()}/${id}`;
            const response = await this.apiClient.get(baseRoute);

            if (response.status === 200) {
                const qtdBolsas = response.data;
                return new QtdBolsasEdital(
                    qtdBolsas.id,
                    qtdBolsas.nome,
                    qtdBolsas.editalAreaTecnicaId,
                    qtdBolsas.modalidades,
                );
            }
            return {} as QtdBolsasEdital;
        } catch (error) {
            log.error("Erro ao buscar quantidade de bolsas", error);
            return {} as QtdBolsasEdital;
        }
    }


    async createQtdBolsas(data: IQtdBolsasEdital): Promise<IQtdBolsasEdital> {
        try {
            const baseRoute = this.createEditalBaseRoute();
            const response = await this.apiClient.post(baseRoute, data);
            return response.data;
        } catch (error) {
            log.error("Erro ao cadastrar quantidade de bolsas", error);
            return {} as IQtdBolsasEdital;
        }
    }

    async updateQtdBolsas(id: string | number, data: Partial<IQtdBolsasEdital>): Promise<IQtdBolsasEdital> {
        try {
            const baseRoute = `${this.createEditalBaseRoute()}/${id}`;
            const response = await this.apiClient.put(baseRoute, data);
            return response.data;
        } catch (error) {
            log.error("Erro ao atualizar quantidade de bolsas", error);
            return {} as IQtdBolsasEdital;
        }
    }

    async deleteQtdBolsas(id: string | number): Promise<boolean> {
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
            let qtds = itens
            ? itens.map(
                (qtdBolsas: IQtdBolsasEdital) =>
                    new QtdBolsasEdital(
                        qtdBolsas.id,
                        qtdBolsas.nome,
                        qtdBolsas.editalAreaTecnicaId,
                        qtdBolsas.modalidades,
                    )
                )
            : [];
            return qtds;
        } catch (error) {
            log.error("Erro ao buscar quantidade de bolsas", error);
            throw error;
        }
    }
}