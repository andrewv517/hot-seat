<template>
  <div  class="mt-3">
    <p class="font-semibold text-2xl text-amber-50 text-center">Successfully submitted your response!</p>
    <p class="text-md text-gray-400 text-center">Please wait the following to submit their responses...</p>
    <div class="grid grid-cols-2 gap-4 m-auto mt-3">
      <div
          v-for="player in peopleWhoHaventSubmitted"
          :key="player"
          class="bg-slate-400 font-semibold rounded-lg p-2 drop-shadow-xl text-slate-800"
      >
        {{ player.name }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {defineProps} from "vue";

defineProps<{
  peopleWhoHaventSubmitted: {[p: string]: {name: string, number: number, response: string}},
}>();
</script>
<style scoped>

</style>