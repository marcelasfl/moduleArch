import type { BaseConfig } from './BaseConfig';
import BaseModule from './BaseModule';

class PessoaRoutes extends BaseModule{
    constructor(config: BaseConfig) {
        super('pagamentobolsistas', 'pessoa', config);
    };

    get dadosPessoa(): string {
        return `?$select=Id,Nome,Email,Cpf`
    }
};

export default PessoaRoutes;