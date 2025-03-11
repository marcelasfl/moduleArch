import MonitorarLiberacaoAreas from "../model/repositories/MonitorarLiberacaoAreas";
import type IController from "./store/generic/IController";

export default class MonitorarLiberacaoAreasController implements IController {
  items: any;
  monitorarLiberacaoAreas;
  
  constructor() {
    this.monitorarLiberacaoAreas = new MonitorarLiberacaoAreas();
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
  
  async fetchAllMonitorarEditais() {
    return await this.monitorarLiberacaoAreas.fetchAllMonitorarEditais();
  }
}