import type { IDecisaoFolha } from "./DecisaoFolhas";
import type { IPagamentoBolsista } from "./PagamentoBolsista";
import type { IPlanoMensal } from "./PlanoMensal";
import type { IRemessaPagamento } from "./RemessaPagamento";


type ApiPagination = {
    Total: number;
    TotalPages: number;
    Page: number;
    Size: number;
}

type ApiPaginationResponse<T> = {
    Data: T[];
} & ApiPagination

export type IFolha = {
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


const getFolhas = async (): Promise<ApiPaginationResponse<IFolha>> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pagamentobolsistas/folha`)
    return await response.json()
}