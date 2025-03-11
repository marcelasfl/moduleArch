import { defineStore } from "pinia";

export interface AreaTecnica {
  Id: number;
  Nome: string;
}

export const useAreaTecnicaSelectStore = defineStore("areaTecnicaSelectStore", {
  state: () => {
    return {
      items: [],
      selected: null,
    };
  },
  getters: {
    isFilterFilled: (state) => !!state.selected,
  },
});
