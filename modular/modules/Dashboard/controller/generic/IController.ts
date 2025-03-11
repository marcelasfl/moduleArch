export default interface IController {
    getAll(filter?: string): Promise<any>; // Adiciona um parâmetro opcional para filtrar
    getById(id: string | number): Promise<any>;
    create(data: any): Promise<any>;
    update(id: string | number, data: any): Promise<any>;
    delete(id: string | number): Promise<any>;
    filter(route: string): Promise<any>;
  }
