import RemessaPagamentoRepository from "../model/repositories/RemessaPagamentoRepository";

export default class RemessaPagamentoController {
  items: any;
  remessaPagamentoRepository;
  
  constructor() {
    this.remessaPagamentoRepository = new RemessaPagamentoRepository();
  }

  async generateRemessaPagamento(id: string) {
    return await this.remessaPagamentoRepository.generateRemessaPagamento(id);
  }
}