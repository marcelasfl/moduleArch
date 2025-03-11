import type { IEntity } from "./generic/IEntity";
export interface IDecisaoLiberacao extends IEntity{
    Nome: string;
    DecisaoLiberacaoUsuarioId: string;
    Justificativa: string;
    EhLiberado: boolean;
    Horario: string;
}

export default class DecisaoLiberacao implements IDecisaoLiberacao{
    
    constructor(public Id: string, public Nome: string, public DecisaoLiberacaoUsuarioId: string, public Justificativa: string, public EhLiberado: boolean, public Horario: string) {
        this.Id = Id;
        this.Nome = Nome;
        this.DecisaoLiberacaoUsuarioId = DecisaoLiberacaoUsuarioId;
        this.Justificativa = this.Justificativa;
        this.EhLiberado = EhLiberado;
        this.Horario = Horario;
    }
}