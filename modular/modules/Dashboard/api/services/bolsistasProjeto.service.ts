import type { ApiPaginationResponse, IBolsistasProjetoDashboard, BolsistasProjetoServiceInterface} from '../interfaces/BolsistasProjetoInterface';
import type { HttpClientInterface } from '../../../../api/interface';

export class BolsistasProjetoService implements BolsistasProjetoServiceInterface {
  private httpClient: HttpClientInterface;

  constructor(httpClient: HttpClientInterface) {
    this.httpClient = httpClient;  
  }

  async getBolsistasPorProjeto(): Promise<ApiPaginationResponse<IBolsistasProjetoDashboard>> {
    try {
      return await this.httpClient.get<ApiPaginationResponse<IBolsistasProjetoDashboard>>("dashboards/bolsistaprojeto");
    } catch (error) {
      throw new Error("Erro ao buscar bolsistas por projeto."); 
    }
  }
  async getBolsistasPorProjetoById(id?: string): Promise<ApiPaginationResponse<IBolsistasProjetoDashboard>> {
    try {
      if (!id) {
        throw new Error("Id não informado.");
      }
      return await this.httpClient.get<ApiPaginationResponse<IBolsistasProjetoDashboard>>(`dashboards/bolsistaprojeto/${id}`);
    } catch (error) {
      throw new Error("Erro ao buscar bolsistas por projeto."); 
    }
  }
}
