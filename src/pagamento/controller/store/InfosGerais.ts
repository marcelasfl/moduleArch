import { defineStore } from "pinia";

export const useInfosGeraisStore = defineStore("infosgeraisSelectStore", {
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
