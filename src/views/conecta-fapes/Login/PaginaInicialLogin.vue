<script setup lang="ts">
import router from '@/router';

 import { AuthStore } from '@/composition/AuthStore';
 import { onMounted } from 'vue';


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

function callback(e: any) {
  try {
    const redirectUri = encodeURIComponent(window.location.origin + '/login/AuthAcessoCidadao'); 
    window.location.href = import.meta.env.VITE_BASE_URL_AUTH;
  } catch (error) {
    console.error('Erro ao redirecionar para o Acesso Cidadão:', error);
  }
}

function paginaInicial() {
  router.push('/modalidade/IndexModalidade');
}
</script>

<template>
  <div class="pa-0">
    <v-row class="no-gutters auth">
      <!-- Coluna Esquerda -->
      <v-col
        cols="12"
        lg="6"
        class="d-flex align-center justify-center bg-white"
      >
        <div class="text-center px-6">
          <img
            src="@/assets/images/backgrounds/icon-school.svg"
            alt="FAPES"
            width="80"
            class="mb-4"
          />

          <h2 class="text-h4 font-weight-bold mb-2">
            Faça login no Conecta Fapes
          </h2>

          <p class="text-body mb-6">
            Para acessar o sistema, utilize sua conta do Acesso Cidadão.
            Clique no botão abaixo para continuar.
          </p>

          <v-btn
            color="primary"
            elevation="2"
            large
            @click="callback"
          >
            Login com Acesso Cidadão
          </v-btn>
        </div>
      </v-col>

      <!-- Coluna Direita -->
      <v-col
        cols="12"
        lg="6"
        class="d-flex align-center justify-center bg-overlay"
      >
        <div class="text-center">
            <img
              src="@/assets/images/logos/fapes_logo_login.svg"
              alt="FAPES"
              width="500"
              class="mb-4"
            />
          
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.auth {
  height: 100vh;
  margin: 0;
}

.no-gutters {
  margin: 0;
}

.bg-overlay {
  background-color: #2B3A8A;
  background-image: url("@/assets/images/backgrounds/s-fapes.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.text-body {
  color: #555555;
}

.v-btn {
  color: #ffffff;
}
</style>


<style scoped>
.auth {
  height: 100vh;
  margin: 0;
}

.no-gutters {
  margin: 0;
}

.bg-overlay {
  background-color: #2B3A8A;
  background-image: url("@/assets/images/backgrounds/s-fapes.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.text-body {
  color: #555555;
}

.v-btn {
  color: #ffffff;
}
</style>