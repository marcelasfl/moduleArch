import Pessoa from '../model/Pessoa';
import PessoaRepository from '../model/repositories/PessoaRepository';
import type IController from './generic/IController';


export default class PessoaController implements IController {
  items: any;
  deleteItem(Id: any) {
    throw new Error('Method not implemented.');
  }
  pessoaRepository: PessoaRepository;

  constructor() {
    this.pessoaRepository = new PessoaRepository();
  }

  // Método para buscar todos as pessoas com filtro opcional
  // Busca todos as pessoas com um filtro opcional.
  async getAll(filter?: string): Promise<any> {
    return await this.pessoaRepository.fetchAllPessoa(filter);
  }

  // Método para buscar uma pessoa por ID
  async getById(id: string | number): Promise<any> {
    if (!id) throw new Error("ID is required");
    return await this.pessoaRepository.fetchPessoaById(id);
  }

  // Método para criar uma nova pessoa 
  async create(data: any): Promise<any> {
    if (!data) throw new Error("Data is required to create a new Pessoa");

    const pessoa = new Pessoa(data.Id, data.Nome, data.Cpf, data.Email, data.DataNascimento);
    
    if (import.meta.env.VITE_DEV_MOCK == 'true') {
      return pessoa.Id = '10';
    }
    return await this.pessoaRepository.createPessoa(data);
  }

  // Método para atualizar uma pessoa por ID
  async update(id: string, data: any): Promise<any> {
    if (!id || !data) throw new Error("ID and data are required for update");

    const pessoa = new Pessoa(data.Id, data.Nome, data.Cpf, data.Email, data.DataNascimento);

    if (import.meta.env.VITE_DEV_MOCK == "true") {
      return id;
    }

    return await this.pessoaRepository.updatePessoa(id, data);
  }

  // Método para deletar uma pessoa por ID
  async delete(id: string | number): Promise<any> {
    if (!id) throw new Error("ID is required to delete a Pessoa");
    return await this.pessoaRepository.deletePessoa(id);
  }

  async filter(route: string) {
    if (!route) throw new Error("Route is required for filter");
    return await this.pessoaRepository.filterPessoa(route);
  }
}


