<script setup lang="ts">
import { AuthStore } from '@/composition/AuthStore';
import { onMounted } from 'vue';

//pode ir pra composable
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const authToken = urlParams.get('token');
  const refreshToken = urlParams.get('refresh_token');

  if (authToken) {
    AuthStore.setToken(authToken);
  }
  
  if (refreshToken) {
    AuthStore.setRefreshToken(refreshToken.replaceAll(" ", '+'));
  }
});
</script>

<template>  
  <div class="pa-3 h-100vh d-flex align-center justify-center" data-test="divLoading">  
    <div class="text-center">  
      <p class="text-h5 font-weight-medium" data-test="pLoadingMessage">Aguarde os dados sendo carregados</p>  
    </div>  
  </div>  
</template>  

<style scoped>
.h-100vh {
  height: 100vh;
}
</style>
