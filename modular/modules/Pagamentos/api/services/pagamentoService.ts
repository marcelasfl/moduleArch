import api from "@/ModularArch/api/axios";
import type { IFolha } from "../entities/Folha";
import { errorFactory } from "@/ModularArch/api/factory/ErrorFactory";
import type { AxiosError } from "axios";

export function pagamentoService<PagamentoApi>() {
  const getFolha = async () => {
    try {
      return await api.get<IFolha>('pagamentobolsistas/folha')
    } catch (error: unknown) {
      return errorFactory((error as AxiosError).response?.status)
    }
  }

  return {
    getFolha
  }
}