import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CardsViewPage from '../views/CardsViewPage.vue'
import SobreView from '../views/SobreView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/cards', component: CardsViewPage },
  { path: '/sobre', component: SobreView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
