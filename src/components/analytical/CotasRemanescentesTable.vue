<script async lang="ts" setup>
import SaldoCotasProjetoController from '@/dashboard/controller/CotasRemanescentesController';
import { useProjetoSelectStore } from '@/dashboard/controller/store/ProjetoSelectStore';
import { useBuscarSelectStore } from '@/dashboard/controller/store/BuscarStore';
import SaldoCotasProjeto from '@/dashboard/model/SaldoCotasProjeto';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { storeToRefs } from 'pinia';
import { ref, watch } from "vue";
dayjs.extend(utc)


const saldoCotasProjeto = ref<SaldoCotasProjeto[]>([]);
const filteredSaldoCotasProjeto = ref<SaldoCotasProjeto[]>([]);
const projetoSelectStore = storeToRefs(useProjetoSelectStore());
const buscarSelectStore = storeToRefs(useBuscarSelectStore());
const saldoCotasProjetoStore = new SaldoCotasProjetoController();


const headersBolsista = ref([
    { title: 'Nível da bolsa', align: 'start', sortable: true, key: 'sigla' },
    { title: 'Valor unitário', key: 'valorUnitario', sortable: true },
    { title: 'Quantidade disponível', key: 'qtdPlanejada', sortable: false, align: 'center' },
    { title: 'Valor total', key: 'total', sortable: true },
]);

watch(saldoCotasProjeto, () => {
    filteredSaldoCotasProjeto.value = saldoCotasProjeto.value.filter(cota => {
        return true;
    });
});


watch(buscarSelectStore.projeto, () => {
    if (buscarSelectStore.projeto.value) {
        getPosts();
    } else {
        saldoCotasProjeto.value = [];
        filteredSaldoCotasProjeto.value = [];
    }
});


const getPosts = async () => {
    try {
        const response = await saldoCotasProjetoStore.getAll(`ProjetoId eq ${projetoSelectStore.selected.value}`);

        if (Array.isArray(response) && response.length > 0) {
            saldoCotasProjeto.value = response;
            filteredSaldoCotasProjeto.value = response;
        } else {
            saldoCotasProjeto.value = [];
            filteredSaldoCotasProjeto.value = [];
        }
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
    }
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};


const pageTable = ref()
const itemsPerPage = ref(10)

</script>

<template>
    <VCard elevation="10">
        <v-card-text>
            <div class="d-sm-flex align-center">
                <div>
                    <h2 class="text-h4">Cotas Remanescentes por nível de bolsa</h2>
                </div>
                <v-spacer></v-spacer>

            </div>
            <!--:sort-by="[{ key: 'Bolsista', order: 'asc' }]"-->
            <v-data-table class="month-table mt-5 mb-0" :headers="headersBolsista" :items="filteredSaldoCotasProjeto"
                :sort-by="[{ key: 'qtdPlanejada', order: 'asc' }]" :items-per-page-options="[5, 10, 25]"
                v-model:page="pageTable" v-model:items-per-page="itemsPerPage">

                <template v-slot:item.sigla="{ item }">
                    <h4 class="text-body-1 font-weight-semibold">{{ item.sigla }}</h4>
                </template>
                <template v-slot:item.qtdPlanejada="{ item }">
                    <h4 class="text-body-1 font-weight-semibold">{{ item.qtdPlanejada }}</h4>
                </template>
                <template v-slot:item.valorUnitario="{ item }">
                    <h4 class="text-body-1 font-weight-semibold">
                        {{ formatCurrency(item.valorUnitario) }}
                    </h4>
                </template>
                <template v-slot:item.total="{ item }">
                    <h4 class="text-body-1 font-weight-semibold">
                        {{ formatCurrency(item.qtdDisponivel * item.valorUnitario) }}
                    </h4>
                </template>


            </v-data-table>
        </v-card-text>
    </VCard>

</template>