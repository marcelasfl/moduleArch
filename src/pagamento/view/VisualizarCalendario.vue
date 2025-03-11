<!-- Finalizado -->

<template> 
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
    <v-form ref="form">
    <v-row>
        <v-col cols="3">
            <v-select v-model="ano" :items="anos" label="Visualizar Calendário" clearable data-test="selectAno"></v-select>
        </v-col>
        <v-col cols="3" class="d-flex align-start">
            <v-btn class="custom-width text-none" color="primary" variant="flat" dark @click="filterByYear">Buscar</v-btn>
        </v-col>
    </v-row>

    <div v-if="planosMensais?.length <= 0 && !isLoading" class="no-calendar">
        <div>
            <v-icon size="100" color="grey">
                mdi-email-open
            </v-icon>
        </div>      
        <b>Calendário indisponível</b>
        <div class="no-calendar-text">
            O calendário da folha de {{ ano }} ainda não foi criado. <br> 
            Deseja criá-lo agora?
        </div>
        <v-btn class="custom-width-2 text-none" color="primary" variant="flat" dark @click="createNewCalendar">Criar Calendário</v-btn>
    </div>

    <v-skeleton-loader v-if="isLoading" type="table" :loading="isLoading" class="mx-auto my-8 skeleton-loader">
        <v-row>
            <v-col cols="12">
                <v-skeleton-loader type="table" class="skeleton-loader" />
            </v-col>
        </v-row>
      </v-skeleton-loader>
    <v-data-table v-if="planosMensais?.length > 0 && !isLoading" :headers="header" :items="planosMensais" :items-per-page="12" >
        <template v-slot:item.Mes="{ item }">
            <div>{{ meses[new Date(item.Mes).getUTCMonth()] }}</div>
        </template>
        <template v-slot:item.MarcoSolicitacaoBolsa="{ item }">
            <div class="input-container">
                <v-text-field type="date" class="inputDate mt-6 mb-2" v-model="item.MarcoSolicitacaoBolsa" :min="dayjs().format('YYYY-MM-DD')"
                    :rules="[
                        (v: string) => { return dateOnThisAndPrevMonth(Number(dayjs(v).utc().format('MM')), Number(dayjs(item.Mes).utc().format('MM'))) },
                        (v: string) => { return correctOrderDate(v, item.MarcoGeracaoFolha, 'O marco M1 deve ocorrer antes do marco M2!') }
                    ]"
                    validate-on="blur"
                    @blur="validaTudo"
                    :disabled="!canEditM1(item.MarcoSolicitacaoBolsa.split('T')[0])"
                    data-test="inputMarcoSolicitacaoBolsa"
                />
                <template v-if="isDifferenceLessThanThreeDays(item.MarcoSolicitacaoBolsa, item.MarcoGeracaoFolha) || isDifferenceLessThanThreeDays(item.MarcoSolicitacaoBolsa, item.MarcoPagamento)">
                    <v-tooltip location="top" class="custom-tooltip" text="É recomendado haver uma distância mínima de 3 dias entre os marcos.">
                        <template v-slot:activator="{ props }">
                            <v-icon 
                            v-bind="props"
                            color="orange" 
                            class="icon-adjustment icon-alert"
                        >
                            mdi-alert
                        </v-icon>
                        </template>
                    </v-tooltip>
                </template>
            </div>
        </template>
        <template v-slot:item.MarcoGeracaoFolha="{ item }">
            <div class="input-container">
                <v-text-field type="date" class="inputDate mt-6 mb-2" v-model="item.MarcoGeracaoFolha" :min="dayjs().add(1, 'day').format('YYYY-MM-DD')"
                    :rules="[
                        (v: string) => { return dateOnMonth(Number(dayjs(v).utc().format('MM')), Number(dayjs(item.Mes).utc().format('MM'))) },
                        (v: string) => { return correctOrderDate(v, item.MarcoPagamento, 'O marco M2 deve ocorrer antes do marco M3!') },
                        (v: string) => { return correctOrderDate(item.MarcoSolicitacaoBolsa, v, 'O marco M2 deve ocorrer depois do marco M1!') }
                    ]"
                    validate-on="blur"
                    @blur="validaTudo"
                    :disabled="!canEditM2(item.MarcoGeracaoFolha.split('T')[0])"
                    data-test="inputMarcoGeracaoFolha"
                />
                <template v-if="isDifferenceLessThanThreeDays(item.MarcoGeracaoFolha, item.MarcoSolicitacaoBolsa) || isDifferenceLessThanThreeDays(item.MarcoGeracaoFolha, item.MarcoPagamento)">
                    <v-tooltip location="top" class="custom-tooltip" text="É recomendado haver uma distância mínima de 3 dias entre os marcos.">
                        <template v-slot:activator="{ props }">
                            <v-icon 
                            v-bind="props"
                            color="orange" 
                            class="icon-adjustment icon-alert"
                        >
                            mdi-alert
                        </v-icon>
                        </template>
                    </v-tooltip>
                </template>
            </div>
                <!-- as rules vao chamar as funcoes que estao definidas do final do codigo da pagina  -->
        </template>
        <template v-slot:item.MarcoPagamento="{ item }">
            <div class="input-container">
                <v-text-field type="date" class="inputDate mt-6 mb-2" v-model="item.MarcoPagamento"
                    :rules="[
                        (v: string) => { return dateOnThisAndNextMonth(Number(dayjs(v).utc().format('MM')), Number(dayjs(item.Mes).utc().format('MM'))) },
                        (v: string) => { return correctOrderDate(item.MarcoGeracaoFolha, v, 'O marco M3 deve ocorrer depois do marco M2!') }
                    ]"
                    validate-on="blur"
                    @blur="validaTudo"
                    :disabled="item.Folhas.length > 0"
                    data-test="inputMarcoPagamento"
                />
                <template v-if="isDifferenceLessThanThreeDays(item.MarcoPagamento, item.MarcoSolicitacaoBolsa) || isDifferenceLessThanThreeDays(item.MarcoPagamento, item.MarcoGeracaoFolha,)">
                    <v-tooltip location="top" class="custom-tooltip" text="É recomendado haver uma distância mínima de 5 dias entre os marcos.">
                        <template v-slot:activator="{ props }">
                            <v-icon 
                            v-bind="props"
                            color="orange" 
                            class="icon-adjustment icon-alert"
                        >
                            mdi-alert
                        </v-icon>
                        </template>
                    </v-tooltip>
                </template>
            </div>
        </template>
        <template #bottom></template> <!-- Remove o footer/linha de paginacao -->
    </v-data-table>

    <v-row class="justify-end">
        <v-col cols="3" class="d-flex justify-end">
            <v-btn v-if="planosMensais && ano >= anoAtual && planosMensais?.length > 0"
                class="custom-width-2 text-none" color="primary" variant="flat" dark @click="updateCalendar">Salvar Calendário</v-btn>
        </v-col>
    </v-row>
</v-form>
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
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { ref, onMounted } from 'vue';
import log from '@/logger'
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

// Defina os breadcrumbs e título da página
const page = ref({ title: 'Calendário' });
const breadcrumbs = ref([
  { text: 'Visualizar Calendário', disabled: true, href: '#' },
  { text: '', disabled: true, href: '#' }
]);
const anoAtual = dayjs().year();
const ano = ref(anoAtual);
const anos = ref([2024, 2025]);
const isLoading = ref(false);

// lista de meses
const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

// header da tabela: o title aparece como titulo e o key vai ser usado para acessar as variaveis qnd a lista de objetos
// for passada pelo mock ou backend. 
// EX: uma lista de objetos: [{"Mes": "1"}, {"mes": "2"}] - so o primeiro item vai aparecer pela key ser igual
const header = ref([
    { title: 'Mês', sortable: true, key: 'Mes' },
    { title: 'Marco Solicitação de Bolsa', sortable: false, key: 'MarcoSolicitacaoBolsa' },
    { title: 'Marco Geração da Folha', sortable: false, key: 'MarcoGeracaoFolha' },
    { title: 'Marco de Pagamento', sortable: false, key: 'MarcoPagamento' }
]);

import { usePlanoMensalStore } from '../controller/store/PlanoMensalStore'; // importacao da store de plano mensal
import type { IPlanoMensal } from '../model/PlanoMensal'; // importa a interface de plano mensal
const planosMensais = ref<IPlanoMensal[]>([]); // cria uma lista de planos mensais vazias
onMounted(async () => {
    await filterByYear(); // atualiza os valores dos items da store
    refreshPlanos(); // recebe os items da store para completar a tabela
    await historyFolha();
});

const data = ref()
import FolhaController from '../controller/FolhaController';
async function historyFolha() {
  const folhaController = new FolhaController();
  data.value = await folhaController.historyFolha();
//   console.log(data.value)
}

function refreshPlanos() {
    planosMensais.value = usePlanoMensalStore.items.map(item => ({ ...item }));
}

// Filtrar por ano
import PlanoMensalRoutes from '../model/repositories/apiRoutes/PlanoMensal'; // importa a classe das rotas do plano mensal
const PlanoMensalRoutesObject = new PlanoMensalRoutes({}); // cria um objetivo sem configs especificas
async function filterByYear() {
    // chama a funcao de filtro da store passando a string da rota completa e o ano
    isLoading.value = true;
    await usePlanoMensalStore.filter(`${PlanoMensalRoutesObject.filterByYear}${ano.value}&$expand=*`);
    refreshPlanos();
    isLoading.value = false;
}

// Faz o update do calendario
async function updateCalendar() {
    try {
        const calendar = {"calendario": planosMensais.value};
        // console.log(planosMensais)
        await usePlanoMensalStore.updateBulk(calendar);
        await filterByYear();
        refreshPlanos();
        snackbarSuccess();
    } catch (error: unknown) {
        log.error(error);
        snackbarError();
    }
}

// Cria um calendario novo pro ano
async function createNewCalendar() {
    const calendar = calendarOfYear();
    await usePlanoMensalStore.saveBulk(calendar);
    await filterByYear();
    refreshPlanos(); 
}

// Cria o objeto que no formato que a rota do back recebe
function calendarOfYear() {
    const calendar: { calendario: IPlanoMensal[], ano: number } = {"calendario": [], "ano": ano.value};
    for (let i = 1; i <= 12; i++) {
        const monthNumber = String(i).padStart(2, '0');
        const month = { 
            Id: '',
            Mes: i,
            MarcoSolicitacaoBolsa: `${ano.value}-${monthNumber}-10`, 
            MarcoGeracaoFolha: `${ano.value}-${monthNumber}-22`, 
            MarcoPagamento: `${ano.value}-${monthNumber}-27`,
            EhAtual: false
        }
        calendar["calendario"].push(month)
    }
    return calendar
}

// Snackbar
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarTimeout = ref(3000);
const snackbarColor = ref('success');

function snackbarSuccess() {
    snackbarText.value = `O calendário de ${ano.value} foi salvo.`;
    snackbarColor.value = 'success';
    snackbar.value = true;
}

function snackbarError() {
    snackbarText.value = `Corrija os campos destacados e tente novamente.`;
    snackbarColor.value = 'error';
    snackbar.value = true;
}

// ---------------------------------- VALIDACOES -----------------------------------------

// Validacoes de multiplos campos
function dateOnMonth(monthValue: number, monthItem: number) {
    if (monthValue == monthItem) {
        return true;
    }
    else return 'A data prevista para a geração da folha normal deve estar dentro do mês em questão.';
}

function dateOnThisAndNextMonth(currentMonth: number, targetMonth: number): boolean | string {
    const current = Number(currentMonth); // 11
    const target = Number(targetMonth);
    const nextMonth = target % 12 + 1;

    if (current === target || current === nextMonth) {
        return true;
    }
    return 'A data prevista para pagamento da folha normal deve estar dentro ou no próximo mês em questão.';
}

function dateOnThisAndPrevMonth(monthValue: number, monthItem: number) {
    const previousMonth = (monthItem - 1 + 12) % 12 == 0 ? 12 : (monthItem - 1 + 12) % 12;
    if (monthValue == monthItem || monthValue == previousMonth) {
        return true;
    }
    else return 'A data prevista para o fim da solicitação de bolsa deve estar dentro do mês ou anterior ao mês em questão.';
}

function correctOrderDate(d1: string, d2: string, message: string): boolean | string{
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    return date1 < date2 ? true : message;
}

// Validacoes de desabilitar o campo
function canEditM1(marco: string): boolean {
    const today = new Date();
    const [year, month, day] = marco.split('-').map(Number);
    const marcoDate = new Date(year, month - 1, day, 23, 59, 59, 999);
    return today <= marcoDate;
}

function canEditM2(marco: string): boolean {
    const today = new Date();
    const [year, month, day] = marco.split('-').map(Number);
    const marcoDate = new Date(year, month - 1, day);
    marcoDate.setDate(marcoDate.getDate() - 1);
    marcoDate.setHours(23, 59, 59, 999);
    return today <= marcoDate;
}

// Validacao de diferenca minima entre marcos
function isDifferenceLessThanThreeDays(d1: string, d2: string): boolean {
    if (!d1 || !d2) return false;
    const diff = Math.abs(dayjs(d1).diff(dayjs(d2), 'day'));
    return diff < 3;
}

const form = ref()
function validaTudo() {
    form.value.validate()
    return true
}
</script>

<style scoped>
.custom-width {
  height: 48px;
  width: 100px;
}

.custom-width-2 {
  height: 48px;
  width: auto;
  margin-top: 10px;
}

.v-tooltip {
    max-width: 75%;
    white-space: normal;
}

.input-container{
    display: flex;
    align-items: center;
}

.icon-adjustment {
    margin-left: 12px; 
    margin-top: -4px; 
}

.icon-alert {
    color: orange !important;
}

.no-calendar {
    font-size: 18px;
    text-align: center;
    padding: 50px;
    width: auto;
}

.no-calendar-text {
    font-size: 16px;
    text-align: center;
    padding: 10px;
    width: auto;
}
</style>