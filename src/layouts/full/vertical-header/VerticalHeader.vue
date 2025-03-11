<script async setup lang="ts">
import config from '@/config';
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Menu2Icon } from 'vue-tabler-icons';
import { useCustomizerStore } from '../../../stores/customizer';

const customizer = useCustomizerStore();
// Get the current route
const router = useRouter().currentRoute;

// Define routes where the sidebar should not appear
const noSidebarRoutes = '/login/PaginaInicialLogin';

// Compute the visibility of the sidebar based on the current route
const isLoginPage = computed(() => noSidebarRoutes.includes(router.value.fullPath));

watch(router, (newRoute) => {
  if (noSidebarRoutes.includes(newRoute.path)) {
    config.mini_sidebar = false;
    config.Sidebar_drawer = false;
    config.boxed = false;
  }
});

// Computed property to check if the user has a valid token in localStorage
const isAuthenticated = computed(() => {
  const storedToken = localStorage.getItem('authToken');
  return !!storedToken; // Returns true if token exists, otherwise false
});

</script>

<template>
    <v-app-bar elevation="0"  v-if="isAuthenticated" height="64" color="background"  id="top">
        <!-- <v-app-bar v-if="!isLoginPage" elevation="0" :priority="priority" height="64" color="background"  id="top"> -->

        <v-btn 
            class="hidden-md-and-down "
            icon
            color="primary"
            variant="text"
            @click.stop="customizer.SET_MINI_SIDEBAR(!customizer.mini_sidebar)"
        >
            <Menu2Icon size="25"  />
        </v-btn>
        <v-btn v-if="!isLoginPage" class="hidden-lg-and-up" icon variant="text" @click.stop="customizer.SET_SIDEBAR_DRAWER" size="small">  
            <Menu2Icon size="25" />
        </v-btn>
        <v-spacer />
    </v-app-bar>
</template>
