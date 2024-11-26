<script setup>
import { ref, computed, onMounted } from 'vue'
// Definir la fuente de audio
const audioSrc = new URL('@/assets/audio/pokemon.mp3', import.meta.url).href;

// Referencia al elemento de audio
const audio = ref(null);

const volume = ref(0.5); // Volumen inicial al 50%
const showMessage = ref(false);
const isMuted = ref(false);
const originalVolume = ref(1)

// Ajustar el volumen al valor del control deslizante
const adjustVolume = () => {
  if (audio.value) {
    audio.value.volume = volume.value;
    isMuted.value = volume.value === 0
  }
};

// Intentar reproducir el audio
const playAudio = () => {
  if (audio.value) {
    audio.value.volume = volume.value;
    audio.value.play().then(() => {
      console.log('Reproducción de audio iniciada.');
    }).catch((error) => {
      // Captura el error (bloqueo por permisos)
      console.log('Reproducción de audio bloqueada por el navegador. Se requiere permiso.');
      showMessage.value = true; // Muestra el mensaje para que el usuario haga clic
    });
  }
};

// Mute, unmute song
const muteSong = () => {
  if (isMuted.value) {
    // Restaurar volumen
    volume.value = originalVolume.value
    audio.value.volume = originalVolume.value
    isMuted.value = false
  } else {
    // Guardar el volumen actual y silenciar
    originalVolume.value = volume.value
    volume.value = 0
    audio.value.volume = 0
    isMuted.value = true
  }
}

//Volume Icon
const volumeIcon = computed(() => {
  return isMuted.value || volume.value === 0 ? 'pi-volume-off' : 'pi-volume-up'
})

// Agregar un evento de clic en la ventana
const requestAudioPermission = () => {
  if (showMessage.value) {
    showMessage.value = false; // Oculta el mensaje
    playAudio(); // Intenta reproducir de nuevo
  }
};

onMounted(() => {
  playAudio();
  console.log('Audio Source:', audioSrc);
});

// Agregar el evento de clic
window.addEventListener('click', requestAudioPermission);

</script>
<style scoped>
.volume-control {
  position: fixed;
  bottom: 5px;
  right: 5px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px;
  border-radius: 15px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;
}

input[type="range"] {
  width: 50px; /* Ajusta el ancho del control de volumen */
}
</style>
<template>
    <div class="volume-control">

      <!-- Elemento de audio oculto -->
      <audio ref="audio" :src="audioSrc" loop></audio>

      <!-- Control deslizante de volumen -->
      <label for="volume" :class="`pi ${volumeIcon}`" @click="muteSong"></label>
      <input type="range" id="volume" min="0" max="1" step="0.01" v-model="volume" @input="adjustVolume" />

    </div>
</template>