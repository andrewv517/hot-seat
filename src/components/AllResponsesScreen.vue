<template>
  <div class="space-y-4">
    <p class="font-semibold text-2xl text-slate-400 text-center">
      All Responses:
    </p>
    <div class="grid grid-cols-2 gap-4">
      <div
          v-for="player in randomizedArray"
          :key="player"
          class="bg-slate-400 font-semibold rounded-lg p-2 drop-shadow-xl text-slate-800"
      >
        {{ player[1].response }}
      </div>
    </div>

  </div>
</template>
<script setup lang="ts">
import {defineProps} from "vue";
import {PlayerData} from "@/interfaces";

defineProps<{
  randomizedArray: [[string, PlayerData]] | undefined,
}>();
</script>
<style scoped>
</style>