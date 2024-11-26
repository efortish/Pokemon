<script setup>
import { ref, onMounted, computed } from 'vue';
import { useGameStore, usePokemonStore } from '@/stores/useGameStore';
import axios from 'axios';
import movesButton from '@/components/movesButton.vue';

// Access the gameStore and pokemonStore
const gameStore = useGameStore();
const pokemonStore = usePokemonStore();
const selectedCharacter = computed(() => gameStore.selectedCharacter);
const playerName = computed(() => gameStore.playerName);
const characterName = computed(() => gameStore.selectedCharacter?.name);

// Reactive state for moves
const pokemonMoves = ref([]);

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Fetch moves for each selected Pokémon
const fetchMoves = async () => {
  const movesPromises = pokemonStore.selectedPokemons.map(async (pokemon) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`);
      const moves = await Promise.all(response.data.moves.map(async (move) => {
        const moveResponse = await axios.get(move.move.url);
        return {
          name: capitalizeFirstLetter(move.move.name), // Capitalize the first letter
          power: moveResponse.data.power,
          accuracy: moveResponse.data.accuracy,
          type: moveResponse.data.type.name,
          pp: moveResponse.data.pp,
          effect: moveResponse.data.effect_entries[0]?.short_effect,
        };
      }));
      return {
        name: pokemon.name,
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${pokemon.id}.gif`, 
        moves,
      };
    } catch (error) {
      console.error(`Failed to fetch moves for ${pokemon.name}:`, error);
      return {
        name: pokemon.name,
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${pokemon.id}.gif`, 
        moves: [],
      };
    }
  });
  pokemonMoves.value = await Promise.all(movesPromises);
};

function changeMove(pokemonIndex, moveIndex, newMove) {
  pokemonMoves.value[pokemonIndex].moves[moveIndex] = newMove;
}



onMounted(() => {
  fetchMoves();
});
</script>

<template>
  <div class="w-full min-h-screen p-4 bg-gradient-to-b from-redbattle to-customcyan text-white">
    <div class="w-full p-3 flex items-center">
      <div class="mb-2">
        <div class="w-24 h-24 rounded-full border-4 border-yellow-400 bg-gradient-to-b from-redbattle to-customcyan overflow-hidden transition-all duration-200 ease-in-out transform hover:scale-110 animate-soft-bounce">
          <img
            v-if="selectedCharacter"
            :src="selectedCharacter.image"
            alt="Champion Avatar"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
      <div class="flex flex-col items-center ml-2">
        <h2 class="text-xl font-bold mb-1 text-yellow-300 text-center">{{ playerName }}</h2>
        <h3 class="bg-gray-700 px-2 py-1 rounded-full mb-3 text-xs">
          <span class="font-semibold">{{ characterName }}</span>
        </h3>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="(pokemon, pokemonIndex) in pokemonMoves" :key="pokemon.name" class="pokemon-moves bg-gray-700/30 rounded-lg p-4">
        <h2 class="text-xl font-semibold text-center">{{ pokemon.name }}</h2>
        <div class="grid grid-cols-2 gap-3 mt-4">
          <div class="flex justify-center items-center">
            <img v-if="pokemon.sprite" :src="pokemon.sprite" alt="Pokemon Sprite" class="w-24 h-24" />
            <div v-else class="w-24 h-24 flex items-center justify-center text-gray-500">No Image</div>
          </div>
          <div>
            <ul class="list-disc list-inside bg-gray-100 rounded-lg">
              <li v-for="(move, moveIndex) in pokemon.moves.slice(0, 4)" :key="moveIndex" class="mb-2 flex items-center justify-between bg-gray-200 text-black rounded-lg my-2 mx-1 pl-2">
                {{ move.name }}
                <movesButton
                  :pokemon="pokemon"
                  :moveIndex="moveIndex"
                  :onMoveChange="(index, newMove) => changeMove(pokemonIndex, index, newMove)"
                  :onRandomizeMoves="() => randomizeMoves(pokemonIndex)"
                  :onRemoveMove="(index) => removeMove(pokemonIndex, index)"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.moves-view {
  padding: 20px;
}
.pokemon-moves {
  padding: 20px;
  position: relative;
}
.pokemon-moves ul {
  margin-top: 10px;
  max-height: 384px; /* Limita la altura de la lista de movimientos */
  overflow-y: auto; /* Añade scroll vertical */
  scrollbar-width: thin;
  scrollbar-color: theme('colors.gray.600') theme('colors.gray.800');
}
.pokemon-moves ul::-webkit-scrollbar {
  width: 6px;
}
.pokemon-moves ul::-webkit-scrollbar-track {
  background: theme('colors.gray.500');
}
.pokemon-moves ul::-webkit-scrollbar-thumb {
  background-color: theme('colors.gray.500');
  border-radius: 3px;
}
.pokemon-moves li {
  margin-bottom: 10px;
  cursor: pointer;
}
.pokemon-moves li .group-hover\:opacity-100 {
  opacity: 0;
}
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
.group .absolute {
  z-index: 50; /* Asegura que el popup esté siempre visible */
}
.group .absolute .bg-gray-800 {
  background-color: #2d3748; /* Ajusta el color de fondo del popup */
}
.group .absolute .rotate-45 {
  background-color: #2d3748; /* Ajusta el color de fondo del triángulo */
}
</style>