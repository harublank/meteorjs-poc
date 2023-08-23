import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../ui/page/Login.page.vue'
import KeelaAdmin from "../ui/page/KeelaAdmin.page.vue"
import KeelaOrganization from '../ui/page/KeelaOrganization.page.vue'
import OrganizationAdmin from '../ui/page/OrganizationAdmin.page.vue'

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
    },
    {
      path: "/keela-admin/org/:id",
      name: "Organization",
      component: KeelaOrganization
    },
    {
      path: "/org-admin",
      name: "Organization Admin",
      component: OrganizationAdmin
    }
  ],
})
