import Edital from '../model/Edital';
import EditalRepository from '../model/repositories/EditalRepository';
import type IController from './generic/IController';


export default class EditalController implements IController {
  fetchAlocacoesInEditalById(selectedValue: string) {
      throw new Error('Method not implemented.');
  }
  items: any;
  deleteItem(Id: any) {
    throw new Error('Method not implemented.');
  }
  editalRepository: EditalRepository;

  constructor() {
    this.editalRepository = new EditalRepository();
  }


  async getAll(filter?: string): Promise<any> {
    return await this.editalRepository.fetchAllEdital(filter);
  }

  // Método para buscar um  edital por ID
  async getById(id: string | number): Promise<any> {
    if (!id) throw new Error("ID is required");
    return await this.editalRepository.fetchEditalById(id);
  }

  async getAlocacoesInEdital(filter?: string): Promise<any> {
    return await this.editalRepository.fetchAlocacoesInEdital(filter);
  }
  async getAlocacoesInEditalById(id: string | number): Promise<any> {
    if (!id) throw new Error("ID is required");
    return await this.editalRepository.fetchAlocacoesInEditalById(id);
  }
  // Método para criar um novo edital 
  async create(data: any): Promise<any> {
    if (!data) throw new Error("Data is required to create a new edital");

    const edital = new Edital(data.Id, data.Nome,  data.AreaTecnica, data.EditalAreaTecnicaId, data.Status, data.Processo, data.Projeto, data.VersaoNivel, data.NivelBolsa);
    
    if (import.meta.env.VITE_DEV_MOCK == 'true') {
      return edital.Id = '10';
    }
    return await this.editalRepository.createEdital(data);
  }

  // Método para atualizar um edital por ID
  async update(id: string, data: any): Promise<any> {
    if (!id || !data) throw new Error("ID and data are required for update");

    const edital = new Edital(data.Id, data.Nome,  data.AreaTecnica, data.EditalAreaTecnicaId, data.Status, data.Processo, data.Projeto, data.VersaoNivel, data.NivelBolsa);

    if (import.meta.env.VITE_DEV_MOCK == "true") {
      return id;
    }

    return await this.editalRepository.updateEdital(id, data);
  }

  async delete(id: string | number): Promise<any> {
    if (!id) throw new Error("ID is required to delete a Edital");
    return await this.editalRepository.deleteEdital(id);
  }

  async filter(route: string) {
    if (!route) throw new Error("Route is required for filter");
    return await this.editalRepository.filterEdital(route);
  }
}


