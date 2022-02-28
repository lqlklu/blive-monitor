<template>
  <div class="danmu-item">
    <div class="container">
      <div class="content">
        <div class="top">
          <Medal :medal="item?.medal" />
          <p class="uname">{{ item?.user.name || "" }}</p>
        </div>
        <p class="message">{{ item?.message || "" }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toRefs } from "vue";

import Medal from "./Medal.vue";
import type { Danmu } from "@/api/entity";

const props = defineProps<{
  item: Danmu | null;
}>();

const { item } = toRefs(props);
</script>

<style scoped>
.danmu-item {
  padding: 1px 1px;
}
.container {
  background: #555;
  border-radius: 6px;
}
.content {
  color: aliceblue;
  padding: 4px 8px;
}
.top {
  font-size: 0.3rem;
  height: 1rem;
  margin: 0;
  padding: 0;
  line-height: 1;
}
.uname {
  font-size: 0.3rem;
  padding: 0;
  margin: 0;
  overflow: hidden;
  height: 1rem;
  line-height: 1;
  display: inline;
}
.message {
  font-size: 0.9rem;
  margin: 0;
  padding: 0;
  overflow: hidden;
  height: 1rem;
  line-height: 1;
}
</style>
