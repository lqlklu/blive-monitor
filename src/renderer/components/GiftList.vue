<template>
  <div class="gift-list"></div>
</template>

<script lang="ts" setup>
import { useSuperchatStore } from "@/stores/superchat";
const store = useSuperchatStore();
</script>

<style scoped>
.gift-list {
  height: 100%;
  flex: 1 1 0;
}
</style>
