<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
  <v-skeleton-loader
    v-if="isLoading"
    type="table"
    :loading="isLoading"
    class="mx-auto my-8 skeleton-loader"
  >
    <v-row>
      <v-col cols="3">
        <v-skeleton-loader type="text" class="skeleton-loader" />
      </v-col>
      <v-col cols="3">
        <v-skeleton-loader type="text" class="skeleton-loader" />
      </v-col>
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
      <v-col cols="2" class="d-flex justify-star">
        <v-btn class="custom-width-2" color="primary" variant="flat" dark @click="addResolucao" data-test="buttonIncluirResolucao">
          Incluir Resolução
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">
        <v-select v-model="filterType" :items="filterTypes" label="Escolha o tipo de filtro" clearable @click:clear="searchResolucoes" data-test="selectFiltroTipo"></v-select>
      </v-col>
      <v-col cols="6">
        <v-text-field v-model="search" :label="filterLabel" clearable data-test="inputBusca"></v-text-field>
      </v-col>
      <v-col cols="2" class="d-flex align-start">
        <v-btn class="custom-width" color="primary" variant="flat" dark @click="searchResolucoes" data-test="buttonBuscar">Buscar</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-data-table class="border rounded-md" :headers="headersResolucao" :items="filteredResolucao"
          :sort-by="[{ key: 'Numero', order: 'asc' }]" :items-per-page-options="[5, 10, 25]" v-model:page="pageTable"
          v-model:items-per-page="itemsPerPage" @update:page="fetchData">

          <template v-slot:top>
            <v-row>
              <v-col class="d-flex justify-end">
              </v-col>
            </v-row>
            <v-spacer />
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5 text-center py-6">Tem certeza que deseja deletar esse item?</v-card-title>
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="primary" variant="outlined" dark @click="closeDelete" data-test="buttonCancelarDelecao">Cancelar</v-btn>
                  <v-btn color="primary" variant="flat" dark @click="deleteItem" data-test="buttonConfirmarDelecao">OK</v-btn>
                  <v-spacer />
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
          <template v-slot:item.Numero="{ item }">
            <a href="#" @click.prevent="goToDetail(item.Id)" data-test="linkNumero">{{ item.Numero }}</a>
          </template>
          <template v-slot:item.Ementa="{ item }">
            <div class="ementa-cell" data-test="divEmenta">{{ item.Ementa }}</div>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon class="mdi mdi-link me-2" color="primary" size="small" @click="linkAcess(item.Link)" data-test="iconLinkAcess" />
            <v-icon color="primary" size="small" class="me-2" @click="editItem(item.Id)" data-test="iconEditItem">
              mdi-pencil
            </v-icon>
            <v-icon color="error" size="small" @click="confirmDeleteItem(item)" data-test="iconDeleteItem">
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data>
            <v-label>Não há dados disponíveis.</v-label>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </template>
</template>
<style scoped>
.ementa-cell {
  white-space: normal;
  word-break: break-word;
  max-width: 800px;
}

.custom-width {
  height: 48px;
  width: 100px
}

.custom-width-2 {
  height: 48px;
  width: 200px;
}
</style>

<script async setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Swal from 'sweetalert2';
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
dayjs.extend(utc);


// Rotas
import ResolucaoGenericObject from '@/services/requires/objects/modalidadebolsa/Resolucao';
import resolucaoRequires from '../../../services/requires/require';
import log from '@/logger';
const ResolucaoObject = new ResolucaoGenericObject({});

const { list, remove } = resolucaoRequires(ResolucaoObject.entity);

const isLoading = ref(false)
const page = ref({ title: 'Resoluções ' });
const breadcrumbs = ref([
  { text: 'Resolução', disabled: true, href: '#' },
  { text: '', disabled: true, href: '#' }
]);

const dialog = ref(false);
const router = useRouter();
const dialogDelete = ref(false);
const headersResolucao = ref([
  { title: 'Número', align: 'start', sortable: true, key: 'Numero' },
  { title: 'Ementa', key: 'Ementa', sortable: false, class: 'ementa-cell' },
  { title: 'Publicação', key: 'Data', sortable: false }, 
  { title: 'Ações', key: 'actions', sortable: false }
]);

interface Resolucao {
  Id: string;
  Numero: string;
  Ementa: string;
  Link: string;
  Data: string;
}

const resolucao = ref<Resolucao[]>([]);
const filteredResolucao = ref<Resolucao[]>([]);
const editedIndex = ref(-1);
const editedItem = ref<Resolucao | null>(null);
const defaultItem = ref<Resolucao | null>(null);
const itemToDelete = ref<string | null>(null);
const search = ref('');
const filterType = ref();
const filterTypes = ref(['Número da Resolução', 'Ementa']);
const form = reactive({
  Id: '',
  Numero: '',
  Ementa: '',
  Link: '',
  Data: ''
});

const filterLabel = computed(() => {
  if (filterType.value === 'Ementa') {
    return 'Filtrar por Ementa';
  }
  return 'Filtrar por Número da Resolução';
});

const sortBy = ref<{ key: keyof Resolucao; order: 'asc' | 'desc' }>({ key: 'Numero', order: 'desc' });

onMounted(() => {
  getPosts();
});


const odataCount = ref()
const getPosts = async () => {
  try {
    isLoading.value = false;
    const data = await list();
    getOdataCount();
    log.info('Data from API:', data);
    data.value.forEach((element: Resolucao) => {
      element.Data = dayjs(element.Data).utc().format('DD/MM/YYYY');
    });
    resolucao.value = data.value;
    filteredResolucao.value = data.value;
    sortData();
    isLoading.value = false;
    sortData(); 
  } catch (error) {
    console.error('Error fetching resolutions:', error);
  }
};

const getOdataCount = async () => {
  try{
    const { list:listPaginacao } = resolucaoRequires(ResolucaoObject.count);
    const data = await listPaginacao();
    odataCount.value = data["@odata.count"];
  } catch (error) {
    console.error('Error fetching resolutions:', error);
  }
}

const getPostPaginacao = async () => {
  try{
    const ResolucaoObject = new ResolucaoGenericObject({ skip: filteredResolucao.value.length });
    const { list:listPaginacao } = resolucaoRequires(ResolucaoObject.paginacao);
    const data = await listPaginacao();
    log.info('Data from API:', data);
    data.value.forEach((element: Resolucao) => {
      resolucao.value.push(element)
      filteredResolucao.value.push(element)
    });
  } catch (error) {
    console.error('Error fetching resolutions:', error);
  }
}

const pageTable = ref()
const itemsPerPage = ref(10)
const fetchData = () => {
  if ((itemsPerPage.value * (pageTable.value + 1)) > filteredResolucao.value.length && filteredResolucao.value.length < odataCount.value) {
    getPostPaginacao();
  }
}

const sortData = () => {
  filteredResolucao.value = [...resolucao.value].sort((a, b) => {
    if (sortBy.value.order === 'desc') {
      return b[sortBy.value.key] < a[sortBy.value.key] ? -1 : 1;
    } else {
      return a[sortBy.value.key] < b[sortBy.value.key] ? -1 : 1;
    }
  });
};

function confirmDeleteItem(item: Resolucao) {
  itemToDelete.value = item.Id; 
  dialogDelete.value = true;
}

async function deleteItem() {
  if (itemToDelete.value !== null) {
    try {
      await remove(itemToDelete.value);
      Swal.fire({
        title: "Deletado com sucesso!",
        icon: "success",
        confirmButtonColor: "#D3D3D3",
        timer: 2000, 
        showConfirmButton: false 
      }).then(() => {
        getPosts(); 
        router.push({ path: '/resolucao/IndexResolucao' });
      });
    } catch (error) {
      console.error('Error deleting resolution:', error);
      Swal.fire({
        title: 'Não foi possível apagar',
        text: 'A resolução está vinculada a um projeto',
        icon: 'error',
        confirmButtonColor: '#D3D3D3'
      });
    } finally {
      dialogDelete.value = false;
    }
  }
}

function linkAcess(link: string) {
  const urlPattern = new RegExp('^(https?:\\/\\/)?' +
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' +
    '((\\d{1,3}\\.){3}\\d{1,3}))' +
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
    '(\\?[;&a-z\\d%_.~+=-]*)?' +
    '(\\#[-a-z\\d_]*)?$', 'i');

  if (urlPattern.test(link)) {
    window.location.href = link;
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Link inválido',
      text: 'O link fornecido não é válido.',
      confirmButtonColor: '#D3D3D3'
    });
  }
}

function addResolucao() {
  router.push('/resolucao/formResolucao');
}

function editItem(id: string) {
  router.push({ path: `/resolucao/formResolucao/${id}` });
}

function closeDelete() {
  dialogDelete.value = false;
  itemToDelete.value = null;
}

function close() {
  dialog.value = false;
  nextTick(() => {
    editedItem.value = defaultItem.value ? { ...defaultItem.value } : null;
    editedIndex.value = -1;
  });
}

function goToDetail(id: string) {
  router.push({ path: `/resolucao/DetailsResolucao/${id}` });
}

const searchResolucoes = () => {
  filterResolucoes();
};

const filterResolucoes = () => {
  if (!search.value) {
    filteredResolucao.value = resolucao.value;
  } else {
    const searchQuery = search.value.toLowerCase();
    filteredResolucao.value = resolucao.value.filter((item) => {
      if (filterType.value === 'Ementa') {
        return item.Ementa.toLowerCase().includes(searchQuery);
      } else {
        //return item.Numero.toLowerCase().includes(searchQuery);
        return item.Numero == searchQuery;
      }
    });
  }
};

watch(dialog, val => {
  if (!val) close();
});

watch(dialogDelete, val => {
  if (!val) closeDelete();
});
</script>