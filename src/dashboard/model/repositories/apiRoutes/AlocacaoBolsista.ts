import type { BaseConfig } from './BaseConfig';
import BaseModule from './BaseModule';

class AlocacaoBolsistaRoutes extends BaseModule{
    constructor(config: BaseConfig) {
        super('alocacaobolsista', config);
    };

    get alocacoesPagamentoBolsista(): string {
        return `${this.entity}?$expand=Projeto($expand=Edital($expand=AreaTecnica($select=Id,areaTecnicaEditalId))),VersaoNivel($expand=NivelBolsa($select=Id,Sigla)),Pessoa($select=Id,Nome)&$count=true`
    }

    get pessoaAlocada(): string {
        return `${this.entity}?$select=Id&$expand=Pessoa($select=Id,Nome),VersaoNivel($select=Id,Valor)`
    }
    get expandRota(): string {
        return `${this.entity}?$expand=versaonivel($expand=nivelbolsa($select=sigla)),projeto($expand=edital($expand=areaTecnica))`
    }

    get edital(): string {
        return `edital`
    }

    get count(): string {
        return "?$count=true"
    }
};

export default AlocacaoBolsistaRoutes;