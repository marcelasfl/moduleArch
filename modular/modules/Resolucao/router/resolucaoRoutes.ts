export const PagamentoRoutes = [{
    path: '/pagamento',
    meta: {
      requiresAuth: true
    },
    redirect: '/login/PaginaInicialLogin',
    component: () => import('../../../../src/layouts/full/FullLayout.vue'),
    children: [
        {
            name: 'IndexResolucao',
            path: '/IndexResolucao',
            component: () => import('../view/IndexResolucao.vue'),
        },

        {
            name: 'CriarResolucao',
            path: '/CriarResolucao',
            component: () => import('../view/CreateResolucao.vue'),
        }

    ] 
  }]