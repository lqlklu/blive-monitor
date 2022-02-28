<template>
  <div class="welcome">
    <div class="form">
      <div class="input">
        <input v-model="roomId" type="text" @keypress="inputKeypress($event)" placeholder="room id" />
      </div>
      <div class="enter">
        <button @click="enter">Enter</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import router from "@/router";

const roomId = ref("");
onMounted(() => {
  const v = localStorage.getItem("roomid");
  if (v) {
    roomId.value = v;
  }
});
const enter = () => {
  localStorage.setItem("roomid", roomId.value);
  const roomid = parseInt(roomId.value);
  router.push({ name: "monitor", params: { roomid } });
};
const inputKeypress = (ev: KeyboardEvent) => {
  if (ev.key == "Enter") {
    enter();
  }
};
</script>

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
