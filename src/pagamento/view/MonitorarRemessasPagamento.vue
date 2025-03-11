<template>
  <div class="navigate-back mb-4">
      <v-icon @click="$router.go(-1)">mdi-chevron-left</v-icon>
      <a @click="$router.go(-1)">Voltar</a>
  </div>
  <div class="mb-6 mt-0">
    <h2 class="mb-6">Monitorar Remessas de Pagamento</h2>
    <p class="mensagemDiasRestantes">Faltam {{ diasRestantes }} dias para atingir a data de pagamento. Solicite os recursos ao Bandes <br> para que não ocorra atrasos no pagamento.</p>
  </div>

  <div class="mt-2">
    <p class="mb-2"><b>FOLHA:</b> {{ folha?.Titulo.split('-')[1] }} DE {{ mesesCaps[folha?.Titulo.split('-')[2].split('/')[1]-1] }}</p>
    <p class="mb-2"><b>VALOR TOTAL DA FOLHA:</b> {{ folha?.ValorPrevisto.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) }}</p>
    <p class="mb-2"><b>TOTAL DE REGISTROS:</b> {{ folha?.PagamentoBolsistas.length }} {{ folha?.PagamentoBolsistas.length == 1 ? 'bolsa' : 'bolsas' }} </p>
    <p class="mb-2"><b>DATA DE GERAÇÃO:</b> {{ dayjs(folha?.DecisaoFolhas.findLast((x: DecisaoFolha) => x.TipoAcaoFolha == "GERAR").Horario).utc().format('DD/MM/YYYY')}}</p>
    <p class="mb-2"><b>DATA DE AUTORIZAÇÃO:</b> {{ dayjs(folha?.DecisaoFolhas.findLast((x: IDecisaoFolha) => x.TipoAcaoFolha == 'AUTORIZAR').Horario).utc().format('DD/MM/YYYY') }}</p>
    <p class="mb-2"><b>DATA DE PAGAMENTO:</b> {{ dayjs(folha?.DataPagamento).utc().format('DD/MM/YYYY') }}</p>
    <p class="mb-2"><b>STATUS DA FOLHA:</b> <a :class="getStatusClass(folha?.Status)">{{ statusTratado(folha?.Status) }}</a></p>
  </div>

  <div class="mt-12 no-remessa" v-if="folha?.RemessaPagamentos.length == 0">
    <div>
        <v-icon size="100" color="grey">
          mdi-email-open
        </v-icon>
      </div>
      <b>Sem remessas disponíveis</b>
      <div class="no-remessa-text">
        No momento, não há remessas disponíveis para serem <br> 
        monitoradas. Você pode criar uma nova remessa.
      </div>
      <v-btn class="custom-width-2 text-none" color="primary" variant="flat" dark @click="openDialogGerarRemessa" data-test="buttonGerarRemessa">Gerar Remessa</v-btn>
  </div>

  <div v-else class="mt-12">
    <v-data-table :headers="headers" :items="folha?.RemessaPagamentos">
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

      <template v-slot:item.DataEnvio="{ item }">
        <td v-if="item.DataEnvio">
          {{ dayjs(item.DataEnvio).format('DD/MM/YYYY') }}
        </td>
      </template>

      <template v-slot:item.DataRetorno="{ item }">
        <td v-if="item.DataRetorno">
          {{ dayjs(item.DataRetorno).format('DD/MM/YYYY') }}
        </td>
      </template>

      <template v-slot:item.Agendados="{ item }">
        <td v-if="item.Agendados">
          {{ item.Agendados }}
        </td>
        <td class="d-flex justify-center" v-else>
          -
        </td>
      </template>

      <template v-slot:item.ValorAgendado="{ item }">
        <td v-if="item.ValorAgendado">
          {{ item.ValorAgendado }}
        </td>
        <td class="d-flex justify-center" v-else>
          -
        </td>
      </template>

      <template v-slot:item.Erros="{ item }">
        <td v-if="item.Erros" class="erroRemessa">
          {{ item.Erros.length }}
        </td>
        <td class="d-flex justify-center" v-else>
          -
        </td>
      </template>

      <template v-slot:item.actions="{ item }">
          <v-icon class="mdi mdi-file-upload-outline me-2" color="primary" size="small" @click="openDialogUpload"/>
          <!-- <v-icon class="mdi mdi-download me-2" color="primary" size="small"/> -->
      </template>
      
      <template v-slot:no-data>
        <v-label>Sem dados!</v-label>
      </template>
      <template #bottom></template> 
    </v-data-table>


    <div class="mt-6 no-remessa" v-if="folha?.RemessaPagamentos[folha?.RemessaPagamentos.length-1].ArquivoRetorno == null">
      <div>
          <v-icon size="100" color="grey">
              mdi-timer-sand-empty
          </v-icon>
      </div>
      <b>Monitoramento indisponível</b>
      <div class="no-remessa-text">
          A última remessa enviada ainda não teve o retorno. O <br> 
          sistema notificará assim que houver uma atualização.
      </div>
    </div>

    <div v-if="folha?.RemessaPagamentos[folha?.RemessaPagamentos?.length-1]?.Erros?.length == 0" class="d-flex justify-center">
      <v-label v-if="folha?.RemessaPagamentos?.length-1 > 0">Todos os registros com pendências de erros foram resolvidos.</v-label>
      <v-label v-else>Remessa retornou sem erros.</v-label>
    </div>

    <div v-else>
      <h4 class="mt-4 mb-8">Erros da última remessa</h4>
      <v-data-table :headers="headersErros" :items="folha?.RemessaPagamentos[folha?.RemessaPagamentos?.length-1]?.Erros">
        <template v-slot:item.Erros="{ item }">
          <label class="errorsClassUltimaRemessa" v-for="erro in item.Erros">{{erro.Numero}}</label>
        </template>

        <template v-slot:no-data>
          <v-label>Sem dados!</v-label>
        </template>
      <template #bottom></template> 
    </v-data-table>

    <div class="d-flex justify-end mt-8">
      <v-btn class="custom-width-2 text-none" color="primary" variant="flat" dark @click="openDialogGerarRemessaComErros" data-test="buttonGerarRemessaComErros">Gerar Remessa</v-btn>
    </div>
    </div>
  </div>

  <v-dialog v-model="showDialogGerarRemessa" max-width="500px">
  <v-card>
    <v-card-title class="mt-2 ml-2">
      <span class="text-h6"><strong>Gerando nova remessa para pagamento</strong> </span>
    </v-card-title>
    <v-card-text>
      <p class="mb-6">Uma nova remessa será gerada da <b>FOLHA {{ folha?.Titulo.split('-')[1] }} DE {{ mesesCaps[folha?.Titulo.split('-')[2].split('/')[1]-1] }}</b> 
        com <b>{{ folha?.PagamentoBolsistas.length }} {{ folha?.PagamentoBolsistas.length == 1 ? 'bolsa' : 'bolsas' }}</b> no valor de 
        <b>{{ folha?.ValorPrevisto.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) }}</b> com data de pagamento para o dia de 
        <b>{{ dayjs(folha?.DataPagamento).utc().format('DD/MM/YYYY') }}.</b></p>
      <p>Deseja continuar?</p>
    </v-card-text>
    <v-card-actions class="d-flex justify-end">
      <v-btn style="color:black" text @click="closeDialogGerarRemessa" data-test="buttonCancelarGerarRemessa">Cancelar</v-btn>
      <v-btn color="primary" variant="flat" dark @click="gerarNovaRemessa" data-test="buttonConfirmarGerarRemessa">Sim, gerar remessa</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<v-dialog v-model="showDialogGerarRemessaComErros" max-width="500px">
  <v-card>
    <v-card-title class="mt-2 ml-2">
      <span class="text-h6"><strong>Gerando nova com erros de registro?</strong> </span>
    </v-card-title>
    <v-card-text>
      <p class="mb-6">Uma nova remessa da <b>FOLHA {{ folha?.Titulo.split('-')[1] }} DE {{ mesesCaps[folha?.Titulo.split('-')[2].split('/')[1]-1] }}</b> 
        com <b>{{ folha?.RemessaPagamentos[folha?.RemessaPagamentos?.length-1]?.Erros?.length }} {{ folha?.RemessaPagamentos[folha?.RemessaPagamentos?.length-1]?.Erros?.length == 1 ? 'bolsa' : 'bolsas' }}</b> no valor de 
        <b>{{ '?????' }}</b> com data de pagamento para o dia de 
        <b>{{ dayjs(folha?.DataPagamento).utc().format('DD/MM/YYYY') }}.</b></p>
      
        <p>Ao prosseguir com a geração da nova remessa, saiba que:</p>

        <ul class="ml-4 my-4">
          <li class="mb-2">
            Os registros com erros serão incluídos na nova remessa.
          </li>
          <li class="mt-2">
            Se não forem corrigidos antes do processamento, os mesmos erros
            retornarão, e você precisará gerar novas remessas para resolvê-los.
          </li>
        </ul>

        <p>Deseja continuar?</p>
    </v-card-text>
    <v-card-actions class="d-flex justify-end">
      <v-btn style="color:black" text @click="closeDialogGerarRemessaComErros" data-test="buttonCancelarGerarRemessaComErros">Cancelar</v-btn>
      <v-btn color="warning100" variant="flat" dark @click="gerarNovaRemessa" data-test="buttonConfirmarGerarRemessaComErros">Gerar nova remessa</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

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
import { useFolhaStore } from '../controller/store/FolhaStore';
import { onMounted, ref } from 'vue';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import type { IDecisaoFolha } from '../model/DecisaoFolhas';
import type DecisaoFolha from '../model/DecisaoFolhas';
dayjs.extend(utc);

const diasRestantes = ref();
const folha = ref();

// Headers - tabela
const headers = ref([
  { title: '#', sortable: false, key: 'Numero', help: "Número da remessa enviada." },
  { title: 'Data de envio', sortable: false, key: 'DataEnvio', help: "Data que a remessa foi enviada para o Banestes." },
  { title: 'Última atualização', sortable: false, key: 'DataRetorno', help: "Data e hora da atualização do status de acordo com o Banestes." },
  { title: 'Status', sortable: false, key: 'Status', help: "Estado da remessa de acordo com a atualização do Banestes." },
  { title: 'Enviados', sortable: false, key: '', help:"Quantidade de pagamentos enviados para agendamento no Banestes." },
  { title: 'Agendados', sortable: false, key: 'Agendados', help:"Quantidade de registros agendados para pagamento pelo Banestes." },
  { title: 'Valor agendado', sortable: false, key: 'ValorAgendado', help:"Soma do valor das bolsas a serem pagas pelo Banestes." },
  { title: 'Erros', sortable: false, key: 'Erros', help:"Quantidade de erros no arquivo de remessa detectados pelo Banestes." },
  { title: 'Ações', key: 'actions' }
]);

const headersErros = ref([
  { title: 'Nome', sortable: false, key: 'Nome' },
  { title: 'Matricula', sortable: false, key: 'Matricula' },
  { title: 'Erros', sortable: false, key: 'Erros' },
  // { title: 'Ações', key: 'actions' }
]);

const mesesCaps = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];

onMounted(async () => {
  refresh();
})

async function refresh() {
  await useFolhaStore.fetch();
  folha.value = useFolhaStore.items[0]
  const dataAtual = dayjs().utc();
  diasRestantes.value = dayjs(folha.value.DataPagamento).utc().diff(dataAtual, 'day') + 1;
}

const getStatusClass = (status: string) => {
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
    } else if (status === 'REJEITADA'){
        return 'status-cancelada';
    } else if (status === 'EM_AGENDAMENTO'){
        return 'status-autorizada';
    }
    return '';
};

const statusTratado = (stt: string) => {
  if (stt === 'EM_AGENDAMENTO'){
    return 'EM AGENDAMENTO ';
  } else {
    return stt;
  }
}

const showDialogGerarRemessa = ref(false)
function openDialogGerarRemessa() {
  showDialogGerarRemessa.value = true;
}
function closeDialogGerarRemessa() {
  showDialogGerarRemessa.value = false;
}

const showDialogGerarRemessaComErros = ref(false)
function openDialogGerarRemessaComErros() {
  showDialogGerarRemessaComErros.value = true;
}
function closeDialogGerarRemessaComErros() {
  showDialogGerarRemessaComErros.value = false;
}

import RemessaPagamentoController from '../controller/RemessaPagamentoController';
const remessaPagamentoController = new RemessaPagamentoController();
async function gerarNovaRemessa() {
  closeDialogGerarRemessa();
  closeDialogGerarRemessaComErros();
  openLoading();
  try {
    await remessaPagamentoController.generateRemessaPagamento(folha.value.Id);
    refresh();
  } catch (error: unknown) {
    console.log(error)
  } finally {
    closeLoading();
  }
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
const retornoRemessaController = new RetornoRemessaController();
async function submitUploadArquivo() {
  try {
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
  } catch (error: unknown) {
    console.log(error);
  } finally {
    closeDialogUpload();
    arquivoUploadDp1.value = null;
    arquivoUploadDp9.value = null;
    refresh();
  }
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

const showDialogDownload = ref(false);
function openLoading() {
  showDialogDownload.value = true;
}

function closeLoading() {
  showDialogDownload.value = false;
}

</script>
    
<style scoped>
.mensagemDiasRestantes {
  color: #B64421;
}

.navigate-back:hover {
cursor: pointer;
}

.navigate-back {
display: flex;
align-items: center;
}

.status-autorizada {
    font-weight: bold;
    background-color: orange;
    border-radius: 15px;
    padding: 5px;
}

.errorsClassUltimaRemessa {
    background-color: #E9CACA;
    color: #AE1212;
    border-radius: 50px;
    padding: 5px;
    font-weight: bold;
}

.erroRemessa{
  color: #AE1212;
  font-weight: bold;
}

.no-remessa {
    font-size: 18px;
    text-align: center;
    padding: 50px;
    width: auto;
}

.no-remessa-text {
    font-size: 16px;
    text-align: center;
    padding: 10px;
    width: auto;
}

.custom-width-2 {
  height: 48px;
  width: auto;
  margin-top: 10px;
}
</style>
