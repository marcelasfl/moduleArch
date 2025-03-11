import log from '@/logger';
import api from '@/services/api';
import type { IBolsistas } from '../Bolsistas';
import Bolsistas from '../Bolsistas';
import BolsistasRoutes from './apiRoutes/Bolsistas';

export default class BolsistasRepository{
    apiClient;

    constructor() {
        this.apiClient = api;
    }

    createBaseRoute() {
        return new BolsistasRoutes({}).getAllBolsistas
    }

    createExpandRoute(id: string){
        return new BolsistasRoutes({id: id}).getById
    }

    async fetchAllBolsistas(filter?: string) {
        try {
            const baseRoute = this.createBaseRoute();
            const response = await this.apiClient.get(baseRoute, {
                params: filter ? { filter } : {},
            });

            if (response.status === 200) {
                
            }
            const itens = response.data.value;
            let bolsistas = itens
                ? itens.map(
                    (bolsista: IBolsistas) =>
                      new Bolsistas(
                        bolsista.Id,
                        bolsista.DataInicio,
                        bolsista.DataFimPrevistaAtividade,
                        bolsista.DataFimAtividade,
                        bolsista.QtdeCotasAlocadas,
                        bolsista.QtdeCotasPagasPreImportacao,
                        bolsista.Status,
                        bolsista.PossuiReducaoBolsa,
                        bolsista.Pessoa,
                        bolsista.VersaoNivel,
                        bolsista.Projeto
                    )
                  )
                : [];

            return bolsistas;
        } catch (error) {
            log.error("Erro ao buscar Bolsistas do Projeto", error);
            return [];
        }
    }

    async fetchBolsistaById(id: string): Promise<Bolsistas> {
            try {
                const baseRoute = this.createExpandRoute(id)
                const response = await this.apiClient.get(baseRoute);
    
                if (response.status === 200 && response.data) {
                    const itens = response.data.value;
                    let bolsistas = itens
                        ? itens.map(
                            (bolsista: IBolsistas) =>
                            new Bolsistas(
                                bolsista.Id,
                                bolsista.DataInicio,
                                bolsista.DataFimPrevistaAtividade,
                                bolsista.DataFimAtividade,
                                bolsista.QtdeCotasAlocadas,
                                bolsista.QtdeCotasPagasPreImportacao,
                                bolsista.Status,
                                bolsista.PossuiReducaoBolsa,
                                bolsista.Pessoa,
                                bolsista.VersaoNivel,
                                bolsista.Projeto
                    )
                  )
                : [];
            return bolsistas;
                } else {
                    throw new Error(`Bolsistas com ID ${id} não encontrado.`)
                }
        } catch (error) {
            log.error("Erro ao buscar Bolsistas por ID:", error);
            throw new Error(`Erro ao buscar Bolsistas com ID ${id}: ${error}`)
        }
    }
}
