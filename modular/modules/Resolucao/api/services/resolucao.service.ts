import type { HttpClientInterface } from "../../../../api/interface";
import type { ApiPaginationResponse, IResolucao, ResolucaoServiceInterface } from "../interface";

export class ResolucaoService implements ResolucaoServiceInterface {
  private httpClient: HttpClientInterface;

  constructor(httpClient: HttpClientInterface) {
    this.httpClient = httpClient;
  }

  async getResolucao(): Promise<ApiPaginationResponse<IResolucao>> {
    try {
      return await this.httpClient.get<ApiPaginationResponse<IResolucao>>("modalidadebolsa/resolucao");
    } catch (error) {
      throw new Error("Erro ao buscar resoluções."); 
    }
  }

  async saveResolucao(resolucao: IResolucao): Promise<IResolucao> {
      return this.httpClient.post<IResolucao>("modalidadebolsa/resolucao", resolucao);
    } 
  }

