import type { BaseConfig } from './BaseConfig';
import BaseModule from './BaseModule';

class AreaTecnicaRoutes extends BaseModule{
    constructor(config: BaseConfig) {
        super('areatecnica', config);
    };
};

export default AreaTecnicaRoutes;