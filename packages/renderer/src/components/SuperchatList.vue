<script lang="ts" setup>
import { ElScrollbar } from "element-plus";
import "element-plus/es/components/scrollbar/style/css";

import SuperchatItem from "@/components/SuperchatItem.vue";
import { useSuperchatStore } from "@/stores/superchat";

const scStore = useSuperchatStore();
</script>

<template>
  <div class="superchat-list">
    <ElScrollbar class="list">
      <SuperchatItem v-for="it in scStore.list" :it="it" />
    </ElScrollbar>
  </div>
</template>

<style scoped>
.superchat-list {
  height: 100%;
  position: absolute;
  box-sizing: border-box;
  padding: 4px 2px;
}
.list {
  overflow: auto;
}
</style>
