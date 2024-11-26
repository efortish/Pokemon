import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useGameStore = defineStore('game', {
  state: () => ({
    selectedCharacter: null,
    playerName: ''
  }),
  actions: {
    setSelectedCharacter(character) {
      this.selectedCharacter = character
    },
    setPlayerName(name) {
      this.playerName = name
    }
  }
})

export const usePokemonStore = defineStore('pokemon', () => {
  const selectedPokemons = ref([]);

  function addPokemon(pokemon) {
    // Solo agrega el Pokémon si hay menos de 3 seleccionados
   
    if (selectedPokemons.value.length < 3) {
      // Guardar el sprite junto con el nombre y el id
      selectedPokemons.value.push({
        id: pokemon.id,
        name: pokemon.name,
        sprite: pokemon.sprite, // Asegúrate de que el sprite esté incluido
      });
    }
  }

  function removePokemon(pokemonId) {
    selectedPokemons.value = selectedPokemons.value.filter(p => p.id !== pokemonId);
  }

  function clearSelection() {
    selectedPokemons.value = [];

    
  }

  return {
    selectedPokemons,
    addPokemon,
    removePokemon,
    clearSelection,
  };
});