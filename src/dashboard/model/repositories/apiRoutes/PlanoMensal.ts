import type { BaseConfig } from './BaseConfig';
import BaseModule from './BaseModule';

class PlanoMensalRoutes extends BaseModule{
    constructor(config: BaseConfig) {
        super('planomensal', config);
    };

    get filterByYear(): string {
        return `${this.entity}?$orderby=Mes asc&$filter=year(Mes) eq `
    }

    get orderByMonth(): string {
        return `${this.entity}?$orderby=Mes asc`
    }

    get bulk(): string {
        return `${this.entity}/bulk`
    }
};

export default PlanoMensalRoutes;