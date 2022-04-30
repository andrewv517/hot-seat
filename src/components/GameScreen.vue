<template>
  <div>
    <InitialScreenHeader/>

    <PregameScreen :gameState="gameState" :gameId="gameid" v-if="!gameReady" />
    <div class="p-6" v-else>
      <p>Hello, {{ nickname }}!</p>
      <p>You are in {{ gameid }}</p>
      <table class="table-auto w-1/5">
        <tr>
          <td>Player</td>
        </tr>
        <tr v-for="player in players" :key="player">
          <td>{{player}}</td>
        </tr>
      </table>

      <button @click="leaveGame">Leave Game</button>
    </div>
  </div>

</template>

<script setup lang="ts">
import {ref, defineProps} from "vue";
import SocketioService from "@/socketio.service";
import InitialScreenHeader from "@/components/InitialScreenHeader.vue";
import PregameScreen from "@/components/PregameScreen.vue";

defineProps({
  gameid: String,
  nickname: String,
});

const gameReady = ref(false);
const gameState = ref<GameState>({players: {}});

interface PlayerData {
  name: string,
  number: number,
}

interface GameState {
  players: {[id: string]: PlayerData}
}

SocketioService.socket.on('update', (state: GameState) => {
  gameState.value = state;
});

const leaveGame = () => {
  console.log('attempting to leave');
  SocketioService.socket.emit('leave');
}


</script>

<style scoped>
tr:nth-child(odd) {
  @apply border border-slate-400 bg-slate-500;
}
table {
  counter-reset: rowNumber;
}

table tr::before {
  display: table-cell;
  counter-increment: rowNumber;
  content: counter(rowNumber) ".";
}
</style>