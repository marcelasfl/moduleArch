import type { BaseConfig } from './BaseConfig';
import BaseModule from './BaseModule';

class BolsistaPorTempoRoutes extends BaseModule{
    constructor(config: BaseConfig) {
        super('dashboards', "bolsistasportempo", config);
    };
};

export default BolsistaPorTempoRoutes;