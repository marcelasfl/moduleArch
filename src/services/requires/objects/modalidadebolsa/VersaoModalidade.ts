import BaseModule from './BaseModule'
import type { BaseConfig } from '../BaseConfig';

class VersaoModalidade extends BaseModule{
    constructor(config: BaseConfig) {
        super('versaomodalidadebolsa', config);
    };

    get versaoModalidadeDetails(): string {
        this.config.expand = '*';
        return this.expand;
    };

    get versaoModalidadeList(): string {
        this.config.expand = 'VersaoNiveis($expand=*)';
        return this.expand;
    };
};

export default VersaoModalidade;