import { defineStore } from "pinia";
import type { Danmu, Medal } from "@/api";

export type DanmuPadItem = Danmu & { count: number };

export const useDanmuStore = defineStore("danmu", {
  state: () => {
    const xMax = 4;
    const yMax = 10;
    var list = new Array<DanmuPadItem>(xMax * yMax);

    return {
      xMax,
      yMax,
      xNext: 0,
      yNext: 0,
      latest: null as number | null,
      list,
    };
  },
  getters: {
    get(state): (x: number, y: number) => DanmuPadItem | undefined {
      return (x: number, y: number) => {
        const idx = x * state.yMax + y;
        return state.list[idx];
      };
    },
    isLatest(state): (x: number, y: number) => boolean {
      return (x: number, y: number) => {
        if (state.latest !== null) {
          const idx = x * state.yMax + y;
          return state.latest == idx;
        } else {
          return false;
        }
      };
    },
  },
  actions: {
    add(it: Danmu) {
      const p = this.list.find((i) => {
        if (i) {
          if (i.message == it.message) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      });
      if (p) {
        p.count += 1;
      } else {
        const nextIdx = this.xNext * this.yMax + this.yNext;
        this.latest = nextIdx;
        this.list[nextIdx] = { ...it, count: 1 };
        this.moveToNext();
      }
    },
    moveToNext() {
      this.yNext += 1;
      if (this.yNext >= this.yMax) {
        this.yNext = 0;
        this.xNext += 1;
        if (this.xNext >= this.xMax) {
          this.xNext = 0;
        }
      }
    },
    setSize(size: number) {
      this.list.length = size;
    },
    setXMax(v: number) {
      this.xMax = v < 1 ? 1 : v;
      this.setSize(this.xMax * this.yMax);
    },
    setYMax(v: number) {
      this.yMax = v < 1 ? 1 : v;
      this.setSize(this.xMax * this.yMax);
    },
  },
});
