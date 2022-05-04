<template>
  <div  class="mt-3 space-y-3 flex flex-col justify-center">
    <p class="font-semibold text-2xl text-amber-50 text-center">Responses:</p>
    <p
        class="text-md text-gray-400 text-center"
        v-if="isInHotSeat"
    >
      It's your job to scroll through and read them!
    </p>
    <p
        class="text-md text-gray-400 text-center"
        v-else
    >
      The player in the Hot Seat will scroll through them...
    </p>
    <div class="flex justify-between items-center">
      <button
          @click="() => changeResponse(gameState.responseIndex - 1)"
          class="bg-neutral-500 p-2 rounded-full drop-shadow-xl h-fit"
          v-if="isInHotSeat"
      >
        <i class="gg-arrow-left text-amber-50"></i>
      </button>
      <div
          class="bg-slate-400 font-semibold rounded-lg p-2 drop-shadow-xl text-slate-800 text-center w-2/3 m-auto"
      >
        {{ randomizedArray[gameState.responseIndex][1].response }}
      </div>
      <button
          @click="() => changeResponse(gameState.responseIndex + 1)"
          class="bg-neutral-500 p-2 rounded-full drop-shadow-xl h-fit"
          v-if="isInHotSeat"
      >
        <i class="gg-arrow-right text-amber-50"></i>
      </button>
    </div>
    <p class="font-semibold text-md text-slate-400 text-center">{{ gameState.responseIndex + 1 }} /
      {{ Object.values(randomizedArray).length }}</p>

    <p
        class="font-semibold text-md text-slate-400 text-center"
        v-if="isInHotSeat"
    >
      Once you're done, click below.
    </p>
    <button
        class="bg-cyan-500 m-auto p-2 pl-3 pr-3 h-fit text-white font-semibold rounded-lg drop-shadow-xl"
        v-if="isInHotSeat"
        @click="doneReading"
    >
      Done
    </button>

  </div>
</template>
<script setup lang="ts">
import {defineProps} from "vue";
import SocketioService from "@/socketio.service";
import {GameState, PlayerData} from "@/interfaces";

defineProps<{
  isInHotSeat: boolean,
  gameState: GameState,
  randomizedArray: [[string, PlayerData]] | undefined,
}>();

const doneReading = () => {
  SocketioService.socket.emit('doneReading');
}

const changeResponse = (newIndex: number) => {
  SocketioService.socket.emit('changeResponseIndex', newIndex);
}

</script>
<style scoped>
</style>