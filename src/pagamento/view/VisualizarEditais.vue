<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
  <v-row>
      <v-col cols="2" class="d-flex justify-start">
      <v-btn class="custom-width-2" color="primary" variant="flat" dark @click="addEdital" data-test="buttonIncluirEdital">
          Incluir Edital
      </v-btn>
      </v-col>
  </v-row>
  <v-row>
      <v-col cols="4">
          <v-text-field
          label="Pesquisar o nome do edital"
          clearable
          data-test="inputPesquisarEdital"
          ></v-text-field>
      </v-col>
      <v-col cols="1">
          <v-btn class="custom-width" color="primary" variant="flat" dark data-test="buttonBuscarEdital">Buscar</v-btn>
      </v-col>
  </v-row>
  <v-row>
      <v-col cols="12">
            <v-skeleton-loader v-if="isLoading" type="table" :loading="isLoading" class="mx-auto my-8 skeleton-loader">
            <v-row>
                <v-col cols="12">
                    <v-skeleton-loader type="table" class="skeleton-loader" />
                </v-col>
            </v-row>
          </v-skeleton-loader>
          <v-data-table v-if="!isLoading" class="border rounded-md" :headers="headers" :items="editalInfo">

              <template v-slot:item.Nome="{ item }">
                <a href="#" @click.prevent="goToProjeto(item.Id)">{{ item.Nome }}</a>
              </template>

              <template v-slot:item.AreaTecnica="{ item }">
                {{ areaTecnicaTratada(item.AreaTecnica) }}
              </template>

              <template v-slot:item.DataCriacao="{ item }">
                {{ dayjs(item.DataCriacao).format('DD/MM/YYYY') }}
              </template>
                              
              <template v-slot:item.actions="{ item }">
                  <v-icon class="mdi mdi-pencil me-2" color="primary" size="small" @click="editEdital(item.Id)" data-test="iconEditarEdital"/>
                  <v-icon class="mdi mdi-delete" color="error" size="small" @click="openDeleteDialog(item.Id)" data-test="iconDeletarEdital"/>
              </template>

              <template v-slot:no-data>
                    <v-label>Sem dados!</v-label>
                </template>
          </v-data-table>
      </v-col>
  </v-row>
  <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5 text-center py-6">Tem certeza que deseja deletar esse item?</v-card-title>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" variant="outlined" dark @click="closeDelete" data-test="buttonCancelarDelecao">Cancelar</v-btn>
              <v-btn color="primary" variant="flat" @click="deleteEdital" dark data-test="buttonConfirmarDelecao">OK</v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import router from '@/router';

const isLoading = ref(false);

const dialogDelete = ref(false);

const page = ref({title:'Editais'});
const breadcrumbs = ref([
{ text: 'Editais', disabled: true, href: '#' },
{ text: '', disabled: true, href: '#' }
]);

const headers = ref([
  { title: 'Nome', key: 'Nome' },
  { title: 'Status', key: 'Status' },
  { title: 'Data de Criação', key: 'DataCriacao' },
  { title: 'Área Técnica', key: 'AreaTecnica' },
  { title: 'Ações', sortable: false, key: 'actions' }
])

function statusTratado(status: number){
  if(status == 0) return 'Ativo'
  else return 'Inativo';
}

function areaTecnicaTratada(area: any){
if(area == null || area == undefined) return ' - '
else return area.Nome
}

function addEdital() {
  router.push('/pagamento/FormEdital');
}

function goToProjeto(id: string){
  router.push({ path: `/pagamento/VisualizarProjeto/${id}`})
}

function editEdital(id: string) {
  router.push({ path: `/pagamento/FormEdital/${id}` });
}

const selectEditalId = ref();
function openDeleteDialog(id: string) {
  selectEditalId.value = id;
  dialogDelete.value = true;
}

function closeDelete() {
  dialogDelete.value = false;
  selectEditalId.value = null;
}

async function deleteEdital(){
  if (selectEditalId.value){
    await useEditalStore.deleteItem(selectEditalId.value);
    Swal.fire({
        title: "Deletado com sucesso!",
        icon: "success",
        confirmButtonColor: "#D3D3D3",
        timer: 2000, 
        showConfirmButton: false 
      }).then(() => {
        getEditais(); 
        router.push({ path: '/pagamento/VisualizarEditais' });
      });
  }
  closeDelete();
}

const editalInfo = ref();
import EditalRoutes from '../model/repositories/apiRoutes/Edital';
import { useEditalStore } from '../controller/store/EditalStore';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
const EditalRoutesObject = new EditalRoutes({expand:'AreaTecnica'});
async function getEditais() {
  await useEditalStore.filter(EditalRoutesObject.expand);
  editalInfo.value = useEditalStore.items;
}

onMounted(async () => {
  isLoading.value = true;
  await getEditais();
  isLoading.value = false;
});

</script>
<style scoped>
.custom-width {
height: 48px;
width: 100px
}
.custom-width-2 {
height: 48px;
width: 200px;
}
</style>