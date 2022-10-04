import type { Gift } from "@/api";
import { defineStore } from "pinia";

export const useGiftStore = defineStore("gift", {
  state: () => {
    return {
      freeList: new Array<Gift>(),
      costList: new Array<Gift>(),
    };
  },
  actions: {
    add(it: Gift) {
      if (it.discountPrice > 0) {
        this.addToCost(it);
      } else {
        this.addToFree(it);
      }
    },
    addToFree(it: Gift) {
      const p = this.freeList.find((i) => {
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
        p.price += it.price;
        p.gold += it.gold;
        p.silver += it.silver;
        p.discountPrice += it.discountPrice;
      } else {
        this.freeList.push(it);
      }
    },
    addToCost(it: Gift) {
      const p = this.costList.find((i) => {
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
        p.price += it.price;
        p.gold += it.gold;
        p.silver += it.silver;
        p.discountPrice += it.discountPrice;
      } else {
        this.costList.push(it);
      }
    },
  },
});
