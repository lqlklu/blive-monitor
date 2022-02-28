import { defineStore } from "pinia";
import type { Superchat } from "@/api/entity";

export const useSuperchatStore = defineStore("superchat", {
  state: () => {
    return {
      list: Array<Superchat>(),
    };
  },
  actions: {
    add(it: Superchat) {
      this.list.push(it);
    },
  },
});
