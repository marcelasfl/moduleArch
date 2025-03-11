import type { BaseConfig } from './BaseConfig';
import BaseModule from './BaseModule';

class VisualizarPreviaFolhaRoutes extends BaseModule{
    constructor(config: BaseConfig) {
        super('editalcompetencia', config);
    };

    get visualizarPreviaFolha(): string {
        return `${this.entity}/visualizarpreviafolha`;
    }
};

export default VisualizarPreviaFolhaRoutes;