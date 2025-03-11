import type { BaseConfig } from './BaseConfig';
import BaseModule from './BaseModule';
import BaseRoute from './BaseRoute';

class BolsistaPorTempoRoutes extends BaseRoute{
    constructor(config: BaseConfig) {
        super('dashboards', "bolsistasportempo", config);
    };
};

export default BolsistaPorTempoRoutes;