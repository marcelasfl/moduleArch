import type ErroRemessa from "./ErroRemessa";
import type { IRemessa } from "./Remessa";

export interface IRemessaPagamento extends IRemessa{
    Status: string;
    Erros: ErroRemessa[];
    // DataAprovacao: string;
    // DataEfetivacao: string;
}

export default class RemessaPagamento implements IRemessaPagamento{
    
    constructor(public Id: string, public Numero: number, public DataEnvio: string, public DataRetorno: string | null, public ArquivoEnviado: string, 
        public ArquivoRetorno: string| null, public Status: string, public Erros: ErroRemessa[]) {
        this.Id = Id;
        this.Numero = Numero;
        this.DataEnvio = DataEnvio;
        this.DataRetorno = DataRetorno;
        this.ArquivoEnviado = ArquivoEnviado;
        this.ArquivoRetorno = ArquivoRetorno;
        this.Status = Status;
        this.Erros = Erros;
    };
};