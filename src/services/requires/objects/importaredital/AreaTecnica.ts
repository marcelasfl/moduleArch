import BaseModule from '@/dashboard/model/repositories/apiRoutes/BaseModule';
import type { BaseConfig } from '../BaseConfig';

class AreaTecnica extends BaseModule{
    value: any;
    constructor(config: BaseConfig) {
        super('areatecnica', config);
    };

    get editalAreaTecnica(): string {
        return `${this.module}/${this.entityName}?$filter=StatusImportacao eq 'NAOIMPORTAR' or StatusImportacao eq 'IMPORTADO'&$expand=*`
    }

    get areaTecnicaModalidade(): string {
        return `${this.module}/${this.entityName}?$expand=editais($expand=projetos($expand=alocacaobolsistas($expand=versaoNivel($expand=nivelbolsa))))`
    }

};

export default AreaTecnica;