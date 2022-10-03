<script lang="ts" setup>
import { ref } from "vue";

import router from "@/router";
import { useLocalStorage } from "@vueuse/core";

const roomId = useLocalStorage("roomId", -1);
const roomIdText = ref(roomId.value >= 0 ? `${roomId.value}` : "");
const enter = () => {
  const r = parseInt(roomIdText.value);
  roomId.value = r;
  router.push(`/${roomId.value}`);
};
const inputKeypress = (ev: KeyboardEvent) => {
  if (ev.key == "Enter") {
    enter();
  }
};
</script>

<template>
  <div class="welcome">
    <div class="form">
      <div class="input">
        <input v-model="roomIdText" type="text" @keypress.stop="inputKeypress($event)" placeholder="room id" />
      </div>
      <div class="enter">
        <button @click="enter">Enter</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.welcome {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.enter {
  margin: 1rem;
  display: inline-flex;
  justify-content: center;
  flex-grow: 0;
}
</style>
