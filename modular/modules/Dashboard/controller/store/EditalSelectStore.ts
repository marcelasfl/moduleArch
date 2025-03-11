import { defineStore } from "pinia";

//serve pra registrar no localstorage, se quiser persistir, alterar nesse arquivo;
export const useEditalSelectStore = defineStore('editalSelectStore', {
  state: () => {
    interface EditalSelectState {
      items: string[];
      selected: string | null;
    }
    return {
      items: [],
      selected: null,
    } as EditalSelectState
  },

  getters: {
    isFilterFilled: (state) => !!state.selected,
  },
  
})
