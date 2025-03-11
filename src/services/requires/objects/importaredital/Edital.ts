import type { BaseConfig } from '../BaseConfig';
import BaseModule from '../dashboards/BaseModule';

class Edital extends BaseModule{
    constructor(config: BaseConfig) {
        super('edital', config);
    };

    get importar(): string {
        return `${this.module}/${this.entityName}/importar`;
    };

    get editalProjetos(): string {
        this.expand = 'AreaTecnica,Projetos($expand=AlocacaoBolsistas)';
        return this.expand;
    };

    get editalAreaTecnica(): string {
        return `${this.module}/${this.entityName}?$filter=StatusImportacao eq 'AIMPORTAR' or StatusImportacao eq 'IMPORTADO'&$expand=*`;
    };

    get editalProjetoFiltro(): string {
        return `${this.module}/${this.entityName}?$expand=Projetos($filter=contains(Nome, '${this.config.filter}'))`;
    };

    get editalExpand(): string {
        this.expand = '*';
        return this.expand;
    };
};



export default Edital;