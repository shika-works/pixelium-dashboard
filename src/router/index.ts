import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/DashboardLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/DashboardView.vue'),
        meta: { title: 'Dashboard', breadcrumb: ['Home', 'Dashboard'] },
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: () => import('../views/AnalyticsView.vue'),
        meta: { title: 'Analytics', breadcrumb: ['Home', 'Analytics'] },
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('../views/UsersView.vue'),
        meta: { title: 'Users', breadcrumb: ['Home', 'Users'] },
      },
      {
        path: 'users/roles',
        name: 'Roles',
        component: () => import('../views/RolesView.vue'),
        meta: { title: 'Roles', breadcrumb: ['Home', 'Users', 'Roles'] },
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('../views/OrdersView.vue'),
        meta: { title: 'Orders', breadcrumb: ['Home', 'Orders'] },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/SettingsView.vue'),
        meta: { title: 'Settings', breadcrumb: ['Home', 'Settings'] },
      },
      {
        path: 'components/form',
        name: 'NewProduct',
        component: () => import('../views/FormView.vue'),
        meta: { title: 'Form Examples', breadcrumb: ['Home', 'Components', 'Form Examples'] },
      },
      {
        path: 'components/dialogs',
        name: 'Dialogs',
        component: () => import('../views/DialogsView.vue'),
        meta: { title: 'Dialogs', breadcrumb: ['Home', 'Components', 'Dialogs'] },
      },
    ],
  },
]

// GitHub Pages serves the app under a sub-path (/pixelium-dashboard/), which is
// configured as Vite's `base`. The router must use the same base, otherwise the
// initial URL like `/pixelium-dashboard/` matches no route and the page renders
// blank. `import.meta.env.BASE_URL` equals Vite's `base` in both dev and prod.
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title ? `${title} - Pixelium Dashboard` : 'Pixelium Dashboard'
})

export default router
