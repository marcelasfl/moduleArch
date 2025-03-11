import type { BaseConfig } from './BaseConfig';
import BaseModule from './BaseModule';

class PlanoMensalRoutes extends BaseModule{
    constructor(config: BaseConfig) {
        super('planomensal', config);
    };

    get filterByYear(): string {
        return `${this.entity}?$orderby=Mes asc&$filter=year(Mes) eq `
    }

    get orderByMonth(): string {
        return `${this.entity}?$orderby=Mes asc`
    }

    get bulk(): string {
        return `${this.entity}/bulk`
    }

    get ehAtual(): string {
        return `${this.entity}?$filter=EhAtual eq true`
    }

    get anterior(): string {
        if (this.config.mes) {
            const data = new Date(this.config.mes);
            const mesAnterior = ((data.getUTCMonth() + 11) % 12) + 1; // Ajusta para o mês anterior, lidando com janeiro.
            const anoAnterior = data.getUTCMonth() === 0 ? data.getUTCFullYear() - 1 : data.getUTCFullYear(); // Ajusta o ano, se necessário.
            return `${this.entity}?$filter=month(Mes) eq ${mesAnterior} and year(Mes) eq ${anoAnterior}`;
        }
        return `${this.entity}`
      }
    
    get posterior(): string {
        if (this.config.mes) {
            const data = new Date(this.config.mes);
            const mesPosterior = ((data.getUTCMonth() + 1) % 12) + 1; // Ajusta para o mês posterior, lidando com dezembro.
            const anoPosterior = data.getUTCMonth() === 11 ? data.getUTCFullYear() + 1 : data.getUTCFullYear(); // Ajusta o ano, se necessário.
        
            return `${this.entity}?$filter=month(Mes) eq ${mesPosterior} and year(Mes) eq ${anoPosterior}`;
        }
        return `${this.entity}`
    }
};

export default PlanoMensalRoutes;