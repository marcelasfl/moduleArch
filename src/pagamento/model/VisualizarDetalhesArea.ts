import type { IDecisaoFolha } from "./DecisaoFolhas";
import type { IPagamentoBolsista } from "./PagamentoBolsista";
import type { IPlanoMensal } from "./PlanoMensal";

export interface IVisualizarDetalhesArea {
    Id: string;
    Ordem: Number;
    Titulo: string;
    DataPagamento: Date;
    ValorPrevisto: Number;
    ValorPago: Number;
    Status: string;
    PlanoMensal: IPlanoMensal;
    FolhaPlanoMensalId: string;
    DecisaoFolhas: IDecisaoFolha[];
    PagamentoBolsistas: IPagamentoBolsista[];
}

export default class VisualizarDetalhesArea implements IVisualizarDetalhesArea{
    
    constructor(public Id: string, public Ordem: Number, public Titulo: string, public DataPagamento: Date, public ValorPrevisto: Number, public ValorPago: Number, public Status: string, public PlanoMensal: IPlanoMensal, public FolhaPlanoMensalId: string, public DecisaoFolhas: IDecisaoFolha[], public PagamentoBolsistas: IPagamentoBolsista[]) {
        this.Id = Id;
        this.Ordem = Ordem;
        this.Titulo = Titulo;
        this.DataPagamento = DataPagamento;
        this.ValorPrevisto = ValorPrevisto;
        this.ValorPago = ValorPago;
        this.Status = Status;
        this.PlanoMensal = PlanoMensal;
        this.FolhaPlanoMensalId= FolhaPlanoMensalId;
        this.DecisaoFolhas = DecisaoFolhas;
        this.PagamentoBolsistas = PagamentoBolsistas;
    };
};