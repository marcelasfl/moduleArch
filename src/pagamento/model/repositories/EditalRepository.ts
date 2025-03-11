import log from '@/logger';
import api from '@/services/api';
import type { IEdital } from '../../model/Edital';
import Edital from '../../model/Edital';
// import type IProjetoRepository from './IProjetoRepository';
import EditalRoutes from './apiRoutes/Edital';

export default class EditalRepository{
    apiClient;

    constructor() {
        this.apiClient = api;
    }


    createBaseRoute() {
        return new EditalRoutes({}).entity
    }

    createExpandRoute(id: string){
        return new EditalRoutes({id: id}).expandById
    }
    
    async fetchAllEdital(filter?: string) {
        try {
            const baseRoute = this.createBaseRoute();
            const response = await this.apiClient.get(baseRoute, {
                params: filter ? { filter } : {},
            });

            if (response.status === 200) {
                
            }
            const itens = response.data.value;
            let editais = itens
                ? itens.map(
                    (edital: IEdital) =>
                      new Edital(
                        edital.Id,
                        edital.Nome,
                        edital.DataCriacao,
                        edital.AreaTecnica,
                        edital.EditalAreaTecnicaId,
                        edital.IdSigfapes,
                        edital.Status,
                        edital.StatusImportacao,
                        edital.InscricaoGenerica,
                        edital.Processo,
                        edital.Atividade,
                        edital.EditalAtividadeId,
                        edital.Projetos,
                        edital.AlocacaoBolsistas
                                            
                        )
                  )
                : [];

            return editais;
        } catch (error) {
            log.error("Erro ao buscar editais mensais", error);
            return [];
        }
    }

    async fetchEditalById(id: string): Promise<Edital> {
        try {
            const baseRoute = this.createExpandRoute(id)
            const response = await this.apiClient.get(baseRoute);

            if (response.status === 200 && response.data) {
                const edital = response.data.value[0];
                return new Edital(
                    edital.Id,
                    edital.Nome,
                    edital.DataCriacao,
                    edital.AreaTecnica,
                    edital.EditalAreaTecnicaId,
                    edital.IdSigfapes,
                    edital.Status,
                    edital.StatusImportacao,
                    edital.InscricaoGenerica,
                    edital.Processo,
                    edital.Atividade,
                    edital.EditalAtividadeId,
                    edital.Projetos,
                    edital.AlocacaoBolsistas
                    
                );
            } else {
                throw new Error(`Edital com ID ${id} não encontrado.`)
            }
        } catch (error) {
            log.error("Erro ao buscar edital por ID:", error);
            throw new Error(`Erro ao buscar edital com ID ${id}: ${error}`)
        }
    }

    async createEdital(data: IEdital) {
        try {
            const baseRoute = this.createBaseRoute();
            const response = await this.apiClient.post(baseRoute, data);
            return response.data;
        } catch (error) {
            log.error("Erro ao criar edital", error);
            throw error;
        }
    }

    async updateEdital(id: string | number, data: Partial<IEdital>) {
        try {
            const baseRoute = `${this.createBaseRoute()}/${id}`;
            const response = await this.apiClient.put(baseRoute, data);
            return response.data;
            
        } catch (error) {
            log.error("Erro ao atualizar edital", error);
        }
    }

    async deleteEdital(id: string | number) {
        try {
            const baseRoute = `${this.createBaseRoute()}/${id}`;
            const response = await this.apiClient.delete(baseRoute);
            return response.status === 200;
        } catch (error) {
            log.error("Erro ao deletar edital", error);
            throw error;
        }
    }

    async filterEdital(route: string){
        try {
          const response = await this.apiClient.get(route);
          const itens = response.data.value;
          let editais = itens
            ? itens.map(
                (edital: IEdital) => 
                  new Edital(
                    edital.Id,
                    edital.Nome,
                    edital.DataCriacao,
                    edital.AreaTecnica,
                    edital.EditalAreaTecnicaId,
                    edital.IdSigfapes,
                    edital.Status,
                    edital.StatusImportacao,
                    edital.InscricaoGenerica,
                    edital.Processo,
                    edital.Atividade,
                    edital.EditalAtividadeId,
                    edital.Projetos,
                    edital.AlocacaoBolsistas
                  )
              )
            : [];
          return editais;
        } catch (error) {
          log.error("Erro ao buscar editais", error);
          throw error;
        }
      }
}