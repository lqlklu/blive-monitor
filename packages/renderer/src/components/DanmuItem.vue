<script lang="ts" setup>
import MedalView from "@/views/MedalView.vue";
import { useDanmuStore, DanmuPadItem } from "@/stores/danmu";

const danmuStore = useDanmuStore();

const props = defineProps<{
  item?: DanmuPadItem;
  x: number;
  y: number;
}>();
</script>

<template>
  <div class="danmu-item">
    <div class="top-wrap" :class="{ latest: danmuStore.isLatest(props.x, props.y) }">
      <div class="top">
        <MedalView :medal="props.item?.medal" />
        <div class="uname" :style="{ color: props.item?.user.color || undefined }">{{ props.item?.user.name || "" }}</div>
        <span class="count">{{ props.item ? (props.item.count > 1 ? `\u00D7${props.item.count}` : ``) : `` }}</span>
      </div>
    </div>
    <div class="message-wrap">
      <div class="message">{{ props.item?.message || "" }}</div>
    </div>
  </div>
</template>

<style scoped>
.danmu-item {
  padding: 1px 1px;
}
.top-wrap {
  padding: 4px 8px;
  border-start-start-radius: 6px;
  border-start-end-radius: 6px;
  background-color: rgb(59, 59, 59);
  color: white;
}
.top-wrap.latest {
  background-color: rgb(95, 87, 41);
}
.top {
  font-size: 0.75rem;
  height: 0.8rem;
  margin: 0;
  padding: 0;
  line-height: 1;
  display: flex;
  flex-direction: row;
}
.uname {
  padding: 0;
  margin: 0;
  overflow: hidden;
  height: 1rem;
  line-height: 1;
  display: inline;
  flex-grow: 1;
}
.count {
  flex-grow: 0;
}
.message-wrap {
  padding: 4px 8px;
  border-end-start-radius: 6px;
  border-end-end-radius: 6px;
  background-color: rgb(128, 128, 128);
  color: white;
}
.message {
  height: 1.4rem;
  font-size: 0.9rem;
  margin: 0;
  padding: 0;
  overflow: hidden;
  height: 1rem;
  line-height: 1;
}
</style>
