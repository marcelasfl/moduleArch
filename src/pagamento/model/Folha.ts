import type { IEntity } from "./generic/IEntity";
import type { IDecisaoFolha } from "./DecisaoFolhas";
import type { IPlanoMensal } from "./PlanoMensal";
import type { IPagamentoBolsista } from "./PagamentoBolsista";
import type { IRemessaPagamento } from "./RemessaPagamento";

export interface IFolha extends IEntity{
    Ordem: number;
    Titulo: string;
    DataPagamento: string;
    ValorPrevisto: number;
    ValorPago: number;
    Status: string;
    FolhaPlanoMensalId: string;
    DateCreated: string;
    DecisaoFolhas: IDecisaoFolha[];
    Horario: string | null;
    PlanoMensal: IPlanoMensal;
    PagamentoBolsistas: IPagamentoBolsista[];
    RemessaPagamentos: IRemessaPagamento[];
}

export default class Folha implements IFolha{
    constructor(public Id: string, public Ordem: number, public Titulo: string, public DataPagamento: string, public ValorPrevisto: number, 
        public ValorPago: number, public Status: string, public FolhaPlanoMensalId: string, public DateCreated: string, public DecisaoFolhas: IDecisaoFolha[], 
        public Horario: string | null, public PlanoMensal: IPlanoMensal, public PagamentoBolsistas: IPagamentoBolsista[], public RemessaPagamentos: IRemessaPagamento[]) {
        this.Id = Id;
        this.Ordem = Ordem;
        this.Titulo = Titulo;
        this.DataPagamento = this.DataPagamento;
        this.ValorPrevisto = ValorPrevisto;
        this.ValorPago = ValorPago;
        this.Status = Status;
        this.FolhaPlanoMensalId = FolhaPlanoMensalId;
        this.DateCreated = DateCreated;
        this.DecisaoFolhas = DecisaoFolhas;
        this.Horario = Horario;
        this.PlanoMensal = PlanoMensal;
        this.PagamentoBolsistas = PagamentoBolsistas;
        this.RemessaPagamentos = RemessaPagamentos;
    }
}