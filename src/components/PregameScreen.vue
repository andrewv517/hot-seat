<template>
  <div class="w-full">
    <button
        class="fixed top-0 left-0 m-4 p-2 pl-4 pr-4 rounded-full drop-shadow-lg bg-red-800 text-amber-100"
        @click="leaveGame"
    >
      X
    </button>
    <p class="text-xl text-white text-center">Code: {{gameId}}</p>
    <div class="w:5/6 sm:w-2/3 md:w-1/3 m-auto p-6 grid grid-cols-2 gap-4">
      <p class="text-lg text-white">Players:</p>
      <div></div>
      <p
          v-for="player in gameState.players"
          :key="player"
          class="player bg-slate-400 rounded-lg p-2"
      >
        {{player.number}}. {{player.name}}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineProps} from "vue";
import SocketioService from "@/socketio.service";
const props = defineProps<{
  gameState: GameState,
  gameId: string,
}>()

interface PlayerData {
  name: string,
  number: number,
}

interface GameState {
  players: {[id: string]: PlayerData}
}

const leaveGame = () => {
  console.log('attempting to leave');
  SocketioService.socket.emit('leave');
}


console.log(props.gameId);
</script>

<style scoped>

</style>