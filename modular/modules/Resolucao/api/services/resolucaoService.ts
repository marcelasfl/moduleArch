import type { AxiosError, AxiosResponse } from "axios";
import api from "../../../../api/apiProvider";
import { errorFactory } from "../../../../api/factory/ErrorFactory";
import type { IResolucao } from "../entities/Resolucao";

export function resolucaoService<ResolucaoApi>() {
  const getResolucao = async (): Promise<AxiosResponse<IResolucao> | void> => {
    try {
      const response = await api.get<IResolucao>('modalidadebolsa/resolucao');
      return response;
    } catch (error: unknown) {
      return errorFactory((error as AxiosError).response?.status)
    }
  }

  const save = async (resolucao: IResolucao): Promise<AxiosResponse<IResolucao> | void> => {
    try {
      const response = await api.post<IResolucao>('modalidadebolsa/resolucao', resolucao);
      return response;
    } catch (error: unknown) {
      return errorFactory((error as AxiosError).response?.status)
    }
  }

  return {
    getResolucao,
    save
  }
}