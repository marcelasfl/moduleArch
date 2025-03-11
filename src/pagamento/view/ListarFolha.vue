<template>
    <BaseBreadcrumb :breadcrumbs="breadcrumbs" :title="page.title" />
    
    <p>Selecione um ano para visualizar as folhas geradas</p>
    <br>

    <v-row>
        <v-col cols="3">
            <v-select v-model="ano" :items="anos" label="Visualizar por ano" clearable></v-select>
        </v-col>
        <v-col cols="3" class="d-flex align-start">
            <v-btn class="custom-width text-none" color="primary" variant="flat" dark>Buscar</v-btn>
        </v-col>
    </v-row>

    <div>
        <v-skeleton-loader v-if="isLoading" type="table" :loading="isLoading" class="mx-auto my-8 skeleton-loader">
        <v-row>
            <v-col cols="12">
                <v-skeleton-loader type="table" class="skeleton-loader" />
            </v-col>
        </v-row>
        </v-skeleton-loader>
        <v-data-table
            v-if="!isLoading"
            class="border rounded-md"
            :headers="headers"
            :items="folhaInfo"
        >

            <template v-slot:item.Titulo="{ item }">
                <td>
                    <a class="folha-btn" @click="onFolhaClick(item.Id)">{{ item.Titulo }}</a>
                </td>
            </template>

            <template v-slot:item.Status="{ item }">
                <span :class="getStatusClass(item.Status)">
                    {{ item.Status }}
                </span>
            </template>

            <template v-slot:item.Horario="{ item }">
                {{ dayjs(item.Horario).format('DD/MM/YYYY') }}
            </template>

            <template v-slot:item.autorizacao="{item}">
                {{ item.DecisaoFolhas.findLast((element: any) => element.TipoAcaoFolha == 'AUTORIZAR') ? dayjs(item.DecisaoFolhas.findLast((element: any) => element.TipoAcaoFolha == 'AUTORIZAR').Horario).format('DD/MM/YYYY') : "-"}}
            </template>

            <template v-slot:item.ValorPrevisto="{ item }">
                <b>
                    {{ item.ValorPrevisto.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) }}
                </b>
            </template>

            <template v-slot:item.actions="{ item }">
                <v-icon class="mdi mdi-eye me-2" color="primary" size="small" @click="onFolhaClick(item.Id)"/>
                <v-icon class="mdi mdi-download me-2" color="primary" size="small"/>
            </template>

            <template v-slot:no-data>
                <v-label>Não há dados para serem exibidos!</v-label>
            </template>
            <template #bottom></template>
        </v-data-table>
    </div>

    <v-snackbar
      v-model="snackbar"
      :timeout="snackbarTimeout"
      :color="snackbarColor"
    >
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="snackbar = false"
        >
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
</template>

<script async setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { onMounted, ref } from 'vue';
import dayjs from 'dayjs';
const anoAtual = dayjs().year();
const ano = ref(anoAtual);
const anos = ref([2024, 2025]);
const isLoading = ref(false);


// Componentes
// Informacoes BreadCrumbs
const page = ref({ title: 'Listar Folhas de Pagamento' });
const breadcrumbs = ref([
  { text: 'Pagamento', disabled: true, href: '#' },
  { text: 'Listar Folhas de Pagamento', disabled: false, href: '#' }
]);

// Informacoes V Data Table
const headers = [
    { key: 'Titulo', title: 'Folha', align: 'start' },
    { key: 'Status', title: 'Status da folha' },
    { key: 'Horario', title: 'Geração' },
    { key: 'autorizacao', title: 'Autorização' },
    { key: 'ValorPrevisto', title: 'Valor da folha' },
    { key: 'actions', title: 'Ações', sortable: false }
];

const getStatusClass = (status: string) => {
    if (status === 'GERADA') {
        return 'status-gerada';
    } else if (status === 'PAGA') {
        return 'status-paga';
    } else if (status === 'CANCELADA'){
        return 'status-cancelada';
    } else if (status === 'REJEITADA'){
      return 'status-cancelada';
    } else if (status === 'AUTORIZADA'){
      return 'status-autorizada';
    } else if (status === 'REJEITADA'){
        return 'status-cancelada';
    }
    return '';
};

import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const params = route.params;

const router = useRouter();
const onFolhaClick = (id: string) => {
    router.push(`/pagamento/VisualizarFolha/${id}`);
};

const folhaInfo = ref();

onMounted(async () => {
    isLoading.value = true;
    await getFolhas();
    if (params.cancelado) snackbarCancelada();
    isLoading.value = false;
});

const snackbar = ref(false);
const snackbarText = ref('');
const snackbarTimeout = ref(3000);
const snackbarColor = ref('');
function snackbarCancelada() {
  snackbarText.value = `Folha cancelada com sucesso.`;
  snackbarColor.value = '';
  snackbar.value = true;
}

import FolhaRoutes from '../model/repositories/apiRoutes/Folha';
import { useFolhaStore } from '../controller/store/FolhaStore';
const FolhaRoutesObject = new FolhaRoutes({expand:'*'});
async function getFolhas() {  
    await useFolhaStore.filter(FolhaRoutesObject.expand);
    folhaInfo.value = useFolhaStore.items;
}

</script>

<style scoped>

.folha-btn {
    text-decoration: underline;
  color: #2B3A8A;
  cursor: pointer;
}

.status-gerada {
    font-weight: bold;
    background-color: orange;
    border-radius: 15px;
    padding: 5px;
}

.status-paga {
    color: white;
    font-weight: bold;
    background-color: green;
    border-radius: 15px;
    padding: 5px;
}

.status-cancelada{
    color: white;
    background-color: #AE1212;
    border-radius: 15px;
    font-weight: bold;
    padding: 5px;
}

.status-autorizada {
  color: white;
  font-weight: bold;
  background-color: #2B3A8A;
  border-radius: 15px;
  padding: 5px;
}
</style>