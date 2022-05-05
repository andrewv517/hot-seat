<template>
  <div class="space-y-4">
    <p class="font-semibold text-2xl text-slate-400 text-center">
      All Responses:
    </p>
    <div class="grid grid-cols-2 gap-4">
      <div
          v-for="player in randomizedArray"
          :key="player[1].number"
          class="bg-slate-400 font-semibold rounded-lg p-2 drop-shadow-xl text-slate-800"
          :class="{'ring-4 ring-cyan-400': gameState.players[SocketioService.uuid]?.vote?.number === player[1].number}"
          @click="vote(player[1])"
      >
        {{ player[1].response }} <span class="float-right text-slate-600">{{amountOfVotes(player[1])}}</span>
      </div>
    </div>

  </div>
</template>
<script setup lang="ts">
import {defineProps} from "vue";
import {GameState, PlayerData} from "@/interfaces";
import SocketioService from "@/socketio.service";

const props = defineProps<{
  randomizedArray: [[string, PlayerData]] | undefined,
  gameState: GameState,
}>();

const amountOfVotes = (player: PlayerData):number => {
  return Object.values(props.gameState.players).filter(p => p.vote?.number === player.number).length;
}

const vote = (player: PlayerData) => {
  SocketioService.socket.emit('vote', player);
}

</script>
<style scoped>
</style>