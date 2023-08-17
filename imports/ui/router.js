import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../ui/page/Login.page.vue'
import KeelaAdmin from "../ui/page/KeelaAdmin.page.vue"
export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Login",
      component: LoginPage
    },
    {
      path: "/keela-admin",
      name: "Keela admin dashboard",
      component: KeelaAdmin
    }
  ],
})
