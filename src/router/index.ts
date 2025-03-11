import { createRouter, createWebHistory } from 'vue-router';
import AuthRoutes from './AuthRoutes';
import MainRoutes from './MainRoutes';
// import { PagamentoRoutes } from '../ModularArch/modules/Pagamentos/router/pagamentoRoutes';

const routes = [
    {
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/authentication/Error.vue')
    },
    ...MainRoutes,
    ...AuthRoutes,
]

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

router.afterEach((to) => {
    const token = localStorage.getItem('authToken');

    if (to.path === '/login/PaginaInicialLogin') {
        if (token) {
            router.push('/resolucao/IndexResolucao').then(() => {
                window.location.reload();
            });
        } 
    } else if (!token) {
        router.push('/login/PaginaInicialLogin');

    }
});

export default router;
