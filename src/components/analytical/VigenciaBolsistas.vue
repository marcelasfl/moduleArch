<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import BolsistaPorTempoController from '@/dashboard/controller/BolsistaPorTempoController';
import { useProjetoSelectStore } from '@/dashboard/controller/store/ProjetoSelectStore';
import { useBuscarSelectStore } from '@/dashboard/controller/store/BuscarStore';
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import BolsistaPorTempo from '@/dashboard/model/BolsistaPorTempo';

interface series {
    name: string,
    data: number[]
}
const yValue = ref(0);
const bolsistas = ref<BolsistaPorTempo[]>([]);
const bolsistaTempoStore = new BolsistaPorTempoController();
const projetoSelectStore = storeToRefs(useProjetoSelectStore());
const buscarSelectStore = storeToRefs(useBuscarSelectStore());
const meseslabel = ref<string[]>([]);
const series = ref<series[]>([]);
const valoresGastos = ref<number[]>([]);
const anos = ref<string[]>([]);
const selectedAno = ref<string>("");
const nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];



watch(buscarSelectStore.projeto, () => {
    if (buscarSelectStore.projeto.value) {
        getPosts();
    } else {
        meseslabel.value = [];
        valoresGastos.value = [];
        series.value = [];
        yValue.value = 0;
    }
});

const getMeses = () => {
    const mesesData = bolsistas.value.reduce((resultado: { [mes: number]: { valor: number; } }, bolsista: BolsistaPorTempo) => {
        if (dayjs(bolsista.mesReferencia).year() !== parseInt(selectedAno.value)) {
            return resultado;
        }
        const mes = dayjs(bolsista.mesReferencia).month();
        if (!resultado[mes]) {
            resultado[mes] = {
                valor: 0
            };
        }
        resultado[mes].valor += (bolsista.qtdAtivos - bolsista.qtdSairam + bolsista.qtdEntraram);
        return resultado;
    }, {});

    meseslabel.value = Object.keys(mesesData).map(mes => nomesMeses[parseInt(mes)]);
    valoresGastos.value = Object.values(mesesData).map(item => item.valor);
    series.value = [{ name: "Valor", data: valoresGastos.value }];
}


const getPosts = async () => {
    try {
        bolsistas.value = await bolsistaTempoStore.getAll(`projetoId eq ${projetoSelectStore.selected.value!}`);
        //const data: PagamentoBolsista[] = await pagamentoBolsistaController.getAll(`Status eq 'PAGADO' and (${query})`);
        const anosData = bolsistas.value.reduce((resultado: string[], bolsista: BolsistaPorTempo) => {
            const ano = dayjs(bolsista.mesReferencia).year();
            if (!resultado.includes(ano.toString())) {
                resultado.push(ano.toString());
            }
            return resultado;
        }, []);

        anos.value = anosData;
        selectedAno.value = anosData[anosData.length - 1];
        getMeses();
    }
    catch (error) {
        console.error("Erro ao buscar dados:", error);
    }
}

const chartOptions = computed(() => {
    return {
        chart: {
            height: 350,
            type: 'line',
            dropShadow: {
                enabled: false,
                color: '#000',
                top: 18,
                left: 7,
                blur: 10,
                opacity: 0.2
            },
            zoom: {
                enabled: false
            },
            toolbar: {
                show: false
            }
        },
        colors: ["#18A03A"],
        dataLabels: {
            enabled: true,
        },
        stroke: {
            curve: 'smooth'
        },
        grid: {
            borderColor: '#e7e7e7',
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
            },
        },
        markers: {
            size: 1
        },
        tooltip: {
            x: {
                show: true,
            }
        },
        xaxis: {
            categories: meseslabel.value,
            title: {
                text: 'Mês'
            }
        },
        yaxis: {
            title: {
                text: 'Quantidade'
            },
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            floating: true,
            offsetY: -25,
            offsetX: -5
        }
    }
})

</script>

<template>
    <!-- ---------------------------------------------------- -->
    <!-- Column Chart -->
    <!-- ---------------------------------------------------- -->
    <v-card elevation="10">
        <v-card-text class="pb-3">
            <div class="d-sm-flex align-center">
                <div>
                    <h2 class="text-h4">Média de vigência de bolsista</h2>
                </div>
                <v-spacer></v-spacer>
                <div class="ml-auto">
                    <v-select 
                        v-model="selectedAno" 
                        :items="anos" 
                        variant="outlined" 
                        dense 
                        hide-details 
                        @update:modelValue="getMeses">
                    </v-select>
                </div>
            </div>
        </v-card-text>
        <v-col cols="12">
            <UiParentCard>
                <apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
            </UiParentCard>
        </v-col>
    </v-card>

</template>