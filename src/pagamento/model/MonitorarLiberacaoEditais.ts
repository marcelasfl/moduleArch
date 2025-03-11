import type { IDetalhesPorAreaTecnica } from "./DetalhesPorAreaTecnica";
import type { IEntity } from "./generic/IEntity";

export interface IMonitorarLiberacaoEditais extends IEntity{
    mes: string,
    detalhesPorAreaTecnica: IDetalhesPorAreaTecnica
}

export default class MonitorarLiberacaoEditais implements IMonitorarLiberacaoEditais {
    
    constructor(public Id: string, public mes: string, public detalhesPorAreaTecnica: IDetalhesPorAreaTecnica) {
        this.Id = Id;
        this.mes = mes;
        this.detalhesPorAreaTecnica = detalhesPorAreaTecnica;
    };
};