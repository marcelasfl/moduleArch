<template> 
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />

  <v-skeleton-loader
    v-if="loading"
    type="table"
    :loading="loading"
    class="mx-auto my-8 skeleton-loader"
  >
    <v-row>
      <v-col cols="12">
        <v-skeleton-loader type="table" class="skeleton-loader" />
      </v-col>
    </v-row>
  </v-skeleton-loader>

  <main v-else>
    <v-form ref="form">
      <section class="inputs-topo">
        <v-select v-model="ano" :items="anos" label="Visualizar Calendário" clearable data-test="selectAno" />
        <v-btn class="custom-width text-none" color="primary" variant="flat" dark @click="filterByYear"> Buscar </v-btn>
      </section>

      <CalendarioPlaceholder
        v-if="planosMensais?.length <= 0"
        :ano="ano"
        @createNewCalendar="createNewCalendar"
      />

      <CalendarioForm
        v-else
        :ano="ano"
        :planosMensais="planosMensais"
        @updateCalendar="updateCalendar"
      />      
    </v-form>
  </main>

  <Snackbar />
</template>

<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import Snackbar from '@/ModularArch/components/Snackbar.vue';
import CalendarioForm from '@/ModularArch/modules/Pagamentos/components/Calendario/CalendarioForm.vue';
import CalendarioPlaceholder from '@/ModularArch/modules/Pagamentos/components/Calendario/CalendarioPlaceholder.vue';
import { useCalendario } from '@/ModularArch/modules/Pagamentos/composables/Calendario/useCalendario';
import { useValidacao } from '@/ModularArch/modules/Pagamentos/composables/Calendario/useValidacao';
import { anoAtual } from '@/ModularArch/utils/dateUtils';
import { ref } from 'vue';

// Defina os breadcrumbs e título da página
const page = ref({ title: 'Calendário' });
const breadcrumbs = ref([
  { text: 'Visualizar Calendário', disabled: true, href: '#' },
  { text: '', disabled: true, href: '#' }
]);
const ano = ref(anoAtual);
const anos = ref([2024, 2025]);
const { planosMensais, isLoading, filterByYear, createNewCalendar, updateCalendar } = useCalendario(ano);
const loading = ref(isLoading);
const { form } = useValidacao();
</script>

<style lang="scss" scoped>
.custom-width {
  height: 48px;
  width: 100px;
}
</style>