import type { BaseConfig } from "./BaseConfig";
import BaseModule from "./BaseModule";

class EditalRoutes extends BaseModule{
    constructor(config: BaseConfig){
        super('edital', config);
    };

    get projetosEdital(): string {
        return `${this.entity}/${this.config.id}?$expand=AreaTecnica,Projetos($expand=AlocacaoBolsistas)`;
    }
    get edital(): string {
        return `?$expand=Projetos($expand=AlocacaoBolsistas($expand=versaonivel($expand=nivelbolsa)))`
    }
};

export default EditalRoutes;