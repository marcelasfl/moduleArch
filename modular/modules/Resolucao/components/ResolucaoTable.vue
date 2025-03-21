<script setup lang="ts">
import dayjs from 'dayjs';
import { useResolucoes } from '../composables/useViewResolucaoPage';

const { header, filterType, filterTypes, resolucoes } = useResolucoes();
</script>

<template>
  <v-row>
    <v-col cols="2" class="d-flex justify-start">
      <v-btn
        class="custom-width-2"
        color="primary"
        variant="flat"
        dark
        @click="$router.push('/CreateResolucao')"
        data-test="buttonIncluirResolucao"
      >
        Criar Resolução
      </v-btn>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="4">
      <v-select v-model="filterType" :items="filterTypes" label="Filtrar por Status" outlined dense />
    </v-col>
  </v-row>

  <v-data-table :headers="header" :items="resolucoes" :items-per-page="10">
    <template #bottom></template>
  </v-data-table>
</template>

