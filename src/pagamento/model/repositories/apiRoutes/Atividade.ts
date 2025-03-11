import type { BaseConfig } from './BaseConfig';
import BaseModule from './importacaoEdital/BaseModuleEdital';

class AtividadeRoutes extends BaseModule{
    constructor(config: BaseConfig) {
        super('atividade', config);
    };
    get getAllAtividades(): string {
        return `${this.entity}/?$expand=*`
    }
};

export default AtividadeRoutes;