const MainRoutes = [{
    path: '/main',
    meta: {
        requiresAuth: true
    },
    redirect: '/login/PaginaInicialLogin', 
    component: () => import('@/layouts/full/FullLayout.vue'),
    children: [
        {
            path: '/',
            redirect: '/resolucao/IndexResolucao', 
        },
        {
            name: 'Dashboard',
            path: '/Dashboard',
            component: () => import('@/dashboard/view/Dashboard.vue'),
        },
        {
            name: 'Resolucao',
            path: '/resolucao/IndexResolucao',
            component: () => import('@/views/conecta-fapes/Resolucao/IndexResolucao.vue'),
        },
        {
            name: 'VisualizarProjeto',
            path: '/pagamento/VisualizarProjeto/:id?',
            component: () => import('@/pagamento/view/VisualizarProjetos.vue'),
        },
        {
            name: 'Modalidade',
            path: '/modalidade/IndexModalidade',
            component: () => import('@/views/conecta-fapes/Modalidade/IndexModalidade.vue'),
        },
        {
            name: 'IndexResolucao',
            path: '/IndexResolucao',
            component: () => import('../../modular/modules/Resolucao/view/IndexResolucao.vue'),
        },
        {
            name: 'Resolucao',
            path: '/CreateResolucao',
            component: () => import('../../modular/modules/Resolucao/view/CreateResolucao.vue'),
        },
        {
            name: 'CadastroResolucao',
            path: '/resolucao/formResolucao/:id?/:modalidade?',
            component: () => import('@/views/conecta-fapes/Resolucao/FormResolucao.vue'),
            props: true
        },
        {
            name: 'DetalhesResolucao',
            path: '/resolucao/DetailsResolucao/:id?',
            component: () => import('@/views/conecta-fapes/Resolucao/DetailsResolucao.vue'),
            props: true
        },
        {
            name: 'DetalhesModalidadeEmEdicao',
            path: '/modalidade/DetailsModalidadeEmEdicao/:id?',
            component: () => import('@/views/conecta-fapes/Modalidade/DetailsModalidadeEmEdicao.vue'),
            props: true
        },
        {
            name: 'DetalhesModalidade',
            path: '/modalidade/DetailsModalidade/:id?',
            component: () => import('@/views/conecta-fapes/Modalidade/DetailsModalidade.vue'),
            props: true
        },
        {
            name: 'CadastroModalidade',
            path: '/modalidade/CreateModalidade/:resolucao?',
            component: () => import('@/views/conecta-fapes/Modalidade/CreateModalidade.vue'),
        },
        {
            name: 'EditarModalidade',
            path: '/modalidade/EditModalidade/:id?/:resolucao?',
            component: () => import('@/views/conecta-fapes/Modalidade/EditModalidade.vue'),
        },
        {
            name: 'NovaVersaoModalidade',
            path: '/modalidade/CreateVersaoModalidade/:id?',
            component: () => import('@/views/conecta-fapes/Modalidade/CreateVersaoModalidade.vue'),
        },
        {
            name: 'ImportarEdital',
            path: '/importaredital/IndexImportarEdital',
            component: () => import('@/views/conecta-fapes/Importar_Edital/IndexImportarEdital.vue'),
        },
        {
            name: 'ErroEdital',
            path: '/importaredital/EditaisErro',
            component: () => import('@/views/conecta-fapes/Importar_Edital/EditaisNaoImportado/ErroNaoImportado.vue'),
        },
        {
            name: 'DetalhesEdital',
            path: '/importaredital/DetalhesEdital/:id?',
            component: () => import('@/views/conecta-fapes/Importar_Edital/IndexDetalhesEdital.vue'),
        },
        {
            name: 'EditarProjeto',
            path: '/importaredital/FormProjeto/:id',
            component: () => import('@/views/conecta-fapes/Importar_Edital/Projeto/FormProjeto.vue')
        },
        {
            name: 'PaginaInicialLogin',
            path: '/login/PaginaInicialLogin',
            component: () => import('@/views/conecta-fapes/Login/PaginaInicialLogin.vue')
        },
        {
            name: 'AuthenticationAcessoCidadao',
            path: '/login/AuthAcessoCidadao',
            component: () => import('@/views/conecta-fapes/Login/AuthAcessoCidadao.vue')
        },
        {
            name: 'PerfilUsuario',
            path: '/perfil/PerfilUsuario',
            component: () => import('@/views/conecta-fapes/Perfil/PerfilUsuario.vue')
        },
        {
            name: 'VisualizarCalendario',
            path: '/pagamento/VisualizarCalendario',
            component: () => import('@/pagamento/view/VisualizarCalendario.vue')
        },
        {
            name: 'MonitorarLiberacaoEditais',
            path: '/pagamento/MonitorarLiberacao',
            component: () => import('@/pagamento/view/MonitorarLiberacaoEditais.vue')
        },
        {
            name: 'GerarFolha',
            path: '/pagamento/GerarFolha',
            component: () => import('@/pagamento/view/GerarFolha.vue')
        },
        {
            name: 'ListarFolha',
            path: '/pagamento/ListarFolha/:cancelado?',
            component: () => import('@/pagamento/view/ListarFolha.vue')
        },
        {
            name: 'ListarFolhaDiraf',
            path: '/pagamento/ListarFolhaDiraf/:rejeitado?',
            component: () => import('@/pagamento/view/ListarFolhaDiraf.vue')
        },
        {
            name: 'VisualizarFolha',
            path: '/pagamento/VisualizarFolha/:id/:gerado?',
            component: () => import('@/pagamento/view/VisualizarFolha.vue') 
        },
        {
            name: 'DecidirAutorizacao',
            path: '/pagamento/AutorizacaoFolha/:id',
            component: () => import('@/pagamento/view/DecidirAutorizacaoFolha.vue')
        },
        {
            name: 'VisualizarLiberacaoEditais',
            path: '/pagamento/VisualizarLiberacaoEditais/:area',
            component: () => import('@/pagamento/view/VisualizarLiberacaoEditais.vue')
        },
        {
            name: 'LiberarEditais',
            path: '/pagamento/LiberarEditaisPagamento',
            component: () => import('@/pagamento/view/LiberarEditaisPagamento.vue'),
        },
        {
            name: 'PreviaFolha',
            path: '/pagamento/PreviaFolha',
            component: () => import('@/pagamento/view/VisualizarPreviaFolha.vue'),
        },
        {
            name: 'VisualizarBolsistas',
            path: '/pagamento/VisualizarBolsistas/:id?',
            component: () => import('@/pagamento/view/VisualizarBolsistas.vue'),
        },
        {
            name: 'VisualizarDetalhesArea',
            path: '/pagamento/VisualizarDetalhesArea/:id/:area', 
            component: () => import('@/pagamento/view/VisualizarDetalhesArea.vue'),
        },
        {
            name: 'MonitorarRemessasPagamento',
            path: '/pagamento/MonitorarRemessasPagamento/:id', 
            component: () => import('@/pagamento/view/MonitorarRemessasPagamento.vue'),
        },
        {
            name: 'SolicitarRecurso',
            path: '/pagamento/SolicitarRecurso',
            component: () => import('@/pagamento/view/SolicitarRecurso.vue'),
        },
        {
            name: 'VisualizarEditais',
            path: '/pagamento/VisualizarEditais',
            component: () => import('@/pagamento/view/VisualizarEditais.vue'),
        },
        {
            name: 'FormEdital',
            path: '/pagamento/FormEdital/:id?',
            component: () => import('@/pagamento/view/FormEdital.vue'),
            props: true
        }
    ]
}];

export default MainRoutes;
