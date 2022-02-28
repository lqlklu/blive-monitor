<template>
  <div
    class="danmu-list"
    :style="{
      flex: `${store.column} 1 0`,
    }"
  >
    <div class="columns" ref="ul">
      <div class="column rows" v-for="col in store.columns">
        <DanmuItem v-for="it in col" :item="it" :key="it?.id" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import DanmuItem from "@/components/DanmuItem.vue";
import { useDanmuStore } from "@/stores/danmu";

const store = useDanmuStore();

// rx-length >>>
const ul = ref<Element | null>(null);
const setSize = (size: number) => {
  store.setRow(size);
};
const resize = () => {
  const ulH = ul.value?.children[0].clientHeight || 1;
  const liH = ul.value?.children[0].children[0].clientHeight || 1;
  const size = Math.floor(ulH / liH);
  // console.log("resize", size);
  setSize(size);
};
onMounted(() => {
  resize();
  window.addEventListener("resize", resize);
});
onUnmounted(() => {
  window.removeEventListener("resize", resize);
});
// rx-length <<<
</script>

<style scoped>
.danmu-list {
  height: 100%;
  overflow: hidden;
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
  flex: 1 1 0;
  height: 100%;
}
.rows {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
</style>
