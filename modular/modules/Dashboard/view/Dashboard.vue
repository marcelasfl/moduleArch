<script setup lang="ts">
// import BolsistasTable from "@/components/analytical/BolsistasTable.vue";
// import CardStatusProjeto from "@/components/analytical/CardStatusProjeto.vue";
// import CardTotalbolsistasEdital from "@/components/analytical/CardTotalbolsistasEdital.vue";
// import CardTotalBolsistasProjeto from "@/components/analytical/CardTotalBolsistasProjeto.vue";
// import CotasRemanescentesTable from "@/components/analytical/CotasRemanescentesTable.vue";
// import DonutPie from "@/components/analytical/DonutPie.vue";
// import DownloadRelatorio from "@/components/analytical/DownloadRelatorio.vue";
// import InfosGeraisAreaTecnica from "@/components/analytical/InfosGeraisAreaTecnica.vue";
// import ModalidadesPorEditaleProjeto from "@/components/analytical/ModalidadesPorEditaleProjeto.vue";
// import PagamentoBolsistas from "@/components/analytical/PagamentoBolsistas.vue";
// import QtdProjetosEdital from "@/components/analytical/QtdProjetosEdital.vue";
// import VigenciaBolsistas from "@/components/analytical/VigenciaBolsistas.vue";
// import AreaTecnicaController from "@/dashboard/controller/AreaTecnicaController";
import { storeToRefs } from 'pinia';
import { inject, ref, watch } from "vue";
import type { AreaTecnicaService } from '../api/services/dashboardService';
import EditalController from "../controller/EditalController";
import ProjetoController from "../controller/ProjetoController";
import { useAreaTecnicaSelectStore } from "../controller/store/AreaTecnicaSelectStore";
import { useBuscarSelectStore } from "../controller/store/BuscarStore";
import { useEditalSelectStore } from "../controller/store/EditalSelectStore";
import { useProjetoSelectStore } from '../controller/store/ProjetoSelectStore';
import AreaTecnicaSelect from "./generic/AreaTecnicaSelect.vue";
import BuscarButton from "./generic/BuscarButton.vue";
import EditalSelect from "./generic/EditalSelect.vue";
import ProjetoSelect from "./generic/ProjetoSelect.vue";

const areaTecnicaSelectStore = storeToRefs(useAreaTecnicaSelectStore());
const projetoSelectStore = storeToRefs(useProjetoSelectStore());
const editalSelectStore = storeToRefs(useEditalSelectStore());
const buscarSelectStore = storeToRefs(useBuscarSelectStore());
const areaTecnicaService = inject<AreaTecnicaService>('areaTecnicaService');
const editalStore = new EditalController();
const projetoStore = new ProjetoController();
const nomeAreaTecnica = ref('');
const nomeEdital = ref('');
const nomeProjeto = ref('');
const page = ref({ title: "Painel de monitoramento financeiro e operacional" });

watch(buscarSelectStore.areaTecnica, () => {
  if(buscarSelectStore.areaTecnica.value) getNomeAreaTecnica();
});

watch(buscarSelectStore.edital, () => {
  if(buscarSelectStore.edital.value) getNomeEdital();
});


watch(buscarSelectStore.projeto, () => {
  if(buscarSelectStore.projeto.value) getNomeProjeto();
});

const getNomeAreaTecnica = async () => {
  try { 
    const data = await areaTecnicaService.getById(areaTecnicaSelectStore.selected.value!);
    nomeAreaTecnica.value = data.Nome;
  } catch {
    console.error("Erro ao carregar dados");
  }
}


const getNomeEdital = async () => {
  try {
    const data = await editalStore.getById(editalSelectStore.selected.value!);
    nomeEdital.value = data.Nome;
  } catch {
    console.error("Erro ao carregar dados");
  }
}

const getNomeProjeto = async () => {
  try {
    const data = await projetoStore.getAll(`Id eq ${projetoSelectStore.selected.value}`);
    nomeProjeto.value = data[0].Nome;
  } catch {
    console.error("Erro ao carregar dados");
  }
}

</script>
<template>
<div class="text-container">
  <h1 class="custom-title">{{ page.title }}</h1>
  <p class="mb-12 text-h7" >
    Acompanhe o orçamento, o status das bolsas e os principais indicadores por área técnica, edital e projeto
  </p>
</div>



  <v-row id="container">
    <v-col cols="3">
      <AreaTecnicaSelect />
    </v-col>
    <v-col cols="3">
      <EditalSelect />
    </v-col>

    <v-col cols="3">
      <ProjetoSelect />
    </v-col> 
    <v-col cols="2" class="d-flex align-start"> 
      <BuscarButton />
    </v-col>
  </v-row>

<div v-if="!buscarSelectStore.areaTecnica.value">
  Selecione uma área técnica
</div>


<div v-show="buscarSelectStore.areaTecnica.value">
  <v-row class="mb-4">
    <v-col cols="12" lg="12">
      <p class="custom-description-area-tecnica">
        Visão geral da <strong>{{nomeAreaTecnica}}</strong>
      </p>
    </v-col>


    <v-col cols="8" sm="6" lg="6" class="d-flex justify-start">
      <InfosGeraisAreaTecnica />
    </v-col>
    <v-col cols="12" sm="6" lg="6" class="d-flex justify-center">
      <DownloadRelatorio />
    </v-col>
  </v-row>
</div>
<br>
<div v-show="buscarSelectStore.edital.value">
  <v-col cols="12" lg="12">
      <p class="custom-description-edital">
        Detalhes do <strong>{{nomeEdital}}</strong>
      </p>
    </v-col>
  <v-row>
    <v-col cols="8" sm="6" lg="6" class="d-flex justify-start">
      <QtdProjetosEdital />
    </v-col>
    <v-col cols="8" sm="6" lg="6" class="d-flex justify-start">
      <CardTotalbolsistasEdital />
    </v-col>
    <v-col cols="12" sm="12" lg="20">
      <ModalidadesPorEditaleProjeto />
    </v-col>
    <v-col cols="12" sm="12" lg="20" class="mt-4">
      <DonutPie  />
    </v-col>


  </v-row>
</div>

<div v-show="buscarSelectStore.projeto.value">
  <br>
  <br>
  <br>
  <v-col cols="12" lg="12">
      <p class="custom-description-projeto">
        Detalhes de <strong>{{ nomeProjeto }}</strong> em {{ nomeEdital }}
      </p>
    </v-col>
  <v-row>
    <v-col cols="6" sm="12" lg="6">
      <CardTotalBolsistasProjeto />
    </v-col>
    <v-col cols="6" sm="12" lg="6">
      <CardStatusProjeto />
    </v-col>
    <v-col cols="6" sm="12" lg="6">
      <VigenciaBolsistas />
    </v-col>
    <v-col cols="6" sm="12" lg="6">
      <PagamentoBolsistas />
    </v-col>
    <v-col cols="12" sm="12" lg="20">
      <BolsistasTable />
    </v-col>
    <v-col cols="12" sm="12" lg="20">
      <CotasRemanescentesTable />
    </v-col>
  </v-row>
</div>
</template>

<style scoped>
.text-container {
  max-width: 700px; 
  margin: 100 auto;
  text-align: left;
}
.custom-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 1rem;
}

.custom-description-area-tecnica {
  font-size: 22px;
  margin-bottom: 1rem;
  margin-top: 50px; 
}

.custom-description-edital {
  font-size: 22px;
  margin-bottom: 1rem;
  margin-top: 50px; 
}

.custom-description-projeto {
  font-size: 22px;
  margin-bottom: 1rem;
  margin-top: 50px; 
}

</style>
