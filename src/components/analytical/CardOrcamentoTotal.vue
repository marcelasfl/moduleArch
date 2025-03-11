<script setup lang="ts">
import EditalController from '@/dashboard/controller/EditalController';
import ProjetoController from '@/dashboard/controller/ProjetoController';
import { useEditalSelectStore } from '@/dashboard/controller/store/EditalSelectStore';
import { useProjetoSelectStore } from '@/dashboard/controller/store/ProjetoSelectStore';
import IAlocacaoBolsista from '@/pagamento/model/AlocacaoBolsista';
import IProjeto from '@/pagamento/model/Projeto';
import IVersaoNivel from '@/pagamento/model/VersaoNivel';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';

const projetoSelectStore = storeToRefs(useProjetoSelectStore());
const editalSelectStore = storeToRefs(useEditalSelectStore());
const projetoController = new ProjetoController();
const editalController = new EditalController();

const checkProjeto = ref(false);
const checkEdital = ref(false);

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

const Projeto = ref<Projeto>({
  Id: "",
  Nome: "",
  OrcamentoTotal: 0,
  OrcamentoBolsa: 0,
  Saldo: 0,
  AlocacaoBolsistas: [],
});

onMounted(() => {
  getPosts();
});

watch(projetoSelectStore.selected, () => {
  checkProjeto.value = !!projetoSelectStore.selected.value;
  getPosts();
});

watch(editalSelectStore.selected, () => {
  checkEdital.value = !!editalSelectStore.selected.value;
  getPosts();
});

const updateOrcamentoByProjeto = async () => {
  const id = projetoSelectStore.selected.value!;
  const p: Projeto = await projetoController.getSaldoBolsasProjeto(`Id eq ${id}`);
  Projeto.value.OrcamentoTotal = p.OrcamentoTotal;

  let gasto = 0;
  p.AlocacaoBolsistas.forEach((AlocacaoBolsista) => {
    const valorBolsa = AlocacaoBolsista.VersaoNivel.Valor;
    gasto += valorBolsa * AlocacaoBolsista.QtdeCotasAlocadas;
  });
  Projeto.value.Saldo = p.OrcamentoBolsa - gasto;
};

const updateOrcamentoByEdital = async () => {
  Projeto.value.OrcamentoTotal = 0;
  const id = editalSelectStore.selected.value!;
  const edital = await editalController.getAlocacoesInEditalById(id);

  edital.Projetos?.forEach((p: Projeto) => {
    Projeto.value.OrcamentoTotal += p.OrcamentoTotal;

    let gasto = 0;
    p.AlocacaoBolsistas.forEach((AlocacaoBolsista) => {
      const valorBolsa = AlocacaoBolsista.VersaoNivel.Valor;
      gasto += valorBolsa * AlocacaoBolsista.QtdeCotasAlocadas;
    });
    Projeto.value.Saldo += p.OrcamentoBolsa - gasto;
  });
};

const getPosts = async () => {
  if (checkProjeto.value) {
    await updateOrcamentoByProjeto();
  } else if (checkEdital.value) {
    await updateOrcamentoByEdital();
  }
};
</script>

<template>
  <v-card elevation="10" id="orcamento-card">
    <v-card-text class="position-relative">
      <h3 class="text-h4 text-24">Orçamento Total</h3>
      <h3 class="text-h4 font-weight-semibold">
        R$ {{ Projeto.OrcamentoTotal.toLocaleString("pt-BR") }}
      </h3>
      <v-spacer></v-spacer>
      <h3 class="text-h4 text-24">Saldo do Orçamento das Bolsas</h3>
      <h3 class="text-h4 font-weight-semibold">
        R$ {{ Projeto.Saldo.toLocaleString("pt-BR") }}
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
