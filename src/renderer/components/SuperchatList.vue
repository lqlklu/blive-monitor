<template>
  <div class="superchat-list">
    <div class="list">
      <SuperchatItem v-for="it in store.list" :item="it" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSuperchatStore } from "@/stores/superchat";
import SuperchatItem from "@/components/SuperchatItem.vue";

const store = useSuperchatStore();
</script>

<style scoped>
.superchat-list {
  height: 100%;
  flex: 1 1 0;
}
.list {
  overflow: auto;
}
</style>
