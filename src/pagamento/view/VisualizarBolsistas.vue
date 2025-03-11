<template>

    <div class="navigate-back mb-6">
        <v-icon @click="$router.go(-1)">mdi-chevron-left</v-icon>
        <a @click="$router.go(-1)">Voltar</a>
    </div>

    <v-skeleton-loader type="text" class="mx-0 my-0 skeleton-loader" v-if="isLoading" :loading="isLoading"/>
    <BaseBreadcrumb v-if="!isLoading" :title="page.title"/>
    <v-skeleton-loader v-if="isLoading">
        <v-row>
            <v-col cols="4">
                <v-skeleton-loader type="text" class="skeleton-loader" />
            </v-col>
            <v-col cols="4">
                <v-skeleton-loader type="text" class="skeleton-loader" />
            </v-col>
            <v-col cols="4">
                <v-skeleton-loader type="button" class="skeleton-loader" />  
            </v-col>
        </v-row>
    </v-skeleton-loader>
    <v-skeleton-loader v-if="isLoading" type="table" :loading="isLoading" class="mx-auto my-8 skeleton-loader">
        <v-row>
            <v-col cols="3">
                <v-skeleton-loader type="text" class="skeleton-loader" />
            </v-col>
            <v-col cols="3">
                <v-skeleton-loader type="text" class="skeleton-loader" />
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="3">
                <v-skeleton-loader type="button" class="skeleton-loader" />
            </v-col>
            <v-col cols="3">
                <v-skeleton-loader type="button" class="skeleton-loader" />
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <v-skeleton-loader type="table" class="skeleton-loader" />
            </v-col>
        </v-row>
    </v-skeleton-loader>
    <template v-else>
        <v-row>
            <v-col cols="4">
                <v-text-field v-model="search" label="Pesquisar o nome do bolsista" clearable data-test="inputSearchBolsista"></v-text-field>
            </v-col>
            <v-col cols="3">
                <v-select :items="statusProjeto" label="Filtrar por Status" clearable data-test="selectStatusProjeto"></v-select>
            </v-col>
            <v-col cols="4" class="d-flex align-start">
                <v-btn class="custom-width" color="primary" variant="flat" dark name="SearchButton">Buscar</v-btn>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <v-data-table class="border rounded-md" :headers="headers" :items="BolsistasById">

                    <template v-slot:item.Nome="{ item }"> 
                        {{ item.Pessoa.Nome }}
                    </template>

                    <template v-slot:item.Status="{ item }">
                        {{ correctNameStatusProjeto(item.Status) }}
                    </template>

                    <template v-slot:item.Sigla="{ item }">
                        {{ item.VersaoNivel.NivelBolsa.Sigla }}
                    </template>

                    <template v-slot:item.porcentagemBolsas="{ item }">
                        {{ porcentagemBolsas(item.PossuiReducaoBolsa) }}
                    </template>

                    <template v-slot:item.QtdCotasPagas="{ item }">
                        {{ item.QtdeCotasPagasPreImportacao }}/{{ item.QtdeCotasAlocadas }}
                    </template>

                    <template v-slot:item.DataInicio="{ item }">
                        {{ dayjs(item.DataInicio).format('DD/MM/YYYY') }}
                    </template>

                    <template v-slot:item.DataFim="{ item }">
                        {{ dayjs(item.DataFim).format('DD/MM/YYYY') }}
                    </template>

                    <template v-slot:item.Valor='{ item }'>
                        <b>{{ item.VersaoNivel.Valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}}</b>
                    </template>

                    <template v-slot:item.actions="{ item }"> 
                        <v-icon class="mdi mdi-eye me-2" color="primary" size="small"/>
                    </template>
                    <template v-slot:no-data>
                        <v-label>Sem dados!</v-label>
                    </template>
                </v-data-table>
                <v-row class="mt-8 mr-4">
                    <v-spacer></v-spacer>
                    <p><b>Total de bolsas alocadas vigentes: {{ valorTotalBolsistas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}}</b></p> 
                </v-row>
            </v-col>
        </v-row>
    </template>
</template>

<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { computed, onMounted, ref } from 'vue';
import dayjs from 'dayjs';

const statusProjeto = ref(['Em andamento', 'Cancelado', 'Finalizado'])
const page = ref({ title: 'Visualizar Bolsistas: Conecta Fapes'});
const isLoading = ref(false);
const route = useRoute();
const params = route.params;
const projetoId = ref(route.params.id); // Pegando o ID da URL

const headers = ref([
    { title: 'Bolsista', sortable: false, key: 'Nome' },
    { title: 'Status', sortable: false, key: 'Status'},
    { title: 'Bolsa', sortable: false, key: 'Sigla'},
    { title: 'Porcentagem', sortable: false, key: 'PorcentagemBolsa'},
    { title: 'Cotas Pagas', sortable: false, key: 'QtdCotasPagas'},
    { title: 'Início', sortable: false, key: 'DataInicio'},
    { title: 'Fim', sortable: false, key: 'DataFim'},
    { title: 'Valor', sortable: false, key: 'Valor'},
]);

const search = ref('');

const verificaSeEhLista = () => {
    if (Array.isArray(params.id)) {
        return params.id[0];
    }
    return params.id;
};

onMounted(async () => {
    isLoading.value = true;
    // await getBolsistas();
    await getBolsistaById();
    isLoading.value = false;
});

const BolsistasInfo = ref();
import BolsistasRoutes from '../model/repositories/apiRoutes/Bolsistas';
import { useBolsistasStore } from '../controller/store/BolsistasStore';
import { useRoute } from 'vue-router';
const BolsistasRoutesObject = new BolsistasRoutes({expand:'*'});
async function getBolsistas() {
  await useBolsistasStore.fetch(BolsistasRoutesObject.expand);
  BolsistasInfo.value = useBolsistasStore.items;
}

const BolsistasById = ref();
async function getBolsistaById(){
    await useBolsistasStore.fetchById(verificaSeEhLista());
    BolsistasById.value = useBolsistasStore.items;
}

const valorTotalBolsistas = computed(() => {
    return BolsistasInfo.value
        ?.filter(item => item.Status === "ATIVA" || item.Status === "Ativa")
        .reduce((total, item) => total + (item.VersaoNivel?.Valor || 0), 0) || 0;
});

function porcentagemBolsas(possuiReducao: any){
    if(possuiReducao == "1") return "60%";
    else return "100%";

}



// Filtra apenas os bolsistas cujo Projeto.Id corresponde ao ID da URL
const filteredBolsistas = computed(() => {
    return BolsistasInfo.value?.filter(item => item.Projeto?.Id == projetoId.value) || [];
});

function correctNameStatusProjeto(Status: string) {
  if (Status == 'EM_EDICAO') return 'Em Andamento';
  if (Status == 'DOCUMENTACAO_PENDENTE') return 'Documentação Pendente';
  if (Status == 'AGUARDANDO_ACEITES') return 'Aguardando Aceites';
  if (Status == 'PENDENTE_DE_AVALIACAO') return 'Pendente de Avaliação';
  if (Status == 'EM_AVALIACAO') return 'Em Avaliação';
  if (Status == 'ATIVA') return 'Ativa';
  if (Status == 'SUSPENSA') return 'Suspensa';
  if (Status == 'CANCELADA') return 'Cancelada';
  if (Status == 'FINALIZADA') return 'Finalizada';
  return Status
}
</script>

<style scoped>
.navigate-back:hover {
  cursor: pointer;
}

.navigate-back {
  display: flex;
  align-items: center;
}
</style>