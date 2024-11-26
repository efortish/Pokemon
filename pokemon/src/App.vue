<script setup>

import { RouterView } from 'vue-router';
import Initialsong from './components/initialsong.vue';
</script>

<template>
  <div id="app">
     <Initialsong/>
    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active en <2.1.8 */ {
  opacity: 0;
}
</style>
