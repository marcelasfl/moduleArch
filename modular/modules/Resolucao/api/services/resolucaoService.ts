import type { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { errorFactory } from "../../../../api/factory/ErrorFactory";
import type { IResolucao } from "../entities/Resolucao";

export class ResolucaoService {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async getResolucao(): Promise<AxiosResponse<IResolucao> | void> {
    try {
      const response = await this.api.get<IResolucao>("modalidadebolsa/resolucao");
      return response;
    } catch (error: unknown) {
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
