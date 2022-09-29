<script lang="ts" setup>
import type { Medal } from "@/api";

const props = defineProps<{
  medal?: Medal;
}>();
</script>

<template>
  <div v-if="props.medal != null" class="medal">
    <span class="name">{{ props.medal?.name }}</span>
    <span class="level">{{ props.medal?.level }}</span>
  </div>
</template>

<style scoped>
.medal {
  display: inline-block;
  margin-right: 10px;
}
</style>
