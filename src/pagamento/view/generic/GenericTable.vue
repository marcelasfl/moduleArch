<!-- A view usa o componente GenericTable para renderizar a lista de planos mensais em uma tabela. -->
<template>
  <!-- Eu acho que essa parte de cima não deveria estar aqui dentro de GenericTable, e sim sendo puxados como componentes -->
  <v-row>
    <Search :title="title" @searchItems="searchItems" data-test="searchComponent"/>
    <v-col cols="4" class="d-flex justify-end">
    <CreateButton buttonText="Cadastrar" @click="navigateToAdd" data-test="createButton"/>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-data-table class="border rounded-md" :headers="headers" :items="filteredItems" data-test="dataTable">
        <template v-slot:item.actions="{ item }">
          <slot name="actions" :item="item">
            <!-- <v-icon class="mdi mdi-eye me-2" color="primary" size="small" @click="goToDetail(item.id)"
              name="detailsList" /> -->
            <v-icon color="primary" size="small" class="me-2" @click="editItem(item.Id)" data-test="editIcon">mdi-pencil</v-icon>
            <v-icon color="error" size="small" @click="confirmDeleteItem(item.Id, item)" data-test="deleteIcon">mdi-delete</v-icon>
          </slot>
        </template>
        <template v-slot:no-data>
          <v-label>Sem dados!</v-label>
        </template>
      </v-data-table>
    </v-col>
  </v-row>

  <!-- Diálogo para criar novo item -->
  <v-dialog v-model="dialogCreate" max-width="600px" data-test="createDialog">
    <v-card>
      <v-card-title class="text-h5">Cadastrar {{ title }}</v-card-title>
      <v-card-text>
        <CreateForm :title="title" :fields="createFields" :store="store" :item="itemToEdit"
          :isEditMode="isEditMode" :successRoute="''" @close="closeCreateDialog"  />
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- Diálogo para confirmação de exclusão -->
  <v-dialog v-model="dialogDelete" max-width="500px" data-test="deleteDialog">
    <v-card>
      <v-card-title class="text-h5 text-center py-6">Tem certeza que deseja deletar esse item?</v-card-title>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" variant="outlined" dark @click="closeDelete" data-test="cancelButton">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" dark @click="deleteItem" data-test="okButton">OK</v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script async setup lang="ts">
import type { IField } from '@/pagamento/model/generic/IField';
import Swal from 'sweetalert2';
import { computed, onMounted, ref, watch, type PropType } from 'vue';
import { useRouter } from 'vue-router';
import PlanoMensal from '../../model/PlanoMensal';
import CreateButton from './CreateButton.vue';
import CreateForm from './CreateForm.vue';
import Search from './Search.vue';

// Props para tornar o componente genérico
const props = defineProps({
  title: { type: String, required: true },
  headers: { type: Array, required: true },
  store: { type: Object, required: true },
  items: { type: Array, default: true },
  searchKey: { type: String, required: true },
  createFields: { type: Array as PropType<IField[]>, required: true },
  editRoute: { type: String, required: true },
  detailRoute: { type: String, required: true }
});

const itemToDelete = ref<{Id: string} | null>(null);
const dialogDelete = ref(false);
const dialogCreate = ref(false);
const router = useRouter();
const isEditMode = ref(false);
const itemToEdit = ref(undefined);

onMounted(async () => {
  await props.store.fetch('');
});

const search = ref('');
// Computed para buscar e filtrar itens
const filteredItems = computed(() => {
  if (!search.value) return props.store.items;
  const searchQuery = search.value.toLowerCase();
  return props.store.items.filter((item: { [x: string]: string; }) =>
    item[props.searchKey].toLowerCase().includes(searchQuery)
  );
});

// Função para buscar itens com base no valor de pesquisa
const searchItems = (searchQuery: string) => {
  search.value = searchQuery;
};

// Função para recarregar os dados
const reloadPage = async () => {
  await props.store.save(new PlanoMensal("", "", "", "", "", true)); // Recarrega os dados chamando fetch
};

const navigateToAdd = () => {
  dialogCreate.value = true;
  isEditMode.value = false;
  itemToEdit.value = undefined;
};

const closeCreateDialog = () => {
  dialogCreate.value = false;
};

const editItem = (id: any) => {
  const item = props.store.items.find((item: any) => item.Id === id);
  
  if (item) {
    itemToEdit.value = item;
    isEditMode.value = true;
    dialogCreate.value = true;
  }
};


const goToDetail = (id: any) => {
  router.push({ path: props.detailRoute.replace(':id', id) });
};

const deleteItem = async () => {
  if (itemToDelete.value) {
    
    try {
      
      await props.store.deleteItem(itemToDelete.value?.Id);
      
      // Usa itemToDelete.value.Id
      Swal.fire({
        title: "Deletado com sucesso!",
        icon: "success",
        confirmButtonColor: "#D3D3D3",
      });
      // await reloadPage();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro ao deletar!",
        text: "Não foi possível apagar.",
      });
    } finally {
      closeDelete();
    }
  }
};

const confirmDeleteItem = (Id: string, item: any) => {
  itemToDelete.value = item;
  dialogDelete.value = true;
};

const closeDelete = () => {
  dialogDelete.value = false;
  itemToDelete.value = null;
};

watch(dialogDelete, (val) => {
  if (!val) closeDelete();
});
</script>

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
