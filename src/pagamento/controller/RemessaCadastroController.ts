import RemessaCadastroRepository from "../model/repositories/RemessaCadastroRepository";

export default class RemessaCadastroController {
  items: any;
  remessaCadastroRepository;
  
  constructor() {
    this.remessaCadastroRepository = new RemessaCadastroRepository();
  }

  async generateRemessaCadastro(id: string) {
    return await this.remessaCadastroRepository.generateRemessaCadastro(id);
  }
}