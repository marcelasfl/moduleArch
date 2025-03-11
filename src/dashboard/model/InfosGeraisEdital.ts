
import type { IEntity } from "./generic/IEntity";


export interface IInfosGeraisEdital extends IEntity {
      Id: string,
      qtdProjetos: number,
      qtdBolsistasAtivos: number,
      qtdBolsistasSuspensos: number
}


export default class InfosGeraisEdital implements IInfosGeraisEdital {

    constructor(
        public Id: string,
        public qtdProjetos: number,
        public qtdBolsistasAtivos: number,
        public qtdBolsistasSuspensos: number,


    ) {
        this.Id = Id;
        this.qtdProjetos = qtdProjetos;
        this.qtdBolsistasAtivos = qtdBolsistasAtivos;
        this.qtdBolsistasSuspensos = qtdBolsistasSuspensos;
    }


}