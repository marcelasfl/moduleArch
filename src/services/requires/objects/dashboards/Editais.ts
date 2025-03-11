import type { BaseConfig } from '../BaseConfig';
import BaseModule from './BaseModule';

class AlocacaoBolsista extends BaseModule{
    declare module: any;
    declare entityName: any;
    Nome: any;
    Projetos: any;
    constructor(config: BaseConfig) {
        super('pagamentobolsistas', config);
    };
    
    get editais(): string {
        return `edital?$expand=Projetos($expand=AlocacaoBolsistas($expand=versaonivel($expand=nivelbolsa)))`
    }

};

export default AlocacaoBolsista;