<script setup lang="ts">
import InfosGeraisController from '@/dashboard/controller/InfosGeraisController';
import InfosGeraisAreaTecnica from '@/dashboard/model/InfosGeraisAreaTecnica';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from "vue";
import { useAreaTecnicaSelectStore } from '../../dashboard/controller/store/AreaTecnicaSelectStore';
import { useBuscarSelectStore } from '@/dashboard/controller/store/BuscarStore';


onMounted(() => {
  if (buscarSelectStore.areaTecnica.value) getPosts();
});

const areaTecnicaSelectStore = storeToRefs(useAreaTecnicaSelectStore());
const buscarSelectStore = storeToRefs(useBuscarSelectStore());
const infosGeraisStore = new InfosGeraisController();
const info = ref<InfosGeraisAreaTecnica>();



watch(buscarSelectStore.areaTecnica, () => {
  if (buscarSelectStore.areaTecnica.value) {
    getPosts();
  }
});


const getPosts = async () => {
  info.value = await infosGeraisStore.getAreaTecnicaById(areaTecnicaSelectStore.selected.value!);
};
</script>



<template>
  <v-card elevation="10" id="orcamento-card">
    <v-card-text class="position-relative">

      <p class="text-h6 text-start ">Informações gerais</p>
      <br>
      <v-divider></v-divider>
      <br>
      <p class="text-h5 text-start mb-4">Quantidade de Editais: {{info?.qtdEditais}}</p>
      <h3 class="text-h4 font-weight-semibold">
      </h3>
      <v-spacer></v-spacer>
      <h3 class= "text-h5 text-start mb-4">Quantidade de Projetos: {{info?.qtdProjetos}}</h3> 
      <h3 class="text-h4 font-weight-semibold">
        <!-- R$ {{ Projeto.Saldo.toLocaleString("pt-BR") }} -->
      </h3>
      <h3 class= "text-h5 text-start mb-4">Quantidade de Bolsistas: {{ info?.qtdBolsistasAtivos }}</h3> 

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
