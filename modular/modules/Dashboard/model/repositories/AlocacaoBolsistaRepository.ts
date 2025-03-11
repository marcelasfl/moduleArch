import log from '@/logger';
import api from '@/services/api';
import type { IAlocacaoBolsista } from '../../../pagamento/model/AlocacaoBolsista';
import AlocacaoBolsista from '../../../pagamento/model/AlocacaoBolsista';
import AlocacaoBolsistaRoutes from './apiRoutes/AlocacaoBolsista';
import type { BaseConfig } from './apiRoutes/BaseConfig';
import type IAlocacaoBolsistaRepository from './IAlocacaoRepository';

export default class AlocacaoBolsistaRepository implements IAlocacaoBolsistaRepository{
    apiClient;

    constructor() {
        this.apiClient = api;
    }

    createBaseRoute() {
        return new AlocacaoBolsistaRoutes({}).entity;
    }
    
    createAlocacoes() {
        return new AlocacaoBolsistaRoutes({}).alocacoesPagamentoBolsista;
    }

    createPaginatedAlocacaoBolsista(config: BaseConfig) {
        return new AlocacaoBolsistaRoutes(config).alocacoesPagamentoBolsista;
    }

    createOdataCount() {
        return new AlocacaoBolsistaRoutes({}).count;
    }

    createPessoaAlocada(){
        return new AlocacaoBolsistaRoutes({}).pessoaAlocada;
    }

    async fetchAllAlocacaoBolsista(filter?: string): Promise<{ alocacoes: AlocacaoBolsista[]; odata: any }> {
        try {
            const baseRoute = this.createAlocacoes();
            const response = await this.apiClient.get(baseRoute, {
                params: filter ? { filter } : {},
            });

            if (response.status === 200) {
                
            }
            const itens = response.data.value;
            let alocacaoes = itens
                ? itens.map(
                    (alocacaoBolsista: IAlocacaoBolsista) =>
                      new AlocacaoBolsista(
                          alocacaoBolsista.Id,
                          alocacaoBolsista.InicioAtividade,
                          alocacaoBolsista.DataPrevistaFimAtividade,
                          alocacaoBolsista.QtdeCotasAlocadas,
                          alocacaoBolsista.QtdeCotasPagasPreImportacao,
                          alocacaoBolsista.Status,
                          alocacaoBolsista.Projeto,
                          alocacaoBolsista.VersaoNivel,
                          alocacaoBolsista.Pessoa
                      )
                  )
                : [];
            
            return { alocacoes: alocacaoes, odata: response.data['@odata.count'] };
        } catch (error) {
            log.error("Erro ao buscar alocações de bolsistas", error);
            return { alocacoes: [], odata: null };
        }
    }

    async fetchAllPessoaAlocada(filter?: string): Promise<AlocacaoBolsista[]> {
        try {
            const baseRoute = this.createPessoaAlocada();
            const response = await this.apiClient.get(baseRoute, {
                params: filter ? { filter } : {},
            });

            if (response.status === 200) {
                
            }
            const itens = response.data.value;
            let alocacaoes = itens
                ? itens.map(
                    (alocacaoBolsista: IAlocacaoBolsista) =>
                      new AlocacaoBolsista(
                          alocacaoBolsista.Id,
                          undefined,
                          undefined,
                          undefined,
                          undefined,
                          undefined,
                          undefined,
                          alocacaoBolsista.VersaoNivel,
                          alocacaoBolsista.Pessoa
                      )
                  )
                : [];
            
            return alocacaoes;
        } catch (error) {
            log.error("Erro ao buscar alocações de bolsistas", error);
            return [];
        }
    }

    async fetchAlocacaoBolsistaById(id: string | number): Promise<AlocacaoBolsista> {
        try {
            const baseRoute = `${this.createBaseRoute()}/${id}`;
            const response = await this.apiClient.get(baseRoute);

            if (response.status === 200 && response.data) {
                const alocacaoBolsista = response.data;
                return new AlocacaoBolsista(
                    alocacaoBolsista.Id,
                    alocacaoBolsista.InicioAtividade,
                    alocacaoBolsista.DataPrevistaFimAtividade,
                    alocacaoBolsista.QtdeCotasAlocadas,
                    alocacaoBolsista.QtdeCotasPagasPreImportacao,
                    alocacaoBolsista.Status,
                    alocacaoBolsista.Projeto,
                    alocacaoBolsista.VersaoNivel,
                    alocacaoBolsista.Pessoa
                );
            } else {
                throw new Error(`Alocação Bolsista com ID ${id} não encontrada.`)
            }
        } catch (error) {
            log.error("Erro ao buscar alocação bolsista por ID:", error);
            throw new Error(`Erro ao buscar Alocação Bolsista com ID ${id}: ${error}`)
        }
    }

    async createAlocacaoBolsista(data: IAlocacaoBolsista) {
        try {
            const baseRoute = this.createBaseRoute();
            const response = await this.apiClient.post(baseRoute, data);
            return response.data;
        } catch (error) {
            log.error("Erro ao criar alocação do bolsista", error);
            throw error;
        }
    }

    async updateAlocacaoBolsista(id: string | number, data: Partial<IAlocacaoBolsista>) {
        try {
            const baseRoute = `${this.createBaseRoute()}/${id}`;
            const response = await this.apiClient.put(baseRoute, data);
            return response.data;
        } catch (error) {
            log.error("Erro ao atualizar alocação do bolsista", error);
        }
    }

    async deleteAlocacaoBolsista(id: string | number) {
        try {
            const baseRoute = `${this.createBaseRoute()}/${id}`;
            const response = await this.apiClient.delete(baseRoute);
            return response.status === 200;
        } catch (error) {
            log.error("Erro ao deletar alocação do bolsista", error);
            throw error;
        }
    }

    async filterAlocacaoBolsista(route: string){
        try {
          const response = await this.apiClient.get(route);
          const itens = response.data.value;
          let alocacoes = itens
            ? itens.map(
                (alocacaoBolsista: IAlocacaoBolsista) =>
                  new AlocacaoBolsista(
                    alocacaoBolsista.Id,
                    alocacaoBolsista.InicioAtividade,
                    alocacaoBolsista.DataPrevistaFimAtividade,
                    alocacaoBolsista.QtdeCotasAlocadas,
                    alocacaoBolsista.QtdeCotasPagasPreImportacao,
                    alocacaoBolsista.Status,
                    alocacaoBolsista.Projeto,
                    alocacaoBolsista.VersaoNivel,
                    alocacaoBolsista.Pessoa
                  )
              )
            : [];
          return alocacoes;
        } catch (error) {
          log.error("Erro ao buscar alocações de bolsistas", error);
          throw error;
        }
      }
    
    async fetchPaginatedAlocacaoBolsista(config: BaseConfig, filter?: string) {
        try {
            const baseRoute = this.createPaginatedAlocacaoBolsista(config);
            const response = await this.apiClient.get(baseRoute, {
                params: filter ? { filter } : {},
            });
            const itens = response.data.value;
            let alocacoes = itens
                ? itens.map(
                    (alocacaoBolsista: IAlocacaoBolsista) =>
                      new AlocacaoBolsista(
                          alocacaoBolsista.Id,
                          alocacaoBolsista.InicioAtividade,
                          alocacaoBolsista.DataPrevistaFimAtividade,
                          alocacaoBolsista.QtdeCotasAlocadas,
                          alocacaoBolsista.QtdeCotasPagasPreImportacao,
                          alocacaoBolsista.Status,
                          alocacaoBolsista.Projeto,
                          alocacaoBolsista.VersaoNivel,
                          alocacaoBolsista.Pessoa
                      )
                  )
                : [];
            return alocacoes;
        } catch (error) {
            log.error("Erro ao buscar alocações de bolsistas", error);
            throw error;
        }
    }

    async countAlocacaoBolsista() {
        try {
            const baseRoute = this.createBaseRoute() + this.createOdataCount();
            const response = await this.apiClient.get(baseRoute);
            return response.data['@odata.count'];
        } catch (error) {
            log.error("Erro ao buscar alocações de bolsistas", error);
            throw error;
        }
    }

    async countAlocacaoByProjetoId(id: string) {
        try {
            const baseRoute = this.createBaseRoute() + this.createOdataCount();
            const filter = `Projeto/Id eq ${id}`;
            const response = await this.apiClient.get(baseRoute, {
                params: { filter },
            });
            return response.data['@odata.count'];
        } catch (error) {
            log.error("Erro ao buscar alocações de bolsistas", error);
            throw error;
        }
    }
}