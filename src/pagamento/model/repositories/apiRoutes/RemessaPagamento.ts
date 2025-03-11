import type { BaseConfig } from './BaseConfig';
import BaseModule from './BaseModule';

class RemessaCadastroRoutes extends BaseModule{
    constructor(config: BaseConfig) {
        super('remessa', config);
    };

    get generate(): string {
        return `${this.entity}/pagamentobolsista`;
    }
};

export default RemessaCadastroRoutes;