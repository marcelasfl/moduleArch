import type { BaseConfig } from './BaseConfig';
import BaseModule from './BaseModule';
import BaseRoute from './BaseRoute';

class InfosGeraisRoutes extends BaseRoute{
    constructor(config: BaseConfig) {
        super('dashboards', 'informacoes', config);
    };

    get areatecnica(): string {
        return `/AreaTecnica`
    }

    get edital(): string {
        return `/Edital`
    }
    
    get projeto(): string {
        return `/Projeto`
    }


};

export default InfosGeraisRoutes;