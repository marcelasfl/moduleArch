<script setup lang="ts">
import snackbarStore from '@/ModularArch/store/SnackbarStore/index';

const { snackbar, snackbarText, snackbarColor, snackbarTimeout } = snackbarStore()
</script>

<template>
  <v-snackbar
    v-model="snackbar"
    :timeout="snackbarTimeout"
    :color="snackbarColor"
  >
  {{ snackbarText }}

  <template v-slot:actions>
    <v-btn
      variant="text"
      @click="snackbar = false"
    >
      Fechar
    </v-btn>
  </template>
  </v-snackbar>
</template>