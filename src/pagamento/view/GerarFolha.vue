<template>
  <v-skeleton-loader type="text" class="mx-0 my-0 skeleton-loader" v-if="isLoading" :loading="isLoading"/>
  <BaseBreadcrumb v-if="!isLoading" :breadcrumbs="breadcrumbs" :title="page.title" class="bold-title" />
  <p v-if="!isLoading">Confirme os dados dos editais a serem incluídos na folha desta competência.</p> <br>
    
  <div v-if="Object.keys(itemsConfirmarGeracaoFolha).length > 0" v-for="dado in itemsConfirmarGeracaoFolha" :key="dado.areaTecnica">
    <v-container class="mt-3 px-0" v-if="Object.keys(dado.detalhesLiberacaoPorMes).length > 0">
      <v-row wrap no-gutters>
        <v-col cols="1" class="text-left">
          <v-skeleton-loader type="text" class="mx-0 my-0 skeleton-loader" v-if="isLoading" :loading="isLoading"/>
          <v-label v-if="!isLoading" class="text-h4 font-weight-bold mr-2">
            {{ dado.areaTecnica }}
          </v-label>
        </v-col>
        <v-col cols="15" class="text-left">
          <v-divider class="mt-3" color="warning" :thickness="3" />
        </v-col>
      </v-row>
    </v-container>

    <div v-if="Object.keys(dado.detalhesLiberacaoPorMes).length > 0" v-for="(itensLiberarEdital, mesLiberarEdital) in dado.detalhesLiberacaoPorMes" :key="mesLiberarEdital">
      <v-container class="px-0">
        <v-row wrap no-gutters>
          <v-col cols="1" class="text-center text-h6 mt-1 mr-4">
            <v-skeleton-loader type="text" class="mx-0 my-0 skeleton-loader" v-if="isLoading" :loading="isLoading"/>
            <v-label v-if="!isLoading">{{mesLiberarEdital}}</v-label>
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
            <template v-slot:item.status="{ item, index }">
              <td class="green-color"><b>LIBERADO</b></td>
            </template>

            <template v-slot:item.valorTotal="{ item, index }">
              <b>{{ item.valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) }}</b>
            </template>
  
            <template v-slot:no-data>
              <v-label>Sem dados!</v-label>
            </template>
            <template #bottom></template> <!-- Remove o footer/linha de paginacao -->
          </v-data-table>
        </v-col>
      </v-row>
    </div>
    <v-col cols="11" class="d-flex justify-end" v-if="Object.keys(dado.detalhesLiberacaoPorMes).length > 0">
      <p class="text-subtitle-1">Total a ser incluso na folha da área técnica: <b>{{ totaisPorArea[dado.areaTecnica]?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) }}</b></p>
    </v-col>
  </div> 
  <div v-if="Object.keys(itemsConfirmarGeracaoFolha).length > 0">
    <v-skeleton-loader type="text" class="mx-0 my-0 skeleton-loader" v-if="isLoading" :loading="isLoading"/>
    <v-col cols="12" class="d-flex justify-end">
      <p class="text-h6" v-if="!isLoading">Total a ser pago na folha: <b>{{ valorTotalFolha.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) }}</b></p>
    </v-col>
  </div>
  <v-col cols="12" class="d-flex justify-center" v-else>
    <p v-if="!isLoading">Sem editais liberados.</p>
  </v-col>
  
  <v-col cols="12" class="d-flex justify-end" v-if="Object.keys(itemsConfirmarGeracaoFolha).length > 0">
    <v-btn type="submit" color="primary" flat @click="openGerarFolha" data-test="buttonGerarFolha">Gerar folha</v-btn>
  </v-col>

  <v-dialog v-model="dialogGerarFolha" max-width="600px">
    <v-card>
        <v-card-title class="text-h5 pt-6 pb-4 px-6"><b>Deseja confirmar a geração da folha?</b></v-card-title>
        <v-card-text class="px-6">
            <p>A DIRAF será notificada sobre a consolidação da <b>FOLHA NORMAL DE {{ mesAtual.toUpperCase() }}</b> com 
              <b>{{ bolsasVigentesTotal.toLocaleString('pt-BR') }} bolsas</b> no valor de 
              <b>{{ valorTotalFolha.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) }}</b> com data de pagamento para o dia 
              <b>{{ dayjs(planoMensalAtual?.MarcoPagamento).utc().format('DD/MM/YYYY') }}</b>.
            </p>
        </v-card-text>
        <v-card-actions>
            <v-spacer />
            <v-btn color="primary" variant="outlined" dark @click="closeDialogGerarFolha">Cancelar</v-btn>
            <v-btn color="primary" variant="flat" dark @click="confirmarGeracaoFolha">Confirmar</v-btn>
        </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogGerarFolhaComplementar" max-width="600px">
    <v-card>
        <v-card-title class="text-h5 pt-6 pb-4 px-6"><b>Deseja confirmar a geração da folha?</b></v-card-title>
        <v-card-text class="px-6">
            <p>A DIRAF será notificada sobre a consolidação da <b>FOLHA COMPLEMENTAR numero da folha {{  }} DE {{ mesAtual.toUpperCase() }}</b> com 
              <b>{{ bolsasVigentesTotal.toLocaleString('pt-BR') }} bolsas</b> no valor de 
              <b>{{ valorTotalFolha.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) }}</b>. 
              Indique abaixo a data de pagamento desta folha:
            </p>

            <p class="mt-4 mb-2">Data de pagamento da folha complementar *</p>
            <v-text-field
              type="date"
              v-model="formComplementar.DataPagamentoFolhaComplementar"
              data-test="inputDatePagamentoFolhaComplementar"
            >             
            </v-text-field>
        </v-card-text>
        <v-card-actions>
            <v-spacer />
            <v-btn color="primary" variant="outlined" dark @click="closeDialogGerarFolhaComplementar" data-test="buttonCancelarGeracaoFolhaComplementar">Cancelar</v-btn>
            <v-btn color="primary" variant="flat" dark @click="confirmarGeracaoFolha">Confirmar data-test="buttonConfirmarGeracaoFolhaComplementar">Confirmar</v-btn>
        </v-card-actions>
    </v-card>
  </v-dialog>

  
  <v-snackbar
      v-model="snackbar"
      :timeout="snackbarTimeout"
      :color="snackbarColor"
      data-test="snackbarMessage"
    >
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="snackbar = false"
          data-test="buttonFecharSnackbar"
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

// Dayjs
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

// Vue
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

// Stores
import { useConfirmarGeracaoFolhaStore } from '../controller/store/ConfirmarGeracaoFolhaStore';

// Logger
import log from '@/logger';

// Controladores
import PlanoMensalController from '../controller/PlanoMensalController';
import FolhaController from '../controller/FolhaController';

// Tipagem
import type { ILiberarEditaisPagamento } from '../model/LiberarEditaisPagamento';
import type { IPlanoMensal } from '../model/PlanoMensal';
import type { IFolha } from '../model/Folha';
// ToDo: criar dtos e tipagens, incluir tipo abaixo
export type EditalPagamento = {
  notReleased?: boolean
  approved?: boolean
  reason?: string
}

// Headers - tabela
const headers = ref([
  { title: 'Edital', sortable: false, key: 'edital' },
  { title: 'Status', sortable: false, key: 'status', help: "Status de liberação do edital para a competência em questão" },
  { title: 'Bolsas vigentes', sortable: false, key: 'bolsasVigentes', help: "Quantidade total de bolsas com pagamento previsto no mês em questão" },
  { title: 'Pendentes', sortable: false, key: 'bolsasPendentes', help: "Quantidade de alocações de bolsistas pendentes de avaliação" },
  { title: 'Valor total', sortable: false, key: 'valorTotal', help:"Somatório dos valores das bolsas vigentes do edital" }
]);

// Declaracoes relacionadas a rotas
const router = useRouter();

// Declaracoes relacionadas aos breadcrumbs
const page = ref({ title: '' });
const breadcrumbs = ref([
  { text: 'Pagamentos', disabled: true, href: '#' },
  { text: 'Monitorar liberação das áreas', disabled: false, href: '/pagamento/MonitorarLiberacao' },
  { text: 'Gerar folha', disabled: false, href: '#' }
]);

const isLoading = ref(false);

// Declaracoes string
const mesAtual = ref('');
const snackbarText = ref('');
const snackbarColor = ref('success');

// Declaracoes booleanas
const dialogGerarFolha = ref(false);
const dialogGerarFolhaComplementar = ref(false);
const snackbar = ref(false);

// Declaracoes number
const valorTotalFolha = ref(0);
const bolsasVigentesTotal = ref(0);
const snackbarTimeout = ref(3000);

// Declaracoes de listas
const mesesNoCaps = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const meses = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];
const historicoFolhas = ref<IFolha[]>([]);

// Declaracoes de objetos
const planoMensalAtual = ref<IPlanoMensal>();

// Declaracoes dos objetos dos controladores
const PlanoMensalControllerObject = new PlanoMensalController();

// Declaracao do form
const formComplementar = ref<{DataPagamentoFolhaComplementar: null | string}>({DataPagamentoFolhaComplementar: null});

// FUNCOES
// Funcao ao carregar a pagina --------------------------------------------------------------------------------------------------------------------------------
onMounted(async () => {
  isLoading.value = true;
  await getPosts();
  await historyFolha();
  await definePlanoMensalAtual();
  page.value.title = `Gerando Folha ${historicoFolhas?.value.length == 0 || historicoFolhas.value[historicoFolhas.value.length-1].Status != "GERADA" ? 
    'Normal' : 'Complementar ' + (historicoFolhas.value.length == 1 ? '1' : historicoFolhas.value[historicoFolhas.value.length-1].Titulo.split("-")[2] + 1) } 
    de ${mesAtual.value}`;
  isLoading.value = false;
});
// ------------------------------------------------------------------------------------------------------------------------------------------------------------

// Funcoes para carregar informacoes ------------------------------------
import ConfirmarGeracaoFolhaController from '../controller/ConfirmarGeracaoFolhaController';
import type { IConfirmarGeracaoFolha } from '../model/ConfirmarGeracaoFolha';
import type { IDetalhesLiberacaoPorMes } from '../model/DetalhesLiberacaoPorMes';
const confirmarGeracaoFolhaController = new ConfirmarGeracaoFolhaController();
const itemsConfirmarGeracaoFolha = ref<IConfirmarGeracaoFolha[]>([]);
const getPosts = async () => {
  try {
    useConfirmarGeracaoFolhaStore.items = await confirmarGeracaoFolhaController.fetchAllConfirmarGeracaoFolha();
    // console.log(useConfirmarGeracaoFolhaStore.items);
    itemsConfirmarGeracaoFolha.value = useConfirmarGeracaoFolhaStore.items
    carregarItems();
  } catch (error) {
    log.error('Error fetching:', error);
  }
};

function carregarItems() {
  limparTotaisPorArea();
  useConfirmarGeracaoFolhaStore.items.forEach(item => {
    carregarTotaisPorArea(item.detalhesLiberacaoPorMes, item.areaTecnica);
  });
}

const totaisPorArea = reactive<{[key: string]: number}>({});
function carregarTotaisPorArea(meses: IDetalhesLiberacaoPorMes, area: string) {
  Object.keys(meses).forEach(mes => {
    meses[mes].forEach((edital) => {
      if (totaisPorArea[area] == undefined) totaisPorArea[area] = edital.valorTotal
      else totaisPorArea[area] += edital.valorTotal;
      valorTotalFolha.value += edital.valorTotal;
      bolsasVigentesTotal.value += edital.bolsasVigentes;
    })
  })
}

async function definePlanoMensalAtual() {
  planoMensalAtual.value = await PlanoMensalControllerObject.fetchAtual();
  if (planoMensalAtual.value) mesAtual.value = mesesNoCaps[new Date(planoMensalAtual.value.Mes).getUTCMonth()];
  // console.log(planoMensalAtual)
}

async function historyFolha() {
  const folhaController = new FolhaController();
  historicoFolhas.value = await folhaController.historyFolha()
}
// ----------------------------------------------------------------------

// Funcoes para limpar informacoes --------------------------------
function limparTotaisPorArea() {
  Object.keys(totaisPorArea).forEach(key => {
    delete totaisPorArea[key];
  });
}
// ------------------------------------------------------------

// Funcoes para abrir dialogs --------------------------------------------------------------------------------------------------------------------
function openGerarFolha() {
  const dataAtual = dayjs().utc()
  const dataM2Atual = dayjs(planoMensalAtual.value?.MarcoGeracaoFolha).utc()
  
  if (ehComplementar() || verificarData()) {
    openDialogGerarFolhaComplementar();
  }
  else openDialogGerarFolha();

  // gambiarra
  function ehComplementar() {
    return historicoFolhas?.value.length > 0 
        && historicoFolhas.value.find(folha => folha.Status == "AUTORIZADA")
  }

  function verificarData(){
    return dataAtual < dataM2Atual
  } 
}

function openDialogGerarFolha() {
  dialogGerarFolha.value = true;
}

function openDialogGerarFolhaComplementar() {
  dialogGerarFolhaComplementar.value = true;
}
// ------------------------------------------------------------------------------------------------------------------------------------------------

// Funcoes para fechar dialogs --------------------------
function closeDialogGerarFolha() {
  dialogGerarFolha.value = false;
}

function closeDialogGerarFolhaComplementar() {
  dialogGerarFolhaComplementar.value = false;
}
// --------------------------------------------------

// Funcao para gerar a folha -----------------------------------------------------------
async function confirmarGeracaoFolha() {
  try {
    const folhaController = new FolhaController();
    const response = await folhaController.generateFolha(formComplementar.value);
    const id = response.uri.replace('/api/pagamentobolsistas/folha/generate/', '');
    router.push(`/pagamento/VisualizarFolha/${id}/1`);
  } catch (error) {
    log.error(error)
    snackbarError();
  }
  closeDialogGerarFolha();
}
// ------------------------------------------------------------------------------------

// Funcoes snackabar ------------------------------------------------
function snackbarError() {
    snackbarText.value = `Ocorreu um erro na geração da folha.`;
    snackbarColor.value = 'error';
    snackbar.value = true;
}
// ----------------------------------------------------------------

// Funcao para ajuste de grafia ------------------------------------------
function correctNameStatusEditalCompetencia(status: string) {
  if (status == 'SEM_DECISAO') return 'SEM DECISÃO';
  if (status == 'NAO_LIBERADO') return 'NÃO LIBERADO';
  if (status == 'INCLUIDO_EM_FOLHA') return 'INCLUÍDO EM FOLHA';
  return status;
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

.green-color {
  color: #107B2E;
}
</style>