<script setup>
import { ref, watch } from 'vue';
import { playSelectSound } from '@/components/selectSound'

const emit = defineEmits(['search']);

const searchTerm = ref('');

function emitSearch(){
    emit('search', searchTerm.value);
}


</script>


<template>
    <div class="flex justify-center mb-4 text-black">
        <input
        type="text"
        v-model="searchTerm"
        @input="emitSearch"
        @focus="playSelectSound"
        placeholder="Find your Pokémon..."
        class="px-4 py-2 border rounded-lg shadow-md w-full sm:w-1/2 bg-gray-50 z-20"
        />
  </div>
</template>