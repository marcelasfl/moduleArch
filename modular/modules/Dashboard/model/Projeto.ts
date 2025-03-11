import type { IEntity } from "./generic/IEntity";
import Edital from "./Edital";
import type AlocacaoBolsista from "./AlocacaoBolsista";

export interface IProjeto extends IEntity {
    Id: string;
    Nome?: string;
    DataInicio?: string;
    DataFimPrevista?: string;
    Edital?: Edital;
    AlocacaoBolsistas?: AlocacaoBolsista[];
    OrcamentoTotal?: number;
    OrcamentoBolsa?: number;
    [key: string]: any;
}

export default class Projeto implements IProjeto {

    constructor(
        public Id: string,
        public Nome?: string,
        public DataInicio?: string,
        public DataFimPrevista?: string,
        public Edital?: Edital,
        public AlocacaoBolsistas?: AlocacaoBolsista[],
        public OrcamentoTotal?: number,
        public OrcamentoBolsa?: number,
    ) {
        this.Id = Id;
        this.Nome = Nome;
        this.DataInicio = DataInicio;
        this.DataFimPrevista = DataFimPrevista;
        this.Edital = Edital;
        this.AlocacaoBolsistas = AlocacaoBolsistas;
        this.OrcamentoTotal = OrcamentoTotal;
        this.OrcamentoBolsa = OrcamentoBolsa;
    }

}