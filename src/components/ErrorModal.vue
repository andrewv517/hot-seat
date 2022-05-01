<template>
  <div id="container" class="fixed top-0 right-0 left-0 z-50 w-full h-full bg-black/60">
    <div
        class="relative w-full h-fit p-4 pb-6 mt-[40%] sm:mt-[15%] m-auto w-[75%] sm:w-[50%] md:w-[30%] bg-gray-700 rounded-lg shadow-2xl space-y-2">
      <!--content-->
      <div class="flex justify-between items-center flex-col">
        <svg class="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200" fill="none" stroke="currentColor"
             viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="text-2xl text-amber-50 font-semibold">You can't have an empty reponse!</p>
        <button class="bg-blue-500 hover:bg-blue-600 text-white w-full rounded-xl p-2 font-semibold mt-7"
                @click="close">Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineEmits} from "vue";

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
}
</script>

<style scoped>

</style>