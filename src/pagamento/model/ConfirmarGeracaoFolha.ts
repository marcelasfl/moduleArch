import type { IDetalhesLiberacaoPorMes } from "./DetalhesLiberacaoPorMes";
import type { IEntity } from "./generic/IEntity";

export interface IConfirmarGeracaoFolha extends IEntity{
    areaTecnica: string,
    detalhesLiberacaoPorMes: IDetalhesLiberacaoPorMes
}

export default class ConfirmarGeracaoFolha implements IConfirmarGeracaoFolha {
    
    constructor(public Id: string, public areaTecnica: string, public detalhesLiberacaoPorMes: IDetalhesLiberacaoPorMes) {
        this.Id = Id;
        this.areaTecnica = areaTecnica;
        this.detalhesLiberacaoPorMes = detalhesLiberacaoPorMes;
    };
};