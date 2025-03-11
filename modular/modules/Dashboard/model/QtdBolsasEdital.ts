import type Modalidade from "./Modalidade";

export interface IQtdBolsasEdital{
    id: string;
    nome: string;
    editalAreaTecnicaId: string;
    modalidades: Modalidade[];
}

export default class QtdBolsasEdital implements IQtdBolsasEdital {

    constructor(
        public id: string,
        public nome: string,
        public editalAreaTecnicaId: string,
        public modalidades: Modalidade[],
    ) {
        this.id = id;
        this.nome = nome;
        this.editalAreaTecnicaId = editalAreaTecnicaId;
        this.modalidades = modalidades;
    }

}