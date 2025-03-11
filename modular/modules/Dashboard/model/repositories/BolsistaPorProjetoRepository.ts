import log from '@/logger';
import api from '@/services/api';
import type { IBolsistaProjeto } from '../BolsistaPorProjeto';
import BolsistaProjeto from '../BolsistaPorProjeto';
import BolsistaPorProjetoRoutes from './apiRoutes/BolsistaPorProjeto';
import type IBolsistaPorProjetoRepository from './IBolsistaPorProjetoRepository';

export default class BolsistaPorProjetoRepository implements IBolsistaPorProjetoRepository{
    apiClient;


    constructor() {
        this.apiClient = api;
    }

    createEditalBaseRoute() {
        return new BolsistaPorProjetoRoutes({}).entity;
    }
    
    count() {
        return new BolsistaPorProjetoRoutes({}).count;
    }
    
    async fetchAllBolsistaProjeto(filter?: string): Promise<{ bolsistas: BolsistaProjeto[]; odata: any }> {
        try {
            const baseRoute = this.createEditalBaseRoute() + this.count();
            const response = await this.apiClient.get(baseRoute, {
                params: filter ? { filter } : {},
            });
            if (response.status === 200) {
                log.info("Busca realizada com sucesso");
            }
            const itens = response.data;
            let bolsistas = itens
                ? itens.map(
                    (bolsistas: IBolsistaProjeto) =>
                        new BolsistaProjeto(
                            bolsistas.id,
                            bolsistas.nome,
                            bolsistas.status,
                            bolsistas.siglaBolsa,
                            bolsistas.cotasPagas,
                            bolsistas.cotasAPagar,
                            bolsistas.valorBolsa,
                            bolsistas.valorAPagar,
                            bolsistas.alocacaoBolsistaProjetoId,
                            bolsistas.alocacaoBolsistaPessoaId,
                            bolsistas.coordenadorAtual
                        )
                    )
                : [];
            
            // return { bolsistas: bolsistas, odata: response.data['@odata.count'] };
            return { bolsistas: bolsistas, odata: null };
        } catch (error) {
            log.error("Erro ao buscar quantidade de bolsas", error);
            return { bolsistas: [], odata: null };
        }
    }

    async fetchBolsistaProjetoById(id: string | number): Promise<BolsistaProjeto> {
        try {
            const baseRoute = `${this.createEditalBaseRoute()}/${id}`;
            const response = await this.apiClient.get(baseRoute);

            if (response.status === 200) {
                const bolsistas = response.data;
                return new BolsistaProjeto(
                    bolsistas.id,
                    bolsistas.nome,
                    bolsistas.status,
                    bolsistas.siglaBolsa,
                    bolsistas.cotasPagas,
                    bolsistas.cotasAPagar,
                    bolsistas.valorBolsa,
                    bolsistas.valorAPagar,
                    bolsistas.alocacaoBolsistaProjetoId,
                    bolsistas.alocacaoBolsistaPessoaId,
                    bolsistas.coordenadorAtual
                );
            }
            return {} as BolsistaProjeto;
        } catch (error) {
            log.error("Erro ao buscar quantidade de bolsas", error);
            return {} as BolsistaProjeto;
        }
    }


    async createBolsistaProjeto(data: IBolsistaProjeto): Promise<IBolsistaProjeto> {
        try {
            const baseRoute = this.createEditalBaseRoute();
            const response = await this.apiClient.post(baseRoute, data);
            return response.data;
        } catch (error) {
            log.error("Erro ao cadastrar quantidade de bolsas", error);
            return {} as IBolsistaProjeto;
        }
    }

    async updateBolsistaProjeto(id: string | number, data: Partial<IBolsistaProjeto>): Promise<IBolsistaProjeto> {
        try {
            const baseRoute = `${this.createEditalBaseRoute()}/${id}`;
            const response = await this.apiClient.put(baseRoute, data);
            return response.data;
        } catch (error) {
            log.error("Erro ao atualizar quantidade de bolsas", error);
            return {} as IBolsistaProjeto;
        }
    }

    async deleteBolsistaProjeto(id: string | number): Promise<boolean> {
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
            const itens = response.data;
            let bolsas = itens
            ? itens.map(
                (bolsistas: IBolsistaProjeto) =>
                    new BolsistaProjeto(
                        bolsistas.id,
                        bolsistas.nome,
                        bolsistas.status,
                        bolsistas.siglaBolsa,
                        bolsistas.cotasPagas,
                        bolsistas.cotasAPagar,
                        bolsistas.valorBolsa,
                        bolsistas.valorAPagar,
                        bolsistas.alocacaoBolsistaProjetoId,
                        bolsistas.alocacaoBolsistaPessoaId,
                        bolsistas.coordenadorAtual
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