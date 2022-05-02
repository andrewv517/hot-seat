<template>
  <div>
    <InitialScreenHeader/>
    <PregameScreen @start="startGame" :gameState="gameState" :gameId="gameid" v-if="!gameReady"/>
    <div class="p-6" v-else>

      <div class="flex justify-center items-center flex-col m-auto grid grid-cols-1 w-5/6 sm:w-2/3 md:w-1/3">
        <!--For the hot seat player-->
        <p class="font-semibold text-2xl text-center text-amber-50"
           v-if="isInHotSeat">
          {{ gameState.players[SocketioService.uuid].name }}, you're in the <span
            class="text-red-400">hot seat</span>!
        </p>

        <!--Waiting for Hot Seat to choose-->
        <div v-if="waitingForCard">
          <!--Hot Seat Player-->
          <div class="flex justify-center flex-col space-y-5 mt-5"
               v-if="isInHotSeat">
            <p class="font-semibold text-xl text-amber-50 text-center">Choose a card, then click when you're ready</p>
            <button
                @click="choseCard"
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

        <!--Ready to enter response-->
        <div v-else-if="!submitted" class="space-y-5">
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

        <!--Submitted, but waiting-->
        <div v-else-if="!everybodyDone" class="mt-3">
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

        <!--Everyone submitted, now going over responses-->
        <div v-else-if="gameState.readingCards" class="mt-3 space-y-3 flex flex-col justify-center">
          <p class="font-semibold text-2xl text-amber-50 text-center">Responses:</p>
          <p
              class="text-md text-gray-400 text-center"
              v-if="isInHotSeat"
          >
            It's your job to scroll through and read them!
          </p>
          <p
              class="text-md text-gray-400 text-center"
              v-else
          >
            The player in the Hot Seat will scroll through them...
          </p>
          <div class="flex justify-between items-center">
            <button
                @click="() => changeResponse(gameState.responseIndex - 1)"
                class="bg-neutral-500 p-2 rounded-full drop-shadow-xl h-fit"
                v-if="isInHotSeat"
            >
              <i class="gg-arrow-left text-amber-50"></i>
            </button>
            <div
                class="bg-slate-400 font-semibold rounded-lg p-2 drop-shadow-xl text-slate-800 text-center w-2/3 m-auto"
            >
              {{ Object.values(randomizedArray)[gameState.responseIndex]?.response }}
            </div>
            <button
                @click="() => changeResponse(gameState.responseIndex + 1)"
                class="bg-neutral-500 p-2 rounded-full drop-shadow-xl h-fit"
                v-if="isInHotSeat"
            >
              <i class="gg-arrow-right text-amber-50"></i>
            </button>
          </div>
          <p class="font-semibold text-md text-slate-400 text-center">{{ gameState.responseIndex + 1 }} /
            {{ Object.values(randomizedArray).length }}</p>

          <p
              class="font-semibold text-md text-slate-400 text-center"
              v-if="isInHotSeat"
          >
            Once you're done, click below.
          </p>
          <button
              class="bg-cyan-500 m-auto p-2 pl-3 pr-3 h-fit text-white font-semibold rounded-lg drop-shadow-xl"
              v-if="isInHotSeat"
              @click="doneReading"
          >
            Done
          </button>

        </div>

        <!--Done going over responses-->
        <div v-else class="space-y-4">
          <p class="font-semibold text-2xl text-slate-400 text-center">
            All Responses:
          </p>
          <div class="grid grid-cols-2 gap-4">
            <div
                v-for="player in randomizedArray"
                :key="player"
                class="bg-slate-400 font-semibold rounded-lg p-2 drop-shadow-xl text-slate-800"
            >
              {{ player.response }}
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
  <ErrorModal v-show="showModal" @close="hideModal"/>
</template>

<script setup lang="ts">
import {computed, defineProps, ref} from "vue";
import SocketioService from "@/socketio.service";
import InitialScreenHeader from "@/components/InitialScreenHeader.vue";
import PregameScreen from "@/components/PregameScreen.vue";
import ErrorModal from "@/components/ErrorModal.vue";

defineProps({
  gameid: String,
  nickname: String,
});

const gameReady = ref(false);
const waitingForCard = ref(true);
const response = ref('');
const submitted = ref(false);
const showModal = ref(false);
const gameState = ref<GameState>({players: {}, playerInHotSeat: 1, responseIndex: 0, readingCards: true});
const isInHotSeat = computed(() => gameState.value.players[SocketioService.uuid].number === gameState.value.playerInHotSeat);
const waitingForSubmissions = computed(() => Object.entries(gameState.value.players).filter(([, v]) => !v.response).length > 0);
const peopleWhoHaventSubmitted = computed(() => Object.fromEntries(Object.entries(gameState.value.players).filter(([, v]) => !v.response)));
const everybodyDone = ref(false);
const randomizedArray = ref<{[id: string]: PlayerData}>();
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

SocketioService.socket.on('random', (players: {[id: string]: PlayerData}) => {
  randomizedArray.value = players;
  everybodyDone.value = true;
  console.log(players);
})

const changeResponse = (newIndex: number) => {
  console.log(Object.values(gameState.value.players));
  SocketioService.socket.emit('changeResponseIndex', newIndex);
}

const doneReading = () => {
  SocketioService.socket.emit('doneReading');
}

const hideModal = () => {
  showModal.value = false;
}

const submitResponse = () => {
  if (!response.value) {
    showModal.value = true;
    return;
  }

  SocketioService.socket.emit('response', response.value);
  submitted.value = true;
}

const choseCard = () => {
  SocketioService.socket.emit('choseCard');
}

const startGame = () => {
  SocketioService.socket.emit('start');
};

// const leaveGame = () => {
//   console.log('attempting to leave');
//   SocketioService.socket.emit('leave');
// }

const getPlayerByNumber = (number: number): PlayerData | null => {
  for (let playersKey in gameState.value.players) {
    if (gameState.value.players[playersKey].number === number) {
      return gameState.value.players[playersKey];
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