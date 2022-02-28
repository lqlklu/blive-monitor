<script lang="ts" setup>
import { defineProps } from "vue";
import type { Medal } from "@/api";

interface Props {
  medal?: Medal;
}

const props = defineProps<Props>();
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
  margin-right: 12px;
  font-size: 0.3rem;
}
</style>
