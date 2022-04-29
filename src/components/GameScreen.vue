<template>
  <p>You are in {{ gameid }}</p>
  <p>Players:</p>
  <ul>
    <li v-for="player in players" :key="player">
      {{ player }}
    </li>
  </ul>
  <p>Hello, {{ nickname }}!</p>

  <button @click="leaveGame">Leave Game</button>
</template>

<script setup lang="ts">
import {ref, defineProps} from "vue";
import SocketioService from "@/socketio.service";

defineProps({
  gameid: String,
  nickname: String,
});

const players = ref({});

SocketioService.socket.on('update', gameState => {
  players.value = gameState.players;
});

const leaveGame = () => {
  console.log('attempting to leave');
  SocketioService.socket.emit('leave');
}

</script>

<style scoped>

</style>