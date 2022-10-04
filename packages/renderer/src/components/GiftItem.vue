<script lang="ts" setup>
import { computed } from "vue";

import MedalView from "@/views/MedalView.vue";

import type { Gift } from "@/api";

const props = defineProps<{
  it: Gift;
}>();
const price = computed(() => {
  if (props.it.discountPrice > 0) {
    return `\u{1F50B}${props.it.discountPrice / 100}`;
  } else {
    return "";
  }
  // if (props.it.price > 0) {
  //   return `\u{1F50B}${props.it.price / 100}`;
  // } else if (props.it.gold > 0) {
  //   return `\u{1F50B}${props.it.gold}`;
  // } else if (props.it.silver > 0) {
  //   return `${props.it.silver}`;
  // } else {
  //   return "";
  // }
});
</script>

<template>
  <div class="gift-item">
    <div class="top-wrap">
      <div class="top">
        <MedalView class="medal" :medal="props.it.medal" />
        <span class="uname" :style="{ color: props.it.user.color || undefined }">{{ props.it.user.name }}</span>
        <span class="price">{{ price }}</span>
      </div>
    </div>
    <div class="message-wrap">
      <div class="message">
        <span class="gift-name">
          {{ `${props.it.giftName}` }}
        </span>
        <span class="num">
          {{ ` \u00D7 ${props.it.num}` }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gift-item {
  padding: 2px;
}
.top-wrap {
  padding: 4px;
  border-start-start-radius: 6px;
  border-start-end-radius: 6px;
  background-color: rgb(59, 59, 59);
  color: white;
}
.top {
  font-size: 0.75rem;
  height: 0.8rem;
  margin: 0;
  padding: 0;
  line-height: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.medal {
  margin-right: 3px;
}
.uname {
  padding: 0;
  margin: 0;
  overflow: hidden;
  display: inline;
  flex-grow: 1;
}
.price {
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
  font-size: 0.9rem;
  margin: 0;
  padding: 0;
  line-height: 1.1;
}
</style>
