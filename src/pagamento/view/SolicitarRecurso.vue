<template>
  <div class="navigate-back mb-4">
      <v-icon @click="$router.go(-1)">mdi-chevron-left</v-icon>
      <a @click="$router.go(-1)">Voltar</a>
  </div>
  <div class="mb-6 mt-0">
    <h2 class="mb-6">Solicitar Transferência de Recursos</h2>
  </div> 

  <div class="mt-2">
    <p class="mb-2"><b>FOLHA:</b> {{ tipoFolha }} DE {{ mesFolha }}</p>
    <p class="mb-2"><b>VALOR TOTAL DA FOLHA:</b> {{ valorTotalFolha.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) }}</p>
    <p class="mb-2"><b>TOTAL DE REGISTROS:</b> {{ totalRegistrosFolha }} {{ totalRegistrosFolha == 1 ? 'bolsa' : 'bolsas' }} </p>
    <p class="mb-2"><b>DATA DE GERAÇÃO:</b> {{ dataGeracao }}</p>
    <p class="mb-2"><b>DATA DE AUTORIZAÇÃO:</b> {{ dataAutorizacao }}</p>
    <p class="mb-2"><b>DATA DE PAGAMENTO:</b> {{ dataPagamento }}</p>
    <p class="mb-2"><b>STATUS DA FOLHA:</b> <a :class="getStatusClass(statusFolha)">{{ statusFolha }}</a></p>
  </div>
  <br>

    <div class="master">
      <div class="formGuia">    
        <v-form ref="form" @submit.prevent="validarFormulario">
          <h2 class="mb-6">Guia de liberação Banestes</h2>
          <p class="mb-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur non earum ut voluptate illum aut, distinctio cupiditate assumenda voluptates, sed exercitationem dolorem reiciendis qui. Fugit eveniet molestiae vel repellendus magnam?</p>
          <p class="mb-2"><b>Valor total da guia: </b> {{ valorTotalGuia.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) }} </p>
          <p class="mb-2"><b>Total de Bolsas: </b> {{ bolsasGuia }} {{ bolsasGuia == 1 ? 'bolsa' : 'bolsas' }} </p>
          <p class="mb-2"><b>Destinatário</b></p>

          <v-text-field
            v-model="destinatario"
            placeholder="destinatario@exemplo.com"
            required
            disabled
            :error-messages="destinatarioErro ? ['Campo destinatário é obrigatório'] : []"
            data-test="inputDestinatarioEmail"
          ></v-text-field>

          <p class="mb-2"><b>N° da Guia de Liberação</b></p>
          <v-text-field
          placeholder="Ex: 058/2024"
          v-model="numeroGuiaLiberacao"
          :error-messages="numeroGuiaLiberacaoErro ? ['Número da guia é obrigatório'] : []"
          clearable
          required
          data-test="inputTextNumeroGuiaLiberacao"
          ></v-text-field>

          <p class="mb-2"><b>Data de Pagamento</b></p>
          <v-text-field
          type="Date"
          v-model="dataPagamentoGuia"
          :error-messages="dataPagamentoGuiaErro ? ['Data de pagamento é obrigatória'] : []"
          clearable
          required
          data-test="inputDateDataPagamentoGuia"
          ></v-text-field>

          <p class="mb-2"><b>Nota Patrimonial</b></p>
          <v-text-field
          placeholder="Ex: 2024NP00197"
          v-model="notaPatrimonial"
          :error-messages="notaPatrimonialErro ? ['Nota Patrimonial é obrigatória'] : []"
          clearable
          required
          data-test="inputTextNotaPatrimonial"
          ></v-text-field>

          <p class="mb-2"><b>Atividade</b></p>
          <v-select
                  placeholder="Selecione o tipo de Atividade"
                  :items="tipoAtividades"
                  item-value="value"
                  item-title="text"
                  clearable
                  required
                  v-model="atividadeGuia"
                  :error-messages="atividadeGuiaErro ? ['Ao menos uma atividade deve ser selecionada'] : []"
                  multiple
                  data-test="selectAtividade"
          ></v-select>

          <p class="mb-2"><b>Texto da Guia</b></p>
          <v-text-field class="msg-email" variant="outlined" readonly data-test="inputTextTextoGuia">
            Solicitamos a autorização de pagamento da folha de pagamento de bolsa e auxílios referente a competência {{ mesCompetencia }}/{{ anoCompetencia }} no valor de
            <b>{{ valorTotalGuia.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) }} ({{ valorGuiaExtenso }}) .</b>
            Atestamos que os pagamentos foram devidamente conferidos, conforme Encaminhamentos e Processo enviados a Gerência de Planejamento, Orçamentária e Finanças da FAPES/FUNCITEC, por meio do EDOCS.
          </v-text-field>

          <p class="mb-2"><b>Texto complementar</b></p>
          <v-textarea cleareble variant="outlined" auto-grow placeholder="Digite sua mensagem..." data-test="textAreaTextoComplementar"></v-textarea>
        
          <v-checkbox
            v-model="checkboxConfirmacao"
            label="Confirmo que concordo com os dados apresentados na Guia de Liberação e autorizo o envio e pagamento pelas instituições responsáveis"
            :rules="[(v:any) => { return v ? true : 'Você precisa confirmar os dados antes de prosseguir.'}]"
            data-test="checkboxConfirmacao"
          ></v-checkbox>
          <v-row justify="end">
          <v-col cols="auto">
            <v-btn class="custom-width-2 text-none" type="submit" @click="validarFormulario()" color="primary"  variant="flat" dark>
              Gerar Arquivo
            </v-btn>
          </v-col>
          </v-row>
        </v-form>
      </div>
    
      <div class="formGuia">
        <v-form ref="form" @submit.prevent="validarFormularioAlternativo">
          <h2 class="mb-6">Guia de liberação Bandes (Guia Alternativa)</h2>
          <p class="mb-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur non earum ut voluptate illum aut, distinctio cupiditate assumenda voluptates, sed exercitationem dolorem reiciendis qui. Fugit eveniet molestiae vel repellendus magnam?</p>
          <p class="mb-2"><b>Valor total da guia: </b> {{ valorTotalGuiaAlternativa.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) }} </p>
          <p class="mb-2"><b>Total de Bolsas: </b> {{ bolsasGuiaAlternativa }} {{ bolsasGuiaAlternativa == 1 ? 'bolsa' : 'bolsas' }} </p>
          <p class="mb-2"><b>Destinatário</b></p>

          <v-text-field
            v-model="destinatarioAlternativo"
            placeholder="destinatario@exemplo.com"
            required
            disabled
            :error-messages="destinatarioErroAlternativo ? ['Campo destinatário é obrigatório'] : []"
            data-test="inputDestinatarioAlternativoEmail"
          ></v-text-field>

          <p class="mb-2"><b>N° da Guia de Liberação *</b></p>
          <v-text-field
          placeholder="Ex: 058/2024"
          v-model="numeroGuiaLiberacaoAlter"
          :error-messages="numeroGuiaLiberacaoAlterErro ? ['Número da guia é obrigatório'] : []"
          clearable
          required
          data-test="inputTextNumeroGuiaLiberacaoAlternativa"
          ></v-text-field>

          <p class="mb-2"><b>Nota Patrimonial *</b></p>
          <v-text-field
          placeholder="Ex: 2024NP00197"
          v-model="notaPatrimonialAlter"
          :error-messages="notaPatrimonialAlterErro ? ['Nota Patrimonial é obrigatória'] : []" 
          clearable
          required
          data-test="inputTextNotaPatrimonialAlternativa"
          ></v-text-field>

          <p class="mb-2"><b>Atividade</b></p>
          <v-select
                  placeholder="Selecione o tipo de Atividade"
                  :items="tipoAtividades"
                  item-value="value"
                  item-title="text"
                  clearable
                  v-model="atividadeGuiaAlter"
                  :error-messages="atividadeGuiaAlterErro ? ['Ao menos uma atividade deve ser selecionada'] : []"
                  required
                  multiple
                  data-test="selectAtividadeAlternativa"
          ></v-select>

          <p class="mb-2"><b>Mensagem do e-mail</b></p>
          <v-text-field class="msg-email" variant="outlined" readonly data-test="inputTextMensagemEmail">
            Solicitamos a autorização de pagamento da folha de pagamento de bolsa e auxílios referente a competência {{ mesCompetencia }}/{{ anoCompetencia }} no valor de
            <b>{{ valorTotalGuiaAlternativa.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) }} ({{ valorGuiaAlternativaExtenso }}) .</b>
            Atestamos que os pagamentos foram devidamente conferidos, conforme Encaminhamentos e Processo enviados a Gerência de Planejamento, Orçamentária e Finanças da FAPES/FUNCITEC, por meio do EDOCS.
          </v-text-field>

          <p class="mb-2"><b>Mensagem complementar</b></p>
          <v-textarea cleareble variant="outlined" auto-grow placeholder="Digite sua mensagem..." data-test="textAreaMensagemComplementar"></v-textarea>
        
          <v-checkbox
            v-model="checkboxConfirmacaoAlternativo"
            label="Confirmo que concordo com os dados apresentados na Guia de Liberação e autorizo o envio e pagamento pelas instituições responsáveis"
            :rules="[(v:any) => { return v ? true : 'Você precisa confirmar os dados antes de prosseguir.'}]"
            data-test="checkboxConfirmacaoAlternativa"
          ></v-checkbox>
          <v-row justify="end">
            <v-col cols="auto">
              <v-btn class="custom-width-2 text-none" type="submit" @click="validarFormularioAlternativo()" color="primary"  variant="flat" dark>
                Gerar Arquivo
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </div>  
  </div>

</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import extenso  from 'extenso';

const mesCompetencia = ref('novembro');
const anoCompetencia = ref('2024');

const tipoFolha = ref('NORMAL');
const mesFolha = ref('SETEMBRO');
const valorTotalFolha = ref(1000000);
const valorTotalGuia = ref(996000);
const valorGuiaExtenso = extenso(valorTotalGuia.value, {mode: 'currency' });
const bolsasGuia = ref(996);

const valorTotalGuiaAlternativa = ref(4000);
const valorGuiaAlternativaExtenso = extenso(valorTotalGuiaAlternativa.value, {mode: 'currency' });
const bolsasGuiaAlternativa = ref(4);

const totalRegistrosFolha = ref(1000);
const dataGeracao = ref(dayjs('2024-09-22').format('DD/MM/YYYY'));
const dataAutorizacao = ref(dayjs('2024-09-25').format('DD/MM/YYYY'));
const dataPagamento = ref(dayjs('2024-09-30').format('DD/MM/YYYY'));
const statusFolha = ref('AGENDADA');

const openDialogEnviar = ref(false);
const closeDialogEnviar = () => {
openDialogEnviar.value = false;
};

const destinatario = ref('');
const destinatarioErro = ref(false);
const checkboxConfirmacao = ref(false);
const checkboxErro = ref(false);

const destinatarioAlternativo = ref('');
const destinatarioErroAlternativo = ref(false);
const checkboxConfirmacaoAlternativo = ref(false);
const checkboxErroAlternativo = ref(false);

const numeroGuiaLiberacao = ref('');
const numeroGuiaLiberacaoErro = ref(false);
const numeroGuiaLiberacaoAlter = ref('');
const numeroGuiaLiberacaoAlterErro = ref(false);

const dataPagamentoGuia = ref('');
const dataPagamentoGuiaErro = ref(false);

const notaPatrimonial = ref('');
const notaPatrimonialErro = ref(false);
const notaPatrimonialAlter = ref('');
const notaPatrimonialAlterErro = ref(false);

const atividadeGuia = ref(null);
const atividadeGuiaErro = ref(false);
const atividadeGuiaAlter = ref(null);
const atividadeGuiaAlterErro = ref(false);

const validarFormulario = () => {
  let erro = false;

  // Validação do destinatário
  // destinatarioErro.value = !destinatario.value;
  // if (destinatarioErro.value) erro = true;

  // Validação do número da guia
  numeroGuiaLiberacaoErro.value = !numeroGuiaLiberacao.value;
  if (numeroGuiaLiberacaoErro.value) erro = true;

  // Validação da data de pagamento
  dataPagamentoGuiaErro.value = !dataPagamentoGuia.value;
  if (dataPagamentoGuiaErro.value) erro = true;

  // Validação da nota patrimonial
  notaPatrimonialErro.value = !notaPatrimonial.value;
  if (notaPatrimonialErro.value) erro = true;

  // Validação da atividade (arrays)
  atividadeGuiaErro.value = atividadeGuia.value === null;
  if (atividadeGuiaErro.value) erro = true;

  // Validação do checkbox
  checkboxErro.value = !checkboxConfirmacao.value;
  if (checkboxErro.value) erro = true;

  if (erro) return;

  openDialogEnviar.value = true;
};

const validarFormularioAlternativo = () => {
  let erroAlternativo = false;

  // Validação do destinatário
  // destinatarioErroAlternativo.value = !destinatarioAlternativo.value;
  // if (destinatarioErroAlternativo.value) erro = true;

  // Validação do número da guia
  numeroGuiaLiberacaoAlterErro.value = !numeroGuiaLiberacaoAlter.value;
  if (numeroGuiaLiberacaoAlterErro.value) erroAlternativo = true;

  // Validação da nota patrimonial
  notaPatrimonialAlterErro.value = !notaPatrimonialAlter.value;
  if (notaPatrimonialAlterErro.value) erroAlternativo = true;

  // Validação da atividade (arrays)
  atividadeGuiaAlterErro.value = atividadeGuiaAlter.value === null;
  if (atividadeGuiaAlterErro.value) erroAlternativo = true;

  // Validação do checkbox
  checkboxErroAlternativo.value = !checkboxConfirmacaoAlternativo.value;
  if (checkboxErroAlternativo.value) erroAlternativo = true;

  if (erroAlternativo) return;

  openDialogEnviar.value = true;
};


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
    return 'status-autorizada-agendada';
  } else if (status === 'REJEITADA'){
      return 'status-cancelada';
  } else if (status === 'AGENDADA'){
      return 'status-autorizada-agendada';
  }
  return '';
};

const tipoAtividades = ref([
  { text: "Atividade 1", value: 0 },
  { text: "Atividade 2", value: 1 },
  { text: "Atividade 3", value: 2 },
  { text: "Atividade 4", value: 3 },
  { text: "Atividade 5", value: 4 },
  { text: "Atividade 6", value: 5 },
]);

</script>
<style scoped>

.status-autorizada-agendada {
  font-weight: bold;
  background-color: orange;
  border-radius: 15px;
  padding: 5px;
}

.master {
  display: flex;
  gap: 16px;
  justify-content: space-between;
}

.formGuia {
  border: 1px solid rgb(228, 228, 228);
  padding: 20px;
  border-radius: 10px;
  flex: 1;
  height: fit-content;
}

</style>