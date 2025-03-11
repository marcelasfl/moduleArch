import ConfirmarGeracaoFolhaRepository from "../model/repositories/ConfirmarGeracaoFolhaRepository";
import type IController from "./store/generic/IController";

export default class ConfirmarGeracaoFolhaController implements IController {
  items: any;
  confirmarGeracaoFolhaRepository;
  
  constructor() {
    this.confirmarGeracaoFolhaRepository = new ConfirmarGeracaoFolhaRepository();
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
  
  getAll(): Promise<any> {
    throw new Error("Method not implemented.");
  }
  
  filter(id: string | number): Promise<any> {
    throw new Error("Method not implemented.");
  }
  
  async fetchAllConfirmarGeracaoFolha() {
    return await this.confirmarGeracaoFolhaRepository.fetchAllConfirmarGeracaoFolha();
  }
}