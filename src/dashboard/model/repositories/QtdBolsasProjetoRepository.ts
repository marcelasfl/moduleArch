import log from '@/logger';
import api from '@/services/api';
import type { IQtdBolsasProjeto } from '../QtdBolsasProjeto';
import QtdBolsasProjeto from '../QtdBolsasProjeto';
import QtdBolsasRoutes from './apiRoutes/QtdBolsasGeneric';
import type IQtdBolsasRepository from './IQtdBolsasProjetoRepository';

export default class QtdBolsasRepository implements IQtdBolsasRepository{
    apiClient;

    constructor() {
        this.apiClient = api;
    }

    createProjetoBaseRoute() {
        return new QtdBolsasRoutes("qtdmodalidadebolsaprojeto", {}).entity;
    }
    
    
    async fetchAllQtdBolsas(filter?: string): Promise<QtdBolsasProjeto[]> {
        try {
            const baseRoute = this.createProjetoBaseRoute();
            const response = await this.apiClient.get(baseRoute, {
                params: filter ? { filter } : {},
            });

            if (response.status === 200) {
                log.info("Busca realizada com sucesso");
            }
            const itens = response.data.value;
            let qtdBolsas = itens
                ? itens.map(
                    (qtdBolsas: IQtdBolsasProjeto) =>
                        new QtdBolsasProjeto(
                            qtdBolsas.id,
                            qtdBolsas.nome,
                            qtdBolsas.projetoEditalId,
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

    async fetchQtdBolsasById(id: string | number): Promise<QtdBolsasProjeto> {
        try {
            const baseRoute = `${this.createProjetoBaseRoute()}/${id}`;
            const response = await this.apiClient.get(baseRoute);

            if (response.status === 200) {
            }
            const qtdBolsas = response.data;
            return new QtdBolsasProjeto(
                qtdBolsas.id,
                qtdBolsas.nome,
                qtdBolsas.projetoEditalId,
                qtdBolsas.modalidades,
            );

        } catch (error) {
            log.error("Erro ao buscar quantidade de bolsas", error);
            return {} as QtdBolsasProjeto;
        }
    }

    async createQtdBolsas(data: IQtdBolsasProjeto): Promise<IQtdBolsasProjeto> {
        try {
            const baseRoute = this.createProjetoBaseRoute();
            const response = await this.apiClient.post(baseRoute, data);
            return response.data;
        } catch (error) {
            log.error("Erro ao cadastrar quantidade de bolsas", error);
            return {} as IQtdBolsasProjeto;
        }
    }

    async updateQtdBolsas(id: string | number, data: Partial<IQtdBolsasProjeto>): Promise<IQtdBolsasProjeto> {
        try {
            const baseRoute = `${this.createProjetoBaseRoute()}/${id}`;
            const response = await this.apiClient.put(baseRoute, data);
            return response.data;
        } catch (error) {
            log.error("Erro ao atualizar quantidade de bolsas", error);
            return {} as IQtdBolsasProjeto;
        }
    }

    async deleteQtdBolsas(id: string | number): Promise<boolean> {
        try {
            const baseRoute = `${this.createProjetoBaseRoute()}/${id}`;
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
                (qtdBolsas: IQtdBolsasProjeto) =>
                    new QtdBolsasProjeto(
                        qtdBolsas.id,
                        qtdBolsas.nome,
                        qtdBolsas.projetoEditalId,
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