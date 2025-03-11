import type { BaseConfig } from './BaseConfig';
import BaseModule from './BaseModule';

class QtdBolsasRoutes extends BaseModule{
    constructor(endpoint: string, config: BaseConfig) {
        super('dashboards', endpoint, config);
    };
};

export default QtdBolsasRoutes;