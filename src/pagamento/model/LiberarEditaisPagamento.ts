import type { IEntity } from "./generic/IEntity";
import type { IEdital } from "./Edital";
import type { IPlanoMensal } from "./PlanoMensal";
import type { IDecisaoLiberacao } from "./DecisaoLiberacao";
import type { IEditalCompetencia } from "./EditalCompetencia";
export interface ILiberarEditaisPagamento extends IEntity {
    mes: string;
    editaisCompetencias: IEditalCompetencia[];
}

export default class LiberarEditaisPagamento implements ILiberarEditaisPagamento{
    
    constructor(public Id: string, public mes: string, public editaisCompetencias: IEditalCompetencia[]) {
        this.Id = Id;
        this.mes = mes;
        this.editaisCompetencias = editaisCompetencias;
    }
}