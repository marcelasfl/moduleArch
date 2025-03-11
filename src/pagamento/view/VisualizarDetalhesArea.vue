<template>

    <div class="navigate-back mb-6">
        <v-icon @click="$router.go(-1)">mdi-chevron-left</v-icon>
        <a @click="$router.go(-1)">Voltar</a>
    </div>

    <v-skeleton-loader v-if="isLoading" type="text" class="skeleton-loader" />
    <BaseBreadcrumb v-if="!isLoading" :title="page.title"/>  

    <v-row v-for="(itens, mes) in groupedData" :key="mes">
      <v-col cols="12">
          <h4>{{ mes }}</h4>
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
            :items="dadosEdital"
            >

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


            <template #item.Status="{ item }">
                <span :class="item.Status === 'LIBERADO' ? 'sttLiberado' : ''">{{ item.Status }}</span>
            </template>
     
            <template #item.ValorTotal="{ item }">
                <span><b>R$ {{ item.ValorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) }}</b></span>
            </template>
            </v-data-table>
      </v-col>
  </v-row>

  <v-row class="mt-8 mr-4">
      <v-spacer></v-spacer>
      <p>
        <b>Total incluso na folha da área técnica: 
          {{ totalValorIncluso.toLocaleString("pt-BR", { style: "currency", currency: "BRL"}) }}
        </b>
      </p>
  </v-row>
</template>

<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { computed, onMounted, ref } from 'vue';
import dayjs from 'dayjs';
import { useRoute } from 'vue-router';

const route = useRoute();
let params = route.params;

const isLoading = ref(false);

const area = ref('GEINOV');
const tipoFolha = ref('Folha Normal');
const mesFolha = ref('Setembro');
const page = ref({ title: `Visualizar detalhes da área da ${area.value} na ${tipoFolha.value} de ${mesFolha.value}` });

const meses = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];

const headers = ref([
    { title: 'Edital', sortable: false, key: 'Edital'},
    { title: 'Status', sortable: false, key: 'Status', help: "Status de liberação do edital para a competência em questão."},
    { title: 'Bolsas vigentes', sortable: false, key: 'BolsasVigentes', help: "Quantidade total de bolsas com pagamento previsto no mês em questão."},
    { title: 'Pendentes', sortable: false, key: 'Pendentes', help: "Quantidade de bolsistas pendentes de avaliação pela Área Técnica."},
    { title: 'Bolsas a pagar', sortable: false, key: 'BolsasAPagar', help: "Quantidade de bolsistas pendentes de avaliação pela Área Técnica."},
    { title: 'Valor total', sortable: false, key: 'ValorTotal', help:"Somatório dos valores das bolsas a pagar do edital."},
]);

const dadosEdital = ref([
    { Edital: 'FAPES N° 03/2024 - INOVAGRO', Mes: 'OUTUBRO', Status: 'LIBERADO', BolsasVigentes: '44', Pendentes: '0', BolsasAPagar: '44', ValorTotal: 92320.00},
    { Edital: 'FAPES/CNPq N° 06/2024 - PDCTR', Mes: 'OUTUBRO', Status: 'LIBERADO', BolsasVigentes: '20', Pendentes: '0', BolsasAPagar: '20', ValorTotal: 121902.00},
    { Edital: 'FINEP/FAPES N° 07/2024 - PROGRAMA TECNOVA III', Mes: 'OUTUBRO', Status: 'LIBERADO', BolsasVigentes: '70', Pendentes: '3', BolsasAPagar: '70', ValorTotal: 32245.00},
    { Edital: 'CHAMADA CONFAP & WBI - BÉLGICA 2024', Mes: 'OUTUBRO', Status: 'LIBERADO', BolsasVigentes: '12', Pendentes: '1', BolsasAPagar: '12', ValorTotal: 65234.00},
    { Edital: 'FAPES N° 03/2024 - INOVAGRO', Mes: 'SETEMBRO', Status: 'LIBERADO', BolsasVigentes: '44', Pendentes: '0', BolsasAPagar: '44', ValorTotal: 92320.00}
    
]);

const totalValorIncluso = dadosEdital.value.reduce((total, item) => total + item.ValorTotal, 0);

const groupedData = computed(() => {
    return dadosEdital.value.reduce((groups, item) => {
        if (!groups[item.Mes]) {
            groups[item.Mes] = [];
        }
        groups[item.Mes].push(item);
        return groups;
    }, {});
});

const verificaArrayParams = () => {
  if (typeof params.id === 'string') {
    return params.id;
  } else if (Array.isArray(params.id)) {
    return params.id[0];
  }
  return '';
};

</script>

<style scoped>
.navigate-back:hover {
  cursor: pointer;
}

.navigate-back {
  display: flex;
  align-items: center;
}

.sttLiberado {
  color: green;
}

</style>