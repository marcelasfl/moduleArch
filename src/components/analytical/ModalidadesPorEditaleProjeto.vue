<script setup lang="ts">
import { computed, ref } from 'vue';

// common components
import UiParentCard from '@/components/shared/UiParentCard.vue';
import QtdBolsasEditalController from '@/dashboard/controller/QtdBolsasEditalController';
import QtdBolsasProjetoController from '@/dashboard/controller/QtdBolsasProjetoController';
import { useEditalSelectStore } from '@/dashboard/controller/store/EditalSelectStore';
import { useProjetoSelectStore } from '@/dashboard/controller/store/ProjetoSelectStore';
import { useBuscarSelectStore } from '@/dashboard/controller/store/BuscarStore';
import type Modalidade from '@/dashboard/model/Modalidade';
import IQtdBolsasEdital from '@/dashboard/model/QtdBolsasEdital';
import IQtdBolsasProjeto from '@/dashboard/model/QtdBolsasProjeto';
import { getdashboardcolorBlue } from '@/utils/UpdateColors';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';

// theme breadcrumb

interface series {
    name: string,
    data: number[]
}
const series = ref<series[]>([]);
const siglas = ref<string[]>([]);
const qtdBolsasEditalStore = new QtdBolsasEditalController();
const qtdBolsasProjetoStore = new QtdBolsasProjetoController();
const projetoSelectStore = storeToRefs(useProjetoSelectStore());
const editalSelectStore = storeToRefs(useEditalSelectStore());
const buscarSelectStore = storeToRefs(useBuscarSelectStore());
const filtro = ref<string>("");
const color = ref<string>("#295FD5");

watch(buscarSelectStore.projeto, () => {
    getPosts();
});

watch(buscarSelectStore.edital, () => {
    getPosts();
});

const updateSelectByEdital = async (selectedValues: string) => {
    try {
        const allData: IQtdBolsasEdital = await qtdBolsasEditalStore.getById(selectedValues);
        const siglas_quantidade = allData.modalidades.reduce((resultado: { [sigla: string]: { qtd: number; } }, modalidade: Modalidade) => {
            resultado[modalidade.sigla] = {
                qtd: modalidade.quantidade
            };
            return resultado;
        }, {});
        color.value = "#295FD5";
        const quantidades = Object.values(siglas_quantidade).map((quantidade) => quantidade.qtd);
        series.value = [{ name: "Quantidade", data: quantidades }];
        siglas.value = Object.keys(siglas_quantidade);
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
    }
};


const updateSelectByProjeto = async (selectedValues: string) => {
    try {
        const allData: IQtdBolsasProjeto = await qtdBolsasProjetoStore.getById(selectedValues);
        const siglas_quantidade = allData.modalidades.reduce((resultado: { [sigla: string]: { qtd: number; } }, modalidade: Modalidade) => {
            resultado[modalidade.sigla] = {
                qtd: modalidade.quantidade
            };
            return resultado;
        }, {});
        color.value = "#18A03A"
        const quantidades = Object.values(siglas_quantidade).map((quantidade) => quantidade.qtd);
        series.value = [{ name: "Quantidade", data: quantidades }];
        siglas.value = Object.keys(siglas_quantidade);
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
    }
};


const getPosts = async () => {
    if (projetoSelectStore.selected.value) {
        updateSelectByProjeto(projetoSelectStore.selected.value);
        filtro.value = "por projeto"
        return;
    }
    if (editalSelectStore.selected.value) {
        updateSelectByEdital(editalSelectStore.selected.value);
        filtro.value = "por edital"
    } else {
        series.value = [];
        siglas.value = [];
        filtro.value = ""
    }
}
const chartOptions = computed(() => {
    return {
        chart: {
            type: 'bar',
            height: 350,
            fontFamily: `inherit`,
            foreColor: '#adb0bb',
            toolbar: {
              show: false,
            },
        },
        colors: [getdashboardcolorBlue.value],

        plotOptions: {
            bar: {
                horizontal: false,
                endingShape: 'rounded',
                columnWidth: '20%',
                distributed: true,
                dataLabels: {
                    position: 'top'
                }
            },
            
        },
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '12px',
                colors: ["#304758"],
            },
            offsetY: -20,
            formatter: (val: number) => val.toString(),
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },

        xaxis: {
            title: {
                text: 'Modalidades'
            },
            categories: siglas.value,
        },
        yaxis: {
            title: {
                text: 'Quantidade',
            },
            labels: {
                show: false,
                formatter: function (val:any) {
                  return val;
                }
            },
        },
        fill: {
            opacity: 1
        },
       
        tooltip: {
            theme: 'dark',
        },
        grid: {
          show: false,
        },
        legend: {
          show: false,
          position: 'bottom',
          width: '50px',
        },
        responsive: [
            {
                breakpoint: 600,
                options: {
                    yaxis: {
                        show: false
                    }
                }
            }
        ]
    };
});

</script>

<template>
    <!-- ---------------------------------------------------- -->
    <!-- Column Chart -->
    <!-- ---------------------------------------------------- -->
    <v-card elevation="10">
        <v-card-text class="pb-3" id="modalidades-edital-projeto">
            <div class="d-sm-flex align-center">
                <div>
                    <h2 class="text-h4">Modalidades de bolsas {{ filtro }}</h2>
                </div>
                <v-spacer></v-spacer>
            </div>
        </v-card-text>
        <v-col cols="12">
            <UiParentCard>
                <apexchart type="bar" height="300" :options="chartOptions" :series="series"></apexchart>
            </UiParentCard>
        </v-col>
    </v-card>
</template>