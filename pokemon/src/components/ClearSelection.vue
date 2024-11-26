<script setup>
import { usePokemonStore } from '@/stores/useGameStore';


const pokemonStore = usePokemonStore();


</script>

<template>
    <button 
        
        @click="pokemonStore.clearSelection()" 
        class="pi pi-trash text-black bg-gray-200 px-1 py-1 rounded-xl animate-pulse">
  
    </button>
</template>