import type { BaseConfig } from './BaseConfig';
import BaseModule from './BaseModule';

class ProjetoRoutes extends BaseModule{
    constructor(config: BaseConfig) {
        super('projeto', config);
    };

    get alocacoesInProjeto(): string {
        return `?$select=Id&expand=AlocacaoBolsistas($select=Id;$expand=versaoNivel($expand=NivelBolsa))`
    }

    get projectDetails(): string {
        return `?$expand=Edital,AlocacaoBolsistas`
    }

    get saldoBolsasProjeto(): string {
        return '?$select=Id,orcamentoBolsa,orcamentoTotal&expand=AlocacaoBolsistas($expand=versaoNivel($expand=NivelBolsa))'
    }
};

export default ProjetoRoutes;