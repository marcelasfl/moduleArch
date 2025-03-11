<script setup lang="ts">
import { getSecondary } from '@/utils/UpdateColors';
import { computed, ref, type PropType } from "vue";

defineProps({
  projeto: {
    type: Array as PropType<any[]>,
    required: true,
  },
  totalPessoas: {
    type: Number,
    required: true,
  },
  totalBolsistasAtivos: {
    type: Number,
    required: true,
  },
});

const selectedProjeto = ref(null); // Para armazenar o projeto selecionado

const chartOptions = computed(() => {
  return {
    series: [
      {
        name: "Vigência dos bolsistas",
        data: [30, 32, 34, 40, 60],
      },
    ],
    colors: [getSecondary.value],
    fill: {
      colors: getSecondary.value,
      opacity: 0.05,
      type: "solid",
    },
    chart: {
      type: "area",
      height: 75,
      toolbar: { show: false },
      foreColor: "#adb0bb",
      sparkline: { enabled: true },
    },
    dataLabels: { enabled: false },
    markers: { size: 0 },
    legend: { show: false },
    stroke: {
      show: true,
      width: 2,
      curve: "smooth",
    },
    tooltip: { theme: "dark" },
  };
});
</script>

<template>
  <v-card elevation="10" class="overflow-hidden w-100">
    <v-card-text class="pb-3">
      <!-- <v-select
        v-model="selectedProjeto"
        :items="projeto"
        item-text="Nome"
        item-value="Id"
        label="Selecione o projeto"
        outlined
        dense
      ></v-select> -->
      <div class="d-flex align-start">
        <div>
          <span class="text-subtitle-1 font-weight-medium text-medium-emphasis">Vigência dos bolsistas</span>
          <h2 class="font-weight-medium">{{ totalBolsistasAtivos }} bolsistas ativos</h2>

        </div>
        <v-spacer></v-spacer>
        <div class="ml-auto">
          <v-btn icon class="btn-custom-sm" color="secondary" fab small>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-user"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
              <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
            </svg>
          </v-btn>
        </div>
      </div>
    </v-card-text>
    <div>
      <apexchart type="area" height="75px" :options="chartOptions" :series="chartOptions.series"></apexchart>
    </div>
  </v-card>
</template>
