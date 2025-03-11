import type { BaseConfig } from '../BaseConfig';
import BaseModule from '../dashboards/BaseModule';

class Projeto extends BaseModule{
    protected status?: string; 
    constructor(config: BaseConfig, status?: string) {
        super('pagamentobolsistas/projeto', config);
        if (status) this.status = status;
    };

    get projetoForm(): string {
        this.expand = 'AlocacaoBolsistas($expand=Pessoa)';
        return this.expand;
    };

    get projetoPessoa(): string {
        return `${this.module}/${this.entityName}/${this.config.id}?$expand=AlocacaoBolsistas($expand=Pessoa;$filter=contains(Pessoa/Nome,'${this.config.filter}'))`
    };

    get projetoStatus(): string {
        return `${this.module}/${this.entityName}/${this.config.id}?$expand=AlocacaoBolsistas($expand=Pessoa;$filter=Status eq '${this.status}')`
    };

    get projetoFiltro(): string {
        return `${this.module}/${this.entityName}/${this.config.id}?$expand=AlocacaoBolsistas($expand=Pessoa;$filter=Status eq '${this.status}' and contains(Pessoa/Nome,'${this.config.filter}'))`
    }
};

export default Projeto;