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
        {{ player[1].response }} <span class="float-right text-slate-600">{{ amountOfVotes(player[1]) }}</span>
      </div>
    </div>
    <p class="font-semibold text-2xl text-slate-300 text-center">
      Vote for the response you think was left by {{ getPlayerByNumber(gameState.playerInHotSeat).name }}!
    </p>
    <p class="font-semibold text-lg text-slate-400 text-center" v-if="gameState.countdownGoing">
      {{ seconds }} seconds left!
    </p>
    <p v-else-if="gameState.countdownFinished" class="font-semibold text-lg text-slate-400 text-center">
      Out of time!
    </p>

  </div>
</template>
<script setup lang="ts">
import {defineProps, ref} from "vue";
import {GameState, PlayerData} from "@/interfaces";
import SocketioService from "@/socketio.service";

const props = defineProps<{
  randomizedArray: [[string, PlayerData]] | undefined,
  gameState: GameState,
}>();

const seconds = ref(10);
// eslint-disable-next-line no-undef
let interval: NodeJS.Timer;

SocketioService.socket.on('startCountdown', () => {
  console.log('started!');
  interval = setInterval(() => {
    if (seconds.value === 0) {
      clearInterval(interval);
      console.log('ended!');
      SocketioService.socket.emit('countdownOver');
    } else {
      seconds.value--;
    }
  }, 1000);
})

SocketioService.socket.on('endCountdown', () => {
  clearInterval(interval);
})

const amountOfVotes = (player: PlayerData): number => {
  return Object.values(props.gameState.players).filter(p => p.vote?.number === player.number).length;
}

const vote = (player: PlayerData) => {
  SocketioService.socket.emit('vote', player);
}

const getPlayerByNumber = (number: number): PlayerData | null => {
  for (let playersKey in props.gameState.players) {
    if (props.gameState.players[playersKey].number === number) {
      return props.gameState.players[playersKey];
    }
  }
  return null;
}


</script>
<style scoped>
</style>