<script setup lang="ts">
import { useProjetoSelectStore } from '@/dashboard/controller/store/ProjetoSelectStore';
import { useBuscarSelectStore } from '@/dashboard/controller/store/BuscarStore';
import ProjetoController from '@/dashboard/controller/ProjetoController';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

const projetoStore = new ProjetoController();
const projetoSelectStore = storeToRefs(useProjetoSelectStore());
const buscarSelectStore = storeToRefs(useBuscarSelectStore());
const checkProjeto = ref(false);
const status = ref("")

watch(buscarSelectStore.projeto, () => {
  getPosts();
});


const getPosts = async () => {
  if (buscarSelectStore.projeto.value) {
    const projeto = await projetoStore.getAll(`Id eq ${projetoSelectStore.selected.value!}`);
    status.value = projeto[0].Status;
  }
};
</script>

<template>
  <v-card elevation="10" id="orcamento-card">
    <v-card-text class="position-relative">
      <div class="d-flex align-center mb-2">
        <h2 class="text-h6">Status do projeto</h2>
      </div>
      <v-divider></v-divider>
      <h3 class="text-h4 font-weight-semibold mt-4 mb-5" style="color: #18A03A" v-if="status === 'EM_ANDAMENTO'">
        Em andamento
      </h3>
      <h3 class="text-h4 font-weight-semibold mt-4 mb-5" style="color: #295FD5" v-else-if="status === 'FINALIZADO'">
        Finalizado
      </h3>
      <h3 class="text-h4 font-weight-semibold mt-4 mb-5" style="color: #D81F1F" v-else>
        Cancelado
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
.text-danger {
    color: red
}
</style>

