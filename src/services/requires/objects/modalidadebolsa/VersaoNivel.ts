import BaseRoute from '../BaseRoute';
import type { BaseConfig } from '../BaseConfig';

class VersaoNivel extends BaseRoute{
    constructor(config: BaseConfig) {
        super('modalidadebolsa', 'versaonivelbolsa', config);
    };

    get versaoNivelDetails(): string {
        this.config.expand = '*';
        return this.expand;
    }
};

export default VersaoNivel;