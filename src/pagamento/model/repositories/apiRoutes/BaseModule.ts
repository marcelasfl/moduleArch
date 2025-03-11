import BaseRoute from './BaseRoute';
import type { BaseConfig } from './BaseConfig';

class BaseModule extends BaseRoute{
    // constructor(module: string, entityName: string, config: BaseConfig) {
    //     super(module, entityName, config);
        
    constructor(entityName: string, config: BaseConfig) {
        super('/pagamentobolsistas', entityName, config);
    };

    get getById(): string {
        return `${this.entity}/${this.config.id}`
    }
};

export default BaseModule;