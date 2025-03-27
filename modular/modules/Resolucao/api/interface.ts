export type ApiPagination = {
    Total: number;
    TotalPages: number;
    Page: number;
    Size: number;
  };
  
  export type ApiPaginationResponse<T> = {
    Data: T[];
  } & ApiPagination;

export type IResolucao = {
    Numero: string;
    Ementa: string;
    Link: string;
    Data: string;
    NumRastreioEdocs: string;
  };
  
  // Interface para o serviço de resoluções
  export interface ResolucaoServiceInterface {
    getResolucao(): Promise<ApiPaginationResponse<IResolucao>>;
    saveResolucao(data: IResolucao): Promise<IResolucao>;
  }