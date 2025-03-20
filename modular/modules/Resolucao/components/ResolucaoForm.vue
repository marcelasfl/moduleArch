<template>
  <form  @submit.prevent="handleSubmit" >
    <v-card elevation="10" rounded="md">
      <v-card-text class="pa-sm-6 pa-3 pb-sm-6 pb-6">
        <v-alert v-if="alertMessage" type="warning" class="mb-3" closable>
          {{ alertMessage }}
        </v-alert>

         <v-row>
          <v-col cols="6">
            <v-label class="font-weight-medium mb-2">{{ t('field.numero') }}</v-label>
              <v-number-input v-model.number="numero.value.value" type="number" placeholder="Ex: 123" :error-messages="numero.errorMessage.value"
              />
          </v-col>

          <v-col cols="6">
            <v-label class="font-weight-medium mb-2"> {{ t('field.data') }} </v-label>
              <v-text-field v-model="data.value.value" placeholder="dd/mm/aaaa" type="date" :error-messages="data.errorMessage.value"  />
          </v-col>

          <v-col cols="12">
            <v-label class="font-weight-medium mb-2"> {{ t('field.ementa') }}</v-label>
              <v-text-field v-model="ementa.value.value" textarea auto-grow rows="2" color="primary" row-height="25" shaped hide-details @input="atualizaContadorEmenta" :error-messages="ementa.errorMessage.value"  />
            <v-label class="font-weight-small mt-1" :class="{ 'text-danger': contadorCaracteresEmenta > 500 }">
              {{ contadorCaracteresEmenta }}/500 caracteres
            </v-label>
          </v-col>

          <v-col cols="12">
            <v-label class="font-weight-medium mb-2"> {{ t('field.link') }}</v-label>
              <v-text-field  v-model="link.value.value"  type="text" placeholder="https://fapes.es.gov.br/..."  
              :error-messages="link.errorMessage.value"
              />
          </v-col>

          <v-col cols="6">
            <v-label class="font-weight-medium mb-2"> {{ t('field.edocs') }}</v-label>
              <v-text-field v-model="numRastreio.value.value" type="text" placeholder="EX: WTC-10192" hide-details :error-messages="numRastreio.errorMessage.value" />
            <v-label class="font-weight-small mt-1">Registre o número do E-Docs da Resolução.</v-label>
          </v-col>

          <v-col cols="12" class="d-flex justify-end">
            <v-btn type="button" color="primary" variant="outlined" class="mr-3" @click="$emit('navigateBack')">
              Voltar
            </v-btn>
            <v-btn type="submit" color="primary" flat :disabled="isPending">
              {{ isPending ? 'Salvando...' : submitButtonText }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </form>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useField, useForm } from 'vee-validate';
import { defineEmits, defineProps, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useResolucao } from '../composables/useCreateResolucaoPage';
import { resolucaoSchema } from '../composables/useValidacaoResolucao';

const { t } = useI18n()
const { handleSubmit: handleNativeSubmit, errors } = useForm({
  validationSchema: toTypedSchema(resolucaoSchema),

});
const { isPending, save } = useResolucao();
const numero = useField<number>('Numero');
const data = useField('Data');
const ementa = useField('Ementa');
const link = useField('Link');
const numRastreio = useField('NumRastreioEdocs');
const props = defineProps({
  form: Object,
  submitButtonText: String,
});

const emit = defineEmits(['submitForm', 'navigateBack']);
const contadorCaracteresEmenta = ref(props.form?.Ementa.length || 0);
const alertMessage = ref('');

const atualizaContadorEmenta = () => {
  contadorCaracteresEmenta.value = props.form?.Ementa.length || 0;
};

const handleSubmit = handleNativeSubmit(
  (values) => {
    save(values)
  },
  (error) => {
    alertMessage.value = t('messages.error')
    console.error(error)
  }
);
</script>


