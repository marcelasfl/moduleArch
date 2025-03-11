<template>
    <div class="navigate-back mb-4">
        <v-icon @click="$router.go(-1)">mdi-chevron-left</v-icon>
        <a @click="$router.go(-1)">Voltar</a>
    </div>
    <h2 class="mb-2"> Visualizar prévia da Folha Normal de {{ mesAtual }}</h2>

    <p>A Folha Normal de {{ mesAtual }} poderá ser consolidada a partir de {{ dayjs(planoMensalAtual?.MarcoGeracaoFolha).utc().format("DD/MM/YYYY") }}</p>

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

    <v-row class="mt-8 mr-4">
        <v-spacer></v-spacer>
        <p>Total a ser incluso na folha: <b>{{ valorTotalFolha.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}}</b></p> 
    </v-row>
</div>
<div v-else>
    <v-col cols="12" class="d-flex justify-center mt-8">
    Sem editais liberados.
    </v-col>
</div>
</template>

<script async setup lang="ts">
// IMPORTACOES
// Componentes
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/pt-br';
dayjs.extend(utc);
dayjs.locale('pt-br');

const router = useRouter();
// Componentes
// Informacoes BreadCrumbs
const page = ref({ title: 'Monitorar liberação das áreas' });
const breadcrumbs = ref([
{ text: 'Pagamento', disabled: true, href: '#' },
{ text: 'Gerenciar Folhas de Pagamento', disabled: false, href: '#' }
]);

// Informacoes V Data Table
const headers = [
    { key: 'areaTecnica', title: 'Área técnica', align: 'start' },
    { key: 'editaisNaoLiberados', title: 'Editais não liberados' },
    { key: 'bolsasAPagar', title: 'Bolsas a pagar' },
    { key: 'valorAPagar', title: 'Valor a pagar' },
    { key: 'actions', title: 'Ações', sortable: false }
];

function irParaGerarFolha() {
router.push('/pagamento/GerarFolha')
};

import { useLiberarEditaisPagamentoStore } from '../controller/store/LiberarEditaisStore';
import log from '@/logger';
import type { ILiberarEditaisPagamento } from '../model/LiberarEditaisPagamento';
import type { IPlanoMensal } from '../model/PlanoMensal';

const meses = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];
export type EditalPagamento = {
notReleased?: boolean
approved?: boolean
reason?: string
}
const mesAtual = ref('');
const proximoMes = ref('');
const mesAnterior = ref('');

onMounted(async () => {
await getPosts();
await historyFolha();
await definePlanoMensalAtual();
});

const controladorPrevia = new VisualizarPreviaFolhaController();
const getPosts = async () => {
  try {
    useVisualizarPreviaFolhaStore.items = await controladorPrevia.fetchAllVisualizarPrevia();
    carregarItems();
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
  useVisualizarPreviaFolhaStore.items.forEach(item => {
    const mesItem = item.mes;
    const listaAreas: IAreaDetalheLiberacaoPorAreaTecnica[] = [];
    Object.keys(item.areasTecnicas).forEach(area => {
      listaAreas.push(item.areasTecnicas[area])
      somarTotalMes(item.areasTecnicas[area], mesItem)
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

function isInMonthObject(areasTecnicas: { AreaTecnica: {Nome: string, Id: string}; EditaisNaoLiberados: number; BolsasAPagar: number; ValorAPagar: number; }[], areaTecnicaItem: string) {
let existe = false;
areasTecnicas.forEach(area => {
    if (area.AreaTecnica.Nome === areaTecnicaItem) existe = true;
})
return existe;
}

function whereIsMonthObject(areasTecnicas: { AreaTecnica: {Nome: string, Id: string}; EditaisNaoLiberados: number; BolsasAPagar: number; ValorAPagar: number; }[], areaTecnicaItem: string) {
let index = -1;
for (let i = 0; i < areasTecnicas.length; i++) {
    if (areasTecnicas[i].AreaTecnica.Nome == areaTecnicaItem) index = i;
}
if (index == -1) throw new Error('Erro na construção!');
else return index;
}

const planoMensalAtual = ref<IPlanoMensal>()
import PlanoMensalController from '../controller/PlanoMensalController';
const PlanoMensalControllerObject = new PlanoMensalController();
async function definePlanoMensalAtual() {
planoMensalAtual.value = await PlanoMensalControllerObject.fetchAtual();

if (planoMensalAtual.value){
    mesAtual.value = mesesNoCaps[new Date(planoMensalAtual.value.Mes).getUTCMonth()];
    // console.log(new Date(planoMensalAtual.value.Mes).getUTCMonth())
    proximoMes.value = mesesNoCaps[(new Date(planoMensalAtual.value.Mes).getUTCMonth())%11];
    mesAnterior.value = mesesNoCaps[new Date(planoMensalAtual.value.Mes).getUTCMonth()-1];
    definePlanoMensalAnterior(planoMensalAtual.value.Mes);
    definePlanoMensalPosterior(planoMensalAtual.value.Mes);
}
}

const planoMensalAnterior = ref<IPlanoMensal>()
async function definePlanoMensalAnterior(mes: string | number) {
planoMensalAnterior.value = await PlanoMensalControllerObject.fetchAnterior(mes);
// console.log(planoMensalAnterior)
}
const planoMensalPosterior = ref<IPlanoMensal>()
async function definePlanoMensalPosterior(mes: string | number) {
planoMensalPosterior.value = await PlanoMensalControllerObject.fetchPosterior(mes);
// console.log(planoMensalPosterior)
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
import type { IAreaDetalheLiberacaoPorAreaTecnica } from '../model/AreaDetalheLiberacaoPorAreaTecnica';
import { useVisualizarPreviaFolhaStore } from '../controller/store/VisualizarPreviaFolhaStore';
import VisualizarPreviaFolhaController from '../controller/VisualizarPreviaFolhaController';
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

function visualizarLiberacaoArea(item: { AreaTecnica: {Nome: string, Id: string}, EditaisNaoLiberados: number, BolsasAPagar: number, ValorAPagar: number}) {
router.push(`/pagamento/VisualizarLiberacaoEditais/${item.AreaTecnica.Id}`)
}

function visualizarPrevia() {
// router.push(``)
}
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


.navigate-back:hover {
cursor: pointer;
}

.navigate-back {
display: flex;
align-items: center;
}
</style>