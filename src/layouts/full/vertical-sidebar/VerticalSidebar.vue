<script setup lang="ts">
import { useCustomizerStore } from '@/stores/customizer';
import { computed, shallowRef } from 'vue';
import sidebarItems from './sidebarItem';

import Logo from '../logo/Logo.vue';
import NavCollapse from './NavCollapse/NavCollapse.vue';
import NavGroup from './NavGroup/index.vue';
import NavItem from './NavItem/index.vue';

const customizer = useCustomizerStore();
const sidebarMenu = shallowRef(sidebarItems);


// Computed property to check if the user has a valid token in localStorage
const isAuthenticated = computed(() => {
  const storedToken = localStorage.getItem('authToken');
  return !!storedToken; // Returns true if token exists, otherwise false
});
</script>
<template>
    <!-- <v-navigation-drawer left v-model="customizer.Sidebar_drawer" elevation="0" 
        rail-width="75" app class="leftSidebar" :rail="customizer.mini_sidebar" expand-on-hover width="256"> -->
        <v-navigation-drawer  v-if="isAuthenticated" left v-model="customizer.Sidebar_drawer" elevation="0" 
        rail-width="75" app class="leftSidebar" :rail="customizer.mini_sidebar" expand-on-hover width="256">
        <div class="pa-5 pl-4">
            <Logo />
        </div>
        <!-- Navigation -->
        <perfect-scrollbar class="">
            <v-list class="py-6 px-4">
                <!-- Menu Loop -->
                <template v-for="(item, i) in sidebarMenu" :key="i">
                    <!-- Item Sub Header -->
                    <NavGroup :item="item" v-if="item.header" :key="item.title" />
                    <NavCollapse class="leftPadding" :item="item" :level="0" v-else-if="item.children" />
                    
                    <!-- Single Item -->
                    <NavItem :item="item" v-else class="leftPadding" />
                    <!-- End Single Item -->
                </template>
            </v-list>
        </perfect-scrollbar>
    </v-navigation-drawer>
</template>