<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <ResolucaoForm 
    :form="form" 
    :submitButtonText="submitButtonText"
    @submitForm="onSubmit"
    @navigateBack="navigateBack"     
  />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import ResolucaoForm from '../components/ResolucaoForm.vue';
import { useResolucao } from '../composables/useCreateResolucaoPage';

const { onSubmit, navigateBack } = useResolucao();     
const route = useRoute();

const form = reactive({
  Numero: null,
  Ementa: '',
  Link: '',
  Data: '',
  id: '',
  NumRastreioEdocs: ''
});

const page = ref({ title: 'Incluir Nova Resolução' });
const submitButtonText = ref('Incluir resolução');

const breadcrumbs = ref([
  { text: 'Resolução', disabled: false, href: '/IndexResolucao' },
  { text: page.value.title, disabled: true, href: '#' }
]);
</script>
