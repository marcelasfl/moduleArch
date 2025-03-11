<script async setup lang="ts">
import logo from '@/assets/images/logos/logo_fapes.svg';
import { RouterLink } from 'vue-router';
</script>
<template>
    <div class="logo">
        <RouterLink to="/">
            <img :src="logo" alt="home" />
        </RouterLink>
    </div>
</template>
