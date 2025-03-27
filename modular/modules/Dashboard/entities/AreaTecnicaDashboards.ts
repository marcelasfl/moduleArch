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

export type IAreaTecnicaDashboard = {
    Id: string;
    Nome?: string;
    Descricao?: string;
    Editais?: IEditalDashboard[];
    AreaTecnicaEditalId?: string;
    
}


const getAreasTecnicas = async (): Promise<ApiPaginationResponse<IAreaTecnicaDashboard>> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboards/areatecnica`)
    return await response.json()
}