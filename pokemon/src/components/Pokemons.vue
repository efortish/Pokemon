<script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const props = defineProps({
    id: Number,
  });
  
  const name = ref('');
  const sprite = ref('');
  const type = ref([]);

  
  onMounted(async () => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${props.id}`);
      const originalName = response.data.name;
      name.value = originalName.charAt(0).toUpperCase() + originalName.slice(1);
      sprite.value = response.data.sprites.front_default;
      type.value = response.data.types.map(type => type.type.name);
    } catch (error) {
      console.error(error);
    }
  });

  const emit = defineEmits(['selected']);

  const select = () => {
    const pokemonData = {
    id: props.id,
    name: name.value,
    sprite: sprite.value, // Asegúrate de que el sprite esté bien aquí
    };
    
    emit('selected', pokemonData);
    };
  </script>

<template>
  <div class="pokemon w-28 text-center cursor-pointer p-1 border border-gray-200 rounded-lg" @click="select">
    <img :src="sprite" :alt="`Sprite of ${name}`" class="pokemon-sprite mx-auto" />
    <p class="pokemon-name">{{ name }}</p>
  </div>
</template>

<style scoped>
.pokemon-sprite {
  width: 110px;
  height: 110px;
  margin-bottom: 10px;
}
.pokemon-name {
  font-size: 1.1em;
  margin: 0px 0;
}
</style>

  
  