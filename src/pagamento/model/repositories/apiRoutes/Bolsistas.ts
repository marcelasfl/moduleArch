import type { BaseConfig } from "./BaseConfig";
import BaseModule from "./importacaoEdital/BaseModuleEdital";

class BolsistasRoutes extends BaseModule{
    constructor(config: BaseConfig){
        super('alocacaobolsista', config);
    };

    get getAllBolsistas(): string {
        return `${this.entity}?$expand=Pessoa,VersaoNivel($expand=NivelBolsa),Projeto($select=Id)`;
    }

    get getById(): string {
        return `${this.entity}?$expand=Pessoa,Projeto,VersaoNivel($expand=NivelBolsa)&$filter=Projeto/Id eq ${this.config.id}`;
    }
    
};

export default BolsistasRoutes;