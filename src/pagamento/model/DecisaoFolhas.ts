import type { IEntity } from "./generic/IEntity";

export interface IDecisaoFolha extends IEntity{
  Horario: string;
  TipoAcaoFolha: string;
  Justificativa: string | null;
}

export default class DecisaoFolha implements IDecisaoFolha{
  constructor(public Id: string, public Horario: string, public TipoAcaoFolha: string,  public Justificativa: string| null, ) {
    this.Id = Id;
    this.Justificativa = this.Justificativa;
    this.Horario = Horario;
    this.TipoAcaoFolha = TipoAcaoFolha;
  }
}