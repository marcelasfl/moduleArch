import type { IEntity } from "./generic/IEntity";
import AlocacaoBolsista from "./AlocacaoBolsista";

export interface IPagamentoBolsista extends IEntity {
    Id: string;
    Ordem: number;
    DataPagamento: string;
    ValorPago: number;
    Status: string;
    MesCompetencia: string;
    PagamentoBolsistaAlocacaoBolsistaId: string;
    AlocacaoBolsista: AlocacaoBolsista;

}


export default class PagamentoBolsista implements IPagamentoBolsista {

    constructor(
        public Id: string,
        public Ordem: number,
        public DataPagamento: string,
        public ValorPago: number,
        public Status: string,
        public MesCompetencia: string,
        public PagamentoBolsistaAlocacaoBolsistaId: string,
        public AlocacaoBolsista: AlocacaoBolsista

    ) {
        this.Id = Id;
        this.Ordem = Ordem;
        this.DataPagamento = DataPagamento;
        this.ValorPago = ValorPago;
        this.Status = Status;
        this.MesCompetencia = MesCompetencia;
        this.PagamentoBolsistaAlocacaoBolsistaId = PagamentoBolsistaAlocacaoBolsistaId;
        this.AlocacaoBolsista = AlocacaoBolsista;

    }
}