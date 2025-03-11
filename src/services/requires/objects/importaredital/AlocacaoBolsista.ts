import type { BaseConfig } from '../BaseConfig';
import BaseModule from '../dashboards/BaseModule';

class AlocacaoBolsista extends BaseModule{
    constructor(config: BaseConfig) {
        super('alocacaobolsista', config);
    };

    get importacaoexpand(): string {
        return `${this.module}/${this.entityName}/completarcota`
    };

    get expandRota(): string {
        return `${this.module}/${this.entityName}?$expand=Projeto($expand=Edital($expand=AreaTecnica)),VersaoNivel,Pessoa`
    }
    
    get teste() : string {
        return `${this.module}/${this.entityName}?$select=InicioAtividade,DataPrevistaFimAtividade,QtdeCotas,Status&$expand=Projeto($select=Nome,DataInicio,DataFimPrevista;$expand=Edital($select=Nome)),VersaoNivel($expand=NivelBolsa($select=sigla)),Pessoa($select=Nome)`
    }
};

export default AlocacaoBolsista;