import { defineStore } from "pinia";

//serve pra registrar no localstorage, se quiser persistir, alterar nesse arquivo;
export const useProjetoSelectStore = defineStore('projetoSelectStore', {
  state: () => {
    interface ProjetoSelectState {
      items: string[];
      selected: string | null;
    }

    return {
      items: [],
      selected: null,
    } as ProjetoSelectState
  },

  getters: {
    isFilterFilled: (state) => !!state.selected,
  },
})
