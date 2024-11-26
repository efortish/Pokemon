import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CharacterSelectionView from '@/views/CharacterSelectionView.vue'
import MovesView from '@/views/MovesView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/selection',
      name: 'selection',
      component: CharacterSelectionView
    },
    {
      path: '/moves',
      name: 'moves',
      component: MovesView
    },

    
  ]
})

export default router
