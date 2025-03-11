import log from '@/logger';
import api from '@/services/api';
import type { IAreaTecnica } from '../AreaTecnica';
import AreaTecnica from '../AreaTecnica';
import AreaTecnicaRoutes from './apiRoutes/AreaTecnica';
import type { BaseConfig } from './apiRoutes/BaseConfig';

export default class AreaTecnicaRepository {
    apiClient;

    constructor() {
        this.apiClient = api;
    }

    createBaseRoute() {
        return new AreaTecnicaRoutes({}).entity;
    }
    
    createOdataCount() {
        return new AreaTecnicaRoutes({}).count;
    }
    createPaginatedAreaTecnica(config: BaseConfig) {
        return new AreaTecnicaRoutes(config).entity;
    }

    async fetchAllAreaTecnica(filter?: string) {
        try {
            const baseRoute = this.createBaseRoute();
            const response = await this.apiClient.get(baseRoute, {
                params: filter ? { filter } : {},
            });

            if (response.status === 200) {
                log.info("Busca realizada com sucesso");
            }
            const itens = response.data.value;
            let areaTecnica = itens
                ? itens.map(
                    (areaTecnica: IAreaTecnica) =>
                      new AreaTecnica(
                            areaTecnica.Id,
                            areaTecnica.Nome,
                            areaTecnica.Descricao,
                            areaTecnica.Editais,
                            areaTecnica.AreaTecnicaEditalId
                      )
                  )
                : [];
            log.info(JSON.stringify(areaTecnica));
            return areaTecnica;
        } catch (error) {
            log.error("Erro ao buscar areas tecnicas", error);
            return [];
        }
    }

    async fetchAreaTecnicaById(id: string | number): Promise<AreaTecnica> {
        try {
            const baseRoute = `${this.createBaseRoute()}/${id}`;
            const response = await this.apiClient.get(baseRoute);

            if (response.status === 200 && response.data) {
                const areaTecnica = response.data.value[0];
                return new AreaTecnica(
                    areaTecnica.Id,
                    areaTecnica.Nome,
                    areaTecnica.Descricao,
                    undefined,
                    areaTecnica.AreaTecnicaEditalId
                );
            } else {
                throw new Error(`Area Tecnica com ID ${id} não encontrada.`)
            }
        } catch (error) {
            log.error("Erro ao buscar area tecnica por ID:", error);
            throw new Error(`Erro ao buscar area tecnica com ID ${id}: ${error}`)
        }
    }

    async createAreaTecnica(data: IAreaTecnica) {
        try {
            const baseRoute = this.createBaseRoute();
            const response = await this.apiClient.post(baseRoute, data);
            return response.data;
        } catch (error) {
            log.error("Erro ao criar area tecnica", error);
            throw error;
        }
    }

    async updateAreaTecnica(id: string | number, data: Partial<IAreaTecnica>) {
        try {
            const baseRoute = `${this.createBaseRoute()}/${id}`;
            const response = await this.apiClient.put(baseRoute, data);
            return response.data;
        } catch (error) {
            log.error("Erro ao atualizar area tecnica", error);
        }
    }

    async deleteAreaTecnica(id: string | number) {
        try {
            const baseRoute = `${this.createBaseRoute()}/${id}`;
            const response = await this.apiClient.delete(baseRoute);
            return response.status === 200;
        } catch (error) {
            log.error("Erro ao deletar area tecnica", error);
            throw error;
        }
    }

    async filterAreaTecnica(route: string){
        try {
          const response = await this.apiClient.get(route);
          const itens = response.data.value;
          let areaTecnica = itens
            ? itens.map(
                (areaTecnica: IAreaTecnica) =>
                  new AreaTecnica(
                    areaTecnica.Id,
                    areaTecnica.Nome,
                    areaTecnica.Descricao,
                    areaTecnica.Editais,
                    areaTecnica.AreaTecnicaEditalId
                  )
              )
            : [];
          return areaTecnica;
        } catch (error) {
          log.error("Erro ao buscar areas tecnicas", error);
          throw error;
        }
      }
    
    async fetchPaginatedAreaTecnica(config: BaseConfig, filter?: string) {
        try {
            const baseRoute = this.createPaginatedAreaTecnica(config);
            const response = await this.apiClient.get(baseRoute, {
                params: filter ? { filter } : {},
            });
            const itens = response.data.value;
            let areaTecnica = itens
                ? itens.map(
                    (areaTecnica: IAreaTecnica) =>
                      new AreaTecnica(
                            areaTecnica.Id,
                            areaTecnica.Nome,
                            areaTecnica.Descricao,
                            areaTecnica.Editais,
                            areaTecnica.AreaTecnicaEditalId
                      )
                  )
                : [];
            return areaTecnica;
        } catch (error) {
            log.error("Erro ao buscar areas tecnicas", error);
            throw error;
        }
    }

    async countAreaTecnica() {
        try {
            const baseRoute = this.createOdataCount();
            const response = await this.apiClient.get(baseRoute);
            return response.data['@odata.count'];
        } catch (error) {
            log.error("Erro ao buscar areas tecnicas", error);
            throw error;
        }
    }
}