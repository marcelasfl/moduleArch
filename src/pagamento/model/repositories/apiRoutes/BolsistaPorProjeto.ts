import type { BaseConfig } from './BaseConfig';
import BaseModule from './BaseModule';

class BolsistaPorProjetoRoutes extends BaseModule{
    constructor(config: BaseConfig) {
        super('dashboards', "bolsistaprojeto", config);
    };

    get count() {
        return "?$count=true"
    }
};

export default BolsistaPorProjetoRoutes;