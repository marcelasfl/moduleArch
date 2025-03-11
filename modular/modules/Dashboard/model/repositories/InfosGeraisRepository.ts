import log from '@/logger';
import api from '@/services/api';
import InfosGeraisAreaTecnica from '../InfosGeraisAreaTecnica';
import InfosGeraisProjeto from '../InfosGeraisProjeto';
import type { BaseConfig } from './apiRoutes/BaseConfig';
import type { IInfosGeraisAreaTecnica } from '../InfosGeraisAreaTecnica';
import type { IInfosGeraisProjeto } from '../InfosGeraisProjeto';
import InfosGeraisRoutes from './apiRoutes/InfosGerais';
import type IInfosGeraisRepository from './IInfosGeraisRepository';
import type { IInfosGeraisEdital } from '../InfosGeraisEdital';
import InfosGeraisEdital from '../InfosGeraisEdital';
// import type IInfosGeraisAreaTecnica  from './IInfosGeraisAreaTecnicaRepository';

export default class InfosGeraisRepository implements IInfosGeraisRepository{
    apiClient;

    constructor() {
        this.apiClient = api;
    }

    createBaseRoute() {
        return new InfosGeraisRoutes({}).entity;
    }
    
    createOdataCount() {
        return new InfosGeraisRoutes({}).count;
    }
    createPaginatedInfosGeraisAreaTecnica(config: BaseConfig) {
        return new InfosGeraisRoutes(config).entity;
    }

    getAreaTecnica() {
        return new InfosGeraisRoutes({}).areatecnica;
    }

    getEdital() {
        return new InfosGeraisRoutes({}).edital;
    }

    getProjeto() {
        return new InfosGeraisRoutes({}).projeto;
    }

    async fetchAllInfosGeraisAreaTecnica(filter?: string): Promise<InfosGeraisAreaTecnica[]> {
        try {
            const baseRoute = this.createBaseRoute()+this.getAreaTecnica();
            let response = await this.apiClient.get(baseRoute, {
                params: filter ? { filter } : {},
            });

            if (response.status === 200) {
                log.info("Busca realizada com sucesso");
            }
            const itens = response.data.value;
            let infosGerais = itens
                ? itens.map(
                    (infosGerais: IInfosGeraisAreaTecnica) =>
                      new InfosGeraisAreaTecnica(
                        infosGerais.Id,
                        infosGerais.qtdEditais,
                        infosGerais.qtdProjetos,
                        infosGerais.qtdBolsistasAtivos,
                        infosGerais.qtdBolsistasSuspensos
                      )
                  )
                : [];
            log.info(JSON.stringify(infosGerais));
            return infosGerais;
        } catch (error) {
            log.error("Erro ao buscar areas tecnicas", error);
            return [];
        }
    }

    async fetchInfosGeraisAreaTecnicaById(id: string | number): Promise<InfosGeraisAreaTecnica> {
        try {
            const baseRoute = `${this.createBaseRoute()}${this.getAreaTecnica()}/${id}`;
            const response = await this.apiClient.get(baseRoute);

            if (response.status === 200 && response.data) {
                const infosGerais = response.data;
                return new InfosGeraisAreaTecnica(
                    infosGerais.Id,
                    infosGerais.qtdEditais,
                    infosGerais.qtdProjetos,
                    infosGerais.qtdBolsistasAtivos,
                    infosGerais.qtdBolsistasSuspensos
                );
            } else {
                throw new Error(`Informações de Area Tecnica com ID ${id} não encontrada.`)
            }
        } catch (error) {
            log.error("Erro ao buscar area tecnica por ID:", error);
            throw new Error(`Erro ao buscar area tecnica com ID ${id}: ${error}`)
        }
    }

    async fetchAllInfosGeraisEdital(filter?: string): Promise<InfosGeraisEdital[]> {
        try {
            const baseRoute = this.createBaseRoute() + this.getEdital();
            let response = await this.apiClient.get(baseRoute, {
                params: filter ? { filter } : {},
            });

            if (response.status === 200) {
                log.info("Busca realizada com sucesso");
            }
            const itens = response.data.value;
            let infosGerais = itens
                ? itens.map(
                    (infosGerais: IInfosGeraisEdital) =>
                      new InfosGeraisEdital(
                        infosGerais.Id,
                        infosGerais.qtdProjetos,
                        infosGerais.qtdBolsistasAtivos,
                        infosGerais.qtdBolsistasSuspensos
                      )
                  )
                : [];
            log.info(JSON.stringify(infosGerais));
            return infosGerais;
        } catch (error) {
            log.error("Erro ao buscar editais", error);
            return [];
        }
    }

    async fetchInfosGeraisEditalById(id: string | number): Promise<InfosGeraisEdital> {
        try {
            const baseRoute = `${this.createBaseRoute()}${this.getEdital()}/${id}`;
            const response = await this.apiClient.get(baseRoute);

            if (response.status === 200 && response.data) {
                const infosGerais = response.data;
                return new InfosGeraisEdital(
                    infosGerais.Id,
                    infosGerais.qtdProjetos,
                    infosGerais.qtdBolsistasAtivos,
                    infosGerais.qtdBolsistasSuspensos,
                );
            } else {
                throw new Error(`Informações de Edital com ID ${id} não encontrada.`)
            }
        } catch (error) {
            log.error("Erro ao buscar edtial por ID:", error);
            throw new Error(`Erro ao buscar edtial com ID ${id}: ${error}`)
        }
    }

    async fetchAllInfosGeraisProjeto(filter?: string) {
        try {
            const baseRoute = this.createBaseRoute() + this.getProjeto();
            let response = await this.apiClient.get(baseRoute, {
                params: filter ? { filter } : {},
            });

            if (response.status === 200) {
                log.info("Busca realizada com sucesso");
            }
            const itens = response.data.value;
            let infosGerais = itens
                ? itens.map(
                    (infosGerais: IInfosGeraisProjeto) =>
                      new InfosGeraisProjeto(
                        infosGerais.Id,
                        infosGerais.qtdBolsistasAtivos,
                        infosGerais.qtdBolsistasSuspensos,
                        infosGerais.qtdBolsistasDocumentacaoPendente,
                        infosGerais.qtdBolsistasPendentesAvaliacao
                      )
                  )
                : [];
            log.info(JSON.stringify(infosGerais));
            return infosGerais;
        } catch (error) {
            log.error("Erro ao buscar projetos", error);
            return [];
        }
    }

    async fetchInfosGeraisProjetoById(id: string | number): Promise<InfosGeraisProjeto> {
        try {
            const baseRoute = `${this.createBaseRoute()}${this.getProjeto()}/${id}`;
            const response = await this.apiClient.get(baseRoute);

            if (response.status === 200 && response.data) {
                const infosGerais = response.data;
                return new InfosGeraisProjeto(
                    infosGerais.Id,
                    infosGerais.qtdBolsistasAtivos,
                    infosGerais.qtdBolsistasSuspensos,
                    infosGerais.qtdBolsistasDocumentacaoPendente,
                    infosGerais.qtdBolsistasPendentesAvaliacao
                );
            } else {
                throw new Error(`Informações de Projeto com ID ${id} não encontrada.`)
            }
        } catch (error) {
            log.error("Erro ao buscar projeto por ID:", error);
            throw new Error(`Erro ao buscar projeto com ID ${id}: ${error}`)
        }
    }

    async filterInfosGeraisAreaTecnica(route: string){
        try {
          const response = await this.apiClient.get(route);
          const itens = response.data.value;
          let infosGerais = itens
            ? itens.map(
                (infosGerais: IInfosGeraisAreaTecnica) =>
                  new InfosGeraisAreaTecnica(
                    infosGerais.Id,
                    infosGerais.qtdEditais,
                    infosGerais.qtdProjetos,
                    infosGerais.qtdBolsistasAtivos,
                    infosGerais.qtdBolsistasSuspensos
                  )
              )
            : [];
          return infosGerais;
        } catch (error) {
          log.error("Erro ao buscar areas tecnicas", error);
          throw error;
        }
      }
    
    async fetchPaginatedInfosGeraisAreaTecnica(config: BaseConfig, filter?: string) {
        try {
            const baseRoute = this.createPaginatedInfosGeraisAreaTecnica(config);
            const response = await this.apiClient.get(baseRoute, {
                params: filter ? { filter } : {},
            });
            const itens = response.data.value;
            let infosGerais = itens
                ? itens.map(
                    (infosGerais: IInfosGeraisAreaTecnica) =>
                      new InfosGeraisAreaTecnica(
                        infosGerais.Id,
                        infosGerais.qtdEditais,
                        infosGerais.qtdProjetos,
                        infosGerais.qtdBolsistasAtivos,
                        infosGerais.qtdBolsistasSuspensos
                      )
                  )
                : [];
            return infosGerais;
        } catch (error) {
            log.error("Erro ao buscar areas tecnicas", error);
            throw error;
        }
    }

    async countInfosGeraisAreaTecnica() {
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