
import type { IEntity } from "./generic/IEntity";


export interface IInfosGeraisAreaTecnica extends IEntity {
      Id: string,
      qtdEditais: number,
      qtdProjetos: number,
      qtdBolsistasAtivos: number,
      qtdBolsistasSuspensos: number
}


export default class InfosGeraisAreaTecnica implements IInfosGeraisAreaTecnica {

    constructor(
       public Id: string,
       public qtdEditais: number,
       public qtdProjetos: number,
       public qtdBolsistasAtivos: number,
       public qtdBolsistasSuspensos: number


    ) {
        this.Id = Id;
        this.qtdEditais = qtdEditais,
        this.qtdProjetos = qtdProjetos,
        this.qtdBolsistasAtivos = qtdBolsistasAtivos,
        this.qtdBolsistasSuspensos = qtdBolsistasSuspensos

    }


}