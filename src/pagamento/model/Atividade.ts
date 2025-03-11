import type { IEntity } from "./generic/IEntity";

export interface IAtividade extends IEntity {
    Nome: string;
    Codigo: string;
    Id: string;
}

export default class Atividade implements IAtividade {

    constructor(
        public Nome: string,
        public Codigo: string,
        public Id: string
    ) {
        this.Nome = Nome;
        this.Codigo = Codigo;
        this.Id = Id;
    }
}