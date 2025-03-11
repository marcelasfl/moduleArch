import type ErroBanestes from "./ErroBanestes";

export interface IErroRemessa{
    Nome: string;
    Matricula: string;
    Erros: ErroBanestes[]
}

export default class ErroRemessa implements IErroRemessa{
    
    constructor(public Nome: string, public Matricula: string, public Erros: ErroBanestes[]) {
        this.Nome = Nome;
        this.Matricula = Matricula;
        this.Erros = Erros;
    };
};