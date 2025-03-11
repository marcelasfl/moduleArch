<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
  
  <!-- Barra de busca e botões -->
  <v-row>
    <v-col cols="6">
      <v-text-field v-model="search" label="Buscar PlanoMensal" clearable data-test="inputSearchPlanoMensal"></v-text-field>
    </v-col>
    <v-col cols="4" class="d-flex align-start">
      <v-btn class="custom-width" color="primary" variant="flat" dark @click="searchPlanoMensal" name="SearchButton" data-test="buttonSearchPlanoMensal">Buscar</v-btn>
    </v-col>
    <v-col cols="2" class="d-flex justify-end">
      <v-btn class="custom-width-2" color="primary" variant="flat" dark @click="openCreateDialog" name="CreateButton" data-test="buttonCreatePlanoMensal">Cadastrar PlanoMensal</v-btn>
    </v-col>
  </v-row>

  <!-- Tabela de dados -->
  <v-row>
    <v-col cols="12">
      <v-data-table class="border rounded-md" :headers="headers" :items="filteredPlanoMensal">
        <template v-slot:item.actions="{ item }">
          <v-icon class="mdi mdi-eye me-2" color="primary" size="small" @click="goToDetail(item.Id)" name="detailsList" data-test="iconDetailsPlanoMensal"></v-icon>
          <v-icon color="primary" size="small" class="me-2" @click="editItem(item.Id)" data-test="iconEditPlanoMensal">mdi-pencil</v-icon>
          <v-icon color="error" size="small" @click="confirmDeleteItem(item)" data-test="iconDeletePlanoMensal">mdi-delete</v-icon>
        </template>
        <template v-slot:no-data>
          <v-label>Sem dados!</v-label>
        </template>
      </v-data-table>
    </v-col>
  </v-row>

  <!-- Diálogo para criar novo item -->
  <v-dialog v-model="dialogCreate" max-width="600px">
    <v-card>
      <v-card-title class="text-h5">Cadastrar {{ page.title }}</v-card-title>
      <v-card-text>
        <CreateForm
          :title="page.title"
          :breadcrumbs="breadcrumbs"
          :fields="createFields"
          :store="planoMensalStore"
          :successRoute="''" 
          @close="closeCreateDialog"
        />
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- Diálogo para confirmação de exclusão -->
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>
      <v-card-title class="text-h5 text-center py-6">Tem certeza que deseja deletar esse item?</v-card-title>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" variant="outlined" dark @click="closeDelete" data-test="buttonCancelDelete">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" dark @click="deleteItem" data-test="buttonConfirmDelete">OK</v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script async setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
// import CreateForm from '@/components/CreateForm.vue'; // Importe o componente CreateForm
import Swal from 'sweetalert2';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import PlanoMensalController from '../controller/PlanoMensalController';

// Defina os breadcrumbs e título da página
const page = ref({ title: 'PlanoMensal' });
const breadcrumbs = ref([
  { text: 'PlanoMensal', disabled: true, href: '#' },
  { text: '', disabled: true, href: '#' }
]);

// Controle do diálogo de criação e exclusão
const dialogCreate = ref(false);
const dialogDelete = ref(false);

// Dados e cabeçalhos da tabela
const headers = ref([
  { title: 'Mes', sortable: false, key: 'Mes' },
  { title: 'MarcoSolicitacaoBolsa', sortable: false, key: 'MarcoSolicitacaoBolsa' },
  { title: 'MarcoGeracaoFolha', sortable: false, key: 'MarcoGeracaoFolha' },
  { title: 'MarcoPagamento', sortable: false, key: 'MarcoPagamento' },
  { title: 'EhAtual', sortable: false, key: 'EhAtual' },
  { title: 'Ações', key: 'actions' }
]);

const PlanoMensal = ref([]);
const filteredPlanoMensal = ref([]);
const itemToDelete = ref(null);
const search = ref('');
const router = useRouter();

// Campos para o formulário de criação
const createFields = ref([
  { key: 'Mes', label: 'Mês', required: true },
  { key: 'MarcoSolicitacaoBolsa', label: 'Marco Solicitação Bolsa', required: true },
  { key: 'MarcoGeracaoFolha', label: 'Marco Geração Folha', required: true },
  { key: 'MarcoPagamento', label: 'Marco Pagamento', required: true },
  { key: 'EhAtual', label: 'É Atual?', required: false, type: 'checkbox' }
]);

// Controlador para PlanoMensal
const planoMensalStore = new PlanoMensalController();

onMounted(() => {
  getPosts();
});

const getPosts = async () => {
  try {
    PlanoMensal.value = await planoMensalStore.getAll();
    filteredPlanoMensal.value = PlanoMensal.value;
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
  }
};

// Funções de controle de diálogo e busca
const openCreateDialog = () => (dialogCreate.value = true);
const closeCreateDialog = () => (dialogCreate.value = false);

const deleteItem = async () => {
  if (itemToDelete.value) {
    try {
      planoMensalStore.deleteItem(itemToDelete.value.Id);
      Swal.fire({
        title: "Deletado com sucesso!",
        icon: "success",
        confirmButtonColor: "#D3D3D3"
      });
      await getPosts();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro ao salvar!",
        text: "Não foi possível apagar."
      });
    } finally {
      closeDelete();
    }
  }
};

const confirmDeleteItem = (item: any) => {
  
  itemToDelete.value = item;
  dialogDelete.value = true;
};

const goToDetail = (id) => router.push(`/PlanoMensal/detailsPlanoMensal/${id}`);
const editItem = (id) => router.push(`/PlanoMensal/formPlanoMensal/${id}`);

const searchPlanoMensal = () => {
  if (!search.value) {
    filteredPlanoMensal.value = PlanoMensal.value;
  } else {
    const searchQuery = search.value.toLowerCase();
    filteredPlanoMensal.value = PlanoMensal.value.filter((item) =>
      item.Mes.toLowerCase().includes(searchQuery)
    );
  }
};

function closeDelete() {
  
}
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
