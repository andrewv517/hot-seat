<template>
  <div class="app">
    <InitialScreen v-if="!inGame"/>
    <GameScreen v-else :gameid="gameId" :nickname="nickname"/>
  </div>
</template>

<script setup lang="ts">
import {onBeforeUnmount, ref} from 'vue';
import SocketioService from "@/socketio.service";
import InitialScreen from "@/components/InitialScreen.vue";
import GameScreen from "@/components/GameScreen.vue";

const inGame = ref(false);
const gameId = ref(undefined);
const nickname = ref(undefined);
SocketioService.socket.on('roomName', (roomName, userName) => {
  inGame.value = true;
  gameId.value = roomName;
  nickname.value = userName;
})

SocketioService.socket.on('left', () => {
  console.log('left game');
  inGame.value = false;
  gameId.value = undefined;
})

onBeforeUnmount(() => {
  SocketioService.disconnect();
  inGame.value = false;
})

</script>

<style>
</style>
