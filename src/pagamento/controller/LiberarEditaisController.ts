import type { IEditalCompetenciaBulkDTO } from "../model/DTO/EditalCompetenciaBulkDTO";
import type { IEditalCompetencia } from "../model/EditalCompetencia";
import LiberarEditaisPagamentoRepository from "../model/repositories/LiberarEditaisPagamentoRepository";
import type { EditalPagamento } from "../view/LiberarEditaisPagamento.vue";
import type IController from "./store/generic/IController";

export default class LiberarEditaisPagamentoController implements IController {
  items: any;
  liberarEditaisRepository;
  
  constructor() {
    this.liberarEditaisRepository = new LiberarEditaisPagamentoRepository();
  }
  
  getById(id: string | number): Promise<any> {
    throw new Error("Method not implemented.");
  }
  create(data: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  update(id: string | number, data: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  delete(id: string | number): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async filter(route: string): Promise<any> {
    if (!route) throw new Error("Route is required for filter");
    return await this.liberarEditaisRepository.filterLiberarEditais(route);
  }

  async getAll() {
    return await this.liberarEditaisRepository.fetchAllLiberarEditais();
  }

  async fetchAllMonitorarEditais() {
    return await this.liberarEditaisRepository.fetchAllMonitorarEditais();
  }

  async fetchAllConfirmarGeracaoFolha() {
    return await this.liberarEditaisRepository.fetchAllConfirmarGeracaoFolha();
  }

  async fetchLiberarEditaisByArea(id: string) {
    return await this.liberarEditaisRepository.filterLiberarEditaisByArea(id);
  }

  async updateBulk(data: any) {
    if (!data) throw new Error("Data is required to update a new PlanoMensal");
    
    let bulk: IEditalCompetenciaBulkDTO = {"editais": []}

    data.forEach((editalCompetencia: EditalPagamento & IEditalCompetencia) => {
      if (editalCompetencia.approved) {
        let competencia = {
          "editalCompetenciaId": editalCompetencia.id,
          "status": 1,
          "justificativa": ''
        }
        bulk["editais"].push(competencia)
      } else if (!editalCompetencia.approved && editalCompetencia.notReleased && editalCompetencia.reason) {
        let competencia = {
          "editalCompetenciaId": editalCompetencia.id,
          "status": 2,
          "justificativa": editalCompetencia.reason
        }
        bulk["editais"].push(competencia)
      }
    });

    if (import.meta.env.VITE_DEV_MOCK == 'true') return '10';
    return await this.liberarEditaisRepository.updateBulkLiberarEditais(bulk)
  }
}