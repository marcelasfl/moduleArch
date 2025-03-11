import AtividadeRepository from '../model/repositories/AtividadeRepository';

export default class AtividadeController {
    AtividadeRepository;
  constructor() {
    this.AtividadeRepository = new AtividadeRepository();
  }

  async getAll() {
    return await this.AtividadeRepository.fetchAllAtividade();
  }
}