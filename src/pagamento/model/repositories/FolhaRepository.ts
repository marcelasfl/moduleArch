import log from '@/logger';
import api from '@/services/api';
import type { IFolha } from '../Folha';
import Folha from '../Folha';
import FolhaRoutes from './apiRoutes/Folha';

export default class FolhaRepository {
  apiClient;
  constructor() {
    this.apiClient = api;
  }

  createBaseRoute() {
    return new FolhaRoutes({}).entity;
  }

  createExpandRoute() {
    return new FolhaRoutes({}).expandAll;
  }

  createCancelRoute() {
    return new FolhaRoutes({}).cancel;
  }

  createAuthorizeRoute() {
    return new FolhaRoutes({}).authorize;
  }

  createGenerateRoute() {
    return new FolhaRoutes({}).generate;
  }

  createHistoryRoute() {
    return new FolhaRoutes({}).history;
  }

  createResumeFolhaRoute(){
    return new FolhaRoutes({}).resume;
  }

  createIdRoute(id: string) {
    return new FolhaRoutes({id: id}).fetchById;
  }

  async getAll() {
    try {
      const response = await this.apiClient.get(this.createExpandRoute());
      const itens = response.data.value;
  
      let folhas = itens.map((folha: IFolha) =>
        new Folha(
          folha.Id,
          folha.Ordem,
          folha.Titulo,
          folha.DataPagamento,
          folha.ValorPrevisto,
          folha.ValorPago,
          folha.Status,
          folha.FolhaPlanoMensalId,
          folha.DateCreated,
          folha.DecisaoFolhas,
          folha.DecisaoFolhas[0].Horario,
          folha.PlanoMensal,
          folha.PagamentoBolsistas,
          folha.RemessaPagamentos
        )
      );
      return folhas;
    } catch (error) {
      log.error("Erro ao buscar folhas", error);
      throw error;
    }
  }
  
  async fetchAllFolha(route: string) {
    try {
      const response = await this.apiClient.get(route);
      const itens = response.data.value;
  
      let folhas = itens.map((folha: IFolha) =>
        new Folha(
          folha.Id,
          folha.Ordem,
          folha.Titulo,
          folha.DataPagamento,
          folha.ValorPrevisto,
          folha.ValorPago,
          folha.Status,
          folha.FolhaPlanoMensalId,
          folha.DateCreated,
          folha.DecisaoFolhas,
          folha.DecisaoFolhas[0].Horario,
          folha.PlanoMensal,
          folha.PagamentoBolsistas,
          folha.RemessaPagamentos
        )
      );
      return folhas;
    } catch (error) {
      log.error("Erro ao buscar folhas", error);
      throw error;
    }
  }

  async fetchFolhaById(id: string) {
    try {
      const route = this.createIdRoute(id);
      const response = await this.apiClient.get(route);
      

      const folhaResponse = response.data.value[0];
      let folha =
        new Folha(
          folhaResponse.Id,
          folhaResponse.Ordem,
          folhaResponse.Titulo,
          folhaResponse.DataPagamento,
          folhaResponse.ValorPrevisto,
          folhaResponse.ValorPago,
          folhaResponse.Status,
          folhaResponse.FolhaPlanoMensalId,
          folhaResponse.DateCreated,
          folhaResponse.DecisaoFolhas,
          folhaResponse.DecisaoFolhas[0].Horario,
          folhaResponse.PlanoMensal,
          folhaResponse.PagamentoBolsistas,
          folhaResponse.RemessaPagamentos
        );
      return folha;
    } catch (error) {
      log.error("Erro ao buscar folha por id", error)
      throw error;
    }
  }

  async cancelFolha(form: {folhaId: string, justificativa: string}) {
    try {
      const route = this.createCancelRoute();
      const response = await this.apiClient.post(route, form);
      return response.data;
    } catch (error) {
      log.error("Erro ao cancelar a folha", error)
      throw error;
    }
  }

  async rejectFolha(form: {folhaId: string, justificativa: string, ehAutorizada: boolean}) {
    try {
      const route = this.createAuthorizeRoute();
      const response = await this.apiClient.post(route, form);
      return response.data;
    } catch (error) {
      log.error("Erro ao cancelar a folha", error)
      throw error;
    }
  }

  async generateFolha(form: {DataPagamentoFolhaComplementar: string | null}) {
    try {
        const generateRoute = this.createGenerateRoute();
        const response = await this.apiClient.post(generateRoute, form);
        return response.data;
      } catch (error) {
        log.error("Erro ao gerar folha", error);
        throw error;
    }
  }

  async getHistoryFolhaAtual() {
    try {
      const historyRoute = this.createHistoryRoute();
      const response = await this.apiClient.get(historyRoute);
      return response.data.value;
    } catch (error) {
      log.error("Erro ao buscar histórico", error);
      throw error;
    }
  }

  async fetchFolhaResume(ordem:number, id: string) {
    try {
      const routeResumeFolha = this.createResumeFolhaRoute();
      const response = await this.apiClient.post(routeResumeFolha, {'planoMensalId': id, 'ordemFolha': ordem});
      const itens = response.data.body;
      return itens;
    } catch (error) {
      log.error("Erro ao buscar resume", error);
      throw error;
    }
  }

}
