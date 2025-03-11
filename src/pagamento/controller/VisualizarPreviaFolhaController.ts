import VisualizarPreviaFolhaRepository from "../model/repositories/VisualizarPreviaFolhaRepository";
import type IController from "./store/generic/IController";

export default class VisualizarPreviaFolhaController implements IController {
  items: any;
  visualizarPreviaFolhaRepository;
  
  constructor() {
    this.visualizarPreviaFolhaRepository = new VisualizarPreviaFolhaRepository();
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

  async fetchAllVisualizarPrevia() {
    return await this.visualizarPreviaFolhaRepository.fetchAllVisualizarPrevia();
  }
}