<template>
  <div>
    <InitialScreenHeader/>
    <PregameScreen @start="startGame" :gameState="gameState" :gameId="gameid" v-if="!gameReady"/>
    <div class="p-6" v-else>

      <div class="flex justify-center items-center flex-col m-auto grid grid-cols-1 w-5/6 sm:w-2/3 md:w-1/3">
        <!--For the hot seat player-->
        <p
            class="font-semibold text-2xl text-center text-amber-50"
            v-if="isInHotSeat"
        >
          {{ gameState.players[SocketioService.uuid].name }}, you're in the <span
            class="text-red-400">hot seat</span>!
        </p>

        <!--Waiting for Hot Seat to choose-->
        <ChoosingCardScreen
            v-if="waitingForCard"
            :isInHotSeat="isInHotSeat"
            :waitingForCard="waitingForCard"
            :gameState="gameState"
            @choseCard="choseCard"
        />

        <!--Ready to enter response-->
        <EnteringResponsesScreen
            v-else-if="!submitted"
            :isInHotSeat="isInHotSeat"
            @submit="submit"
            @showModal="showModal"
        />

        <!--Submitted, but waiting-->
        <WaitingForResponsesScreen
            v-else-if="!everybodyDone"
            :peopleWhoHaventSubmitted="peopleWhoHaventSubmitted"
        />

        <!--Everyone submitted, now going over responses-->
        <GoingThroughResponsesScreen
            v-else-if="gameState.readingCards"
            :isInHotSeat="isInHotSeat"
            :gameState="gameState"
            :randomizedArray="randomizedArray"
        />

        <!--Done going over responses-->
        <AllResponsesScreen
            v-else
            :randomizedArray="randomizedArray"
        />

      </div>
    </div>
  </div>
  <ErrorModal v-show="modalViewable" @close="hideModal"/>
</template>

<script setup lang="ts">
import {computed, defineProps, ref} from "vue";
import SocketioService from "@/socketio.service";
import InitialScreenHeader from "@/components/InitialScreenHeader.vue";
import PregameScreen from "@/components/PregameScreen.vue";
import ErrorModal from "@/components/ErrorModal.vue";
import ChoosingCardScreen from "@/components/ChoosingCardScreen.vue";
import EnteringResponsesScreen from "@/components/EnteringResponsesScreen.vue";
import WaitingForResponsesScreen from "@/components/WaitingForResponsesScreen.vue";
import GoingThroughResponsesScreen from "@/components/GoingThroughResponsesScreen.vue";
import AllResponsesScreen from "@/components/AllResponsesScreen.vue";

defineProps({
  gameid: String,
  nickname: String,
});

const gameReady = ref(false);
const waitingForCard = ref(true);
const submitted = ref(false);
const modalViewable = ref(false);
const gameState = ref<GameState>({players: {}, playerInHotSeat: 1, responseIndex: 0, readingCards: true});
const isInHotSeat = computed(() => gameState.value.players[SocketioService.uuid].number === gameState.value.playerInHotSeat);
const waitingForSubmissions = computed(() => Object.entries(gameState.value.players).filter(([, v]) => !v.response).length > 0);
const peopleWhoHaventSubmitted = computed(() => Object.fromEntries(Object.entries(gameState.value.players).filter(([, v]) => !v.response)));
const everybodyDone = ref(false);
const randomizedArray = ref<[[string, PlayerData]] | undefined>();
let randomized = false;

interface PlayerData {
  name: string,
  number: number,
  response: string,
}

interface GameState {
  players: { [id: string]: PlayerData },
  playerInHotSeat: number,
  responseIndex: number,
  readingCards: boolean,
}

SocketioService.socket.on('update', (state: GameState) => {
  gameState.value = state;

  if (!waitingForSubmissions.value && !randomized) {
    // randomize the players
    SocketioService.socket.emit('randomize');
    randomized = true;
  }

  console.log(state);
});

SocketioService.socket.on('startGame', () => {
  gameReady.value = true;
});

SocketioService.socket.on('cardChosen', () => {
  waitingForCard.value = false;
})

SocketioService.socket.on('random', (players: [[string, PlayerData]] | undefined) => {
  randomizedArray.value = players;
  everybodyDone.value = true;
  console.log(players);
})

const hideModal = () => {
  modalViewable.value = false;
}

const showModal = () => {
  modalViewable.value = true;
}

const choseCard = () => {
  SocketioService.socket.emit('choseCard');
}

const startGame = () => {
  SocketioService.socket.emit('start');
}

const submit = () => {
  submitted.value = true;
}

// const leaveGame = () => {
//   console.log('attempting to leave');
//   SocketioService.socket.emit('leave');
// }


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