import type { BaseConfig } from './BaseConfig';
import BaseModule from './BaseModule';

class ConfirmarGeracaoFolhaRoutes extends BaseModule{
    constructor(config: BaseConfig) {
        super('editalcompetencia', config);
    };

    get confirmarGeracaoFolha(): string {
        return `${this.entity}/confirmargeracaofolha`;
    }

};

export default ConfirmarGeracaoFolhaRoutes;