import type { BaseConfig } from "./BaseConfig";
import BaseModule from "./BaseModule";

class VisualizarDetalhesArea extends BaseModule{
    constructor(config: BaseConfig) {
        super('folha', config);
    };

    get visualizarDetalhesArea(): string {
        return `${this.entity}`
    }
};

export default VisualizarDetalhesArea;