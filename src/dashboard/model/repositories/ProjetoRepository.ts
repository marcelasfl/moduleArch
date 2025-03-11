import log from '@/logger';
import api from '@/services/api';
import type { IProjeto } from '../../../pagamento/model/Projeto';
import Projeto from '../../../pagamento/model/Projeto';
import ProjetoRoutes from './apiRoutes/Projeto';
import type IProjetoRepository from './IProjetoRepository';

export default class ProjetoRepository implements IProjetoRepository{
    apiClient;

    constructor() {
        this.apiClient = api;
    }

    createBaseRoute() {
        return new ProjetoRoutes({}).entity;
    }
    
    createAlocacoesInProjetoRoute() {
        return new ProjetoRoutes({}).alocacoesInProjeto;
    }

    createProjectDetails() {
        return new ProjetoRoutes({}).projectDetails;
    }

    createSaldoBolsasProjetoRoute() {
        return new ProjetoRoutes({}).saldoBolsasProjeto
    }
    async fetchAllProjeto(filter?: string) {
        try {
            const baseRoute = `${this.createBaseRoute()}${this.createProjectDetails()}`;
            const response = await this.apiClient.get(baseRoute, {
                params: filter ? { filter } : {},
            });

            if (response.status === 200) {
                
            }
            const itens = response.data.value;
            let projetos = itens
                ? itens.map(
                    (projeto: IProjeto) =>
                      new Projeto(
                          projeto.Id,
                          projeto.Nome,
                          projeto.DataInicio,
                          projeto.DataFimPrevista,
                          projeto.Edital,
                          projeto.AlocacaoBolsistas,
                          projeto.OrçamentoTotal,
                          projeto.OrçamentoBolsa,
                          projeto.Status   
                        )
                  )
                : [];
            
            return projetos;
        } catch (error) {
            log.error("Erro ao buscar projetos", error);
            return [];
        }
    }

    async fetchProjetoById(id: string | number): Promise<Projeto> {
        try {
            const baseRoute = `${this.createBaseRoute()}/${id}`;
            const response = await this.apiClient.get(baseRoute);

            if (response.status === 200 && response.data) {
                const projeto = response.data.value[0];
                return new Projeto(
                    projeto.Id,
                    projeto.Nome,
                    projeto.DataInicio,
                    projeto.DataFimPrevista,
                    projeto.Edital,
                    projeto.AlocacaoBolsistas,
                    projeto.OrcamentoTotal,
                    projeto.OrcamentoBolsa 
                );
            } else {
                throw new Error(`Projeto com ID ${id} não encontrado.`)
            }
        } catch (error) {
            log.error("Erro ao buscar projeto por ID:", error);
            throw new Error(`Erro ao buscar Projeto com ID ${id}: ${error}`)
        }
    }

    async fetchAlocacoesInProjeto(filter?: string) {
        try {
            const baseRoute = `${this.createBaseRoute()}${this.createAlocacoesInProjetoRoute()}`;
            const response = await this.apiClient.get(baseRoute, {
                params: filter ? { filter } : {},
            });

            if (response.status === 200) {
                
            }
            const itens = response.data.value;
            let projetos = itens
                ? itens.map(
                    (projeto: IProjeto) =>
                      new Projeto(
                            projeto.Id,
                            projeto.Nome,
                            undefined,
                            undefined,
                            undefined,
                            projeto.AlocacaoBolsistas
                        )
                  )
                : [];
            
            return projetos;
        } catch (error) {
            log.error("Erro ao buscar projetoss", error);
            return [];
        }
    }

    async fetchAlocacoesInProjetoById(id: string | number): Promise<Projeto> {
        try {
            const baseRoute = `${this.createBaseRoute()}/${id}${this.createAlocacoesInProjetoRoute()}`;
            const response = await this.apiClient.get(baseRoute);

            if (response.status === 200 && response.data) {
                const projeto = response.data.value[0];
                return new Projeto(
                    projeto.Id,
                    projeto.Nome,
                    undefined,
                    undefined,
                    undefined,
                    projeto.AlocacaoBolsistas
                );
            } else {
                throw new Error(`Projeto com ID ${id} não encontrado.`)
            }
        } catch (error) {
            log.error("Erro ao buscar projeto por ID:", error);
            throw new Error(`Erro ao buscar Projeto com ID ${id}: ${error}`)
        }
    }

    async fetchSaldoBolsasProjeto(filter?: string) {
        try {
            const baseRoute = `${this.createBaseRoute()}${this.createSaldoBolsasProjetoRoute()}`;
            const response = await this.apiClient.get(baseRoute, {
                params: filter ? { filter } : {},
            });

            if (response.status === 200) {
                log.info("Busca realizada com sucesso");
            }
            const itens = response.data.value;
            let projetos = itens
                ? itens.map(
                    (projeto: IProjeto) =>
                      new Projeto(
                            projeto.Id,
                            projeto.Nome,
                            undefined,
                            undefined,
                            undefined,
                            projeto.AlocacaoBolsistas,
                            projeto.OrcamentoTotal,
                            projeto.OrcamentoBolsa
                        )
                  )
                : [];
            log.info(JSON.stringify(projetos));
            return projetos;
        } catch (error) {
            log.error("Erro ao buscar projetos", error);
            return [];
        }
    }

    async fetchSaldoBolsasProjetoById(id: string | number): Promise<Projeto> {
        try {
            const baseRoute = `${this.createBaseRoute()}/${id}${this.createSaldoBolsasProjetoRoute()}`;
            const response = await this.apiClient.get(baseRoute);

            if (response.status === 200 && response.data) {
                const projeto = response.data.value[0];
                return new Projeto(
                    projeto.Id,
                    projeto.Nome,
                    undefined,
                    undefined,
                    undefined,
                    projeto.AlocacaoBolsistas,
                    projeto.OrcamentoTotal,
                    projeto.OrcamentoBolsa
                );
            } else {
                throw new Error(`Projeto com ID ${id} não encontrado.`)
            }
        } catch (error) {
            log.error("Erro ao buscar projeto por ID:", error);
            throw new Error(`Erro ao buscar Projeto com ID ${id}: ${error}`)
        }
    }

    async createProjeto(data: IProjeto) {
        try {
            const baseRoute = this.createBaseRoute();
            const response = await this.apiClient.post(baseRoute, data);
            return response.data;
        } catch (error) {
            log.error("Erro ao criar projeto", error);
            throw error;
        }
    }

    async updateProjeto(id: string | number, data: Partial<IProjeto>) {
        try {
            const baseRoute = `${this.createBaseRoute()}/${id}`;
            const response = await this.apiClient.put(baseRoute, data);
            return response.data;
        } catch (error) {
            log.error("Erro ao atualizar projeto", error);
        }
    }

    async deleteProjeto(id: string | number) {
        try {
            const baseRoute = `${this.createBaseRoute()}/${id}`;
            const response = await this.apiClient.delete(baseRoute);
            return response.status === 200;
        } catch (error) {
            log.error("Erro ao deletar projeto", error);
            throw error;
        }
    }

    async filterProjeto(route: string){
        try {
          const response = await this.apiClient.get(route);
          const itens = response.data.value;
          let projetos = itens
            ? itens.map(
                (projeto: IProjeto) =>
                  new Projeto(
                    projeto.Id,
                    projeto.Nome,
                    projeto.Cpf,
                    projeto.Email,
                    projeto.DataNascimento
                  )
              )
            : [];
          return projetos;
        } catch (error) {
          log.error("Erro ao buscar projetos", error);
          throw error;
        }
      }
}