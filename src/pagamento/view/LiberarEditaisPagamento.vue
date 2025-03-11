<template>
  <BaseBreadcrumb :breadcrumbs="breadcrumbs" :title="page.title" class="bold-title" />
  <v-skeleton-loader type="text" class="mx-0 my-0 skeleton-loader" v-if="isLoading" :loading="isLoading"/>
  <p v-if="!isLoading">{{ messageAlertDateGeneratePaymentDoc }}</p> <br>
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
    
    <v-skeleton-loader v-if="isLoading" type="table" :loading="isLoading" class="mx-auto my-8 skeleton-loader">
      <v-col cols="4">
          <v-skeleton-loader type="button" class="skeleton-loader" />
      </v-col>
      <v-row>
        <v-col cols="12">
            <v-skeleton-loader type="table" class="skeleton-loader" />
        </v-col>
      </v-row>
    </v-skeleton-loader>
    <v-col cols="4" class="d-flex align-start" v-if="Object.keys(mesesLiberarEdital).length > 0 
    && useLiberarEditaisPagamentoStore.items.find(x => x.editaisCompetencias.find(y => y.filter == true)) !== undefined">
      <v-btn class="custom-width-2" color="primary" variant="flat" dark @click="markAllNotice" name="AllMark">
        Marcar todos como liberado
      </v-btn>
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
        <v-data-table class="border rounded-md" :headers="headers" :items="itensLiberarEdital">
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
            <tr v-if="item.filter" :class="{ 'approved-item': (item.approved || item.status == 'LIBERADO') && !item.notReleased, 'not-released-item': (item.notReleased 
            || item.status == 'NAO_LIBERADO') && !item.approved, 'included-item': item.status == 'INCLUIDO_EM_FOLHA'}">
              <td>{{ item.edital.nome }}</td>
              <td>{{ correctNameStatusEditalCompetencia(item.status) }}</td>
              <td>{{ item.bolsasVigentes }}</td>
              <td>{{ item.bolsasPendentes }}</td>
              <td><b>{{ item.valorPrevisto.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) }}</b></td>
              <td class="d-flex justify-end align-center">
                <v-icon :color="item.approved || item.notReleased ? 'green' : 'primary'" size="small" class="me-2"
                  @click="toggleApproval(item)" v-if="item.status == 'SEM_DECISAO' || item.status == 'NAO_LIBERADO'">
                  {{ item.approved || item.notReleased ? 'mdi mdi-rotate-left' : 'mdi mdi-check' }}
                </v-icon>
                <v-icon size="small" class="me-1"
                  v-if="item.status == 'INCLUIDO_EM_FOLHA'">
                  mdi-eye 
                </v-icon>
                <v-menu offset-y bottom left>
                  <template v-slot:activator="{ props }" v-if="item.status !== 'INCLUIDO_EM_FOLHA'">
                    <span icon v-bind="props" :class="{ 'approved-item': (item.approved || item.Status == 'LIBERADO') && !item.notReleased, 'not-released-item': (item.notReleased 
                    || item.Status == 'NAO_LIBERADO') && !item.approved, 'no-transition': true }">
                      <span class="mdi mdi-dots-vertical btn-dot"></span>
                    </span>
                  </template>
                  <v-list v-if="item.status == 'NAO_LIBERADO'">
                    <v-list-item @click="openDialog(item)">
                      <v-list-item-icon>
                        <v-icon>mdi-text</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Editar justificativa</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon>mdi-eye</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Ver detalhes</v-list-item-title>
                    </v-list-item>
                  </v-list>
                  <v-list v-else-if="(item.notReleased || item.status == 'NAO_LIBERADO') && !item.approved">
                    <v-list-item @click="toggleApproval(item, true)">
                      <v-list-item-icon>
                        <v-icon>mdi-check</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Marcar para liberar</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="openDialog(item)">
                      <v-list-item-icon>
                        <v-icon>mdi-text</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Editar justificativa</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon>mdi-eye</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Ver detalhes</v-list-item-title>
                    </v-list-item>
                  </v-list>
                  <v-list v-else>
                    <v-list-item @click="openDialog(item)">
                      <v-list-item-icon>
                        <v-icon>mdi-block-helper</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Marcar para não liberar</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon>mdi-eye</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Ver detalhes</v-list-item-title>
                    </v-list-item>
                  </v-list>              
                </v-menu>
              </td>
            </tr>
            <!-- Modal qnd "não liberado" -->
            <v-dialog v-model="showDialog" max-width="500px">
              <v-card>
                <v-card-title class="ml-2 mt-2">
                  <span class="text-h6"><strong>Deseja marcar o edital como não liberado?</strong> </span>
                </v-card-title>
                <v-card-text>
                  <p>Para não liberar um edital para pagamento, é necessário uma justificativa.</p>
                  <v-textarea class="mt-4" placeholder="Justificativa da não liberação *" v-model="reason" required data-test="textareaJustificativa"></v-textarea>
                </v-card-text>
                <v-card-actions class="d-flex justify-end">
                  <v-btn text @click="closeDialog">Cancelar</v-btn>
                  <v-btn variant="flat" color="error" dark @click="markAsNotReleased">Marcar para não liberar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog v-model="showDialogEdit" max-width="500px">
              <v-card>
                <v-card-title class="ml-2 mt-2">
                  <span class="text-h6"><strong>Edital não liberado para pagamento</strong> </span>
                </v-card-title>
                <v-card-text>
                  <p class="mb-6">O edital não foi liberado com a justificativa abaixo.</p>
                  <p>Justificativa da não liberação *</p>
                  <v-textarea class="mt-4" placeholder="Justificativa da não liberação *" v-model="reason" required data-test="textareaJustificativaEdit"></v-textarea>
                </v-card-text>
                <v-card-actions class="d-flex justify-end">
                  <v-btn text @click="closeDialogEdit">Cancelar</v-btn>
                  <v-btn variant="flat" color="primary" dark @click="markAsNotReleased">Salvar justificativa</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>

          <template v-slot:no-data>
            <v-label>Sem dados!</v-label>
          </template>
          <template #bottom></template> <!-- Remove o footer/linha de paginacao -->
        </v-data-table>
      </v-col>
    </v-row>
  </div>
  
  <v-col cols="12" class="d-flex justify-end" v-if="Object.keys(mesesLiberarEdital).length > 0 
  && !allInFolha() && useLiberarEditaisPagamentoStore.items.find(x => x.editaisCompetencias.find(y => y.filter == true)) !== undefined">
    <v-btn type="submit" color="primary" flat @click="submitDecision">Submeter Decisões</v-btn>
  </v-col>

  <v-col cols="12" class="d-flex justify-center" v-if="(Object.keys(mesesLiberarEdital).length == 0 || useLiberarEditaisPagamentoStore.items.find(x => x.editaisCompetencias.find(y => y.filter == true) !== undefined) === undefined) && !isLoading">
    Sem registros encontrados!
  </v-col>

  <v-dialog v-model="showDialogSubmit" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="text-h6"><strong>Encaminhando decisões de pagamento {{ folhaPagamentoAlreadyGenerated ? ' com atraso' : '' }}</strong> </span>
      </v-card-title>
      <v-card-text>
        <div v-if="folhaPagamentoAlreadyGenerated" class="mb-4">
          <p class="mb-4">
            <b>
              A geração se realizou {{ dayjs().utc().diff(dayjs(historicoFolhas[historicoFolhas.length-1].DateCreated).utc()) == 0 ? "hoje" : 
              ` ${dayjs().utc().diff(dayjs(historicoFolhas[historicoFolhas.length-1].DateCreated).utc())} dias atrás` }} 
              ({{ dayjs(historicoFolhas[historicoFolhas.length-1].DateCreated).utc().format('DD/MM/YYYY') }}).
            </b>
          </p>
          <p>
            Devido ao atraso, ao confirmar, os editais selecionados serão encaminhados <b>apenas para a folha seguinte</b>. Ao submeter as decisões de
            pagamento, o status dos editais será atualizado conforme abaixo:
          </p>
        </div>
        <div v-else>
          <p>Ao submeter as decisões de pagamento, o status dos editais será atualizado conforme abaixo:</p><br>
        </div>
        <p class="ml-4">
          <ul>
            <li v-for="item in relatorioEnvio">
              {{ item }}
            </li>
          </ul>
        </p>
        <br>
        <p>Uma vez marcados como liberado ou não liberado, <strong>o edital não poderá voltar ao status de sem decisão.</strong> Confirmar submissão?</p>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="primary" text @click="closeDialogSubmit">Cancelar</v-btn>
        <v-btn variant="flat" color="primary" dark @click="confirmSubmit">Confirmar decisões</v-btn>
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
// IMPORTACOES
// Componentes
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';

// Vue
import { useRoute } from 'vue-router';
import { onMounted, reactive, ref, watch } from 'vue';

// Logging
import log from '@/logger';

// Store
import { useLiberarEditaisPagamentoStore } from '../controller/store/LiberarEditaisStore';

// Controllers
import FolhaController from '../controller/FolhaController';
import AreaTecnicaController from '../controller/AreaTecnicaController';

// Dayjs
import dayjs from 'dayjs';import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

// Tipagem
import type { ILiberarEditaisPagamento } from '../model/LiberarEditaisPagamento';
import type { IPlanoMensal } from '../model/PlanoMensal';
import type { IFolha } from '../model/Folha';
import { usePlanoMensalStore } from '../controller/store/PlanoMensalStore';
import PlanoMensalController from '../controller/PlanoMensalController';
import type { IEditalCompetencia } from '../model/EditalCompetencia';
export type EditalPagamento = {
  notReleased?: boolean
  approved?: boolean
  reason?: string
}

// Breadcrumbs
const page = ref({ title: `Liberar editais: /` });
const breadcrumbs = ref([
  { text: 'Pagamentos', disabled: true, href: '#' },
  { text: 'Liberação de editais', disabled: false, href: '#' }
]);

// Headers - tabela
const headers = ref([
  { title: 'Edital', sortable: false, key: 'Edital.Nome' },
  { title: 'Status', sortable: false, key: 'Status', help: "Status de liberação do edital para a competência em questão" },
  { title: 'Bolsas vigentes', sortable: false, key: 'BolsasVigentes', help: "Quantidade total de bolsas com pagamento previsto no mês em questão" },
  { title: 'Pendentes', sortable: false, key: 'BolsasPendentes', help: "Quantidade de alocações de bolsistas pendentes de avaliação" },
  { title: 'Valor total', sortable: false, key: 'ValorPrevisto', help:"Somatório dos valores das bolsas vigentes do edital" },
  { title: 'Ações', key: 'actions' }
]);

// Select de status
const statusItemsSelect = ref([
    { Status: "Sem decisão", Value: 'SEM_DECISAO' },
    { Status: "Liberado", Value: 'LIBERADO' },
    { Status: "Não liberado", Value: 'NAO_LIBERADO' },
    { Status: "Incluído em folha", Value: 'INCLUIDO_EM_FOLHA' }
]);

// Declaracoes booleanas
const showDialog = ref(false);
const showDialogEdit = ref(false);
const showDialogSubmit = ref(false);
const folhaPagamentoAlreadyGenerated = ref(false);
const snackbar = ref(false);

// Declaracoes string
const reason = ref('');
const mesAtual = ref('')
const messageAlertDateGeneratePaymentDoc = ref('');
const mesAtualPrimeiroCaracter = ref('');
const snackbarText = ref('');
const areaTecnicaAtual = ref('');
const snackbarColor = ref('success');
const searchEdital = ref('');
const searchStatus = ref();
const isLoading = ref(false);

// Declaracoes number
const snackbarTimeout = ref(3000);

// Declaracoes objetos
let currentItem = ref(<EditalPagamento>({})); 
const mesesLiberarEdital = reactive<{[key: string]: Array<EditalPagamento & IEditalCompetencia>;}>({});
const planoMensalAtual = ref<IPlanoMensal>();
const historicoFolhas = ref<IFolha[]>([]);
const relatorioEnvio = ref<String[]>([])

// Declaracoes listas
const meses = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", 
"AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];
const mesesPrimeiroCaracterMaiusculo = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", 
"Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

// Criacao controladores
const controlladorAreaTecnica = new AreaTecnicaController();
const controladorFolha = new FolhaController();

// Definicoes para rotas
const route = useRoute();
let params = route.params;

// FUNCOES
// Funcao ao carregar a pagina -----------------------------------------------------------------------------
onMounted(async () => {
  carregarPagina();
});

watch(
  () => route.params.area,
  async (newRoute, oldRoute) => {
    carregarPagina();
  }
);

async function carregarPagina() {
  isLoading.value = true;
  await historyFolha();
  await getPosts();
  page.value.title = `Liberar editais: Áreas/${mesAtualPrimeiroCaracter.value}`;
  await definePlanoMensalAtual();
  isLoading.value = false;
}
// ------------------------------------------------------------------------------------------------------------

// Funcoes para carregar informacoes -------------------------------------
const getPosts = async () => {
  try {
    await useLiberarEditaisPagamentoStore.fetch();

    resetarFiltro();
    carregarItems();
  } catch (error) {
    log.error('Error fetching:', error);
  }
};

function limparItems() {
  Object.keys(mesesLiberarEdital).forEach(key => {
    delete mesesLiberarEdital[key];
  });
}

function carregarItems() {
  limparItems();
  useLiberarEditaisPagamentoStore.items.forEach(item => {
    mesesLiberarEdital[item.mes.toUpperCase()] = item.editaisCompetencias;
  });
}

// ------------------------------------------------------------------------

// Funcoes para definicao de entidades padroes ----------------------------------------------
const verificaArrayParams = () => {
  if (typeof params.area === 'string') {
    return params.area;
  } else if (Array.isArray(params.area)) {
    return params.area[0];
  }
  return '';
};

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

async function historyFolha() {
  historicoFolhas.value = await controladorFolha.historyFolha();
}
// --------------------------------------------------------------------------------------------

// Funcoes para estados visuais --------------------------------------------------
function allInFolha() {
  let outFolha = true;
  Object.keys(mesesLiberarEdital).forEach(key => {
    mesesLiberarEdital[key].forEach(element => {
      if (element.status != "INCLUIDO_EM_FOLHA") outFolha = false;
    })
  });
  return outFolha;
}

// Funcoes para submit ----------------------------------------
const submitDecision = () => {
  const listaUnificada = Object.values(mesesLiberarEdital).flatMap((mesLiberarEdital) => mesLiberarEdital);
  relatorioEnvio.value = []
  let countApproved = 0;
  let countNoDecision = 0;
  let countNotReleased = 0;

  listaUnificada.forEach(liberarEdital => {
    // console.log(liberarEdital)
    if (liberarEdital.approved || (liberarEdital.status == 'LIBERADO' && !liberarEdital.notReleased)) countApproved++;
    else if ((liberarEdital.notReleased && liberarEdital.reason) || liberarEdital.status == 'NAO_LIBERADO') countNotReleased++;
    else if (liberarEdital.status == 'SEM_DECISAO') countNoDecision++;
  });

  if (countApproved > 0) {
    relatorioEnvio.value.push(
      `${countApproved} ${countApproved > 1 ? 'editais' : 'edital'} ${countApproved > 1 ? 'estarão LIBERADOS' : 'estará LIBERADO'} `
    );
  }
  if (countNoDecision > 0) {
    relatorioEnvio.value.push(
      `${countNoDecision} ${countNoDecision > 1 ? 'editais' : 'edital'} ${countNoDecision > 1 ? 'estarão' : 'estará'} SEM DECISÃO`
    );
  }

  if (countNotReleased > 0) {
    relatorioEnvio.value.push(
      `${countNotReleased} ${countNotReleased > 1 ? 'editais' : 'edital'} ${countNotReleased > 1 ? 'estarão' : 'estará'} NÃO LIBERADO`
    );
  }
  showDialogSubmit.value = true;
};

async function confirmSubmit() {
  try {
    const listaUnificada = Object.values(mesesLiberarEdital).flatMap((mesLiberarEdital) => mesLiberarEdital);
    await useLiberarEditaisPagamentoStore.updateBulk(listaUnificada);
    closeDialogSubmit();
    snackbarSuccess();
    limparFiltros();
  } catch (error: unknown) {
    log.error(error);
    snackbarError();
  } finally {
    await useLiberarEditaisPagamentoStore.fetch(verificaArrayParams());
    resetarFiltro();
    carregarItems();
  }
}
// ----------------------------------------------------------------------------------------------------

// Funcoes de correcao de grafia
function correctNameStatusEditalCompetencia(status: string) {
  if (status == 'SEM_DECISAO') return 'SEM DECISÃO';
  if (status == 'NAO_LIBERADO') return 'NÃO LIBERADO';
  if (status == 'INCLUIDO_EM_FOLHA') return 'INCLUÍDO EM FOLHA';
  return status
}
// ------------------------------------------------------------------------

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
// ------------------------------------------------------------------

// Funcoes de aprovacao de editais ----------------------------------------
const toggleApproval = (item: any, directApproval?: boolean) => {
  if (item.notReleased) {
    item.notReleased = !item.notReleased;
    return
  } else if (item.Status == "NAO_LIBERADO" && directApproval) {
    item.notReleased = false;
    item.approved = true;
    // console.log(item)
    return
  }
  item.approved = !item.approved
};

function markAllNotice() {
  Object.values(mesesLiberarEdital).forEach((items) => {
    items.forEach((item) => {
      if (item.status != 'INCLUIDO_EM_FOLHA') {
        item.approved = true;
        if (item.notReleased) {
          item.notReleased = false;
        }
      }
    });
  });
}

const markAsNotReleased = () => {
  if (reason.value) {
    currentItem.value.notReleased = true;
    currentItem.value.approved = false;
    currentItem.value.reason = reason.value;
    closeDialog();
    closeDialogEdit();
  } else {
    snackbarText.value = `Insira uma justificativa!`;
    snackbarColor.value = 'error';
    snackbar.value = true;
  }
};

// ---------------------------------------------------------------------

// Funcoes dialog ----------------------------------------------------------------
const openDialog = (item: EditalPagamento & IEditalCompetencia) => {
  reason.value = '';
  currentItem.value = item;
  if (item.status == "NAO_LIBERADO" && item.decisaoLiberacoes.length > 0 && !item.reason) {
    reason.value = item.decisaoLiberacoes[item.decisaoLiberacoes.length-1].justificativa;
    showDialogEdit.value = true;
    return
  }
  if (item.reason) reason.value = item.reason;  
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
};

const closeDialogEdit = () => {
  showDialogEdit.value = false;
}

const closeDialogSubmit = () => {
  showDialogSubmit.value = false;
};
// ------------------------------------------------------------------------------------------------

// Funcoes snackbar ------------------------------------------------------------------------
function snackbarSuccess() {
    snackbarText.value = `Decisões salvas.`;
    snackbarColor.value = 'success';
    snackbar.value = true;
}

function snackbarError() {
    snackbarText.value = `Ocorreu um erro. Tente novamente.`;
    snackbarColor.value = 'error';
    snackbar.value = true;
}
</script>


<style scoped>
.approved-item {
  background-color: #e6ffe6;
  /* Cor verde */
}

.not-released-item {
  background-color: #f8d3d3;
  /* Cor vermelha suave */
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
</style>