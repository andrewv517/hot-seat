<template>
  <div>
    <!--Hot Seat Player-->
    <div class="flex justify-center flex-col space-y-5 mt-5"
         v-if="isInHotSeat">
      <p class="font-semibold text-xl text-amber-50 text-center">Choose a card, then click when you're ready</p>
      <button
          @click="emit('choseCard')"
          class="bg-green-500 text-white m-auto w-fit font-semibold p-3 pl-4 pr-4 drop-shadow-xl rounded-lg">I
        chose
        my card
      </button>
    </div>

    <!--For the regular player-->
    <div class="flex justify-center flex-col space-y-5 mt-5" v-else>
      <p class="font-semibold text-2xl text-amber-50 text-center" v-if="waitingForCard">
        Wait for {{ getPlayerByNumber(gameState.playerInHotSeat)?.name }} to choose a card!
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import {defineProps, defineEmits} from "vue";
import {GameState, PlayerData} from "@/interfaces";

const props = defineProps<{
  isInHotSeat: boolean,
  waitingForCard: boolean,
  gameState: GameState,
}>();

const emit = defineEmits(['choseCard']);

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