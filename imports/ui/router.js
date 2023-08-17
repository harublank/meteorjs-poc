import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../ui/Login.page.vue'
export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Login",
      component: LoginPage
    }
  ],
})
