<template>
    <div class="navigate-back mb-4" @click="goBackToListFolhas">
      <v-icon>mdi-chevron-left</v-icon>
      <a>Voltar para listagem</a>
    </div>

    <div class="mb-2 mt-0">
      <v-skeleton-loader type="text" class="mx-0 my-0 skeleton-loader" v-if="isLoading" :loading="isLoading"/>
      <h2 v-if="!isLoading" class="mb-6">Exibindo Folha {{ folha ? folha?.Titulo.split('-')[1].charAt(0).toUpperCase() + folha?.Titulo.split("-")[1].slice(1).toLowerCase() : '' }} 
        {{ folha?.Ordem && folha?.Ordem > 0 ? folha?.Titulo.split('-')[2] : '' }} de 
        {{ mesAtual }}</h2>
      <p v-if="!isLoading" class="mb-4"><b>MÊS COMPETÊNCIA: </b> {{ dayjs(folha?.PlanoMensal.Mes).utc().format("MM/YYYY") }}</p>
      <p v-if="!isLoading" class="mb-4"><b>DATA DE GERAÇÃO: </b> {{ dayjs(folha?.DateCreated).utc().format("DD/MM/YYYY") }}</p>
      <p v-if="!isLoading" class="mb-4"><b>STATUS DA FOLHA: </b> <span :class="getStatusClass(folha?.Status)"> {{ folha?.Status }} </span></p>
    </div>

    <div class="mb-6">
      <p v-if="!isLoading"><b>Histórico de geração das folhas de {{ mesAtual }}</b></p>
      <p v-if="historicoFolhas?.length == 0 && !isLoading">
        Nenhuma folha gerada até o momento.
      </p>
      <div v-else >
        <div v-for="folha in historicoFolhas">
          <p v-for="decisao in folha.DecisaoFolhas">
            Folha {{ folha.Titulo.split("-")[1].charAt(0).toUpperCase() + folha.Titulo.split("-")[1].slice(1).toLowerCase() }} 
          {{ folha.Titulo.split("-")[1] == "COMPLEMENTAR" ?  folha.Titulo.split("-")[2] : "" }} de 
          {{ mesAtual }} {{ statusPorAcao(decisao.TipoAcaoFolha) }} em 
          {{ dayjs(decisao.Horario).utc().format("DD/MM/YYYY") }}. <span class="detailLink" v-if="decisao.TipoAcaoFolha == 'CANCELAR' || decisao.TipoAcaoFolha == 'REJEITAR'" @click="openDialogDetail(folha, decisao)">Ver Detalhes</span>
          </p>
        </div>
      </div>
    </div>

    <div v-if="folha?.Status != 'CANCELADA' && folha?.Status != 'REJEITADA'">
      <v-skeleton-loader v-if="isLoading" type="table" :loading="isLoading" class="mx-auto my-8 skeleton-loader">
        <v-row>
            <v-col cols="12">
                <v-skeleton-loader type="table" class="skeleton-loader" />
            </v-col>
        </v-row>
        </v-skeleton-loader>
        <v-data-table
            v-if="!isLoading"
            class="border rounded-md"
            :headers="headers"
            :items="folhaTabela"
        >

            <template v-slot:item.valorAPagar="{ item }">
                <b>
                    {{ item.valorAPagar.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) }}
                </b>
            </template>

            <template v-slot:item.actions="{ item }">
                <v-icon class="mdi mdi-eye me-2" color="primary" size="small"/>
            </template>

            <template v-slot:body.append>
                <tr class="text-body-1">
                    <td><b>Total da Folha</b></td>
                    <td><b>{{ totalEditaisInclusos }}</b></td>
                    <td><b>{{ totalQtdBolsas }}</b></td>
                    <td><b>{{ totalValorBolsas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) }}</b></td>
                </tr>
            </template>

            <template v-slot:no-data>
                <v-label>Não há dados para serem exibidos!</v-label>
            </template>
            <template #bottom></template>
        </v-data-table>

      
        <v-col cols="12" class="d-flex justify-space-between mt-4" v-if="folha?.Status != 'AUTORIZADA'">
        <v-btn type="submit" variant="text" style="color:#AE1212" flat @click="openDialogRejeitar">
            Rejeitar Pagamento
        </v-btn>
        <v-btn type="submit" color="primary" flat @click="openDialogAutorizar">
            Autorizar Pagamento
        </v-btn>
        </v-col>  
    </div>

    

    <v-dialog v-model="showDialogRejeitar" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="text-h6"><strong>Rejeitar pagamento da folha?</strong> </span>
      </v-card-title>
      <v-card-text>
        <p>A GEPOF será notificada sobre a recusa de pagamento da <b>{{  }}</b>
            no valor de {{ totalValorBolsas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) }} com data de 
            pagamento para o dia {{ dayjs(folha?.DataPagamento).utc().format('DD/MM/YYYY') }}.
        </p>
        <br>
        <p>Para recusar o pagamento de uma folha, é necessária uma justificativa.</p>
        <br>
        <label>Justificativa da rejeição de pagamento*</label>
        <v-text-field placeholder="Digite aqui a justificativa" variant="outlined" v-model="form.justificativa"></v-text-field>
        <p><b>A consolidação da folha será desfeita, e essa ação é irreversível.</b></p>
        <p>Deseja continuar?</p>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn style="color:black" text @click="closeDialogCancel">Não</v-btn>
        <v-btn variant="flat" style="background-color: #AE1212; color:white" dark @click="rejeitarFolha">Sim, rejeitar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>


    <v-dialog v-model="showDialogDetail" max-width="500px">
    <v-card>
      <v-card-title class="title-wrap">
        <span class="text-h6"><strong>A Folha {{ tipoFolha }} de {{ mesAtual }} foi {{ statusFolha }} para <br> pagamento em {{ dataAcaoFolha }}.</strong> </span>
      </v-card-title>
      <v-card-text><p class="mb-2">Folha {{tipoFolha}} de {{ mesAtual }} gerada em {{ dayjs(dataGeradaAnterior).utc().format('DD/MM/YYYY') }}, porém foi {{ statusFolha }} para pagamento pela <b v-if= "statusFolha == 'cancelada'">GEPOF</b> <b v-else>DIRAF</b> conforme abaixo:</p><br>
        
        <p class="mb-1">Justificativa da recusa de pagamento</p>
        <v-text-field
          v-model="justificativaFolha"
          disabled="true"
        >
        </v-text-field>
        
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="black" text @click="closeDialogDetail">Fechar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog> 

  <v-dialog v-model="showDialogAutorizar" max-width="500px">
    <v-card>
      <v-card-title class="title-wrap">
        <span class="text-h6"><strong>Autorizando pagamento da folha</strong></span>
      </v-card-title>
      <v-card-text>
        <p class="mb-2">A GEPOF será notificada sobre a autorização de pagamento da <b>FOLHA {{ tipoFolha }} DE {{ mesAtual.toLocaleUpperCase() }}</b> com <b>{{ totalQtdBolsas }} bolsas</b> no valor de <b>{{ totalValorBolsas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) }}</b>
        com data de pagamento para o dia de <b>{{ dayjs(folha?.DataPagamento).utc().format('DD/MM/YYYY') }}</b>
        </p>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn style="color:black" text @click="closeDialogAutorizar">Cancelar</v-btn>
        <v-btn variant="flat" style="background-color: #2B3A8A; color:white" dark @click="autorizarFolha">Autorizar pagamento</v-btn>
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
  
<script async setup lang="ts">
// IMPORTACOES
// Vue
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Logger
import log from '@/logger';

// Dayjs
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/pt-br';
dayjs.extend(utc);
dayjs.locale('pt-br');

// Tipagem
import type { IPlanoMensal } from '../model/PlanoMensal';
import type { IFolha } from '../model/Folha';
import type { IFolhaResumo } from '../model/FolhaResumo';
import type { IDecisaoFolha } from '../model/DecisaoFolhas';

// Controladores
import PlanoMensalController from '../controller/PlanoMensalController';
import FolhaController from '../controller/FolhaController';

// Declaracoes string
const mesAtual = ref('');
const diaPagamentoAutorizacao = ref('');
const snackbarText = ref('');
const snackbarColor = ref('success');
const tipoFolha = ref();
const dataAcaoFolha = ref();
const statusFolha = ref();
const justificativaFolha = ref();
const dataGeradaAnterior = ref();

// Declaracoes number
const snackbarTimeout = ref(3000);
const totalEditaisInclusos = ref(0);
const totalQtdBolsas = ref(0);
const totalValorBolsas = ref(0);

// Declaracoes booleanas
const showDialogDetail = ref(false);
const showDialogAutorizar = ref(false);
const showDialogRejeitar= ref(false);
const snackbar = ref(false);

// Declaracoes de listas
const mesesNoCaps = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const historicoFolhas = ref<IFolha[]>([]);
const folhaTabela = ref<IFolhaResumo[]>([]);

// Declaracoes de objetos
const planoMensalAtual = ref<IPlanoMensal>();
const folha = ref<IFolha>();
const isLoading = ref(false);

// Declaracoes dos objetos dos controladores
const PlanoMensalControllerObject = new PlanoMensalController();
const controladorFolha = new FolhaController();

// Headers - tabela
const headers = [
  { key: 'areaTecnica', title: 'Área técnica', align: 'start' },
  { key: 'editaisInclusos', title: 'Editais inclusos' },
  { key: 'quantidadeBolsas', title: 'Quantidade de bolsas' },
  { key: 'valorAPagar', title: 'Valor a pagar' },
  { key: 'actions', title: 'Ações', sortable: false }
];

// Declaracoes relacionadas a rotas
const router = useRouter();
const route = useRoute();
const params = route.params;

// Declaracao do form
const form = reactive({
  folhaId: idFolha(),
  justificativa: '',
  ehAutorizada: true
});

// FUNCOES
// Funcao para carregar a pagina -------------
onMounted(async()=>{
  isLoading.value = true;
  await refresh();  
  isLoading.value = false;
})

async function refresh() {
  if (params.gerado) snackbarSuccess();
  await definePlanoMensalAtual();
  await historyFolha();
  await getFolhaInformations();
  await getFolhaTabela();
  await somaEditais();
}
// ------------------------------------------

// Funcoes de redirecionamento ---------------
function goBackToListFolhas() {
  router.push('/pagamento/ListarFolha')
}
// ------------------------------------------

// Funcoes para carregar informacoes ------------------------------------------------------------------------------------------
async function definePlanoMensalAtual() {
  planoMensalAtual.value = await PlanoMensalControllerObject.fetchAtual();
  if (planoMensalAtual.value) mesAtual.value = mesesNoCaps[new Date(planoMensalAtual.value.Mes).getUTCMonth()];
}

async function getFolhaTabela() {
  if(folha.value){
    folhaTabela.value = await controladorFolha.fetchFolhaResume(folha.value?.Ordem, folha.value?.PlanoMensal.Id);
  }
}

async function getFolhaInformations() {
  folha.value = await controladorFolha.getFolhaById(idFolha());
}

async function somaEditais(){
  totalEditaisInclusos.value = 0;
  totalQtdBolsas.value = 0;
  totalValorBolsas.value = 0;
  folhaTabela.value.forEach(item => {
    totalEditaisInclusos.value += item.editaisInclusos;
    totalQtdBolsas.value += item.quantidadeBolsas;
    totalValorBolsas.value += item.valorAPagar;
  });
}

async function historyFolha() {
  historicoFolhas.value = await controladorFolha.historyFolha();
}
// -----------------------------------------------------------------------------------------------------------------------------

// Funcao para verificacao de parametros --------
function idFolha(): string {
  if (Array.isArray(params.id)) {
    return params.id[0];
  }
  return params.id;
}
// ----------------------------------------------

// Funcoes para abrir os dialogs --------------------------------------------------------------------------------------------------------
async function openDialogRejeitar() {
  showDialogRejeitar.value = true;
};

async function openDialogAutorizar() {
  showDialogAutorizar.value = true;
};

async function openDialogDetail(historico: IFolha, decisao: IDecisaoFolha) {
  tipoFolha.value = historico.Titulo.split("-")[1].charAt(0).toUpperCase() + historico.Titulo.split("-")[1].slice(1).toLowerCase();
  dataAcaoFolha.value = dayjs(decisao.Horario).utc().format("DD/MM/YYYY");
  statusFolha.value = statusPorAcao(decisao.TipoAcaoFolha);
  justificativaFolha.value = decisao.Justificativa;
  showDialogDetail.value = true;
  
  const index = historico.DecisaoFolhas.findIndex(folha => folha.Id === decisao.Id);
  if (index > 0) {
    dataGeradaAnterior.value = historico.DecisaoFolhas[index - 1].Horario;
  }
}
// -------------------------------------------------------------------------------------------------------------------------------------------

// Funcoes para envio de decisao sobre a folha -----------
async function rejeitarFolha() {
  if (form.justificativa == '') {
    snackbarSemJustificativa();
    return
  }
  try {
    form.ehAutorizada = false;
    await controladorFolha.rejectFolha(form);
    router.push('/pagamento/ListarFolhaDiraf');
  } catch (error) {
    log.error(error);
  }
}

async function autorizarFolha() {
  try {
    form.ehAutorizada = true;
    await controladorFolha.rejectFolha(form);
    closeDialogAutorizar();
    snackbarAutorizada();
    refresh();
  } catch (error) {
    log.error(error);
  }
}
// ----------------------------------------------------

// Funcoes snackbar -----------------------------------------------------
function snackbarSuccess() {
  snackbarText.value = `Folha gerada com sucesso.`;
  snackbarColor.value = 'success';
  snackbar.value = true;
}

function snackbarSemJustificativa() {
  snackbarText.value = `Insira uma justificativa.`;
  snackbarColor.value = 'error';
  snackbar.value = true;
}

function snackbarAutorizada() {
  snackbarText.value = `Folha foi autorizada para pagamento.`;
  snackbarColor.value = '';
  snackbar.value = true;
}
// ---------------------------------------------------------------------

// Funcoes para fechar dialogs -------------------
const closeDialogDetail = () => {
  showDialogDetail.value = false;
};

const closeDialogAutorizar = () => {
  showDialogAutorizar.value = false;
};

const closeDialogCancel = () => {
  showDialogRejeitar.value = false;
}
// -----------------------------------------------

// Funcoes de correcao de grafia ---------------------------
function statusPorAcao(acao: string) {
  if (acao == "GERAR") return "gerada";
  if (acao == "CANCELAR") return "cancelada";
  if (acao == "REJEITAR") return "rejeitada";
  if (acao == "AUTORIZAR") return "autorizada";
  return " ";
}
// ---------------------------------------------------------

// Funcoes para definir classes de estilo -------------------
const getStatusClass = (status: string | undefined) => {
  if (status === 'GERADA') {
    return 'status-gerada';
  } else if (status === 'PAGA') {
    return 'status-paga';
  } else if (status === 'CANCELADA'){
    return 'status-cancelada';
  } else if (status === 'REJEITADA'){
    return 'status-cancelada';
  } else if (status === 'AUTORIZADA'){
    return 'status-autorizada';
  }
  return '';
};
// -----------------------------------------------------------
</script>

<style>
.title-wrap {
  white-space: normal; 
  word-wrap: break-word; 
  overflow-wrap: break-word;
}

/* Estilo de link */
.detailLink {
  text-decoration: underline;
  color: #2B3A8A;
  cursor: pointer;
}

/* Botao de voltar */
.navigate-back:hover {
  cursor: pointer;
}

.navigate-back {
  display: flex;
  align-items: center;
}

/* Estilos para status da folha */
.status-gerada {
  font-weight: bold;
  background-color: orange;
  border-radius: 15px;
  padding: 5px;
}

.status-paga {
  color: white;
  font-weight: bold;
  background-color: green;
  border-radius: 15px;
  padding: 5px;
}

.status-cancelada{
  color: white;
  background-color: #AE1212;
  border-radius: 15px;
  font-weight: bold;
  padding: 5px;
}

.status-autorizada {
  color: white;
  font-weight: bold;
  background-color: #2B3A8A;
  border-radius: 15px;
  padding: 5px;
}
</style>