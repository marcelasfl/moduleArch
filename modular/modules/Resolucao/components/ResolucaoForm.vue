<template>
  <form @submit.prevent="onSubmit">
    <v-card elevation="10" rounded="md">
      <v-card-text class="pa-sm-6 pa-3 pb-sm-6 pb-6">
        <v-row>
          <v-col cols="6">
            <v-label class="font-weight-medium mb-2">Número da resolução *</v-label>
            <VTextField type="string" placeholder="Ex: 123" hide-details v-model="form.Numero"
              @keypress="$event.key.match(/^[\d\.]$/) ? '' : $event.preventDefault()"
              data-test="inputNumeroResolucao" />
          </v-col>

          <v-col cols="6">
            <v-label class="font-weight-medium mb-2">Data de publicação *</v-label>
            <VTextField placeholder="dd/mm/aaaa" type="date" hide-details v-model="form.Data" required
              data-test="inputDataPublicacao" />
          </v-col>

          <v-col cols="12">
            <v-label class="font-weight-medium mb-2">Ementa *</v-label>
            <VTextarea auto-grow rows="2" color="primary" row-height="25" shaped hide-detail v-model="form.Ementa"
              @input="atualizaContadorEmenta" required data-test="textareaEmenta" />
            <v-label class="font-weight-small mt-1" :class="{ 'text-danger': contadorCaracteresEmenta > 500 }">
              {{ contadorCaracteresEmenta }}/500 caracteres
            </v-label>
          </v-col>

          <v-col cols="12">
            <v-label class="font-weight-medium mb-2">Link da publicação *</v-label>
            <VTextField type="text" placeholder="https://fapes.es.gov.br/..." hide-details v-model="form.Link" required
              data-test="inputLinkPublicacao" />
          </v-col>

          <v-col cols="6">
            <v-label class="font-weight-medium mb-2">Número do E-Docs *</v-label>
            <VTextField type="text" placeholder="EX: WTC-10192" hide-details v-model="form.NumRastreioEdocs" required
              data-test="inputNumeroEDocs" />
            <v-label class="font-weight-small mt-1">Registre o número do E-Docs da Resolução.</v-label>
          </v-col>

          <v-col cols="12" class="d-flex justify-end">
            <v-btn type="button" color="primary" variant="outlined" class="mr-3" @click="$emit('navigateBack')"
              data-test="buttonVoltar">
              Voltar
            </v-btn>
            <v-btn type="submit" color="primary" flat :disabled="isPending" data-test="buttonSalvar">
              {{ isPending ? 'Salvando...' : submitButtonText }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </form>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref } from 'vue';
import { useResolucao } from '../composables/useCreateResolucaoPage';

const { isPending, isSuccess, isError, onSubmit } = useResolucao();

const props = defineProps({
  form: {
    type: Object,
    required: true

  },
  submitButtonText: String
});

const emit = defineEmits(['submitForm', 'navigateBack']);

const contadorCaracteresEmenta = ref(props.form?.Ementa.length || 0);

const atualizaContadorEmenta = () => {
  contadorCaracteresEmenta.value = props.form?.Ementa.length || 0;
};


</script>

<style scoped>
.text-danger {
  color: red;
}
</style>

<style scoped>
.text-danger {
  color: red;
}
</style>
