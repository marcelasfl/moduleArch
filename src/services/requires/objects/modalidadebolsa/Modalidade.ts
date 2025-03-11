import BaseModule from './BaseModule'
import type { BaseConfig } from '../BaseConfig';

class Modalidade extends BaseModule{
    constructor(config: BaseConfig) {
        super('modalidadebolsa', config);
    };

    get modalidadeCount(): string {
        this.expand = 'VersaoModalidadesBolsas($expand=*)&$count=true';
        return this.expand;
    };

    get modalidadeConsult(): string {
        this.expand ='VersaoModalidadesBolsas($expand=Resolucao,ModalidadeBolsaCompativeis,RequisitoBolsas,VersaoNiveis($expand=*))';
        return this.expand;
    };

    get modalidadeDetails(): string {
        this.expand ='VersaoModalidadesBolsas($expand=Resolucao,RequisitoBolsas,VersaoNiveis($expand=*))';
        return this.expand;
    };

    get modalidadePagination(): string {
        this.expand = `VersaoModalidadesBolsas&$skip=${this.config.skip}`;
        return this.expand;
    };

    get modalidadeFiltro(): string {
        this.filtro = `${this.config.filter}`;
        return `${this.filtro}&$expand=VersaoModalidadesBolsas($expand=*)&$count=true`
    };
};

export default Modalidade;