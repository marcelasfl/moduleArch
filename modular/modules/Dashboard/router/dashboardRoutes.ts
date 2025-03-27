export const DashboardRoutes = [{
    path: '/dashboard',
    meta: {
      requiresAuth: true
    },
    redirect: '/login/PaginaInicialLogin',
    component: () => import('../../../../src/layouts/full/FullLayout.vue'),
    children: [
        {
            name: 'Dashboard',
            path: '/Dashboard',
            component: () => import('../view/Dashboard.vue'),
        },

    ] 
  }]