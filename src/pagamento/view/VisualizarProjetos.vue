<template>
    <div class="navigate-back mb-6">
        <v-icon @click="$router.go(-1)">mdi-chevron-left</v-icon>
        <a @click="$router.go(-1)">Voltar</a>
    </div>
    <v-skeleton-loader type="text" class="mx-0 my-0 skeleton-loader" v-if="isLoading" :loading="isLoading"/>
    <h2 v-if="!isLoading">Visualizar edital: {{ nomeEdital }}</h2>
    <br>

    <v-row>
        <v-col cols="4">
            <v-text-field v-model="search" label="Pesquisar o nome do Projeto" clearable data-test="inputSearchProjeto"></v-text-field>
        </v-col>
        <v-col cols="3">
            <v-select :items="statusProjeto" label="Filtrar por Status" clearable data-test="selectStatusProjeto"></v-select>
        </v-col>
        <v-col cols="4" class="d-flex align-start">
            <v-btn class="custom-width" color="primary" variant="flat" dark name="SearchButton" data-test="buttonSearch">Buscar</v-btn>
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
            <v-data-table v-if="!isLoading" class="border rounded-md" :headers="headers" :items="projetoInfo">
                <template v-slot:item.Nome="{ item }">
                    <a href="#" @click.prevent="goToBolsistas(item.Id)">{{ item.Nome }}</a>
                </template>
                <template v-slot:item.StatusProjeto="{ item }">
                    {{ correctNameStatusProjeto(item.StatusProjeto) }} 
                </template>

                <template v-slot:item.actions="{ item }"> 
                    <v-icon class="mdi mdi-eye me-2" color="primary" size="small" @click="goToBolsistas(item.Id)"/>
                    <v-icon class="mdi mdi-file-download-outline me-2" color="primary" size="small" @click="downloadRemessaCadstro(item)"/>
                    <v-icon class="mdi mdi-upload me-2" color="primary" size="small" @click="openDialogUpload"/>
                </template>
                <template v-slot:no-data>
                    <v-label>Sem dados!</v-label>
                </template>
            </v-data-table>
        </v-col>
    </v-row>

    <v-dialog v-model="showDialogUpload" max-width="500px">
    <v-card>
      <v-card-title class="mt-2 ml-2">
        <span class="text-h5"><strong>Enviar arquivo de retorno</strong> </span>
      </v-card-title>
      <v-card-text>
        <p class="mb-4"> Você pode optar por enviar apenas um arquivo. </p>
        <p class="mb-2">Escolha um arquivo DP1 para enviar:</p>
        <v-file-input
          v-model="arquivoUploadDp1"
          label="Escolha um arquivo" 
          prepend-icon="mdi-paperclip"
          outlined
          dense
          accept=".txt"
        ></v-file-input>
        <p class="mb-2 mt-4">Escolha um arquivo DP9 para enviar:</p>
        <v-file-input
          v-model="arquivoUploadDp9"
          label="Escolha um arquivo" 
          prepend-icon="mdi-paperclip"
          outlined
          dense
          accept=".txt"
        ></v-file-input>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn style="color:black" text @click="closeDialogUpload">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" dark @click="submitUploadArquivo">Enviar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="showDialogDownload" max-width="400px">
    <v-card class="pa-4">
      <v-card-title class="d-flex justify-center">
        <span class="text-h5 font-weight-bold">Baixando Arquivo</span>
      </v-card-title>
      
      <v-card-text class="d-flex justify-center mt-4">
        <v-progress-circular indeterminate color="primary" size="50"></v-progress-circular>
      </v-card-text>
    </v-card>
  </v-dialog>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useEditalStore } from '../controller/store/EditalStore';
import type { IEdital } from '../model/Edital';
import type { IProjeto } from '../model/Projeto';

const route = useRoute();
const params = route.params;
const isLoading = ref(false);

const statusProjeto = ref(['Em andamento', 'Cancelado', 'Finalizado'])
const page = ref({ title: 'Visualizar edital: Carregando...' });

const headers = ref([
    { title: 'Projeto', sortable: false, key: 'Nome' },
    { title: 'Status do Projeto', sortable: false, key: 'StatusProjeto', help: "Status de atividade do projeto." },
    { title: 'Ações', key: 'actions' }
]);

const nomeEdital = ref();

const search = ref('');

onMounted(async () => {
    isLoading.value = true;
    await getEditais()
    isLoading.value = false;
});

const verificaSeEhLista = () => {
    if (Array.isArray(params.id)) {
        return params.id[0];
    }
    return params.id;
};

const projetoInfo = ref<IProjeto[]>([]);

async function getEditais() {
    await useEditalStore.fetchById(verificaSeEhLista());

    const edital: IEdital = useEditalStore.items; 

    if (edital) {
        projetoInfo.value = edital.Projetos || [];
        nomeEdital.value = edital.Nome; 
    } else {
        projetoInfo.value = [];
        nomeEdital.value = 'Edital não encontrado';
    }
}

function correctNameStatusProjeto(Status: string) {
  if (Status == 'EMANDAMENTO' || Status == 'EM_ANDAMENTO') return 'Em Andamento';
  if (Status == 'FINALIZADO') return 'Finalizado';
  if (Status == 'CANCELADO') return 'Cancelado';
  return Status
}

function goToBolsistas(id: string){
  router.push({ path: `/pagamento/VisualizarBolsistas/${id}`})
}

import RemessaCadastroController from '../controller/RemessaCadastroController';
import router from '@/router';
const controllerRemessaCadastro = new RemessaCadastroController();
async function downloadRemessaCadstro(item: IProjeto) {
  openLoading();
  await controllerRemessaCadastro.generateRemessaCadastro(item.Id);
  closeLoading();
}

const showDialogDownload = ref(false);
function openLoading() {
  showDialogDownload.value = true;
}

function closeLoading() {
  showDialogDownload.value = false;
}

const showDialogUpload = ref(false)
function openDialogUpload(item: IDecisaoFolha) {
  showDialogUpload.value = true;
}
function closeDialogUpload() {
  showDialogUpload.value = false;
}

const arquivoUploadDp1 = ref(null);
const arquivoUploadDp9 = ref(null);
import RetornoRemessaController from '../controller/RetornoRemessaController';
import type { IDecisaoFolha } from '../model/DecisaoFolhas';
const retornoRemessaController = new RetornoRemessaController();

async function submitUploadArquivo() {
  if (!arquivoUploadDp1.value && !arquivoUploadDp9.value) {
    console.warn("Nenhum arquivo selecionado!");
    return;
  }

  if (arquivoUploadDp9.value) {
    const response = await submitDp9();
  }

  if (arquivoUploadDp1.value) {
    const response = await submitDp1();
  }  
  closeDialogUpload();
  arquivoUploadDp1.value = null;
  arquivoUploadDp9.value = null;
}


async function submitDp9() {
  if (!arquivoUploadDp9.value) return
  const formData = new FormData();
  formData.append("Arquivo", arquivoUploadDp9.value[0]);
  return await retornoRemessaController.uploadDp9(formData);
}

async function submitDp1() {
  if (!arquivoUploadDp1.value) return
  const formData = new FormData();
  formData.append("Arquivo", arquivoUploadDp1.value[0]);
  return await retornoRemessaController.uploadDp1(formData);
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