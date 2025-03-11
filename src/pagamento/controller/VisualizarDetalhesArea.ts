import VisualizarDetalhesAreaRepository from "../model/repositories/VisualizarDetalhesAreaRepository";
import type { IVisualizarDetalhesArea } from "../model/VisualizarDetalhesArea";
import type IController from "./store/generic/IController";


export default class VisualizarDetalhesAreaController implements IController {
  items: any;
  visualizarDetalhesAreaRepository;
  
  constructor() {
    this.visualizarDetalhesAreaRepository = new VisualizarDetalhesAreaRepository();
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
    filter(route: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
  
  async getAll() {
    return await this.visualizarDetalhesAreaRepository.fetchAllDetalhesArea();
  }
}