type ApiPagination = {
    Total: number;
    TotalPages: number;
    Page: number;
    Size: number;
}

type ApiPaginationResponse<T> = {
    Data: T[];
} & ApiPagination

export type IResolucao = {
    Numero: string;
    Ementa: string;
    Link: string;
    Data: string;
    NumRastreioEdocs: string;
}

//na minha visão, nao deve ser aqui o getResolucao, mas na service

// const getResolucao = async (): Promise<ApiPaginationResponse<IResolucao>> => {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/modalidadebolsa/resolucao`)
//     return await response.json()
// }