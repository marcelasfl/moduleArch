import type { BaseConfig } from './BaseConfig';
import BaseRoute from './BaseRoute';

class CotasRemanescentesRoutes extends BaseRoute{
    constructor(config: BaseConfig) {
        super('dashboards', "saldocotasprojeto", config);
    };

    get count() {
        return "?$count=true"
    }
};

export default CotasRemanescentesRoutes;