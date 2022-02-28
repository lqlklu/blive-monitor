<script lang="ts" setup>
import Monitor from "@/components/Monitor.vue";
const props = defineProps<{
  roomid: string;
}>();
</script>

<template>
  <Monitor :roomid="props.roomid" />
</template>

<style></style>
