<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { IResolucao } from '../api/entities/Resolucao';
import { resolucaoService } from '../api/services/resolucaoService';
import ResolucaoForm from '../components/ResolucaoTable.vue';

const { getResolucao } = resolucaoService();
const resolucoes = ref<IResolucao[]>([]); 

onMounted(async () => {
  try {
    const response = await getResolucao(); 
    console.log('Dados recebidos:', response);
    resolucoes.value = response.data.value; 
  } catch (error) {
    console.error('Erro ao buscar resoluções:', error);
  }
});

const atualizarResolucoes = () => {
  console.log('Lista de resoluções salva:', resolucoes.value);
};
</script>

<template>
  <v-container>
    <h2 class="mb-4 text-xl font-bold">Gerenciamento de Resoluções</h2>

    <resolucao-form 
      :resolucoes="resolucoes"
      @createResolucoes="atualizarResolucoes"
    />

    <v-divider class="my-6"></v-divider>

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
