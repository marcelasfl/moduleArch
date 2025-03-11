<script setup lang="ts">
import { ref } from 'vue';
import dayjs from "dayjs";
import { anoAtual, meses } from '@/ModularArch/utils/dateUtils';
import { useValidacao } from '@/ModularArch/modules/Pagamentos/composables/Calendario/useValidacao';
import type { IPlanoMensal } from '../api/entities/Folha';

const props = defineProps<{
  ano: number,
  planosMensais: IPlanoMensal[]
}>()
const emits = defineEmits<{
  (e: 'updateCalendar'): void
}>() 

const header = ref([
  { title: 'Mês', sortable: true, key: 'Mes' },
  { title: 'Marco Solicitação de Bolsa', sortable: false, key: 'MarcoSolicitacaoBolsa' },
  { title: 'Marco Geração da Folha', sortable: false, key: 'MarcoGeracaoFolha' },
  { title: 'Marco de Pagamento', sortable: false, key: 'MarcoPagamento' }
]);
const {
    dateOnMonth,
    dateOnThisAndNextMonth,
    dateOnThisAndPrevMonth,
    correctOrderDate,
    canEditM1,
    canEditM2,
    isDifferenceLessThanThreeDays,
    validaTudo
} = useValidacao();
</script>

<template>
  <v-data-table :headers="header" :items="planosMensais" :items-per-page="12">
    <template v-slot:item.Mes="{ item }">
      <div>{{ meses[new Date(item.Mes).getUTCMonth()] }}</div>
    </template>
    <template v-slot:item.MarcoSolicitacaoBolsa="{ item }">
      <div class="input-container">
        <v-text-field type="date" class="inputDate mt-6 mb-2" v-model="item.MarcoSolicitacaoBolsa"
          :min="dayjs().format('YYYY-MM-DD')" :rules="[
            (v: string) => { return dateOnThisAndPrevMonth(Number(dayjs(v).utc().format('MM')), Number(dayjs(item.Mes).utc().format('MM'))) },
            (v: string) => { return correctOrderDate(v, item.MarcoGeracaoFolha, 'O marco M1 deve ocorrer antes do marco M2!') }
          ]" validate-on="blur" @blur="validaTudo"
          :disabled="!canEditM1(item.MarcoSolicitacaoBolsa.split('T')[0])" data-test="inputMarcoSolicitacaoBolsa" />
        <template
          v-if="isDifferenceLessThanThreeDays(item.MarcoSolicitacaoBolsa, item.MarcoGeracaoFolha) || isDifferenceLessThanThreeDays(item.MarcoSolicitacaoBolsa, item.MarcoPagamento)">
          <v-tooltip location="top" class="custom-tooltip"
            text="É recomendado haver uma distância mínima de 3 dias entre os marcos.">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" color="orange" class="icon-adjustment icon-alert">
                mdi-alert
              </v-icon>
            </template>
          </v-tooltip>
        </template>
      </div>
    </template>
    <template v-slot:item.MarcoGeracaoFolha="{ item }">
      <div class="input-container">
        <v-text-field type="date" class="inputDate mt-6 mb-2" v-model="item.MarcoGeracaoFolha"
          :min="dayjs().add(1, 'day').format('YYYY-MM-DD')" :rules="[
            (v: string) => { return dateOnMonth(Number(dayjs(v).utc().format('MM')), Number(dayjs(item.Mes).utc().format('MM'))) },
            (v: string) => { return correctOrderDate(v, item.MarcoPagamento, 'O marco M2 deve ocorrer antes do marco M3!') },
            (v: string) => { return correctOrderDate(item.MarcoSolicitacaoBolsa, v, 'O marco M2 deve ocorrer depois do marco M1!') }
          ]" validate-on="blur" @blur="validaTudo"
          :disabled="!canEditM2(item.MarcoGeracaoFolha.split('T')[0])" data-test="inputMarcoGeracaoFolha" />
        <template
          v-if="isDifferenceLessThanThreeDays(item.MarcoGeracaoFolha, item.MarcoSolicitacaoBolsa) || isDifferenceLessThanThreeDays(item.MarcoGeracaoFolha, item.MarcoPagamento)">
          <v-tooltip location="top" class="custom-tooltip"
            text="É recomendado haver uma distância mínima de 3 dias entre os marcos.">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" color="orange" class="icon-adjustment icon-alert">
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
        <v-text-field type="date" class="inputDate mt-6 mb-2" v-model="item.MarcoPagamento" :rules="[
          (v: string) => { return dateOnThisAndNextMonth(Number(dayjs(v).utc().format('MM')), Number(dayjs(item.Mes).utc().format('MM'))) },
          (v: string) => { return correctOrderDate(item.MarcoGeracaoFolha, v, 'O marco M3 deve ocorrer depois do marco M2!') }
        ]" validate-on="blur" @blur="validaTudo" :disabled="item.Folhas.length > 0"
          data-test="inputMarcoPagamento" />
        <template
          v-if="isDifferenceLessThanThreeDays(item.MarcoPagamento, item.MarcoSolicitacaoBolsa) || isDifferenceLessThanThreeDays(item.MarcoPagamento, item.MarcoGeracaoFolha,)">
          <v-tooltip location="top" class="custom-tooltip"
            text="É recomendado haver uma distância mínima de 5 dias entre os marcos.">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" color="orange" class="icon-adjustment icon-alert">
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
      <v-btn v-if="planosMensais && ano >= anoAtual && planosMensais?.length > 0" class="custom-width-2 text-none"
        color="primary" variant="flat" dark @click="() => emits('updateCalendar')">Salvar Calendário</v-btn>
    </v-col>
  </v-row>
</template>

<style scoped>
.custom-width-2 {
  height: 48px;
  width: auto;
  margin-top: 10px;
}

.v-tooltip {
  max-width: 75%;
  white-space: normal;
}

.input-container {
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
</style>