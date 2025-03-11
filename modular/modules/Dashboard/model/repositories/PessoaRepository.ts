import log from '@/logger';
import api from '@/services/api';
import type { IPessoa } from '../../../pagamento/model/Pessoa';
import Pessoa from '../../../pagamento/model/Pessoa';
import BaseRoute from './apiRoutes/BaseRoute';
import PessoaRoutes from './apiRoutes/Pessoa';
import type IPessoaRepository from './IPessoaRepository';

export default class PessoaRepository implements IPessoaRepository{
    apiClient;

    constructor() {
        this.apiClient = api;
    }

    createBaseRoute() {
        return new BaseRoute("dashboards", "pessoa", {}).entity;
    }
    
    createPessoaRoute() {
        return new PessoaRoutes({}).dadosPessoa;
    }

    async fetchAllPessoa(filter?: string) {
        try {
            const baseRoute = this.createBaseRoute();
            const response = await this.apiClient.get(baseRoute, {
                params: filter ? { filter } : {},
            });

            if (response.status === 200) {
                
            }
            const itens = response.data.value;
            let pessoas = itens
                ? itens.map(
                    (pessoa: IPessoa) =>
                      new Pessoa(
                          pessoa.Id,
                          pessoa.Nome,
                          pessoa.CPF,
                          pessoa.Email
                      )
                  )
                : [];
            
            return pessoas;
        } catch (error) {
            log.error("Erro ao buscar pessoas", error);
            return [];
        }
    }

    async fetchPessoaById(id: string | number): Promise<Pessoa> {
        try {
            const baseRoute = `${this.createBaseRoute()}/${id}${this.createPessoaRoute()}`;
            const response = await this.apiClient.get(baseRoute);

            if (response.status === 200 && response.data) {
                const pessoa = response.data.value[0];
                return new Pessoa(
                    pessoa.Id,
                    pessoa.Nome,
                    pessoa.CPF,
                    pessoa.Email
                );
            } else {
                throw new Error(`Pessoa com ID ${id} não encontrada.`)
            }
        } catch (error) {
            log.error("Erro ao buscar pessoa por ID:", error);
            throw new Error(`Erro ao buscar Pessoa com ID ${id}: ${error}`)
        }
    }

    async createPessoa(data: IPessoa) {
        try {
            const baseRoute = this.createBaseRoute();
            const response = await this.apiClient.post(baseRoute, data);
            return response.data;
        } catch (error) {
            log.error("Erro ao criar pessoa", error);
            throw error;
        }
    }

    async updatePessoa(id: string | number, data: Partial<IPessoa>) {
        try {
            const baseRoute = `${this.createBaseRoute()}/${id}`;
            const response = await this.apiClient.put(baseRoute, data);
            return response.data;
        } catch (error) {
            log.error("Erro ao atualizar pessoa", error);
        }
    }

    async deletePessoa(id: string | number) {
        try {
            const baseRoute = `${this.createBaseRoute()}/${id}`;
            const response = await this.apiClient.delete(baseRoute);
            return response.status === 200;
        } catch (error) {
            log.error("Erro ao deletar pessoa", error);
            throw error;
        }
    }

    async filterPessoa(route: string){
        try {
          const response = await this.apiClient.get(route);
          const itens = response.data.value;
          let pessoas = itens
            ? itens.map(
                (pessoa: IPessoa) =>
                  new Pessoa(
                    pessoa.Id,
                    pessoa.Nome,
                    pessoa.CPF,
                    pessoa.Email
                  )
              )
            : [];
          return pessoas;
        } catch (error) {
          log.error("Erro ao buscar pessoas", error);
          throw error;
        }
      }
}