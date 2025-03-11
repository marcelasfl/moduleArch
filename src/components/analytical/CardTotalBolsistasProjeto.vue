<script setup lang="ts">
import InfosGeraisController from '@/dashboard/controller/InfosGeraisController';
import { useProjetoSelectStore } from '@/dashboard/controller/store/ProjetoSelectStore';
import { useBuscarSelectStore } from '@/dashboard/controller/store/BuscarStore';
import type InfosGeraisProjeto from '@/dashboard/model/InfosGeraisProjeto';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

const buscarSelectStore = storeToRefs(useBuscarSelectStore());
const projetoSelectStore = storeToRefs(useProjetoSelectStore());
const infosGeraisStore = new InfosGeraisController();

const checkProjeto = ref(false);
const info = ref<InfosGeraisProjeto>();

watch(buscarSelectStore.projeto, () => {
  getPosts();
});

const getCount = async () => {
  try{
    info.value = await infosGeraisStore.getProjetoById(projetoSelectStore.selected.value!);
    // const {alocacoes, odata} = await alocacaoBolsistaStore.getAll(`Projeto/Id eq ${projetoSelectStore.selected.value!}`);
    // let contPendentes = 0;

    // alocacoes.map((alocacao: AlocacaoBolsista) => {
    //   if (alocacao.Status === 'PENDENTE_DE_AVALIACAO') {
    //     contPendentes++;
    //   }
    // });
    // odataCount.value = odata - contPendentes;
    // pendentes.value = contPendentes;
  } catch (error) {
    console.error('Error fetching resolutions:', error);
  }
}

const getPosts = async () => {
  if (buscarSelectStore.projeto.value) {
    await getCount();
  }
};
</script>

<template>
  <v-card elevation="10" id="orcamento-card">
    <v-card-text class="position-relative">
      <div class="d-flex align-center mb-2">
        <h2 class="text-h6">Bolsistas no projeto</h2>
      </div>
      <v-divider></v-divider>
      <h3 class="text-h4 font-weight-semibold mt-4">
        {{ info?.qtdBolsistasAtivos }} ativos
      </h3>
      <v-spacer></v-spacer>
      <h3 class="text-h6 text-danger">
        {{ info?.qtdBolsistasPendentesAvaliacao }} pendentes de avaliação
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
