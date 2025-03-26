import type { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { errorFactory } from "../../../../api/factory/ErrorFactory";
import type { IResolucao } from "../entities/Resolucao";

// [MELHORIA] - Princípio de Inversão de Dependência (DIP):
// Embora a classe receba a API por injeção de dependência (bom),
// deveria depender de uma abstração (interface) e não diretamente do AxiosInstance

export class ResolucaoService {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  // [MELHORIA] - Problemas no tipo de retorno:
  // O retorno Promise<AxiosResponse<IResolucao> | void> é problemático
  // pois permite retornar void, o que pode causar erros silenciosos
  // Recomendação: Usar um tipo de resposta consistente, como Promise<Result<IResolucao>>
  // que sempre retorna um objeto com status de sucesso/erro e dados quando disponíveis
  async getResolucao(): Promise<AxiosResponse<IResolucao> | void> {
    try {
      const response = await this.api.get<IResolucao>("modalidadebolsa/resolucao");
      return response;
    } catch (error: unknown) {
      // [MELHORIA] - Problema crítico:
      // errorFactory não retorna nada, gerando erro silencioso
      // Além disso, tratamento de erros deveria ser mais robusto
      return errorFactory((error as AxiosError).response?.status);
    }
  }

  async save(resolucao: IResolucao): Promise<AxiosResponse<IResolucao> | void> {
    try {
      const response = await this.api.post<IResolucao>("modalidadebolsa/resolucao", resolucao);
      return response;
    } catch (error: unknown) {
      return errorFactory((error as AxiosError).response?.status);
    }
  }
}
