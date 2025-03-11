<script async setup lang="ts">
import { computed, shallowRef } from 'vue';
import { useRoute } from 'vue-router'; // Importa o useRoute
import { useDisplay } from 'vuetify';
import HorizontalItems from './horizontalItems';

// Computed property to check if the user has a valid token in localStorage
const isAuthenticated = computed(() => {
  const storedToken = localStorage.getItem('authToken');
  return !!storedToken; // token existe? = true
});

const sidebarMenu = shallowRef(HorizontalItems);
const { mdAndUp } = useDisplay();
const route = useRoute(); // pegando a rota atual

// Computed property para verificar se a rota atual é '/login/PaginaInicialLogin'
const shouldDisplaySidebar = computed(() => route.path !== '/login/PaginaInicialLogin');

</script>

<template>
    <!-- To renderizando aq a sidebar apenas se o token estiver presente no localStorage -->
    <template v-if="isAuthenticated">
        <template v-if="mdAndUp">
            <div class="horizontalMenu border-bottom bg-surface position-relative">
                <div :class="config.boxed ? 'maxWidth' : 'px-6'">
                    <ul class="gap-1 horizontal-navbar mx-lg-0 mx-3">
                        <!---Menu Loop -->
                        <li v-for="(item, i) in sidebarMenu" :key="i" class="navItem">
                            <!---If Has Child -->
                            <NavCollapse :item="item" :level="0" v-if="item.children" />
                            <!---Single Item-->
                            <NavItem :item="item" v-else />
                            <!---End Single Item-->
                        </li>
                    </ul>
                </div>    
            </div>
        </template>
        <template v-else-if="shouldDisplaySidebar" class="mobile-menu">

            <VerticalSidebar />
        </template> 
    </template> 
</template>