import type Modalidade from "./Modalidade";

export interface IQtdBolsasProjeto {
    id: string;
    nome: string;
    projetoEditalId: string;
    modalidades: Modalidade[];
}

export default class QtdBolsasProjeto implements IQtdBolsasProjeto {

    constructor(
        public id: string,
        public nome: string,
        public projetoEditalId: string,
        public modalidades: Modalidade[],
    ) {
        this.id = id;
        this.nome = nome;
        this.projetoEditalId = projetoEditalId;
        this.modalidades = modalidades
    }

}