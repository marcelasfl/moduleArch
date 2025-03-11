export interface IErroBanestes{
    Numero: number;
    Descricao: string;
}

export default class ErroBanestes implements IErroBanestes{
    
    constructor(public Numero: number, public Descricao: string) {
        this.Numero = Numero;
        this.Descricao = Descricao;
    };
};