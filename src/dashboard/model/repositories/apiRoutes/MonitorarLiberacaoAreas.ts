import type { BaseConfig } from './BaseConfig';
import BaseModule from './BaseModule';

class MonitorarLiberacaoAreasRoutes extends BaseModule{
    constructor(config: BaseConfig) {
        super('editalcompetencia', config);
    };

    get monitorarLiberacaoEdital(): string {
        return `${this.entity}/monitorarliberacaoedital`;
    }
};

export default MonitorarLiberacaoAreasRoutes;