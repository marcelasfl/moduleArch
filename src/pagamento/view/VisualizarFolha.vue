<template>
    <div class="navigate-back mb-4" @click="goBackToListFolhas">
      <v-icon>mdi-chevron-left</v-icon>
      <a>Voltar para listagem</a>
    </div>
  

    <div class="mb-2 mt-0">
      <v-skeleton-loader type="text" class="mx-0 my-0 skeleton-loader" v-if="isLoading" :loading="isLoading"/>
      <h2 v-if="!isLoading" class="mb-6">Exibindo Folha {{ folha ? folha?.Titulo.split('-')[1].charAt(0).toUpperCase() + folha?.Titulo.split("-")[1].slice(1).toLowerCase() : '' }} 
        {{ folha?.Ordem && folha?.Ordem > 0 ? folha?.Titulo.split('-')[2] : '' }} de 
        {{ mesesNoCaps[parseInt(dayjs(folha?.PlanoMensal.Mes).utc().format('MM'))-1] }}</h2>

      <div v-if="folha?.Status === 'AUTORIZADA'" class="warn-dias-restantes">
        <p>
          <v-icon class="mdi mdi-alert me-2" color="black" size="small"/>
          <b>Faltam {{ diasParaData(dayjs(folha?.DataPagamento)) }} dias para atingir a data de pagamento</b></p>
        <p>Solicite os recursos ao Bandes para que não ocorra atrasos no pagamento</p>
      </div>
      <v-skeleton-loader type="text" class="mx-0 my-0 skeleton-loader" v-if="isLoading" :loading="isLoading"/>
      <p v-if="!isLoading" class="mb-4"><b>MÊS COMPETÊNCIA: </b> {{ dayjs(folha?.PlanoMensal.Mes).utc().format("MM/YYYY") }}</p>
      <p v-if="!isLoading" class="mb-4"><b>DATA DE GERAÇÃO: </b> {{ dayjs(folha?.DateCreated).utc().format("DD/MM/YYYY") }}</p>
      <p v-if="!isLoading" class="mb-4"><b>STATUS DA FOLHA: </b> <span :class="getStatusClass(folha?.Status)"> {{ folha?.Status }} </span></p>
    </div>

    <div class="mb-6">
      <v-skeleton-loader type="text" class="mx-0 my-0 skeleton-loader" v-if="isLoading" :loading="isLoading"/>
      <p v-if="!isLoading"><b>Histórico de geração das folhas de {{ mesAtual }}</b></p>
      <p v-if="historicoFolhas?.length == 0 && !isLoading">
        Nenhuma folha gerada até o momento.
      </p>
      <div v-else>
        <div v-for="folha in historicoFolhas">
          <v-skeleton-loader type="text" class="mx-0 my-0 skeleton-loader" v-if="isLoading" :loading="isLoading"/>
          <p v-if="!isLoading" v-for="decisao in folha.DecisaoFolhas">
            Folha {{ folha.Titulo.split("-")[1].charAt(0).toUpperCase() + folha.Titulo.split("-")[1].slice(1).toLowerCase() }} 
          {{ folha.Titulo.split("-")[1] == "COMPLEMENTAR" ?  folha.Titulo.split("-")[2] : "" }} de 
          {{ mesAtual }} {{ statusPorAcao(decisao.TipoAcaoFolha) }} em 
          {{ dayjs(decisao.Horario).utc().format("DD/MM/YYYY") }}. <span class="detailLink" v-if="decisao.TipoAcaoFolha == 'CANCELAR' || decisao.TipoAcaoFolha == 'REJEITAR'" @click="openDialogDetail(folha, decisao)">Ver Detalhes</span>
          </p>
        </div>
      </div>
    </div>
    
    <div v-if="folha?.Status !== 'CANCELADA' && folha?.Status !== 'REJEITADA'">
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
            <template v-slot:item.areaTecnica="{ item }">
              <td>
                  <a class="folha-btn" @click="goDetalhesArea(item.areaTecnica)">{{ item.areaTecnica }}</a>
              </td>
            </template>

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
          <v-btn type="submit" variant="text" style="color:#AE1212" flat @click="openDialogCancel">
              Cancelar Folha
          </v-btn>
          <v-btn type="submit" color="primary" flat>
              Exportar Folha
          </v-btn>
        </v-col>

        <v-col cols="12" class="d-flex justify-end mt-4" v-if="folha?.Status == 'AUTORIZADA'">
          <v-btn type="submit" color="primary" flat @click="monitorarRemessas">
              Monitorar remessas
          </v-btn>
        </v-col>  
    </div>

    <v-dialog v-model="showDialogCancel" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="text-h6"><strong>Deseja cancelar a folha?</strong> </span>
      </v-card-title>
      <v-card-text>
        <p>Ao confirmar o cancelamento da folha, saiba que:</p><br>
        <p class="ml-4">
          <ul>
            <li>Todos os pagamentos incluídos nessa folha voltarão ao status "Alocado".</li>
            <li>Os pagamentos só serão efetivados caso uma nova geração de folha seja executada.</li>
            <li>Essa ação é <b>irreversível</b>.</li>
          </ul>
        </p>
        <br>
        <p>Para cancelar a folha, é necessária uma justificativa.</p>
        <br>
        <label>Justificativa *</label>
        <v-text-field placeholder="Digite aqui a justificativa" variant="outlined" v-model="form.justificativa" data-test="inputJustificativa"></v-text-field>        <p>Deseja continuar e cancelar a folha?</p>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn style="color:black" text @click="closeDialogCancel">Não</v-btn>
        <v-btn variant="flat" style="background-color: #AE1212; color:white" dark @click="cancelarFolha">sim, cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>


    <v-dialog v-model="showDialogDetail" max-width="500px">
    <v-card>
      <v-card-title class="title-wrap">
        <span class="text-h6"><strong>A Folha {{ tipoFolha }} de {{ mesAtual }} foi {{ statusFolha }} para <br> pagamento em {{ dataAcaoFolha }}.</strong> </span>
      </v-card-title>
      <v-card-text><p class="mb-2">Folha {{tipoFolha}} de {{ mesAtual }} gerada em {{ dayjs(dataGeradaAnterior).utc().format('DD/MM/YYYY') }}, porém foi {{ statusFolha }} para pagamento pela <b v-if= "statusFolha == 'cancelada'">GEPOF</b> <b v-else>DIRAF</b> conforme abaixo:</p><br>
        
        <p>Justificativa da recusa de pagamento</p>
        <v-text-field
          v-model="justificativaFolha"
          disabled="true"
          data-test="inputJustificativaFolha"
        >
        </v-text-field>
        
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="black" text @click="closeDialogDetail">Fechar</v-btn>
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
import { onMounted, reactive, ref } from 'vue';
import dayjs, { Dayjs } from "dayjs";
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/pt-br';
dayjs.extend(utc);
dayjs.locale('pt-br');

const isLoading = ref(false);

const mesAtual = ref('')
const page = ref({ title: `` });

const showDialogDetail = ref(false);
const closeDialogDetail = () => {
    showDialogDetail.value = false;
};

const showDialogCancel = ref(false);
const closeDialogCancel = () => {
    showDialogCancel.value = false;
}

const headers = [
    { key: 'areaTecnica', title: 'Área técnica', align: 'start' },
    { key: 'editaisInclusos', title: 'Editais inclusos' },
    { key: 'quantidadeBolsas', title: 'Quantidade de bolsas' },
    { key: 'valorAPagar', title: 'Valor a pagar' },
    { key: 'actions', title: 'Ações', sortable: false }
];

const route = useRoute();
const params = route.params;
onMounted(async()=>{
  isLoading.value = true;
  if (params.gerado) snackbarSuccess();
  await definePlanoMensalAtual();
  await historyFolha();
  await getFolhaInformations();
  await getFolhaTabela();
  await somaEditais()
  page.value.title = `Exibindo folha normal de ${mesAtual.value}`;
  isLoading.value = false;
})

const planoMensalAtual = ref<IPlanoMensal>()
import PlanoMensalController from '../controller/PlanoMensalController';
import type { IPlanoMensal } from '../model/PlanoMensal';
const PlanoMensalControllerObject = new PlanoMensalController();
const mesesNoCaps = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
async function definePlanoMensalAtual() {
  planoMensalAtual.value = await PlanoMensalControllerObject.fetchAtual();
  if (planoMensalAtual.value) mesAtual.value = mesesNoCaps[new Date(planoMensalAtual.value.Mes).getUTCMonth()];
}

const router = useRouter();
function goBackToListFolhas() {
  router.push('/pagamento/ListarFolha')
}

const goDetalhesArea = (areaTecnica: string) => {
    router.push(`/pagamento/VisualizarDetalhesArea/${areaTecnica}`);
};

import FolhaController from '../controller/FolhaController';
import type { IFolha } from '../model/Folha';
import { useRoute, useRouter } from 'vue-router';
import log from '@/logger';
import type { IFolhaResumo } from '../model/FolhaResumo';
import type { IDecisaoFolha } from '../model/DecisaoFolhas';
import AreaTecnica from '@/services/requires/objects/importaredital/AreaTecnica';
const controladorFolha = new FolhaController();

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

function idFolha(): string {
  if (Array.isArray(params.id)) {
    return params.id[0];
  }
  return params.id;
}

const folha = ref<IFolha>()
async function getFolhaInformations() {
  folha.value = await controladorFolha.getFolhaById(idFolha());
}

const folhaTabela = ref<IFolhaResumo[]>([])
async function getFolhaTabela() {
  if(folha.value){
    folhaTabela.value = await controladorFolha.fetchFolhaResume(folha.value?.Ordem, folha.value?.PlanoMensal.Id);
  }
}

const totalEditaisInclusos = ref(0);
const totalQtdBolsas = ref(0);
const totalValorBolsas = ref(0);
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

async function openDialogCancel() {
  showDialogCancel.value = true;
};

const tipoFolha = ref();
const dataAcaoFolha = ref();
const statusFolha = ref();
const justificativaFolha = ref();
const dataGeradaAnterior = ref();
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

const historicoFolhas = ref<IFolha[]>([]);
async function historyFolha() {
  historicoFolhas.value = await controladorFolha.historyFolha();
}

const snackbar = ref(false);
const snackbarText = ref('');
const snackbarTimeout = ref(3000);
const snackbarColor = ref('success');
function snackbarSuccess() {
  snackbarText.value = `Folha gerada com sucesso.`;
  snackbarColor.value = 'success';
  snackbar.value = true;
}

function diasParaData(dataPgto: Dayjs): number {
  const dataAtual = dayjs();
  return dataPgto.diff(dataAtual, "day"); 
}


function snackbarSemJustificativa() {
  snackbarText.value = `Insira uma justificativa.`;
  snackbarColor.value = 'error';
  snackbar.value = true;
}

function statusPorAcao(acao: string) {
  if (acao == "GERAR") return "gerada";
  if (acao == "CANCELAR") return "cancelada";
  if (acao == "REJEITAR") return "rejeitada";
  if (acao == "AUTORIZAR") return "autorizada";
  return " "
}

const form = reactive({
  folhaId: idFolha(),
  justificativa: ''
});

async function cancelarFolha() {
  if (form.justificativa == '') {
    snackbarSemJustificativa();
    return
  }
  try {
    await controladorFolha.cancelFolha(form);
    router.push('/pagamento/ListarFolha/1');
  } catch (error) {
    log.error(error);
  }
}

function monitorarRemessas() {
  router.push(`/pagamento/MonitorarRemessasPagamento/${idFolha()}`);
}
</script>

<style>

.folha-btn {
    text-decoration: underline;
  color: #2B3A8A;
  cursor: pointer;
}

.title-wrap {
  white-space: normal; 
  word-wrap: break-word; 
  overflow-wrap: break-word;
}

.detailLink {
  text-decoration: underline;
  color: #2B3A8A;
  cursor: pointer;
}

.navigate-back:hover {
  cursor: pointer;
}

.navigate-back {
  display: flex;
  align-items: center;
  cursor: pointer;
}

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

.status-autorizada {
  color: white;
  font-weight: bold;
  background-color: #2B3A8A;
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

.warn-dias-restantes{
  background-color: #FDC32E;
  padding: 15px;
  padding-left: 20px;
  margin-bottom: 20px;

}
</style>