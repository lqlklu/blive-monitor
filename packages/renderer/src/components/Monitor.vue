<script lang="ts" setup>
import { ref, computed } from "vue";
import { ElButton, ElIcon } from "element-plus";
import "element-plus/es/components/button/style/css";
import { Close } from "@element-plus/icons-vue";

import DanmuList from "@/components/DanmuList.vue";
import SuperchatList from "@/components/SuperchatList.vue";
import GiftList from "@/components/GiftList.vue";

import router from "@/router";
import { useBlive } from "@/composables";
import { useLocalStorage, useWindowSize } from "@vueuse/core";
import { useDanmuStore } from "@/stores";

const props = defineProps<{
  id: number;
}>();

const danmuStore = useDanmuStore();

const { watched, title, uname } = useBlive(props.id);

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
      <div class="close-button">
        <ElIcon>
          <Close />
        </ElIcon>
      </div>
      <div class="content-l">
        <span :class="['title']">{{ `${title}` }}</span>
        <span :class="['watched']">{{ `${watched}` }}</span>
      </div>
      <div class="content-r">
        <span>{{ `${uname}` }}</span>
      </div>
    </div>
    <div class="container" :style="{ height: `${containerHeight}px`, top: `${headerHeight}px` }">
      <DanmuList :style="{ width: `${dmWidth}px` }" />
      <SuperchatList :style="{ width: `${scWidth}px`, left: `${dmWidth}px` }" />
      <GiftList :style="{ width: `${gfWidth}px`, left: `${dmWidth + scWidth}px` }" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.monitor {
  height: 100%;
}
.header {
  height: 1.4rem;
  flex-grow: 0;
  background-color: rgb(34, 34, 34);
  display: flex;
  .content-l {
    flex-grow: 1;
    height: 100%;
    display: inline-flex;
    flex-direction: row;
    align-items: center;

    span {
      line-height: 100%;
      margin: 0 0.5rem;
    }
  }
  .content-r {
    flex-grow: 0;
    height: 100%;
    display: inline-flex;
    align-items: center;

    span {
      line-height: 100%;
      margin: 0 0.5rem;
    }
  }
}

.close-button {
  height: 100%;
  width: 42px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.close-button:hover {
  background-color: red;
}

.container {
  position: absolute;
  width: 100%;
}
</style>
