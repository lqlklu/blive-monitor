<script lang="ts" setup>
import { computed } from "vue";
import { Medal, medalColor } from "@/api";

const props = defineProps<{
  medal?: Medal;
}>();
const bgColor = computed(() => props.medal?.color || medalColor(props.medal?.level || 0));
</script>

<template>
  <div
    v-if="props.medal && props.medal.level != 0"
    class="medal"
    :style="{
      backgroundColor: bgColor,
      borderColor: bgColor,
    }"
  >
    <div class="label">
      <span class="name">
        {{ props.medal?.name }}
      </span>
    </div>
    <div
      class="level"
      :style="{
        color: bgColor,
      }"
    >
      {{ props.medal?.level }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.medal {
  display: inline-flex;
  padding: 1px;
  box-sizing: content-box;
  height: 14px;
  line-height: 14px;
  color: white;
  border: 1px solid transparent;
  border-radius: 2px;
  font-size: 12px;
  position: relative;
  font-family: "Microsoft YaHei", "Microsoft Sans Serif", "Microsoft SanSerf", "\5FAE\8F6F\96C5\9ED1";

  .label {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 12px;
    padding: 0 4px;
    color: white;
    border-top-left-radius: 1px;
    border-bottom-left-radius: 1px;

    .name {
      display: block;
    }
  }

  .level {
    width: 16px;
    text-align: center;
    background-color: white;
    border-top-left-radius: 1px;
    border-bottom-right-radius: 1px;
  }
}
</style>
