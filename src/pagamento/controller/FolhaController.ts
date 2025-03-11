import FolhaRepository from '../model/repositories/FolhaRepository';

export default class FolhaController {
  folhaRepository;
  constructor() {
    this.folhaRepository = new FolhaRepository();
  }

  async getAll() {
    return await this.folhaRepository.getAll();
  }

  async generateFolha(form: {DataPagamentoFolhaComplementar: string | null}) {
    return await this.folhaRepository.generateFolha(form);
  }

  async historyFolha() {
    return await this.folhaRepository.getHistoryFolhaAtual();
  }

  async filter(route: string) {
    return await this.folhaRepository.fetchAllFolha(route);
  }

  async getFolhaById(id: string) {
    return await this.folhaRepository.fetchFolhaById(id);
  }

  async fetchFolhaResume(ordem: number, id: string){
    return await this.folhaRepository.fetchFolhaResume(ordem, id);
  }
  
  async cancelFolha(form: {folhaId: string, justificativa: string}) {
    return await this.folhaRepository.cancelFolha(form);
  }

  async rejectFolha(form: {folhaId: string, justificativa: string, ehAutorizada: boolean}) {
    return await this.folhaRepository.rejectFolha(form);
  }
}
