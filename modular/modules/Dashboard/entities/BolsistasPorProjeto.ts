type ApiPagination = {
    Total: number;
    TotalPages: number;
    Page: number;
    Size: number;
}

type ApiPaginationResponse<T> = {
    Data: T[];
} & ApiPagination

export type IBolsistasPorTempoDashboard = {
    id: string,
    nome: string,
    status: number, 
    siglaBolsa: string,
    cotasPagas: number,
    cotasAPagar: number,
    valorBolsa: number,
    valorAPagar: number,
    alocacaoBolsistaProjetoId: string,
    alocacaoBolsistaPessoaId: string,
    coordenadorAtual: boolean
    
}


const getBolsistasProjeto = async (): Promise<ApiPaginationResponse<IBolsistasPorTempoDashboard>> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboards/bolsistaprojeto`)
    return await response.json()
}