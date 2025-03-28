<script setup lang="ts">
import { ref } from 'vue';
import BolsistasTable from '../components/BolsistasTable.vue';

</script>

<template>
  <v-container>
    <h2 class="mb-4 text-xl font-bold">Gerenciamento de Resoluções</h2>

    <BolsistasTable />
  </v-container>
</template>

<style scoped>
.text-xl {
  font-size: 1.25rem;
}

.font-bold {
  font-weight: 700;
}
</style>
