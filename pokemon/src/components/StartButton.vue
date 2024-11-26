<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
  text: {
    type: String,
    default: 'Ready?'
  },
});
const emit = defineEmits(['confirm']);
const isConfirming = ref(false);

function handleClick() {
  isConfirming.value = true;
  // Play the selection sound
  const selectSoundURL = new URL('../assets/audio/select2.mp3', import.meta.url);
  const selectSound = new Audio(selectSoundURL);
  selectSound.volume = 0.6;
  selectSound.currentTime = 0;
  selectSound.play();
  // Navigate to the "moves-selection" view
  
  emit('confirm');
}
</script>

<template>
  <button
    :class="['circle-button', { 'confirming': isConfirming }]"
    @click="handleClick"
  >
    {{ text }}
  </button>
</template>

<style scoped>
.circle-button {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  
  color: white;
  border: none;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 10px;
}
.circle-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
}
.confirming {
  background-color: #4caf50; /* Green background when confirming */
}
</style>