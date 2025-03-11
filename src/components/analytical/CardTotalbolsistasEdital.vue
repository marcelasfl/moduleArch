<script setup lang="ts">
import InfosGeraisController from '@/dashboard/controller/InfosGeraisController';
import { useEditalSelectStore } from '@/dashboard/controller/store/EditalSelectStore';
import { useBuscarSelectStore } from '@/dashboard/controller/store/BuscarStore';
import type InfosGeraisEdital from '@/dashboard/model/InfosGeraisEdital';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

const editalSelectStore = storeToRefs(useEditalSelectStore());
const buscarSelectStore = storeToRefs(useBuscarSelectStore());
const infosGeraisStore = new InfosGeraisController();

const info = ref<InfosGeraisEdital>();

watch(buscarSelectStore.edital, () => {
  getPosts();
});


const getCount = async () => {
  try{
    info.value = await infosGeraisStore.getEditalById(editalSelectStore.selected.value!);
  } catch (error) {
    console.error('Error fetching resolutions:', error);
  }
}

const getPosts = async () => {
  if (buscarSelectStore.edital.value) {
    await getCount();
  }
};
</script>

<template>
  <v-card elevation="10" id="orcamento-card">
    <v-card-text class="position-relative">
      <div class="d-flex align-center mb-2">
        <h2 class="text-h6">Total de Bolsistas</h2>
      </div>
      <v-divider></v-divider>
      <h3 class="text-h4 font-weight-semibold mt-4">
        {{ info?.qtdBolsistasAtivos }} ativos
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
