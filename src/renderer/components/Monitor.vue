<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";

import DanmuList from "@/components/DanmuList.vue";
import SuperchatList from "@/components/SuperchatList.vue";
import GiftList from "@/components/GiftList.vue";

import { dial, BliveSocket } from "@/api";
import { useDanmuStore } from "@/stores/danmu";
import { useSuperchatStore } from "@/stores/superchat";

const danmuStore = useDanmuStore();
const superchatStore = useSuperchatStore();

const props = defineProps<{
  roomid: string;
}>();

var ws: BliveSocket | null = null;
onMounted(() => {
  ws = dial("ws://127.0.0.1:6470/blive");
  ws.use((v) => {
    console.log(v);
    return v;
  });
  ws.addOnOpen(() => {
    const roomidInt = parseInt(props.roomid);
    ws?.sendConnect(roomidInt);
  });
  ws.addOnMessage((m) => {
    switch (m.type) {
      case "DANMU":
        danmuStore.add(m.payload);
      case "SUPERCHAT":
        superchatStore.add(m.payload);
      default:
        console.log(m);
    }
  });
  setInterval(() => {
    ws?.sendHeartbeat();
  }, 30 * 1000);
});

onUnmounted(() => {
  ws?.sendClose();
});
</script>

<template>
  <div class="monitor">
    <DanmuList />
    <SuperchatList />
    <GiftList />
  </div>
</template>

<style scoped>
.monitor {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
}
</style>
