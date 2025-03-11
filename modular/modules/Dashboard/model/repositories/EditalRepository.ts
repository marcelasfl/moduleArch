import log from '@/logger';
import api from '@/services/api';
import type { IEdital } from '../Edital';
import Edital from '../Edital';
// import type IProjetoRepository from './IProjetoRepository';
import EditalRoutes from './apiRoutes/Edital';
import type IEditalRepository from './IEditalRepository';

export default class EditalRepository implements IEditalRepository{
    apiClient;

    constructor() {
        this.apiClient = api;
    }


    createBaseRoute() {
        return new EditalRoutes({}).entity
    }
    
    createAlocacoesInEditalRoute() {
        return new EditalRoutes({}).edital;
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
                          edital.EditalAreaTecnicaId,
                          edital.AreaTecnica,
                          edital.DataCriacao,
                          edital.Status
                                               
                        )
                  )
                : [];
            
            return editais;
        } catch (error) {
            log.error("Erro ao buscar editais mensais", error);
            return [];
        }
    }

    async fetchEditalById(id: string | number): Promise<Edital> {
        try {
            const baseRoute = `${this.createBaseRoute()}/${id}`;
            const response = await this.apiClient.get(baseRoute);

            if (response.status === 200 && response.data) {
                const edital = response.data.value[0];
                return new Edital(
                    edital.Id,
                    edital.Nome,
                    edital.EditalAreaTecnicaId,
                    edital.AreaTecnica,
                    edital.DataCriacao,
                    edital.Status
                    
                );
            } else {
                throw new Error(`Edital com ID ${id} não encontrado.`)
            }
        } catch (error) {
            log.error("Erro ao buscar edital por ID:", error);
            throw new Error(`Erro ao buscar edital com ID ${id}: ${error}`)
        }
    }

    async fetchAlocacoesInEdital(filter?: string) : Promise<Edital[]> {
        try {
            const baseRoute = `${this.createBaseRoute()}${this.createAlocacoesInEditalRoute()}`;
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
                            edital.EditalAreaTecnicaId,
                            edital.AreaTecnica,
                            edital.DataCriacao,
                            edital.Status,
                            edital.Projetos                  
                        )
                  )
                : [];
            
            return editais;
        } catch (error) {
            log.error("Erro ao buscar editais mensais", error);
            return [];
        }
    }
    async fetchAlocacoesInEditalById(id: string | number): Promise<Edital> {
        try {
            const baseRoute = `${this.createBaseRoute()}/${id}/${this.createAlocacoesInEditalRoute()}`;
            const response = await this.apiClient.get(baseRoute);

            if (response.status === 200 && response.data) {
                const edital = response.data.value[0];
                return new Edital(
                    edital.Id,
                    edital.Nome,
                    edital.EditalAreaTecnicaId,
                    edital.AreaTecnica,
                    edital.DataCriacao,
                    edital.Status,
                    edital.Projetos
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
                    edital.EditalAreaTecnicaId,
                    edital.AreaTecnica,
                    edital.DataCriacao,
                    edital.Status
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