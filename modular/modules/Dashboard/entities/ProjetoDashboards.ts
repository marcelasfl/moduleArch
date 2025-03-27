import type { IEditalDashboard } from "./EditalDashboards";

type ApiPagination = {
    Total: number;
    TotalPages: number;
    Page: number;
    Size: number;
}

type ApiPaginationResponse<T> = {
    Data: T[];
} & ApiPagination

export type IProjetoDashboard = {
    Id: string;
    Nome?: string;
    DataInicio?: string;
    DataFimPrevista?: string;
    Edital?: IEditalDashboard;
    AlocacaoBolsistas?: AlocacaoBolsista[];
    OrcamentoTotal?: number;
    OrcamentoBolsa?: number;
    [key: string]: any;
    
}


const getAreasTecnicas = async (): Promise<ApiPaginationResponse<IProjetoDashboard>> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboards/projeto`)
    return await response.json()
}