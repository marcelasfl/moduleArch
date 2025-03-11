import type { BaseConfig } from './BaseConfig';
import BaseModule from './BaseModule';

class RetornoRemessaRoutes extends BaseModule{
    constructor(config: BaseConfig) {
        super('retornoremessa', config);
    };

    get uploadDp1(): string {
        return `${this.entity}/dp1`;
    }


    get uploadDp9(): string {
        return `${this.entity}/dp9`;
    }
};

export default RetornoRemessaRoutes;