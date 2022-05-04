<template>
  <div class="space-y-5">
    <div class="space-y-1">
      <p class="text-xl text-gray-300 font-semibold">Scoring</p>
      <p class="text-md text-gray-400">
        As a reminder, points are awarded based on your role in the game:
      </p>
      <p class="text-lg text-gray-300 font-semibold">Player in the Hot Seat
        <span
            v-if="isInHotSeat">(this is you)</span>:
      </p>
      <ul>
        <li class="text-gray-400 text-md">1 point for each player that correctly guesses the answer you wrote.
        </li>
      </ul>
      <p class="text-gray-300 font-semibold text-lg">All Other Players
        <span
            v-if="!isInHotSeat">(this is you)</span>:
      </p>
      <ul class="text-gray-400 text-md ">
        <li>1 point for each player that guesses your answer.</li>
        <li>2 points for guessing the player in the Hot Seat's answer correctly</li>
        <li>4 points for responding with the same answer as the player in the Hot Seat</li>
      </ul>
    </div>
    <p class="text-gray-300 text-lg font-semibold">Submit your response here.</p>
    <div class="space-x-5 text-center space-y-3">
      <input
          class="input w-2/3 text-lg sm:text-md max-w-sm focus:ring-blue-500 focus:border-blue-500 rounded-xl p-2 text-white bg-gray-500"
          placeholder="Enter your response..."
          v-model="response"
      />
      <button @click="submitResponse"
              class="bg-green-500 p-2 pl-3 pr-3 h-fit text-white font-semibold rounded-lg drop-shadow-xl">Submit
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import {defineEmits, defineProps, ref} from "vue";
import SocketioService from "@/socketio.service";

defineProps<{
  isInHotSeat: boolean,
}>();

const emit = defineEmits(['showModal', 'submit']);

const response = ref('');

const submitResponse = () => {
  if (!response.value) {
    emit('showModal');
    return;
  }
  SocketioService.socket.emit('response', response.value);
  emit('submit');
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