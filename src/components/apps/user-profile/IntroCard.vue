<script setup lang="ts">
import { AuthStore } from '@/composition/AuthStore';
import { jwtDecode } from "jwt-decode";
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userData = ref({ unique_name: '', email: '', role: '' }); 

const logout = () => {
  AuthStore.logout();
  router.push('/Login/PaginaInicialLogin');
  window.location.reload();
};

onMounted(() => {
  const token = localStorage.getItem('authToken'); 
  if (token) {
    const decoded = jwtDecode<any>(token);
    userData.value = {
      unique_name: decoded.unique_name,
      email: decoded.email,
      role: decoded.role,
    };
  }
});


</script>

<template>
    <v-row>
        <v-col cols="12">
            <v-card variant="outlined" class="bg-surface">
                <v-card-item>
                    <h3 class="text-h3">Olá, {{ userData.unique_name }}</h3>
                    <p class="my-5 text-subtitle-1 lh-md"></p>
                    <div class="d-flex gap-3 mb-5">
                        <BriefcaseIcon size="21" />
                        <span class="text-h6">{{ userData.role }}</span>
                    </div>
                    <div class="d-flex gap-3 mb-5">
                        <MailIcon size="21" />
                        <span class="text-h6">{{ userData.email }}</span>
                    </div>
                    <div class="d-flex gap-3 mb-5">
                        <MapPinIcon size="21" />
                        <span class="text-h6">Fapes</span>
                    </div>
                    <v-btn class="custom-width-2" color="error" variant="flat" dark @click="logout">
                    Logout
                    </v-btn>
                </v-card-item>
            </v-card>
        </v-col>
    </v-row>
</template>
