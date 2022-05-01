<template>
  <InitialScreenHeader/>
  <div class="grid grid-cols-1 w-5/6 sm:w-2/3 md:w-1/3 m-auto space-y-5 mt-10 text-center">
    <p class="text-2xl text-amber-50 font-semibold">Join a game...</p>
    <div class="space-x-4 flex justify-center w-full items-center">
      <input v-model="gameId"
             class="w-2/3 focus:ring-blue-500 focus:border-blue-500 rounded-xl p-2 pl-4 text-white bg-gray-500 block"
             placeholder="Enter Game Code..."
             id="gameIdInput">
      <button @click="joinGame" class="inline-block bg-neutral-500 p-2 rounded-full drop-shadow-xl">
        <i class="gg-arrow-right text-amber-50"></i>
      </button>
    </div>
    <p class="text-2xl text-amber-50 font-semibold">Or Create Your Own!</p>
    <button
        @click="createGame"
        class="w-fit m-auto pl-4 pr-4 pt-2 pb-2 rounded-xl text-white drop-shadow-xl bg-cyan-600"
    >
      Create
    </button>
  </div>
  <NicknameModal v-show="this.isModalViewable" @close="hideModal"/>
</template>

<script setup lang="ts">
import {onBeforeUnmount, ref} from "vue";
import NicknameModal from "@/components/NicknameModal.vue";
import SocketioService from "@/socketio.service";
import InitialScreenHeader from "@/components/InitialScreenHeader.vue";

const gameId = ref('');
let name = '';
const isModalViewable = ref(false);

SocketioService.socket.on('unknownGame', () => {
  alert('Invalid code!');
});

const joinGame = () => {
  if (!name) {
    showModal();
    action = 'join';
    return;
  }
  console.log(name);
  SocketioService.socket.emit('joinGame', gameId.value, name);
  console.log('attempting to join');
}

const createGame = () => {
  if (!name) {
    showModal();
    action = 'create';
    return;
  }
  SocketioService.socket.emit('newGame', name);
}

const showModal = () => {
  isModalViewable.value = true;
}

let action = '';

const hideModal = (nickname: string) => {
  isModalViewable.value = false;
  console.log(isModalViewable.value);
  name = nickname;

  if (name) {
    if (action === 'create') {
      createGame();
    } else if (action === 'join') {
      joinGame();
    }
  }

  action = '';

}

onBeforeUnmount(() => {
  SocketioService.socket.off('unknownGame');
});
</script>

<style scoped>

</style>