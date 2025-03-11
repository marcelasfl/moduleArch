<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useProjetoSelectStore } from '../../dashboard/controller/store/ProjetoSelectStore';
import { useBuscarSelectStore } from '@/dashboard/controller/store/BuscarStore';

const projetoSelectStore = storeToRefs(useProjetoSelectStore());
const buscarSelectStore = storeToRefs(useBuscarSelectStore());
const tamanho = ref(0);

watch(buscarSelectStore.edital, () => {
  tamanho.value = projetoSelectStore.items.value.length;
});


</script>

<template>
  <v-card elevation="10" id="orcamento-card">
    <v-card-text class="position-relative">
      <div class="d-flex align-center mb-2">
        <h2 class="text-h6">Quantidade de Projetos</h2>
      </div>
      <v-divider></v-divider>
      
      <h3 class="text-h4 font-weight-semibold mt-4"> 
      {{ tamanho }}
      </h3>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.overlay-title {
  position: relative;
  z-index: 1;
}
.bg-img-1 {
  position: absolute;
  right: -19%;
  width: 377px;
  top: 0;
}
</style>
