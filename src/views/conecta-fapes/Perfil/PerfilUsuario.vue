<script setup lang="ts">
import IntroCard from '@/components/apps/user-profile/IntroCard.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { ref } from 'vue';
// import PostListing from '@/components/apps/user-profile/PostListing.vue';
// import AddPost from '@/components/apps/user-profile/posts/AddPost.vue';
// import ProfileBanner from '@/components/apps/user-profile/ProfileBanner.vue';

const page = ref({ title: 'Perfil do usuário' });
const breadcrumbs = ref([
    {
        text: 'Perfil',
        disabled: false,
        href: '/'
    },
    {
        text: 'Usuário',
        disabled: true,
        href: '#'
    }
]);
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-row class="mt-4">
        <v-col cols="12" lg="4" md="4">
            <IntroCard />
        </v-col>
        <v-col cols="12" lg="8" md="8">
        </v-col>
    </v-row>
</template>