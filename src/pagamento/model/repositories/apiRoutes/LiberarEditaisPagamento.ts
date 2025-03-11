import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import type { BaseConfig } from './BaseConfig';
import BaseModule from './BaseModule';

class LiberarEditaisRoutes extends BaseModule{
    constructor(config: BaseConfig) {
        super('editalcompetencia', config);
    };

    get liberarEdital(): string {
        return `${this.entity}/liberacao`;
    }

    get monitorarLiberacaoEdital(): string {
        return `${this.entity}/monitorarliberacaoedital`;
    }

    get confirmarGeracaoFolha(): string {
        return `${this.entity}/confirmargeracaofolha`;
    }

    get liberarEditalCurrentMonth(): string {
        return `${this.entity}?$expand=Edital,DecisaoLiberacoes,PlanoMensal&$filter=PlanoMensal/EhAtual%20eq%20true`;
    }

    get liberarEditalPrevMonths(): string {
        return `${this.entity}?$expand=Edital,DecisaoLiberacoes,PlanoMensal&$filter=PlanoMensal/EhAtual eq false and (Status eq 'SEM_DECISAO' or Status eq 'NAO_LIBERADO')`;
    }

    get bulk(): string {
        return `${this.entity}/bulk`;
    }

    get monitorarEdital(): string {
        const dataAtual = dayjs().utc().toISOString();
        const mesAnterior = dayjs().subtract(1, 'month').month() + 1;
        return `${this.entity}?$expand=Edital($expand=AreaTecnica),PlanoMensal,DecisaoLiberacoes($orderby=horario)&$filter=(PlanoMensal/EhAtual eq true and ${dataAtual} ge PlanoMensal/MarcoGeracaoFolha) or (month(PlanoMensal/Mes) eq ${mesAnterior})`;
    }

    get visualizarLiberacao(): string {
        return `${this.entity}/visualizarliberacaoporarea/${this.config.id}`
    }
};

export default LiberarEditaisRoutes;