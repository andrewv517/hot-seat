<template>
  <InitialScreenHeader/>
  <p>Welcome to my Game! {{ gameId }}</p>
  <input v-model="gameId">
  <button @click="joinGame">Join Game</button>
  <p>OR</p>
  <button @click="createGame">Create Game</button>
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
    return;
  }
  console.log(name);
  SocketioService.socket.emit('joinGame', gameId.value, name);
  console.log('attempting to join');
}

const createGame = () => {
  if (!name) {
    showModal();
    return;
  }
  SocketioService.socket.emit('newGame', name);
}

const showModal = () => {
  isModalViewable.value = true;
}

const hideModal = (nickname: string) => {
  isModalViewable.value = false;
  console.log(isModalViewable.value);
  name = nickname;
}

onBeforeUnmount(() => {
  SocketioService.socket.off('unknownGame');
});
</script>

<style scoped>

</style>