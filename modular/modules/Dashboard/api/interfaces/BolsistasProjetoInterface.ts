export type ApiPagination = {
    Total: number;
    TotalPages: number;
    Page: number;
    Size: number;
  };
  
  export type ApiPaginationResponse<T> = {
    Data: T[];
  } & ApiPagination;

  export type IBolsistasProjetoDashboard = {
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
  // Interface para o serviço de resoluções
  export interface BolsistasProjetoServiceInterface {
    getBolsistasPorProjeto(): Promise<ApiPaginationResponse<IBolsistasProjetoDashboard>>;
    getBolsistasPorProjetoById(id?: string): Promise<ApiPaginationResponse<IBolsistasProjetoDashboard>>;
  }