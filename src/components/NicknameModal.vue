<template>
  <div id="container">
    <p>Give a name</p>
    <input v-model="nickname">
    <button @click="close">Submit</button>
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
#container {
  width: 200px;
  height: 200px;
  position: absolute;
  top: 50%;
  left: 50%;
  background: gray;
  transform: translate(-50%, -50%);
}
</style>