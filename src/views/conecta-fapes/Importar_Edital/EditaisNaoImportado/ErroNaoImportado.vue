<template>
    <h2 class="text-xl mb-2">Editais com erro na sincronização</h2>
    <div class="mb-4 d-flex align-items-center">
    </div>

    <div class="p-8">
        <div class="mb-6">
            Lista dos editais que vieram com erro durante as últimas sincronização
        </div>
    </div>

    <div v-if="isLoading">
        <v-skeleton-loader type="text@3"></v-skeleton-loader>
    </div>

    <div v-else>
        <v-row>
            <v-col cols="4">
                <v-text-field label="Pesquisar o nome do edital" v-model="search" clearable data-test="inputPesquisarEdital"></v-text-field>
            </v-col>

            <v-col cols="1" class="mt-1">
                <v-btn class="custom-width" color="primary" variant="flat" dark data-test="buttonBuscar">Buscar</v-btn> 
            </v-col>

        </v-row>
    </div>

    <v-data-table class="border rounded-md" :headers="headers" :items="items">
        <template v-slot:no-data>
            <v-skeleton-loader v-if="isLoading" type="table"></v-skeleton-loader>
            <v-label v-else>Sem dados!</v-label>
        </template>
    </v-data-table>
</template>


<script async setup lang="ts">
// Importacoes
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Rotas
const router = useRouter();
const route = useRoute();
const params = route.params;
const isLoading = ref(true);
const search = ref()
const searchStatus = ref()

const headers = [
    { key: 'Edital', title: 'Edital', sortable: false },
    { key: 'DataInicio', title: 'Data Início', sortable: false },
    { key: 'DataFim', title: 'Data Fim', sortable: false },
    { key: 'Status', title: 'Status', sortable: false },
    { key: 'AreaTecnica', title: 'Área Técnica', sortable: false },
];

const items = ref([
    {
        Edital: 'Edital 01/2024 - Desenvolvimento Web',
        DataInicio: '01/01/2024',
        DataFim: '01/06/2024',
        Status: 'Não importado',
        AreaTecnica: 'Desenvolvimento Web'
    },
    {
        Edital: 'Edital 02/2024 - Análise de Dados',
        DataInicio: '01/12/2023',
        DataFim: '01/05/2024',
        Status: 'Não importado',
        AreaTecnica: 'Análise de Dados'
    },
    {
        Edital: 'Edital 03/2024 - Infraestrutura de Redes',
        DataInicio: '15/02/2024',
        DataFim: '15/07/2024',
        Status: 'Não importado',
        AreaTecnica: 'Infraestrutura de Redes'
    },
    {
        Edital: 'Edital 04/2024 - Segurança da Informação',
        DataInicio: '01/03/2024',
        DataFim: '01/08/2024',
        Status: 'Não importado',
        AreaTecnica: 'Segurança da Informação'
    },
    {
        Edital: 'Edital 05/2024 - Banco de Dados',
        DataInicio: '10/04/2024',
        DataFim: '10/09/2024',
        Status: 'Não importado',
        AreaTecnica: 'Banco de Dados'
    }
]);

setTimeout(() => {
    isLoading.value = false;
}, 500);


const StatusAlocacaoItems = ref([
    { Status: "Ativa", Value: 'ATIVA' },
    { Status: "Cancelada", Value: 'CANCELADA' },
    { Status: "Em avaliação", Value: 'EM_AVALIACAO' }
]);

// Forms
const form = reactive({
    DataInicio: '',
    DataFim: '',
    Status: '',
    AreaTecnica: '',
});


// Objeto rota

// onMounted(async () => {

//     }
// });

</script>
