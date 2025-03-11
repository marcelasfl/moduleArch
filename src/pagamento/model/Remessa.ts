import type { IEntity } from "./generic/IEntity";

export interface IRemessa extends IEntity{
    Numero: number;
    DataEnvio: string;
    DataRetorno: string | null;
    ArquivoEnviado: string;
    ArquivoRetorno: string | null;
}

export default class Remessa implements IRemessa{
    
    constructor(public Id: string, public Numero: number, public DataEnvio: string, public DataRetorno: string | null, public ArquivoEnviado: string, public ArquivoRetorno: string | null) {
        this.Id = Id;
        this.Numero = Numero;
        this.DataEnvio = DataEnvio;
        this.DataRetorno = DataRetorno;
        this.ArquivoEnviado = ArquivoEnviado;
        this.ArquivoRetorno = ArquivoRetorno;
    };
};