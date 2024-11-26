<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  pokemon: Object,
  moveIndex: Number,
  onMoveChange: Function,
  onRandomizeMoves: Function,
});

const showPopup = ref(false);
const showInfo = ref(false);
const moveInfo = ref({});
const searchQuery = ref(''); // Añadir propiedad para la búsqueda

function openPopup() {
  showPopup.value = true;
}

function closePopup() {
  showPopup.value = false;
}

function selectMove(move) {
  props.onMoveChange(props.moveIndex, move);
  closePopup();
}

function randomizeMove() {
  const randomMove = props.pokemon.moves[Math.floor(Math.random() * props.pokemon.moves.length)];
  props.onMoveChange(props.moveIndex, randomMove);
}

function showMoveInfo(move) {
  moveInfo.value = {
    name: move.name,
    power: move.power,
    pp: move.pp,
    accuracy: move.accuracy,
    type: move.type,
    effect: move.effect,
  };
  showInfo.value = true;
}

function hideMoveInfo() {
  showInfo.value = false;
  moveInfo.value = {};
}

const filteredMoves = computed(() => {
  return props.pokemon.moves.filter(move =>
    move.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<template>
  <div class="relative">
    <button @mouseover="showMoveInfo(props.pokemon.moves[props.moveIndex])" @mouseleave="hideMoveInfo" class="text-black px-1 py-1 rounded pi pi-info-circle text-sm"></button>
    <button @click="openPopup" class="text-black px-1 py-1 rounded pi pi-pencil text-sm"></button>
    <button @click="randomizeMove" class="text-black px-1 py-1 rounded pi pi-sync text-sm"></button>
    
    <div v-if="showInfo" class="fixed bg-white p-2 rounded shadow-lg z-50">
      <p><strong>Name:</strong> {{ moveInfo.name }}</p>
      <p><strong>Power:</strong> {{ moveInfo.power }}</p>
      <p><strong>PP:</strong> {{ moveInfo.pp }}</p>
      <p><strong>Accuracy:</strong> {{ moveInfo.accuracy }}</p>
      <p><strong>Type:</strong> {{ moveInfo.type }}</p>
      <p><strong>Effect:</strong> {{ moveInfo.effect }}</p>
    </div>

    <div v-if="showPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gradient-to-b from-redbattle to-customcyan p-4 rounded-lg shadow-lg max-w-md w-full">
        <h2 class="text-xl font-bold mb-4 bg-gray-200 rounded-md text-center">Select a Move</h2>
        <div class="flex mb-4">
          <input v-model="searchQuery" type="text" placeholder="Search moves" class="p-2 w-full rounded border" />
          <button class="ml-2 text-black px-1 py-1 rounded pi pi-search text-sm"></button>
        </div>
        <div class="h-64 overflow-y-auto"> <!-- Establecer una altura fija -->
          <ul class="list-disc list-inside">
            <li v-for="move in filteredMoves" :key="move.name" class="mb-2 cursor-pointer hover:text-blue-500 text-center bg-gray-300 rounded-2xl" @click="selectMove(move)">
              {{ move.name }} 
            </li>
          </ul>
        </div>
        <button @click="closePopup" class="mt-4 bg-gray-500 text-white px-4 py-2 rounded">Close</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styles here */
</style>