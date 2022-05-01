<template>
  <div id="container" class="fixed top-0 right-0 left-0 z-50 w-full h-full bg-black/60">
    <div class="relative w-full h-fit p-4 pb-6 mt-[40%] sm:mt-[15%] m-auto w-[75%] sm:w-[50%] md:w-[30%] bg-gray-700 rounded-lg shadow-2xl space-y-2">
      <!--content-->
      <div class="flex justify-between items-center">
        <p class="text-white text-2xl font-semibold">Enter a name to play</p>
        <div class="hover:bg-slate-500/80 rounded-md p-1">
          <i class="gg-close text-white" @click="close"></i>
        </div>
      </div>
      <hr class="opacity-20">
      <div class="w-5/6 ml-auto mr-auto">
        <p class="text-white mb-3 mt-3">Your name</p>
        <input v-model="nickname"
               class="w-full focus:ring-blue-500 focus:border-blue-500 rounded-xl p-2 pl-4 text-white bg-gray-500 m-auto block"
               placeholder="Enter Your Name..."
        >
        <button class="bg-blue-500 hover:bg-blue-600 text-white w-full rounded-xl p-2 font-semibold mt-7" @click="close">Submit</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, ref} from "vue";

const nickname = ref('');
const emit = defineEmits(['close']);

const close = () => {
  emit('close', nickname.value);
}

</script>

<style scoped>
</style>