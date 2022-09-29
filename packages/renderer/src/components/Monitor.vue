<script lang="ts" setup>
import { ref, computed } from "vue";

import DanmuList from "@/components/DanmuList.vue";
import SuperchatList from "@/components/SuperchatList.vue";
import GiftList from "@/components/GiftList.vue";

import router from "@/router";
import { useBlive } from "@/composables";
import { useLocalStorage, useWindowSize } from "@vueuse/core";
import { useDanmuStore } from "@/stores";

const props = defineProps<{
  id?: number | undefined;
}>();

const danmuStore = useDanmuStore();

const watched = ref("");

if (props.id) {
  useBlive(props.id, watched);
} else {
  router.replace("/");
}
const onClose = () => {
  router.replace("/");
};

const { width, height } = useWindowSize();
const elw = computed(() => width.value / (danmuStore.xMax + 2));
const dmWidth = computed(() => elw.value * danmuStore.xMax);
const scWidth = computed(() => elw.value);
const gfWidth = computed(() => elw.value);
const headerHeight = ref(30);
const containerHeight = computed(() => height.value - headerHeight.value);
</script>

<template>
  <div class="monitor">
    <div class="header" @click.stop="onClose" :style="{ height: `${headerHeight}px`, top: `0px` }">
      <div class="close-button"></div>
      <span class="watched">{{ `${watched}` }}</span>
    </div>
    <div class="container" :style="{ height: `${containerHeight}px`, top: `${headerHeight}px` }">
      <DanmuList :style="{ width: `${dmWidth}px` }" />
      <SuperchatList :style="{ width: `${scWidth}px`, left: `${dmWidth}px` }" />
      <GiftList :style="{ width: `${gfWidth}px`, left: `${dmWidth + scWidth}px` }" />
    </div>
  </div>
</template>

<style scoped>
.monitor {
  height: 100%;
}
.header {
  height: 1.4rem;
  flex-grow: 0;
  background-color: rgb(34, 34, 34);
}
.close-button {
  height: 100%;
  width: 46px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
.close-button:hover {
  background-color: red;
}
.close-button::before {
  /* content: "\eab8"; */
  content: "X";
}
.watched {
  height: 100%;
}
.container {
  position: absolute;
  width: 100%;
}
.divider {
  background-color: gray;
  width: 4px;
  height: 100%;
  margin: 0;
  padding: 0;
  cursor: col-resize;
}
</style>
