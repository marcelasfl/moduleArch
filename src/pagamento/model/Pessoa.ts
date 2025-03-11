import type { IEntity } from "./generic/IEntity";

export interface IPessoa extends IEntity {
    Id: string;
    Nome: string;
    CPF?: string;
    Email?: string;
    DataNascimento?: string;
}


export default class Pessoa implements IPessoa {

    constructor(
        public Id: string,
        public Nome: string,
        public CPF?: string,
        public Email?: string,
        public DataNascimento?: string
    ) {
        this.Id = Id;
        this.Nome = Nome;
        this.CPF = CPF;
        this.Email = Email;
        this.DataNascimento = DataNascimento;
    }

}