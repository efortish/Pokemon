<script setup>
import { ref, computed, onMounted } from 'vue';
import { useGameStore, usePokemonStore } from '@/stores/useGameStore';
import ultimatelogo from '@/assets/img/Ultimate.png';
import axios from 'axios';
import Pokemons from '@/components/Pokemons.vue';
import SearchBar from '@/components/SearchBar.vue';
import ClearSelection from '@/components/ClearSelection.vue';
import StartButton from '@/components/StartButton.vue';
import { playSelectSound } from '@/components/selectSound';
import { useRouter } from 'vue-router';

// Profile Store
const gameStore = useGameStore();
const selectedCharacter = computed(() => gameStore.selectedCharacter);
const characterName = computed(() => gameStore.selectedCharacter.name);
const playerName = computed(() => gameStore.playerName);

// Pokemon selection Store
const pokemonStore = usePokemonStore();
const hasSelectedPokemons = computed(() => pokemonStore.selectedPokemons.length > 2);

const router = useRouter();

function selectPokemon(pokemon) {
  const pokemonData = {
    id: pokemon.id,
    name: pokemon.name,
    sprite: pokemon.sprite, // Asegúrate de pasar el sprite
  };

  // Verifica si el id del pokemon está en el array de seleccionados
  const isSelected = pokemonStore.selectedPokemons.some(selected => selected.id === pokemon.id);
  // verifica primero si el array de selected pokemons ya cuenta con los 3 pokemons, si ya hay 3 pokemons al clikear en algún otro no sonará el Cry
  if (pokemonStore.selectedPokemons.length < 3) {
    const cryUrl = new URL(`../assets/audio/151pokemons/${pokemon.id}.ogg`, import.meta.url);
    const cryAudio = new Audio(cryUrl);
    cryAudio.volume = 0.2;
    cryAudio.currentTime = 0; // Reinicia el audio para que suene desde el principio
    cryAudio.play();
  }
  // Funciones para remover pokemons y añadirlos
  if (isSelected) {
    pokemonStore.removePokemon(pokemon.id);
  } else {
    pokemonStore.addPokemon(pokemonData);
  }
}

// Pokemons
const pokemons = ref([]);
const selectedPokemons = computed(() => pokemonStore.selectedPokemons);

// Function to obtain the first 151 pokemons from Gen1
onMounted(async () => {
  try {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
    // Map the results to extract id from the URL
    pokemons.value = response.data.results.map((pokemon) => {
      const id = Number(pokemon.url.split('/').filter(Boolean).pop());
      return { ...pokemon, id };
    });
  } catch (error) {
    console.error(error);
  }
});

// Actualiza el término de búsqueda cuando se reciba del componente SearchBar
const searchTerm = ref('');
function updateSearch(term) {
  searchTerm.value = term;
}
const filteredPokemons = computed(() =>
  pokemons.value.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
);

// 3 Functions to make the overflow-x able to scroll with mouse while mouseOver and mouseLeave
function enableHorizontalScroll(event) {
  event.currentTarget.addEventListener('wheel', handleHorizontalScroll);
}
function disableHorizontalScroll(event) {
  event.currentTarget.removeEventListener('wheel', handleHorizontalScroll);
}
function handleHorizontalScroll(event) {
  event.preventDefault();
  event.currentTarget.scrollLeft += event.deltaY;
}

// Define the onConfirm method
function onConfirm() {
  if (hasSelectedPokemons.value) {
    // Navigate to the moves view
    router.push({ name: 'moves' });
  } else {
    alert('Please select at least 3 Pokémon.');
  }
}
</script>

<template>
  <div class="w-full min-h-screen p-4 bg-gradient-to-b from-redbattle to-customcyan text-white">
    <!-- Navbar -->
    <div class="w-full p-3 flex items-center">
      <!-- Profile Image -->
      <div class="mb-2">
        <div class="w-24 h-24 rounded-full border-4 border-yellow-400 bg-gradient-to-b from-redbattle to-customcyan overflow-hidden transition-all duration-200 ease-in-out transform hover:scale-110 animate-soft-bounce">
          <img
            :src="selectedCharacter.image"
            alt="Champion Avatar"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
      
      <!-- Champion Name and Type -->
      <div class="flex flex-col items-center ml-2">
        <h2 class="text-xl font-bold mb-1 text-yellow-300 text-center">{{ playerName }}</h2>
        <h3 class="bg-gray-700 px-2 py-1 rounded-full mb-3 text-xs">
          <span class="font-semibold">{{ characterName }}</span>
        </h3>
      </div>

      <div class="ml-auto mr-10 flex items-center space-x-4">

            
            <button
              v-for="selected in selectedPokemons"
              :key="selected.id"
              @click="pokemonStore.removePokemon(selected.id)"
              :class="[
                'w-24 h-24 rounded-full border-4 border-yellow-300 transition-all duration-200 ease-in-out transform hover:scale-105 bg-gradient-to-r from-cyan-200 to-rose-200 animate-pulse', hasSelectedPokemons ? 'animate-scale' : ''
              ]"
            >
              <img :src="selected.sprite" :alt="`Sprite of ${selected.name}`" class="w-full h-full object-cover rounded-full" />
            </button>
            <ClearSelection v-if="pokemonStore.selectedPokemons.length > 0" @click="playSelectSound"/>      
      </div>
      <div>
        <StartButton @confirm="onConfirm" :class="['hover:scale-110', hasSelectedPokemons ? 'bg-green-500' : 'bg-redbattle']"/>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-2 flex-1">
      <!-- Champion Details -->
      <div class="relative bg-gradient-to-b from-gray-200 to-gray-400 rounded-lg shadow-lg">
        <img
          :src="ultimatelogo"
          alt="Ultimate Logo"
          class="absolute left-1/2 top-1/2 w-80 h-80 2xl:w-96 2xl:h-96 opacity-10 transform -translate-x-1/2 -translate-y-1/2 mt-5"
        />
        <h2 class="text-xl font-extrabold mb-1 text-gray-800 text-center pt-2 z-10">CHOOSE 3 POKÉMON</h2>
        
        <!-- Contenedor de Pokémons con desplazamiento horizontal -->
        <div>
          <SearchBar @search="updateSearch" class="text-md font-bold mb-0 text-gray-800"/>
          
          <!-- Contenedor deslizante horizontal -->
          <div 
            class="overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-redbattle z-40 relative"
            @mouseover="enableHorizontalScroll"
            @mouseleave="disableHorizontalScroll"
          >
            <div class="grid grid-rows-2 2xl:grid-rows-4 grid-flow-col">
              <Pokemons 
                v-for="pokemon in filteredPokemons" 
                :key="pokemon.id" 
                :id="pokemon.id" 
                @selected="selectPokemon"
                :class="['w-32 m-2 text-black shadow-md hover:scale-110 hover:transition hover:duration-300 hover:ease-in-out', selectedPokemons.some(selected => selected.id === pokemon.id)
                ? 'border-customcyan scale-110 animate-pulse'
                : 'border-transparent'
                ] "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>