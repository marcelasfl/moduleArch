import RetornoRemessaRepository from '../model/repositories/RetornoRemessaRepository';

export default class RetornoRemessaController {
    retornoRemessaRepository: RetornoRemessaRepository;
    constructor() {
        this.retornoRemessaRepository = new RetornoRemessaRepository();
    }

    async uploadDp1(data: FormData) {
        return this.retornoRemessaRepository.uploadDp1(data);
    }

    async uploadDp9(data: FormData) {
        return this.retornoRemessaRepository.uploadDp9(data);
    }
}