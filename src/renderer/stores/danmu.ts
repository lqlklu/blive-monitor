import { defineStore } from "pinia";
import type { Danmu, Medal } from "@/api/entity";

export const useDanmuStore = defineStore("danmu", {
  state: () => {
    var list = new Array<Danmu | null>();
    const row = 10;
    const column = 3;
    for (var i = 0; i < row * column; ++i) {
      list.push(null);
    }

    return {
      row,
      column,
      rowOffset: 0,
      columnOffset: 0,
      list,
    };
  },
  getters: {
    columns() {
      const ret = Array<Array<Danmu | null>>();
      for (var i = 0; i < this.column; ++i) {
        ret.push(this.list.slice(i * this.row, (i + 1) * this.row));
      }
      return ret;
    },
  },
  actions: {
    add(it: Danmu) {
      if (this.rowOffset >= this.row) {
        this.rowOffset = 0;
        this.columnOffset++;
        if (this.columnOffset >= this.column) {
          this.columnOffset = 0;
        }
      }
      this.list[this.columnOffset * this.row + this.rowOffset] = it;
      this.rowOffset++;
    },
    setSize(size: number) {
      if (size < 1) {
        size = 1;
      }
      if (this.list.length < size) {
        for (var i = this.list.length; i < size; ++i) {
          this.list.push(null);
        }
      } else if (this.list.length > size) {
        for (var i = size; i < this.list.length; ++i) {
          this.list.pop();
        }
      }
    },
    setRow(r: number) {
      this.row = r < 1 ? 1 : r;
      this.setSize(this.row * this.column);
    },
    setColumn(c: number) {
      this.column = c < 1 ? 1 : c;
      this.setSize(this.row * this.column);
    },
  },
});
