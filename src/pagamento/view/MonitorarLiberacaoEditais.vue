<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
  <div v-if="isLoading" :loading="isLoading">
        <v-row>
          <v-col cols="3">
            <v-skeleton-loader type="text" class="skeleton-loader" />
            <v-skeleton-loader type="text" class="skeleton-loader" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-skeleton-loader type="text" class="skeleton-loader" />
            <v-skeleton-loader type="text" class="skeleton-loader" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-skeleton-loader type="table" class="skeleton-loader" />
          </v-col>
        </v-row>

        <v-row justify="end">
          <v-col cols="1">
            <v-skeleton-loader type="button" class="skeleton-loader" />
          </v-col>
        </v-row>
  </div>

  <div v-else>
    <div class="mb-2 mt-0">
      <p><b>{{ subtituloDaPagina }}</b></p>
      <p v-if="!previaLiberada">{{ mensagemPrevia }}</p>
      <p v-else><a class="detailLink" @click="visualizarPrevia">{{ mensagemPrevia }}</a></p>
    </div>
    
    <div>
      <p><b>Histórico de geração das folhas de {{ previaLiberada ? mesAnterior : mesAtual }}</b></p>
      <p v-if="historicoFolhas?.length == 0">
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

    <div v-if="Object.keys(mesesMonitorar).length > 0" v-for="(mesesLiberarEdital, mes) in mesesMonitorar" :key="mes">
      <v-container class="mt-8 px-0">
        <v-row wrap no-gutters>
          <v-col cols="1" class="text-center text-h6 mt-1 mr-4">
            <v-label><b> {{ mes }} </b></v-label>
          </v-col>
          <v-col cols="15" class="text-center">
            <v-divider class="mt-3" :thickness="3" color="warning"/>
          </v-col>
        </v-row>
      </v-container>

      <v-data-table
        class="border rounded-md"
        :headers="headers"
        :items="mesesLiberarEdital"
      >

        <template v-slot:item.areaTecnica="{item}">
          <td>
            <a class="detailLink" @click="visualizarLiberacaoArea(item)">{{ item.areaTecnica }}</a>
          </td>
        </template>

        <template v-slot:item.editaisNaoLiberados="{item}" >
          <td :class="totalPorMes[mes].editaisNaoLiberados > 0 ? 'redColor' : ''">
            <b>{{ item.editaisNaoLiberados }}</b>
          </td>
        </template>

        <template v-slot:item.valorAPagar="{item}">
          <b>{{ item.valorAPagar.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) }}</b>
        </template>  

        <template v-slot:item.actions="{ item }">
          <v-icon class="mdi mdi-eye me-2" color="primary" size="small" @click="visualizarLiberacaoArea(item)"/>
        </template>

        <template v-slot:body.append>
          <tr class="text-body-1">
            <td><b>Total previsto da competência</b></td>
            <td :class="totalPorMes[mes].editaisNaoLiberados > 0 ? 'red-color' : ''"><b>{{totalPorMes[mes].editaisNaoLiberados}}</b></td>
            <td><b>{{totalPorMes[mes].bolsasAPagar}}</b></td>
            <td><b>{{totalPorMes[mes].valorAPagar.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}}</b></td>
          </tr>
        </template>

        <template v-slot:no-data>
          <v-label>Não há dados para serem exibidos!</v-label>
        </template>
        <template #bottom></template>
      </v-data-table>
    </div>
    <div v-if="Object.keys(mesesMonitorar).length > 0">
      <v-row class="mt-8 mr-4">
          <v-spacer></v-spacer>
          <p>Total a ser incluso na folha: <b>{{ valorTotalFolha.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}}</b></p> 
      </v-row>
      <v-row class="mt-8">
          <v-spacer></v-spacer>
          <v-btn color="primary" class="ma-2" @click="irParaGerarFolha" :disabled="bloquearGeracao || valorTotalFolha == 0" data-test="buttonGerarFolha">Prosseguir para geração</v-btn>
      </v-row>
    </div>
    <div v-else>
      <v-col cols="12" class="d-flex justify-center mt-8">
        Sem editais liberados.
      </v-col>
    </div>
  </div>
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
        <v-btn color="black" text @click="closeDialogDetail" data-test="buttonFecharDialog">Fechar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script async setup lang="ts">
// IMPORTACOES
// Componentes
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';

// Vue
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

// Logger
import log from '@/logger';

// Controladores
import LiberarEditaisPagamentoController from '../controller/LiberarEditaisController';

// Dayjs
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/pt-br';
dayjs.extend(utc);
dayjs.locale('pt-br');

// Store
import { useMonitorarLiberacaoAreasStore } from '../controller/store/MonitorarLiberacaoAreasStore';

// Tipagem
import type { IPlanoMensal } from '../model/PlanoMensal';

export type EditalPagamento = {
  notReleased?: boolean
  approved?: boolean
  reason?: string
}

// Headers - tabela
const headers = [
  { key: 'areaTecnica', title: 'Área técnica', align: 'start' },
  { key: 'editaisNaoLiberados', title: 'Editais não liberados' },
  { key: 'bolsasAPagar', title: 'Bolsas a pagar' },
  { key: 'valorAPagar', title: 'Valor a pagar' },
  { key: 'actions', title: 'Ações', sortable: false }
];

// Declaracoes relacionadas a rotas
const router = useRouter();

// Declaracoes breadcrumbs
const page = ref({ title: 'Monitorar liberação das áreas' });
const breadcrumbs = ref([
  { text: 'Pagamento', disabled: true, href: '#' },
  { text: 'Gerenciar Folhas de Pagamento', disabled: false, href: '#' }
]);

// Declaracoes de lista
const meses = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];

// Declaracoes string
const mesAtual = ref('');
const proximoMes = ref('');
const mesAnterior = ref('');

const isLoading = ref(false);

// FUNCOES
// Funcao para carregar a tela ----------------
onMounted(async () => {
  await refresh();
});

async function refresh() {
  await getPosts();
  await historyFolha();
  await definePlanoMensalAtual();
}
// ---------------------------------------

// Funcoes para redirecionamento -------------
function irParaGerarFolha() {
  router.push('/pagamento/GerarFolha')
};
// -----------------------------------------

const controladorMonitorar = new MonitorarLiberacaoAreasController();
const getPosts = async () => {
  try {
    isLoading.value = true;
    useMonitorarLiberacaoAreasStore.items = await controladorMonitorar.fetchAllMonitorarEditais();
    carregarItems();
    isLoading.value = false;
  } catch (error) {
    log.error('Error fetching:', error);
  }
};

const mesesNoCaps = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

function limparDicionarioMesesMonitorar() {
  Object.keys(mesesMonitorar).forEach(key => {
    delete mesesMonitorar[key];
  });
}

const mesesMonitorar = reactive<{[key: string]: { areaTecnica: string, editaisNaoLiberados: number, bolsasAPagar: number, valorAPagar: number}[]}>({});
function carregarItems() {
  limparDicionarioMesesMonitorar();
  useMonitorarLiberacaoAreasStore.items.forEach(item => {
    const mesItem = item.mes;
    const listaAreas: IAreaDetalheLiberacaoPorAreaTecnica[] = [];
    Object.keys(item.detalhesPorAreaTecnica).forEach(area => {
      listaAreas.push(item.detalhesPorAreaTecnica[area])
      somarTotalMes(item.detalhesPorAreaTecnica[area], mesItem)
    })
    mesesMonitorar[mesItem] = listaAreas;
  });
  somaTotalFolha();
}

const totalPorMes = reactive<{[key: string]: {editaisNaoLiberados: number, bolsasAPagar: number, valorAPagar: number}}>({});
function somarTotalMes(item: IAreaDetalheLiberacaoPorAreaTecnica, mesItem: string) {
  if (totalPorMes[mesItem]) {
    totalPorMes[mesItem].editaisNaoLiberados += item.editaisNaoLiberados;
    totalPorMes[mesItem].bolsasAPagar += item.bolsasAPagar;
    totalPorMes[mesItem].valorAPagar += item.valorAPagar;
  } else {
    totalPorMes[mesItem] = {
      editaisNaoLiberados: item.editaisNaoLiberados,
      bolsasAPagar:  item.bolsasAPagar,
      valorAPagar:  item.valorAPagar
    }
  }
}

const valorTotalFolha = ref(0);
function somaTotalFolha() {
  Object.keys(totalPorMes).forEach(chave => {
    valorTotalFolha.value += totalPorMes[chave].valorAPagar;
  });
}

const planoMensalAtual = ref<IPlanoMensal>()
import PlanoMensalController from '../controller/PlanoMensalController';
const PlanoMensalControllerObject = new PlanoMensalController();
async function definePlanoMensalAtual() {
  planoMensalAtual.value = await PlanoMensalControllerObject.fetchAtual();
  
  if (planoMensalAtual.value){
    mesAtual.value = mesesNoCaps[new Date(planoMensalAtual.value.Mes).getUTCMonth()];
    proximoMes.value = mesesNoCaps[(new Date(planoMensalAtual.value.Mes).getUTCMonth())%11];
    mesAnterior.value = mesesNoCaps[new Date(planoMensalAtual.value.Mes).getUTCMonth()-1];
    definePlanoMensalAnterior(planoMensalAtual.value.Mes);
    definePlanoMensalPosterior(planoMensalAtual.value.Mes);
  }
}

const planoMensalAnterior = ref<IPlanoMensal>()
async function definePlanoMensalAnterior(mes: string | number) {
  planoMensalAnterior.value = await PlanoMensalControllerObject.fetchAnterior(mes);
}
const planoMensalPosterior = ref<IPlanoMensal>()
async function definePlanoMensalPosterior(mes: string | number) {
  planoMensalPosterior.value = await PlanoMensalControllerObject.fetchPosterior(mes);
}

const previaLiberada = ref(false);
const mensagemPrevia = computed(() => {
  if (!planoMensalAtual.value) return '';

  const dataAtual = dayjs().subtract(0, 'day').utc();
  const marcoGeracaoFolhaAtual = dayjs(planoMensalAtual.value.MarcoGeracaoFolha.split('T')[0]).utc();
  const marcoSolicitacaoAtual = dayjs(planoMensalAtual.value.MarcoSolicitacaoBolsa.split('T')[0]).utc();
  if (dataAtual.isAfter(marcoGeracaoFolhaAtual)) {
    if (planoMensalPosterior.value) return `Prévia da Folha Normal de ${proximoMes.value}  disponível a partir de ${dayjs(planoMensalPosterior.value?.MarcoSolicitacaoBolsa).utc().add(1, 'day').format('DD/MM/YYYY')}.`;
    return `Calendário do próximo mês ainda não está definido!`
  }
  
  if (dataAtual.isBefore(marcoSolicitacaoAtual.add(1, 'day'))) {
    return `Prévia da Folha Normal de ${mesAtual.value}  disponível a partir de ${dayjs(planoMensalAtual.value?.MarcoSolicitacaoBolsa).utc().add(1, 'day').format('DD/MM/YYYY')}.`;
  }
  
  if (dataAtual.isAfter(marcoSolicitacaoAtual.add(1, 'day'))) {
    previaLiberada.value = true;
    return `Visualizar Prévia da Folha Normal de ${mesAtual.value}.`
  }
});

import FolhaController from '../controller/FolhaController';
import type { IFolha } from '../model/Folha';
import type { IDecisaoFolha } from '../model/DecisaoFolhas';
import type { IAreaDetalheLiberacaoPorAreaTecnica } from '../model/AreaDetalheLiberacaoPorAreaTecnica';
import MonitorarLiberacaoAreasController from '../controller/MonitorarLiberacaoAreasController';
const controladorFolha = new FolhaController();
const historicoFolhas = ref<IFolha[]>([]);
const bloquearGeracao = ref(false);
async function historyFolha() {
  historicoFolhas.value = await controladorFolha.historyFolha();
}

const subtituloDaPagina = computed(() => {
  if (Object.keys(mesesMonitorar).length <= 0) return '';
  bloquearGeracao.value = false;
  if (!historicoFolhas.value || historicoFolhas.value.length === 0) {
    return `Folha Normal de ${mesAtual.value} será gerada.`;
  }

  if (historicoFolhas.value[historicoFolhas.value.length-1].Status == "GERADA") {
    bloquearGeracao.value = true;
    return `Aguardando decisão sobre autorização da Folha 
    ${historicoFolhas.value[historicoFolhas.value.length-1].Titulo.split("-")[1].charAt(0).toUpperCase() + 
    historicoFolhas.value[historicoFolhas.value.length-1].Titulo.split("-")[1].slice(1).toLowerCase()} 
    ${historicoFolhas.value[historicoFolhas.value.length-1].Titulo.split("-")[1] == "COMPLEMENTAR" ?  
    historicoFolhas.value[historicoFolhas.value.length-1].Titulo.split("-")[2] : ""} de ${mesAtual.value}. Não é permitido gerar nova folha!`
  }

  if (historicoFolhas.value[historicoFolhas.value.length-1].Status == "CANCELADA") {
    return `Folha ${historicoFolhas.value[historicoFolhas.value.length-1].Titulo.split("-")[1].charAt(0).toUpperCase() + 
    historicoFolhas.value[historicoFolhas.value.length-1].Titulo.split("-")[1].slice(1).toLowerCase()} 
    ${historicoFolhas.value[historicoFolhas.value.length-1].Titulo.split("-")[1] == "COMPLEMENTAR" ?  
    historicoFolhas.value[historicoFolhas.value.length-1].Titulo.split("-")[2] : ""} de ${mesAtual.value} será gerada novamente.`
  }
  return `Folha Complementar ${historicoFolhas.value.length} de ${mesAtual.value} será gerada.`
});

function statusPorAcao(acao: string) {
  if (acao == "GERAR") return "gerada";
  if (acao == "CANCELAR") return "cancelada";
  if (acao == "REJEITAR") return "rejeitada";
  if (acao == "AUTORIZAR") return "autorizada";
  return " "
}

function visualizarLiberacaoArea(item: { AreaTecnica: string, areaTecnicaId: string, EditaisNaoLiberados: number, BolsasAPagar: number, ValorAPagar: number}) {
  router.push(`/pagamento/VisualizarLiberacaoEditais/${item.areaTecnicaId}`)
}

function visualizarPrevia() {
  router.push(`/pagamento/PreviaFolha`)
}

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

const showDialogDetail = ref(false);
const closeDialogDetail = () => {
    showDialogDetail.value = false;
};
</script>

<style scoped>
.red-color {
  color: #AE1212;
}

.detailLink {
  text-decoration: underline;
  color: #2B3A8A;
  cursor: pointer;
}
</style>