<template>
  <q-layout>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script setup lang="ts">

import axios from "axios";
import { RouterView } from "vue-router";
import { provideServices } from '../modular/api/apiProvider';
import { AuthStore, type RefreshTokenResponse } from "./composition/AuthStore";

defineOptions({
  name: 'App',
  

  //ao atualizar a página
  mounted() {
    provideServices();
    
    const checkRefreshToken = async (oldRefreshToken: string) => {
      const { data } = await axios.post<RefreshTokenResponse>(`${import.meta.env.VITE_BASE_URL_AUTH}refreshtoken`, {
        refreshToken: oldRefreshToken
      })
      return data
    }

    const updateRefreshToken = async () => {
      const { refreshToken, token } = await checkRefreshToken(AuthStore.getRefreshToken())
      AuthStore.setRefreshToken(refreshToken)
      AuthStore.setToken(token)

    }

    const rehydrateAuthStore = () => {
      const authToken = localStorage.getItem('authToken')
      const refreshToken = localStorage.getItem('refreshToken')
      const user = localStorage.getItem('user')

      if (authToken) AuthStore.setToken(authToken)
      if (refreshToken) {
        AuthStore.setRefreshToken(refreshToken)
      }
    }

    rehydrateAuthStore()

    setInterval(updateRefreshToken, 30000)
  },
})
</script>

