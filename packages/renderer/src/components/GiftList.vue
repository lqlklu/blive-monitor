<script lang="ts" setup>
import { ElScrollbar } from "element-plus";
import 'element-plus/es/components/scrollbar/style/css'

import GiftItem from "./GiftItem.vue";
import { useGiftStore } from "@/stores";

const store = useGiftStore();
</script>

<template>
  <div class="gift-list">
    <ElScrollbar class="list">
      <GiftItem v-for="it in store.list" :it="it" />
    </ElScrollbar>
  </div>
</template>

<style scoped>
.gift-list {
  height: 100%;
  position: absolute;
  box-sizing: border-box;
  padding: 4px 2px;
}
.list {
  overflow: auto;
}
</style>
