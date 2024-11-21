import { createRouter, createWebHistory } from 'vue-router'

import SearchPage from '../components/SearchPage.vue'
import LoginPage from '../components/LoginPage.vue'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/search',
    name: 'Search',
    component: SearchPage,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
