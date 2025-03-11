
import type { IEntity } from "./generic/IEntity";


export interface IInfosGeraisProjeto extends IEntity {
      Id: string,
      qtdBolsistasAtivos: number,
      qtdBolsistasSuspensos: number,
      qtdBolsistasDocumentacaoPendente: number,
      qtdBolsistasPendentesAvaliacao: number
}


export default class InfosGeraisProjeto implements IInfosGeraisProjeto {

    constructor(
        public Id: string,
        public qtdBolsistasAtivos: number,
        public qtdBolsistasSuspensos: number,
        public qtdBolsistasDocumentacaoPendente: number,
        public qtdBolsistasPendentesAvaliacao: number


    ) {
        this.Id = Id;
        this.qtdBolsistasAtivos = qtdBolsistasAtivos;
        this.qtdBolsistasSuspensos = qtdBolsistasSuspensos;
        this.qtdBolsistasDocumentacaoPendente = qtdBolsistasDocumentacaoPendente;
        this.qtdBolsistasPendentesAvaliacao = qtdBolsistasPendentesAvaliacao;

    }


}