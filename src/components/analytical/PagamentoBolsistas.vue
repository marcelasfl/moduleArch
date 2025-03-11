<script setup lang="ts">
import AlocacaoBolsistaController from '@/dashboard/controller/AlocacaoBolsistaController';
import PagamentoBolsitaController from '@/dashboard/controller/PagamentoBolsistaController';
import ProjetoController from '@/dashboard/controller/ProjetoController';
import { useProjetoSelectStore } from '@/dashboard/controller/store/ProjetoSelectStore';
import { useBuscarSelectStore } from '@/dashboard/controller/store/BuscarStore';
import type AlocacaoBolsista from '@/dashboard/model/AlocacaoBolsista';
import PagamentoBolsista from '@/dashboard/model/PagamentoBolsista';
import type Projeto from '@/dashboard/model/Projeto';
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';

interface series {
    name: string,
    data: number[]
}

interface formValores {
    Id: string,
    bolsista: string,
    valorPago: number
}

const formValores = ref<formValores[]>([]);

const headersBolsista = ref([
    { title: 'Bolsista', align: 'start', sortable: true, key: 'bolsista'},
    { title: 'Valor Pago', key: 'valorPago', sortable: true, align: 'end' }
    // { title: 'Valor Pago', key: 'ValorPago', sortable: true }
]);
const yValue = ref(0);
const pagamentoBolsistaController = new PagamentoBolsitaController();
const projetoController = new ProjetoController();
const alocacaoBolsistaStore = new AlocacaoBolsistaController();
const projetoSelectStore = storeToRefs(useProjetoSelectStore());
const buscarSelectStore = storeToRefs(useBuscarSelectStore());
const meseslabel = ref<string[]>([]);
const series = ref<series[]>([]);
const valoresGastos = ref<number[]>([]);
const dialogBolsista = ref(false);
const mesClicado = ref("");
const selectedAno = ref<string>("");
const anos = ref<string[]>([]);
const nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const pagamentos = ref<PagamentoBolsista[]>([]);
const isLoading = ref(false)



watch(buscarSelectStore.projeto, () => {
    if (buscarSelectStore.projeto.value) {
        getPosts();
    } else {
        meseslabel.value = [];
        valoresGastos.value = [];
        series.value = [];
        yValue.value = 0;
        formValores.value = [];
        mesClicado.value = "";
    }
});

watch(dialogBolsista, () => {
    if (!dialogBolsista.value) {
        formValores.value = [];
        yValue.value = 0;
        mesClicado.value = "";
    }
})
const getQuery = async () => {
    const projectData: Projeto[] = await projetoController.getAlocacoesInProjeto(`Id eq ${projetoSelectStore.selected.value}`);
    if (!projectData[0].AlocacaoBolsistas) {
        return;
    }
    let query = ""
    projectData[0].AlocacaoBolsistas.map((alocacao: AlocacaoBolsista) => {
        if (!query) {
            query = `PagamentoBolsistaAlocacaoBolsistaId eq ${alocacao.Id}`;
        } else {
            query += ` or PagamentoBolsistaAlocacaoBolsistaId eq ${alocacao.Id}`;
        }
    });
    
    return query
}

const getMeses = () => {
    const mesesData = pagamentos.value.reduce((resultado: { [mes: number]: { valor: number; } }, pagamento) => {
        if (dayjs(pagamento.DataPagamento).year() !== parseInt(selectedAno.value)) {
            return resultado;
        }
        const mes = dayjs(pagamento.DataPagamento).month();
        if (!resultado[mes]) {
            resultado[mes] = {
                valor: 0
            };
        }
        resultado[mes].valor += pagamento.ValorPago;
        return resultado;
    }, {});

    meseslabel.value = Object.keys(mesesData).map(mes => nomesMeses[parseInt(mes)]);
    valoresGastos.value = Object.values(mesesData).map(item => item.valor);
    series.value = [{ name: "Valor", data: valoresGastos.value }];

}


const getPosts = async () => {
    try {
        const query = await getQuery();
        pagamentos.value = await pagamentoBolsistaController.getAll(`Status eq 'PAGADO' and (${query})`);
        const anosData = pagamentos.value.reduce((resultado: string[], pagamento) => {
            const ano = dayjs(pagamento.DataPagamento).year();
            if (!resultado.includes(ano.toString())) {
                resultado.push(ano.toString());
            }
            return resultado;
        }, []);

        anos.value = anosData;
        selectedAno.value = anosData[anosData.length - 1];

        getMeses();
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
    } finally {
        isLoading.value = true;
    }
};


const chartOptions = computed(() => {
    return {
        chart: {
            height: 350,
            type: 'line',
            dropShadow: {
                enabled: true,
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
                formatter: function (val: any) {
                    return "Ver detalhes";
                }
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
                text: 'Valor (R$)'
            },
            min: 5,
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

const pageTable = ref()
const itemsPerPage = ref(10)

const procurarValoresMes = async (indexMex: number) => {
    isLoading.value = true; // Mostra o skeleton
    const query = await getQuery();
    const data: PagamentoBolsista[] = await pagamentoBolsistaController.getAll(`Status eq 'PAGADO' and (${query}) and month(DataPagamento) eq ${indexMex + 1}`);
    await Promise.all(data.map(async (pagamento: PagamentoBolsista) => {
        const items = await alocacaoBolsistaStore.getAllPessoaAlocada(`Id eq ${pagamento.PagamentoBolsistaAlocacaoBolsistaId}`);
        const item = items[0];
        const existing = formValores.value.find(valor => valor.Id === item.Id);
        if (existing) {
            existing.valorPago += item.VersaoNivel ? item.VersaoNivel.Valor : 0;
        } else {
            formValores.value.push({ Id: item.Id, bolsista: item.Pessoa ? item.Pessoa.Nome : "", valorPago: item.VersaoNivel ? item.VersaoNivel.Valor : 0 });
        }
        return items[0];
    }));
    isLoading.value = false; // Esconde o skeleton
};


const verDetalhes = (event: any, chartContext: any, config: any) => {
    const { dataPointIndex, seriesIndex } = config;
    dialogBolsista.value = true;
    if (dataPointIndex !== -1) {
        yValue.value = series.value[seriesIndex].data[dataPointIndex];
        mesClicado.value = meseslabel.value[dataPointIndex];
        const indexMes = nomesMeses.indexOf(meseslabel.value[dataPointIndex]);
        procurarValoresMes(indexMes);
    }
}

function formatMoney(value: any) {
    return new Intl.NumberFormat(undefined,{
        style: "currency",
        currency: "BRT"
    }).format(value).replace("BRT", "");
}
</script>

<template>
    <!-- ---------------------------------------------------- -->
    <!-- Column Chart -->
    <!-- ---------------------------------------------------- -->
    <v-card elevation="10">
        <v-card-text class="pb-3">
            <div class="d-sm-flex align-center">
                <div>
                    <h2 class="text-h4">Pagamento dos Bolsistas ao Longo do Tempo</h2>
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
                <apexchart type="line" height="350" :options="chartOptions" :series="series" @click="verDetalhes"></apexchart>
            </UiParentCard>
        </v-col>
    </v-card>

    <v-dialog v-model="dialogBolsista" max-width="1000">
    <v-card>
        <v-card-text>
            <div class="d-sm-flex align-center">
                <div>
                    <h2 class="text-h4 font-weith-bold">Bolsistas pagos no mês {{ mesClicado }}</h2>
                </div>
                <v-spacer></v-spacer>
                <div class="ml-auto">
                    <h2 class="text-h4">Valor total: R$ {{ formatMoney(yValue) }}</h2>
                </div>
            </div>
            <v-card-text>
                <!-- Skeleton loader while loading -->
                <template v-if="isLoading">
                    <v-skeleton-loader
                        class="mt-5"
                        :type="['table']"
                    ></v-skeleton-loader>
                </template>

                <!-- Data table after loading -->
                <template v-else>
                    <v-data-table
                        class="month-table mt-5 mb-0"
                        :headers="headersBolsista"
                        :items="formValores"
                        :sort-by="[{ key: 'valorPago', order: 'desc' }]"
                        :items-per-page-options="[5, 10, 25]"
                        v-model:page="pageTable"
                        v-model:items-per-page="itemsPerPage"
                    >
                    </v-data-table>
                </template>
            </v-card-text>
        </v-card-text>
    </v-card>
</v-dialog>


</template>