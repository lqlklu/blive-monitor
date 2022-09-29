import type { Gift } from "@/api";
import { defineStore } from "pinia";

export const useGiftStore = defineStore("gift", {
  state: () => {
    return {
      list: new Array<Gift>(),
    };
  },
  actions: {
    add(it: Gift) {
      this.list.push(it);
    },
  },
});
