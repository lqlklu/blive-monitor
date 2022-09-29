<script lang="ts" setup>
import { ref } from "vue";

import DanmuItem from "@/components/DanmuItem.vue";

import { useDanmuStore } from "@/stores/danmu";
import { useRxLength } from "@/composables/useRxLength";
import { range } from "@/utils";

const danmuStore = useDanmuStore();

const ul = ref<Element | null>(null);
useRxLength(ul);
</script>

<template>
  <div class="danmu-list">
    <div class="columns" ref="ul">
      <div class="column rows" v-for="x in range(danmuStore.xMax)">
        <DanmuItem v-for="y in range(danmuStore.yMax)" :item="danmuStore.get(x, y)" :x="x" :y="y" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.danmu-list {
  height: 100%;
  overflow: hidden;
  position: absolute;
  padding: 4px 2px;
  box-sizing: border-box;
}
.columns {
  padding: 0;
  margin: 0;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  flex-direction: row;
}
.column {
  flex: 1 0 0;
  height: 100%;
}
.rows {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
</style>
