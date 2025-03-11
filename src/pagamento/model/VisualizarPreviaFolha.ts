import type { IDetalhesPorAreaTecnica } from "./DetalhesPorAreaTecnica";
import type { IEntity } from "./generic/IEntity";

export interface IVisualizarPreviaFolha extends IEntity{
    mes: string,
    areasTecnicas: IDetalhesPorAreaTecnica
}

export default class VisualizarPreviaFolha implements IVisualizarPreviaFolha {
    
    constructor(public Id: string, public mes: string, public areasTecnicas: IDetalhesPorAreaTecnica) {
        this.Id = Id;
        this.mes = mes;
        this.areasTecnicas = areasTecnicas;
    };
};