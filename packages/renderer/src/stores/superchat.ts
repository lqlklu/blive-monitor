import { defineStore } from "pinia";

import type { SuperChat } from "@/api";

export const useSuperchatStore = defineStore("superchat", {
  state: () => {
    return {
      list: new Array<SuperChat>(),
    };
  },
  actions: {
    add(it: SuperChat) {
      this.list.push(it);
    },
  },
});
