import log from '@/logger';
import api from '@/services/api';
import AtividadeRoutes from './apiRoutes/Atividade';
import type { IAtividade } from '../Atividade';
import Atividade from '../Atividade';

export default class AtividadeRepository {
    apiClient;

    constructor() {
        this.apiClient = api;
    }

    createBaseRoute() {
        return new AtividadeRoutes({}).entity;
    }
    
    async fetchAllAtividade(filter?: string) {
        try {
            const baseRoute = this.createBaseRoute();
            const response = await this.apiClient.get(baseRoute, {
                params: filter ? { filter } : {},
            });

            if (response.status === 200) {
                log.info("Busca realizada com sucesso");
            }
            const itens = response.data.value;
            let atividade = itens
                ? itens.map(
                    (atividade: IAtividade) =>
                      new Atividade(
                        atividade.Nome,
                        atividade.Codigo,
                        atividade.Id
                      )
                  )
                : [];
            return atividade;
        } catch (error) {
            log.error("Erro ao buscar atividades", error);
            return [];
        }
    }
}