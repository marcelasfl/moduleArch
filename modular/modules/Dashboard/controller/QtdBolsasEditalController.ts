import QtdBolsasEdital from '../model/QtdBolsasEdital';
import QtdBolsasEditalRepository from '../model/repositories/QtdBolsasEditalRepository';
import type IController from './generic/IController';


export default class QtdBolsasEditalController implements IController {
  items: any;
  deleteItem(Id: any) {
    throw new Error('Method not implemented.');
  }
  qtdBolsasEditalRepository: QtdBolsasEditalRepository;

  constructor() {
    this.qtdBolsasEditalRepository = new QtdBolsasEditalRepository();
  }

  async getAll(filter?: string): Promise<any> {
    return await this.qtdBolsasEditalRepository.fetchAllQtdBolsas(filter);
  }

  async getById(id: string | number): Promise<any> {
    if (!id) throw new Error("ID is required");
    return await this.qtdBolsasEditalRepository.fetchQtdBolsasById(id);
  }
  
  async create(data: any): Promise<any> {
    if (!data) throw new Error("Data is required to create a new Edital");

    const qtdBolsasEdital = new QtdBolsasEdital(data.Id, data.Nome, data.IdEdital, data.Modalidades);
    
    if (import.meta.env.VITE_DEV_MOCK == 'true') {
      return qtdBolsasEdital.id = '10';
    }
    return await this.qtdBolsasEditalRepository.createQtdBolsas(data);
  }

  async update(id: string, data: any): Promise<any> {
    if (!id || !data) throw new Error("ID and data are required for update");

    const qtdBolsasEdital = new QtdBolsasEdital(data.Id, data.Nome, data.IdEdital, data.Modalidades);

    if (import.meta.env.VITE_DEV_MOCK == "true") {
      return id;
    }

    return await this.qtdBolsasEditalRepository.updateQtdBolsas(id, data);
  }

  async delete(id: string | number): Promise<any> {
    if (!id) throw new Error("ID is required to delete a Edital");
    return await this.qtdBolsasEditalRepository.deleteQtdBolsas(id);
  }

  async filter(route: string) {
    if (!route) throw new Error("Route is required for filter");
    return await this.qtdBolsasEditalRepository.filter(route);
  }
}


