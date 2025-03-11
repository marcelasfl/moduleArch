import type { BaseConfig } from './BaseConfig';
import BaseModule from './importacaoEdital/BaseModuleEdital';

class AreaTecnicaRoutes extends BaseModule{
    constructor(config: BaseConfig) {
        super('areatecnica', config);
    };
};

export default AreaTecnicaRoutes;