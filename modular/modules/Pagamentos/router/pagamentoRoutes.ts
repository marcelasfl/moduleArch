export const PagamentoRoutes = [{
  path: '/pagamento',
  meta: {
    requiresAuth: true
  },
  redirect: '/login/PaginaInicialLogin',
  component: () => import('@/layouts/full/FullLayout.vue'),
  children: [
    {
      name: 'VisualizarProjeto',
      path: 'VisualizarProjeto/:id?',
      component: () => import('@/pagamento/view/VisualizarProjetos.vue'),
    },
    {
      name: 'VisualizarCalendario',
      path: 'VisualizarCalendario',
      component: () => import('@/ModularArch/modules/Pagamentos/views/Calendario.vue')
    },
    {
        name: 'MonitorarLiberacaoEditais',
        path: 'MonitorarLiberacao',
        component: () => import('@/pagamento/view/MonitorarLiberacaoEditais.vue')
    },
    {
        name: 'GerarFolha',
        path: 'GerarFolha',
        component: () => import('@/pagamento/view/GerarFolha.vue')
    },
    {
        name: 'ListarFolha',
        path: 'ListarFolha/:cancelado?',
        component: () => import('@/pagamento/view/ListarFolha.vue')
    },
    {
        name: 'ListarFolhaDiraf',
        path: 'ListarFolhaDiraf/:rejeitado?',
        component: () => import('@/pagamento/view/ListarFolhaDiraf.vue')
    },
    {
        name: 'VisualizarFolha',
        path: 'VisualizarFolha/:id/:gerado?',
        component: () => import('@/pagamento/view/VisualizarFolha.vue') 
    },
    {
        name: 'DecidirAutorizacao',
        path: 'AutorizacaoFolha/:id',
        component: () => import('@/pagamento/view/DecidirAutorizacaoFolha.vue')
    },
    {
        name: 'VisualizarLiberacaoEditais',
        path: 'VisualizarLiberacaoEditais/:area',
        component: () => import('@/pagamento/view/VisualizarLiberacaoEditais.vue')
    },
    {
        name: 'LiberarEditais',
        path: 'LiberarEditaisPagamento',
        component: () => import('@/pagamento/view/LiberarEditaisPagamento.vue'),
    },
    {
        name: 'PreviaFolha',
        path: 'PreviaFolha',
        component: () => import('@/pagamento/view/VisualizarPreviaFolha.vue'),
    },
    {
        name: 'VisualizarBolsistas',
        path: 'VisualizarBolsistas/:id?',
        component: () => import('@/pagamento/view/VisualizarBolsistas.vue'),
    },
    {
        name: 'VisualizarDetalhesArea',
        path: 'VisualizarDetalhesArea/:id/:area', 
        component: () => import('@/pagamento/view/VisualizarDetalhesArea.vue'),
    },
    {
        name: 'MonitorarRemessasPagamento',
        path: 'MonitorarRemessasPagamento/:id', 
        component: () => import('@/pagamento/view/MonitorarRemessasPagamento.vue'),
    },
    {
        name: 'SolicitarRecurso',
        path: 'SolicitarRecurso',
        component: () => import('@/pagamento/view/SolicitarRecurso.vue'),
    },
    {
        name: 'VisualizarEditais',
        path: 'VisualizarEditais',
        component: () => import('@/pagamento/view/VisualizarEditais.vue'),
    },
    {
        name: 'FormEdital',
        path: 'FormEdital/:id?',
        component: () => import('@/pagamento/view/FormEdital.vue'),
        props: true
    }
  ] 
}]