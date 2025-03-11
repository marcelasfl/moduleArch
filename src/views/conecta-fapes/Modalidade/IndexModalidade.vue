<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
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
            <v-col cols="6" class="d-flex justify-start">
                <v-btn class="custom-width-2" color="primary" variant="flat" dark @click="addModalidade" data-test="buttonIncluirModalidade"> Incluir Modalidade </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="4">
                <v-select v-model="filterType" :items="filterTypes" label="Escolha o tipo de filtro" clearable @click:clear="searchModalidades"
                ></v-select>
            </v-col>
            <v-col cols="6" class="d-flex justify-start">
                <v-text-field
                    v-model="search"
                    :label="filterLabel"
                    clearable
                    @click:clear="searchModalidades"
                    data-test="inputPesquisarPalavraChave"
                ></v-text-field> 
            </v-col>
            <v-col cols="2" class="d-flex align-start">
                <v-btn class="custom-width" color="primary" variant="flat" dark @click.prevent="searchModalidades" data-test="buttonBuscar">Buscar</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-data-table
                    class="border rounded-md"
                    :headers="headers"
                    :items="filteredModalidades"
                    :sort-by="[{ key: 'Sigla', order: 'asc' }]"
                    :items-per-page-options="[5, 10, 25]"
                    v-model:page="pageTable"
                    v-model:items-per-page="itemsPerPage"
                    @update:page="fetchData"
                    data-test="dataTableModalidades"
                >
                    <template v-slot:top>
                        <v-spacer />
                        <v-dialog v-model="dialogVersionChoice" max-width="800px"> </v-dialog>
                    </template>
                    <template v-slot:item.Sigla="{ item }">
                        <a href="#" @click.prevent="checkVersion(item)" data-test="linkSigla">{{ item.Sigla }}</a>
                    </template>
                    <template v-slot:item.Ativa="{ item }">
                        <span>{{ item.Ativa ? item.Ativa : '-' }}</span>
                    </template>

                    <template v-slot:item.EmEdicao="{ item }">
                        <span>{{ item.EmEdicao ? item.EmEdicao : '-' }}</span>
                    </template>

                    <template v-slot:item.actions="{ item }">
                        <v-icon v-if="item.EmEdicao" color="primary" size="small" class="me-2" @click="editItem(item.Id)" data-test="iconEdit">
                            mdi-pencil</v-icon
                        >
                        <v-icon v-else-if="item.Ativa" class="me-2" color="primary" dark @click="viewCurrentVersion(item.Id)" data-test="iconView">
                            mdi-eye</v-icon
                        >
                    </template>
                    <template v-slot:no-data>
                        <v-label>Não há dados para serem exibidos!</v-label>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
    </template>
</template>

<style scoped>
.custom-width {
    height: 48px;
    width: 100px;
}

.custom-width-2 {
    height: 48px;
    width: 200px;
}
</style>
<script async setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import dayjs from 'dayjs';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { VBtn, VCol, VDataTable, VDialog, VIcon, VLabel, VRow, VSpacer, VTextField } from 'vuetify/components';
import modalidadeRequires from '../../../services/requires/require';

import ModalidadeGenericObject from '@/services/requires/objects/modalidadebolsa/Modalidade';
const ModalidadeObject = new ModalidadeGenericObject({});
const isLoading = ref(false);
const { list } = modalidadeRequires(ModalidadeObject.modalidadeCount);
const page = ref({ title: 'Modalidades' });
const search = ref('');
const filteredModalidades = ref<Modalidade[]>([]);
const filterTypes = ref(['Sigla', 'Nome', "Versão Ativa", "Em Edição"]);
const filterType = ref();
const modalidade = ref<Modalidade[]>([]);
const breadcrumbs = ref([
    { text: 'Modalidade', disabled: true, href: '#' },
    { text: '', disabled: true, href: '#' }
]);

interface Modalidade {
    Id: string;
    Sigla: string;
    Nome: string;
    Ativa: string | null;
    EmEdicao: string | null;
    VersaoModalidadesBolsas: VersaoModalidade[];
    [key: string]: any;
}

interface VersaoModalidade {
    Estado: string;
    Sigla: string;
}

const dialog = ref(false);
const dialogVersionChoice = ref(false);
const router = useRouter();

const filterLabel = computed(() => {
  if (filterType.value === 'Sigla') {
    return 'Filtrar por Sigla';
  } else if (filterType.value === 'Versão Ativa') {
    return 'Filtrar por Versão Ativa';
  } else if (filterType.value === 'Em Edição') {
    return 'Filtrar por Em Edição';
  }
  return 'Filtrar por Nome';
});

const headers = [
    { key: 'Sigla', title: 'Sigla', align: 'start', sortable: true },
    { key: 'Nome', title: 'Nome' },
    { key: 'Ativa', title: 'Versão Ativa' },
    { key: 'EmEdicao', title: 'Em edição' },
    { key: 'actions', title: 'Ações', sortable: false }
] as const;

const editedIndex = ref(-1);
const editedItem = ref<Partial<Modalidade>>({});
const defaultItem = ref<Partial<Modalidade>>({});
const selectedModalidade = ref<Modalidade>({} as Modalidade);
onMounted(() => {
    getPosts();
});

const getPosts = async () => {
    try {
        isLoading.value = true;
        const data = await list();
        
        odataCount.value = data['@odata.count'];
        prepareDataFromApi(data, true);
        isLoading.value = false;
    } catch (error) {
        console.error('Error fetching resolutions:', error);
    }
};

const odataCount = ref();

const getPostPaginacao = async () => {
    try {
        const ModalidadeObject = new ModalidadeGenericObject({ skip: filteredModalidades.value.length });
        const { list: listPaginacao } = modalidadeRequires(ModalidadeObject.modalidadePagination);
        const data = await listPaginacao();
        
        prepareDataFromApi(data, false, true);
    } catch (error) {
        console.error('Error fetching resolutions:', error);
    }
};

const prepareDataFromApi = (data: any, firstGet?: boolean, pagination?: boolean, searchModalidade?: boolean) => {
    data.value.forEach((element: Modalidade) => {
        element.Data = dayjs(element.Data).format('DD/MM/YYYY');
        const emEdicaoVersao = element.VersaoModalidadesBolsas.find((versao) => versao.Estado === 'EM_EDICAO');
        const ativaVersao = element.VersaoModalidadesBolsas.find((versao) => versao.Estado === 'ATIVA');
        element.EmEdicao = emEdicaoVersao ? emEdicaoVersao.Sigla : '';
        element.Ativa = ativaVersao ? ativaVersao.Sigla : '';

        if (pagination) {
            modalidade.value.push(element);
            filteredModalidades.value.push(element);
        } else if (searchModalidade) {
            filteredModalidades.value.push(element);
        } else if (firstGet) {
            modalidade.value = data.value;
            filteredModalidades.value = data.value;
        }
    });
};

const pageTable = ref();
const itemsPerPage = ref(10);
const fetchData = () => {
    if (
        itemsPerPage.value * (pageTable.value + 1) > filteredModalidades.value.length &&
        filteredModalidades.value.length < odataCount.value
    ) {
        getPostPaginacao();
    }
};
const searchModalidades = async () => {
    filterModalidades();
};

const filterModalidades = async () => {
    if (!search.value) {
        filteredModalidades.value = modalidade.value;
    } else {
        const searchQuery = search.value.toLowerCase();
        filteredModalidades.value = modalidade.value.filter((item) => {
            if (filterType.value === 'Sigla') {
                return item.Sigla.toLowerCase().includes(searchQuery);
            } else if (filterType.value === 'Nome') {
                return item.Nome.toLowerCase().includes(searchQuery);
            } else if (filterType.value === 'Versão Ativa') {
                return item.Ativa.toLowerCase().includes(searchQuery);
            } else if (filterType.value === 'Em Edição') {
                return item.EmEdicao.toLowerCase().includes(searchQuery);
            }
        });

        // const ModalidadeObject = new ModalidadeGenericObject({ filter: searchQuery });
        // const { list: listPaginacao } = modalidadeRequires(ModalidadeObject.modalidadeFiltro);
        // const data = await listPaginacao();
        // filteredModalidades.value = [];
        // prepareDataFromApi(data, false, false, true);
    }
};

const checkVersion = (item: Modalidade) => {
    if (item.EmEdicao) {
        editItem(item.Id);
    } else if (item.Ativa) {
        viewCurrentVersion(item.Id);
    } else {
        viewCurrentVersion(item.Id);
    }
};

const editItem = (id: string) => {
    router.push({ path: `/modalidade/EditModalidade/${id}` });
};

const viewCurrentVersion = (id: string) => {
    dialogVersionChoice.value = false;
    router.push({ path: `/modalidade/DetailsModalidade/${id}` });
};

const addModalidade = () => {
    router.push('/modalidade/CreateModalidade');
};

const close = () => {
    dialog.value = false;
    nextTick(() => {
        editedItem.value = Object.assign({}, defaultItem.value);
        editedIndex.value = -1;
    });
};

watch(dialog, (val) => {
    if (!val) close();
});
</script>
