<script setup lang="ts">
import { ref } from 'vue';
import type { IResolucao } from '../api/entities/Resolucao';
import ResolucaoTable from '../components/ResolucaoTable.vue';

const resolucoes = ref<IResolucao[]>([]);

const atualizarResolucoes = (data: IResolucao[]) => {
  resolucoes.value = [...data]; 
  console.log('Lista de resoluções atualizada:', resolucoes.value);
};

</script>

<template>
  <h2 class="mb-4 text-xl font-bold">Gerenciamento de Resoluções</h2>

  <ResolucaoTable :resolucoes="resolucoes" @loadResolucoes="atualizarResolucoes" />
</template>

<style scoped>
.text-xl {
  font-size: 1.25rem;
}

.font-bold {
  font-weight: 700;
}
</style>
