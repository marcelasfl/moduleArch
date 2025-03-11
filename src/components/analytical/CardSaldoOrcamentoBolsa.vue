<script setup lang="ts">
import ProjetoController from '@/dashboard/controller/ProjetoController';
import { useProjetoSelectStore } from '@/dashboard/controller/store/ProjetoSelectStore';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
//import AlocacaoBolsista from '@/services/requires/objects/dashboards/Editais';
import IAlocacaoBolsista from '@/dashboard/model/AlocacaoBolsista';
import IProjeto from '@/dashboard/model/Projeto';
import IVersaoNivel from '@/dashboard/model/VersaoNivel';

const projetoSelectStore = storeToRefs(useProjetoSelectStore());
const projetoController = new ProjetoController();
const checkProjeto = ref(false);

interface VersaoNivel extends IVersaoNivel {
  Valor: number;
}

interface AlocacaoBolsista extends IAlocacaoBolsista {
  VersaoNivel: VersaoNivel;
  QtdeCotasAlocadas: number;
}

interface Projeto extends IProjeto {
  OrcamentoTotal: number;
  OrcamentoBolsa: number;
  Saldo: number;
  AlocacaoBolsistas: AlocacaoBolsista[];
}

const Projeto = ref<Projeto>(
  {
    Id: "",
    Nome: "",
    OrcamentoTotal: 0,
    OrcamentoBolsa: 0,
    Saldo: 0,
    AlocacaoBolsistas: [],
  }
);

onMounted(() => {
  getPosts();
});

watch(projetoSelectStore.selected, () => {
    checkProjeto.value = !!projetoSelectStore.selected.value;
    getPosts();
});

const updateOrcamentoByProjeto = async () => {
  // saldo.value = 0;
  // const ids = projetoSelectStore.selected.value.includes("0")?
  //   projetoSelectStore.items.value.map(item => item.Id):
  //   projetoSelectStore.selected.value;
  // ids.forEach(async (id) => {
  //   const projeto = await projetoController.getSaldoBolsasProjetoById(id);
  //   let gasto = 0
  //   projeto.AlocacaoBolsistas?.forEach((AlocacaoBolsistas) => {
  //     const valorBolsa = AlocacaoBolsistas.VersaoNivel.Valor;
  //     gasto += valorBolsa * AlocacaoBolsistas.QtdeCotasAlocadas;
  //   });
  //   saldo.value += (projeto.OrcamentoBolsa - gasto);
  // })

  const id = projetoSelectStore.selected.value!;
  const p: Projeto = await projetoController.getSaldoBolsasProjetoById(id);
  let gasto = 0
  p.AlocacaoBolsistas.forEach((AlocacaoBolsista) => {
    const valorBolsa = AlocacaoBolsista.VersaoNivel.Valor;
    gasto += valorBolsa * AlocacaoBolsista.QtdeCotasAlocadas;
  });
  Projeto.value.Saldo = (p.OrcamentoBolsa - gasto);
}

const getPosts = async () => {
  if (checkProjeto.value) {
    updateOrcamentoByProjeto();
    return  
  } 
}
</script>
<template>
  <v-card elevation="10" >
    <v-card-text class="position-relative" id="orcamento-bolsa">
      <h3 class="text-h4 text-24">
        Saldo do Orçamento das Bolsas
      </h3>
      <v-spacer></v-spacer>
      <h3 class="text-h4 font-weight-semibold">R$ {{ Projeto.Saldo.toLocaleString("pt-BR") }}</h3>
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