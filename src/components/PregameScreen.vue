<template>
  <div class="w-full">
    <p class="text-2xl font-semibold text-white text-center">Code: {{gameId}}</p>
    <div class="w:5/6 sm:w-2/3 md:w-1/3 m-auto p-6 grid grid-cols-2 gap-4">
      <button
          class="p-2 pl-4 pr-4 rounded-xl drop-shadow-lg bg-red-700 text-amber-100"
          @click="leaveGame"
      >
        Leave Game
      </button>
      <button
          class="p-2 pl-4 pr-4 rounded-xl drop-shadow-lg bg-green-500 text-amber-100"
          @click="startGame"
          v-if="gameState.players[SocketioService.uuid]?.number === 1"
      >
        Start Game
      </button>
      <div v-else></div>
      <p class="text-2xl font-semibold text-white">Players:</p>
      <div></div>
      <div
          v-for="player in gameState.players"
          :key="player"
          class="player bg-slate-400 font-semibold rounded-lg p-2 drop-shadow-xl text-slate-800"
      >
        {{player.number}}. {{player.name}}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineProps, defineEmits} from "vue";
import SocketioService from "@/socketio.service";
import {GameState} from "@/interfaces";
const props = defineProps<{
  gameState: GameState,
  gameId: string,
}>()

const emit = defineEmits(['start']);

const leaveGame = () => {
  console.log('attempting to leave');
  SocketioService.socket.emit('leave');
}

const startGame = () => {
  emit('start');
}

console.log(props.gameId);
</script>

<style scoped>

</style>