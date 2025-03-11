import type { BaseConfig } from './BaseConfig';
import BaseModule from './BaseModule';
import BaseRoute from './BaseRoute';

class QtdBolsasRoutes extends BaseRoute{
    constructor(endpoint: string, config: BaseConfig) {
        super('dashboards', endpoint, config);
    };
};

export default QtdBolsasRoutes;