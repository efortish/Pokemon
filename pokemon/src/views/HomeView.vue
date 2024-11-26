<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter} from 'vue-router'
import { useGameStore } from '@/stores/useGameStore'

import walter from '@/assets/img/walter.png'
import thomas from '@/assets/img/thomas.png'
import jinx from '@/assets/img/jinx.png'
import ultimatelogo from '@/assets/img/Ultimate.png'
import { playSelectSound } from '@/components/selectSound'



//Enrrutador
const router = useRouter();
//Pinia Storage
const gameStore = useGameStore()
//select Sound



 

const characters = [
  { name: 'Walter White', image: walter, initialItems: ["Sunglasses", "Jessie Pinkman", "Saul Godman"] },
  { name: 'Jinx', image: jinx, initialItems: ["Grenade", "Rocket", "Shimmer"] },
  { name: 'Thomas Shelby', image: thomas, initialItems: ["Revolver", "Razor blade", "Tokio"] },
  
]

//const playerName = ref('')

//const selectCharacter = (index) => {
//  selectedCharacter.value = index
//}

// Selección de personaje usando Pinia
const selectCharacter = (character) => {
  gameStore.setSelectedCharacter(character)
  // Reproducir el audio de selección
  playSelectSound()
}

// Computed para validar el formulario
const isFormValid = computed(() => {
  return gameStore.selectedCharacter !== null && gameStore.playerName.trim() !== ''
})

// Función para iniciar el juego
const startGame = () => {
  if (isFormValid.value) {
    console.log('Starting game with:', {
      character: gameStore.selectedCharacter.name,
      playerName: gameStore.playerName
    })
    playSelectSound()
    setTimeout(() => {
      router.push('/selection');
    }, 300);
  } else {
    alert('Please select a character and enter a nickname.')
  }
}
</script>




<template>
  
    <div class="min-h-screen bg-gradient-to-b from-redbattle to-customcyan flex items-center justify-center p-4">
      <div class="bg-slate-200  rounded-lg shadow-2xl px-6 pb-5 pt-2 max-w-md w-full">
        <div class="flex justify-center items-center">
          <img :src="ultimatelogo" alt="logo" class="w-60 h-auto">
        </div>
          
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-700 mb-4 mt-3 text-center">Choose your character</h2>
          <div class="flex justify-between">
            <button
              v-for="(character, index) in characters"
              :key="index"
              @click="selectCharacter(character)"
              :class="[
                'w-24 h-24 rounded-full border-4 transition-all duration-200 ease-in-out transform hover:scale-110',
                gameStore.selectedCharacter?.name === character.name ? 'border-customcyan scale-110' : 'border-transparent'
              ]"
            >
              <img :src="character.image" :alt="character.name" class="w-full h-full object-cover rounded-full" />
            </button>
          </div>
        </div>
        
        <div class="mb-6">
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2 text-center">Enter your nickname</label>
          <input
            type="text"
            id="name"
            @focus="playSelectSound"
            v-model="gameStore.playerName"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
            placeholder="Your nickname"
          />
        </div>
        
        <button
          @click="startGame"
          :disabled="!isFormValid"
          :class="[
            'w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-[300ms] ease-in-out',
            isFormValid ? 'bg-blue-800 hover:bg-blue-900' : 'bg-gray-400 cursor-not-allowed'
          ]"
        >
          <!-- Mensaje cuando el formulario es válido -->
          <div class="relative py-2.5">
            <span
              class="absolute inset-0 transition-opacity duration-[300ms] ease-in-out"
              :class="{ 'opacity-100': isFormValid, 'opacity-0': !isFormValid, }"
              key="valid-message"
            >
              Start Your Adventure!
            </span>
            
            <!-- Mensaje cuando el formulario no es válido -->
            <span
              class="absolute inset-0 transition-opacity duration-[300ms] ease-in-out"
              :class="{ 'opacity-100': !isFormValid, 'opacity-0': isFormValid }"
              key="invalid-message"
            >
              Choose a character and a nickname first!
            </span>
          </div>
          

        </button>
      </div>
    </div>
    
  </template>
  
