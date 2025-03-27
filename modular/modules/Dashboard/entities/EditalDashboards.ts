type ApiPagination = {
    Total: number;
    TotalPages: number;
    Page: number;
    Size: number;
}

type ApiPaginationResponse<T> = {
    Data: T[];
} & ApiPagination

export type IEditalDashboard = {
    Nome: string,
    DataCriacao: string,
    AreaTecnica: string,
    EditalAreaTecnicaId: string,
    Status: string,
    Projetos?: Projeto[],
    [key: number]: any;
    AlocacaoBolsistas?: AlocacaoBolsista[],
    [key: string]: any;
    VersaoNivel?: VersaoNivel,
    NivelBolsas?: NivelBolsa
    
}


const getAreasTecnicas = async (): Promise<ApiPaginationResponse<IEditalDashboard>> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboards/edital`)
    return await response.json()
}