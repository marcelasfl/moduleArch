import type { BaseConfig } from '../BaseConfig';
import BaseModule from './BaseModule';

class AlocacaoBolsista extends BaseModule{
    declare module: any;
    declare entityName: any;
    constructor(config: BaseConfig) {
        super('alocacaobolsista', config);
    };

    get importacaoexpand(): string {
        return `${this.module}/${this.entityName}/completarcota`
    };


    get areaTecnicaModalidade(): string {
        return `${this.module}/${this.entityName}?$expand=Editais($expand=Projetos($expand=AlocacaoBolsistas($expand=VersaoNivel($expand=VersaoModalidade($select=Sigla);$select=Id);$select=Id);$select=Nome);$select=Nome)&$select=Nome`
    }
    
    get editais(): string {
        return `edital`
    }

};

export default AlocacaoBolsista;