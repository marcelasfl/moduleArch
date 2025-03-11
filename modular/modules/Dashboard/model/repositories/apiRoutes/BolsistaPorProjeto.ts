import type { BaseConfig } from './BaseConfig';
import BaseModule from './BaseModule';
import BaseRoute from './BaseRoute';

class BolsistaPorProjetoRoutes extends BaseRoute{
    constructor(config: BaseConfig) {
        super('dashboards', "bolsistaprojeto", config);
    };

    get count() {
        return "?$count=true"
    }
};

export default BolsistaPorProjetoRoutes;