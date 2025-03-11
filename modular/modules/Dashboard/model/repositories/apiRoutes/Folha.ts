import type { BaseConfig } from './BaseConfig';
import BaseModule from './BaseModule';

class FolhaRoutes extends BaseModule{
    constructor(config: BaseConfig) {
        super('folha', config);
    };

    get generate(): string {
        return `${this.entity}/generate`;
    };

    get history(): string {
        return `${this.entity}?$expand=*&$filter=PlanoMensal/EhAtual eq true`;
    }

    get fetchById(): string {
        return `${this.entity}/${this.config.id}?$expand=*`;
    }

    get expandAll(): string {
        return `${this.entity}?$expand=*`;
    }

    get cancel(): string {
        return `${this.entity}/cancel`;
    }
    
    get authorize(): string {
        return `${this.entity}/authorize`;
    }

    get resume(): string {
        return `${this.entity}/resume`;
    }
};

export default FolhaRoutes;