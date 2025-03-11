<template>
  <div class="navigate-back mb-4">
    <v-icon @click="$router.go(-1)">mdi-chevron-left</v-icon>
    <a @click="$router.go(-1)">Voltar</a>
  </div>
  <h2 class="mb-2"> Visualizar liberação da área: {{ areaTecnicaAtual }}</h2>
  <p>Visualizando os editais gerenciados pela {{ areaTecnicaAtual }} e seus respectivos status de pagamento.</p> <br>

  <v-row>
    <v-col cols="4">
        <v-text-field
            label="Pesquisar o nome do edital"
            v-model="searchEdital"
            clearable
            @click:clear="searchFilter"
            data-test="inputSearchEdital"
        ></v-text-field>
    </v-col>

    <v-col cols="4">
        <v-select
            :items="statusItemsSelect"
            item-title="Status"
            item-value="Value"
            label="Filtrar por status"
            hide-details
            v-model="searchStatus"
            clearable
            @click:clear="searchFilter"
            data-test="selectSearchStatus"
        ></v-select>
    </v-col>

    <v-col cols="1" class="mt-1">
        <v-btn class="custom-width" color="primary" variant="flat" dark @click="searchFilter">Buscar</v-btn>
    </v-col>
  </v-row>

  <div v-if="Object.keys(mesesLiberarEdital).length > 0 
  && useLiberarEditaisPagamentoStore.items.find(x => x.editaisCompetencias.find(y => y.filter == true)) !== undefined" 
  v-for="(itensLiberarEdital, mesLiberarEdital) in mesesLiberarEdital" :key="mesLiberarEdital">
    <v-container class="mt-6 px-0">
      <v-row wrap no-gutters>
        <v-col cols="1" class="text-center text-h6 mt-1 mr-4">
          <v-label>{{mesLiberarEdital}}</v-label>
        </v-col>
        <v-col cols="15" class="text-center">
          <v-divider class="mt-3" color="warning" :thickness="3" />
        </v-col>
      </v-row>
    </v-container>
    

    <v-row>
      <v-col cols="12">

        <v-skeleton-loader v-if="isLoading" type="table" :loading="isLoading" class="mx-auto my-8 skeleton-loader">
            <v-row>
                <v-col cols="12">
                    <v-skeleton-loader type="table" class="skeleton-loader" />
                </v-col>
            </v-row>
        </v-skeleton-loader>
        <v-data-table v-if="!isLoading" class="border rounded-md" :headers="headers" :items="itensLiberarEdital">
          <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
            <tr>
              <template v-for="column in columns" :key="column.key">
                <th :class="{'text-end': column.key === 'actions'}">
                  <span class="mr-2 cursor-pointer" @click="() => toggleSort(column)">{{ column.title }}</span>
                  <template v-if="isSorted(column)">
                    <v-icon :icon="getSortIcon(column)"></v-icon>
                  </template>

                  <v-tooltip v-if="column.help" :text="column.help">
                    <template v-slot:activator="{ props }">
                      <v-btn variant="text" size="small" icon="mdi-alert-circle-outline" v-bind="props"></v-btn>
                    </template>
                  </v-tooltip>
                </th>
              </template>
            </tr>
          </template>

          <template v-slot:top>
            <v-row>
              <v-col class="d-flex justify-end"></v-col>
            </v-row>
            <v-spacer />
          </template>

          <template v-slot:item="{ item, index }">
            <tr v-if="item.filter" :class="{ 'approved-item': (item.approved || item.status == 'LIBERADO') && !item.notReleased, 'not-released-item': (item.notReleased || item.status == 'NAO_LIBERADO') && !item.approved, 'included-item': item.status == 'INCLUIDO_EM_FOLHA'}">
              <td>{{ item.edital.nome }}</td>
              <td>{{ correctNameStatusEditalCompetencia(item.status) }}</td>
              <td>{{ item.bolsasVigentes }}</td>
              <td>{{ item.bolsasPendentes }}</td>
              <td><b>{{ item.valorPrevisto.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) }}</b></td>
              <td class="d-flex justify-end align-center">
                <v-icon size="small" class="me-1">
                  mdi-eye
                </v-icon>
                <v-icon size="small" class="me-1"
                  v-if="item.status == 'NAO_LIBERADO'"
                  @click="openDialogNaoLiberado(item)">
                  mdi-clipboard-text 
                </v-icon>
              </td>
            </tr>
          </template>

          <template v-slot:no-data>
            <v-label>Sem dados!</v-label>
          </template>
          <template #bottom></template> 
        </v-data-table>
      </v-col>
    </v-row>
  </div>


  <v-col cols="12" class="d-flex justify-center" v-if="Object.keys(mesesLiberarEdital).length == 0 || useLiberarEditaisPagamentoStore.items.find(x => x.editaisCompetencias.find(y => y.filter == true) !== undefined) === undefined">
    Sem registros encontrados!
  </v-col>


  <v-dialog v-model="showDialogNaoLiberado" max-width="500px">
    <v-card>
      <v-card-title>
        <span><strong>Edital não liberado para pagamento</strong> </span>
      </v-card-title>
      <v-card-text><p class="mb-2">O edital {{ nomeEditalNaoLiberada }} não foi liberado para pagamento pela Área Técnica responsável.</p><br>
        
        <p><b>Justificativa da não liberação</b></p>
        <v-text-field
          v-model="justificativaEdital"
          disabled="true"
          data-test="inputJustificativaEdital"
        ></v-text-field>
        
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="black" text @click="closeDialogNaoLiberado">Fechar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

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
  
<script setup lang="ts">
import dayjs from 'dayjs';import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { onMounted, reactive, ref, watch } from 'vue';
import { useLiberarEditaisPagamentoStore } from '../controller/store/LiberarEditaisStore';
import log from '@/logger';
import type { IPlanoMensal } from '../model/PlanoMensal';

export type EditalPagamento = {
  notReleased?: boolean
  approved?: boolean
  reason?: string
}


const page = ref({ title: `Liberar editais: TODAS/` });

const headers = ref([
  { title: 'Edital', sortable: false, key: 'Edital.Nome' },
  { title: 'Status', sortable: false, key: 'Status', help: "Status de liberação do edital para a competência em questão" },
  { title: 'Bolsas vigentes', sortable: false, key: 'BolsasVigentes', help: "Quantidade total de bolsas com pagamento previsto no mês em questão" },
  { title: 'Pendentes', sortable: false, key: 'BolsasPendentes', help: "Quantidade de alocações de bolsistas pendentes de avaliação" },
  { title: 'Valor total', sortable: false, key: 'ValorPrevisto', help:"Somatório dos valores das bolsas vigentes do edital" },
  { title: 'Ações', key: 'actions' }
]);

const statusItemsSelect = ref([
    { Status: "Sem decisão", Value: 'SEM_DECISAO' },
    { Status: "Liberado", Value: 'LIBERADO' },
    { Status: "Não liberado", Value: 'NAO_LIBERADO' },
    { Status: "Incluído em folha", Value: 'INCLUIDO_EM_FOLHA' }
]);

const showDialogNaoLiberado = ref(false);
const isLoading = ref(false);

const nomeEditalNaoLiberada = ref();
const justificativaEdital = ref(); 
async function openDialogNaoLiberado(item: IEditalCompetencia) {
  nomeEditalNaoLiberada.value = item.edital.nome;
  justificativaEdital.value = item.decisaoLiberacoes.findLast((DecisaoLiberacao: { ehLiberado: boolean, justificativa: string })=> DecisaoLiberacao.ehLiberado == false )?.justificativa;
  showDialogNaoLiberado.value = true;
}

const reason = ref('');
const mesAtual = ref('')
let currentItem = ref(<EditalPagamento>({})); 

onMounted(async () => {
  isLoading.value = true;
  await historyFolha();
  await getPosts();
  //await defineAreaTecnica();
  page.value.title = `Liberar editais: ${areaTecnicaAtual.value}/${mesAtualPrimeiroCaracter.value}`
  isLoading.value = false;
});

import LiberarEditaisPagamentoController from '../controller/LiberarEditaisController';
const controladorLiberarEditais = new LiberarEditaisPagamentoController();
const getPosts = async () => {
  try {
    useLiberarEditaisPagamentoStore.items = await controladorLiberarEditais.fetchLiberarEditaisByArea(verificaArrayParams());
    resetarFiltro();
    carregarItems();
    page.value.title = `Liberar editais: ${areaTecnicaAtual.value}/${mesAtual.value}`
  } catch (error) {
    log.error('Error fetching:', error);
  }
};

const mesesLiberarEdital = reactive<{[key: string]: Array<EditalPagamento & IEditalCompetencia>;}>({});
const meses = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];
function carregarItems() {
  Object.keys(mesesLiberarEdital).forEach(key => {
    delete mesesLiberarEdital[key];
  });
  useLiberarEditaisPagamentoStore.items.forEach(item => {
    mesesLiberarEdital[item.mes.toUpperCase()] = item.editaisCompetencias;
  });
}
const folhaPagamentoAlreadyGenerated = ref(false);
const messageAlertDateGeneratePaymentDoc = ref('');
const mesAtualPrimeiroCaracter = ref('');
const planoMensalAtual = ref<IPlanoMensal>();
import PlanoMensalController from '../controller/PlanoMensalController';
async function definePlanoMensalAtual() {
  const controladorPlanoMensal = new PlanoMensalController();
  const plano = await controladorPlanoMensal.fetchAtual();

  let remainingDaysGeneratePayment: number;
  let dateMarcoGeracao: string;
  planoMensalAtual.value = plano;

  mesAtual.value = meses[new Date(plano.Mes).getUTCMonth()];
  mesAtualPrimeiroCaracter.value = mesesPrimeiroCaracterMaiusculo[new Date(plano.Mes).getUTCMonth()];
  dateMarcoGeracao = dayjs(plano.MarcoGeracaoFolha).utc().format('DD/MM/YYYY');
  
  const currentDate = dayjs().utc();
  const marcoGeracaoDate = dayjs(plano.MarcoGeracaoFolha).utc();
  
  remainingDaysGeneratePayment = marcoGeracaoDate.startOf('day').diff(currentDate.startOf('day'), 'days');

  if (remainingDaysGeneratePayment > 0) {
    messageAlertDateGeneratePaymentDoc.value = `${remainingDaysGeneratePayment > 1 ? 'Faltam' : 'Falta'} ${remainingDaysGeneratePayment} ${remainingDaysGeneratePayment > 1 ? 'dias' : 'dia'} para a geração da folha normal, prevista para dia ${dateMarcoGeracao}.`;
  } else if (historicoFolhas.value.length == 0) {
    messageAlertDateGeneratePaymentDoc.value = `A geração da folha normal estava prevista para ${dateMarcoGeracao}, mas ainda não foi efetivada.`;
  } else {
    folhaPagamentoAlreadyGenerated.value = true;
    messageAlertDateGeneratePaymentDoc.value = `A Folha Normal foi gerada em ${dayjs(historicoFolhas.value[historicoFolhas.value.length-1].DateCreated).utc().format('DD/MM/YYYY')}. Quaisquer liberações a partir de agora serão para a folha seguinte.`;
  }
}

import FolhaController from '../controller/FolhaController';
import type { IFolha } from '../model/Folha';
const controladorFolha = new FolhaController();
const historicoFolhas = ref<IFolha[]>([]);
async function historyFolha() {
  historicoFolhas.value = await controladorFolha.historyFolha();
}

const relatorioEnvio = ref<String[]>([])
const route = useRoute();
let params = route.params;
const mesesPrimeiroCaracterMaiusculo = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const verificaArrayParams = () => {
if (typeof params.area === 'string') {
  return params.area;
} else if (Array.isArray(params.area)) {
  return params.area[0];
}
return '';
};
  import { useRoute } from 'vue-router';
  import AreaTecnicaController from '../controller/AreaTecnicaController';
  const controlladorAreaTecnica = new AreaTecnicaController();
const areaTecnicaAtual = ref('');
async function defineAreaTecnica() {
  const idArea = verificaArrayParams();
  const response = await controlladorAreaTecnica.getById(idArea);
  if (response) areaTecnicaAtual.value = response.Nome;
}
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarTimeout = ref(3000);
const snackbarColor = ref('success');


const closeDialogNaoLiberado = () => {
  showDialogNaoLiberado.value = false;
};

function correctNameStatusEditalCompetencia(status: string) {
  if (status == 'SEM_DECISAO') return 'SEM DECISÃO';
  if (status == 'NAO_LIBERADO') return 'NÃO LIBERADO';
  if (status == 'INCLUIDO_EM_FOLHA') return 'INCLUÍDO EM FOLHA';
  return status
}

const searchEdital = ref('');
const searchStatus = ref();
import LiberarEditaisRoutes from '../model/repositories/apiRoutes/LiberarEditaisPagamento';
import DecisaoLiberacao from '../model/DecisaoLiberacao';
import type { IEditalCompetencia } from '../model/EditalCompetencia';
// Funcao de filtro ------------------------------------------------------------
function searchFilter() {
  if (searchEdital.value && !searchStatus.value) {
    filtrarPorNome(searchEdital.value);
  } else if (!searchEdital.value && searchStatus.value) {
    filtrarPorStatus(searchStatus.value);
  } else if (searchEdital.value && searchStatus.value) {
    filtrarPorNomeEStatus(searchEdital.value, searchStatus.value);
  } else {
    resetarFiltro();
  };
  carregarItems();
}

function filtrarPorNome(nome: string) {
  useLiberarEditaisPagamentoStore.items.forEach(x => {
    x.editaisCompetencias.forEach(y => {
      if (y.edital.nome.toLowerCase().includes(nome.toLowerCase())) {
        y.filter = true;
      } else {
        y.filter = false;
      }
    })
  });
}

function filtrarPorStatus(status: string) {
  useLiberarEditaisPagamentoStore.items.forEach(x => {
    x.editaisCompetencias.forEach(y => {
      if (y.status == status) {
        y.filter = true;
      } else {
        y.filter = false;
      }
    })
  });
}

function filtrarPorNomeEStatus(nome: string, status: string) {
  useLiberarEditaisPagamentoStore.items.forEach(x => {
    x.editaisCompetencias.forEach(y => {
      if (y.status == status && y.edital.nome.toLowerCase().includes(nome.toLowerCase())) {
        y.filter = true;
      } else {
        y.filter = false;
      }
    })
  });
}

function resetarFiltro() {
  useLiberarEditaisPagamentoStore.items.forEach(x => x.editaisCompetencias.forEach(y => y.filter = true))
}

function limparFiltros() {
  searchStatus.value = null;
  searchEdital.value = '';
}
</script>
  
<style scoped>
.approved-item {
  background-color: #e6ffe6;
}

.not-released-item {
  background-color: #f8d3d3;
}

.included-item {
  background-color: #cdd0e5;
}

.no-transition {
  transition: none !important;
}

.action-icons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px; 
}

.btn-dot {
  font-size: 18px;
  cursor: pointer;
}

.navigate-back:hover {
  cursor: pointer;
}
  
.navigate-back {
  display: flex;
  align-items: center;
}
</style>
  