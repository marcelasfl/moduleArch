import { defineStore } from "pinia";

export interface Buscar {
  areaTecnica: string | null;
  edital: string | null;
  projeto: string | null;
}

export const useBuscarSelectStore = defineStore("buscarSelectStore", {
  state: () => {
    return {
      areaTecnica: null,
      edital: null,
      projeto: null
    } as Buscar;
  }
});
