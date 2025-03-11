<script setup lang="ts">
import AlocacaoBolsistaController from "@/dashboard/controller/AlocacaoBolsistaController";
import { useEditalSelectStore } from "@/dashboard/controller/store/EditalSelectStore";
import { useBuscarSelectStore } from "@/dashboard/controller/store/BuscarStore";
import { getdashboardcolorBlue, getdashboardcolorDarkGreen, getdashboardcolorRed, getPrimary, getSecondary } from '@/utils/UpdateColors';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from "vue";

/* Chart */

const editalSelectStore = storeToRefs(useEditalSelectStore());
const buscarSelectStore = storeToRefs(useBuscarSelectStore());
const alocacaoBolsistaStore = new AlocacaoBolsistaController();
const niveis = ref<{ series: number[], labels: string[] }>({ series: [], labels: [] });

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

watch(buscarSelectStore.edital, () => {
  getPostsModalidadesOrcamento();
});

const getPostsModalidadesOrcamento = async () => {
  try {
    const response = await alocacaoBolsistaStore.getAll(`Projeto/Edital/Id eq ${editalSelectStore.selected.value}`);

    const data = response.alocacoes;

    if (!Array.isArray(data)) {
      throw new Error("Os dados recebidos não estão no formato esperado.");
    }

    const aggregatedData: Record<string, number> = {};

    data.forEach((item: any) => {
      const nivelBolsa = item?.VersaoNivel?.NivelBolsa || {};
      const versaoNivel = item?.VersaoNivel || {};

      const sigla = nivelBolsa.Sigla || "N/A";
      const valor = parseFloat(versaoNivel.Valor || "0");

      if (aggregatedData[sigla]) {
        aggregatedData[sigla] += valor;
      } else {
        aggregatedData[sigla] = valor;
      }
    });

    niveis.value = {
      labels: Object.keys(aggregatedData),
      series: Object.values(aggregatedData)
    };

  } catch (error) {
    console.error("Erro ao carregar dados das modalidades de orçamento:", error);
  }
};

const chartOptions = computed(() => {
  return {
    series: niveis.value.series,
    labels: niveis.value.labels,
    chart: {
      height: 280,
      type: "donut",
      fontFamily: "DM sans",
    },

    colors: [getSecondary.value, getPrimary.value, getdashboardcolorDarkGreen.value, getdashboardcolorBlue.value, getdashboardcolorRed.value ],

    tooltip: {
      y: {
        formatter: (val: number) => formatCurrency(val) 
      }
    },
    legend: { show: true },
    grid: {
      show: false,
      borderColor: "transparent",
      padding: { top: 0, right: 0 },
    },
    stroke: { colors: ["transparent"] },
    plotOptions: {
      pie: {
        donut: {
          size: "78%",
          background: "transparent",
          labels: {
            show: true, 
            name: { show: true },
            value: {
              show: true, 
              formatter: (val: number) => formatCurrency(val) 

            }
          },
        },
      },
    },
  };
});

</script>

<template>
  <v-card elevation="10">
    <v-card-text>
      <div class="d-flex align-center mb-5">
        <h2 class="text-h4">Orçamento das modalidades de bolsas</h2>
        <div class="ml-auto"></div>
      </div>
      <v-divider></v-divider>
      <div class="border-top mt-5 d-flex align-center">
        <h6 class="text-subtitle-1 text-medium-emphasis font-weight-medium">
          Separado por saldo das modalidades
        </h6>
      </div>
      <div class="mt-5 pt-5 position-relative">
        <apexchart type="donut" height="280px" :options="chartOptions" :series="chartOptions.series"></apexchart>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.total-sales-icon {
  position: absolute;
  left: 46%;
  top: 45%;
  opacity: 0.6;
}
</style>
