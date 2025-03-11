
import BolsistasRepository from '../model/repositories/BolsistasRepository';

export default class BolsistasController {
    BolsistasRepository;
  constructor() {
    this.BolsistasRepository = new BolsistasRepository();
  }

  async getAll() {
    return await this.BolsistasRepository.fetchAllBolsistas();
  }

  async getById(id: string) {
    if (!id) throw new Error("ID is required");
    return await this.BolsistasRepository.fetchBolsistaById(id);
  }
}
