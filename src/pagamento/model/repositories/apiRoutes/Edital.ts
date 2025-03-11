import type { BaseConfig } from "./BaseConfig";
import BaseModule from "./importacaoEdital/BaseModuleEdital";

class EditalRoutes extends BaseModule{
    constructor(config: BaseConfig){
        super('edital', config);
    };

    get projetosEdital(): string {
        return `${this.entity}/${this.config.id}?$expand=AreaTecnica,Atividade,Projetos($expand=AlocacaoBolsistas)`;
    }

    get expandById(): string {
        return `${this.entity}/${this.config.id}?$expand=*`
    }

    get getAllEditais(): string {
        return `${this.entity}/?$expand=*`
    }
};

export default EditalRoutes;