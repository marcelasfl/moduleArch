<script setup lang="ts">
import dayjs from 'dayjs';
import { ref } from 'vue';
// import { useValidacaoResolucao }  from '../composables/useValidacaoResolucao';
import type { IResolucao } from '../api/entities/Resolucao';

const props = defineProps<{
  resolucoes: IResolucao[]
}>();

const emits = defineEmits<{
  (e: 'createResolucoes'): void
}>();

const header = ref([
  { title: 'Numero', sortable: false, key: 'Numero' },
  { title: 'Data de Criação', sortable: false, key: 'Data' },
  { title: 'Ementa', sortable: false, key: 'Ementa' },
  { title: 'Link', sortable: false, key: 'Link' },

]);

const filterType = ref('');
const filterTypes = ref([
  { text: 'Todos', value: '' },
  { text: 'Ativos', value: 'ativo' },
  { text: 'Inativos', value: 'inativo' }
]);
</script>

<template>
  <v-row>
    <v-col cols="2" class="d-flex justify-start">
      <v-btn class="custom-width-2" color="primary" variant="flat" dark @click="$router.push('/CreateResolucao')"
        data-test="buttonIncluirResolucao">
        Criar Resolução
      </v-btn>

    </v-col>
  </v-row>

  <v-row>
    <v-col cols="4">
      <v-select v-model="filterType" :items="filterTypes" label="Filtrar por Status" outlined dense />
    </v-col>
  </v-row>

  <v-data-table :headers="header" :items="props.resolucoes" :items-per-page="10">
    <template v-slot:item.titulo="{ item }">
      <div class="input-container">
        <v-text-field v-model="item.titulo" label="Título" class="inputDate mt-6 mb-2" validate-on="blur"
          data-test="inputTitulo" />
      </div>
    </template>

    <template v-slot:item.dataCriacao="{ item }">
      <div class="input-container">
        <v-text-field type="date" v-model="item.dataCriacao" class="inputDate mt-6 mb-2"
          :min="dayjs().subtract(1, 'year').format('YYYY-MM-DD')" validate-on="blur" data-test="inputDataCriacao" />
      </div>
    </template>


    <template #bottom></template>
  </v-data-table>
</template>

<style scoped>
.custom-width-2 {
  height: 48px;
  width: auto;
  margin-top: 10px;
}

.input-container {
  display: flex;
  align-items: center;
}

.v-tooltip {
  max-width: 75%;
  white-space: normal;
}

.icon-adjustment {
  margin-left: 12px;
  margin-top: -4px;
}

.icon-alert {
  color: orange !important;
}
</style>
