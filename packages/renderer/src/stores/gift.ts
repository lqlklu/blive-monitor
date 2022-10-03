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
      const p = this.list.find((i) => {
        if (i) {
          if (i.giftName == it.giftName && i.user.id == it.user.id) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      });
      if (p) {
        p.num += it.num;
      } else {
        this.list.push(it);
      }
    },
  },
});
