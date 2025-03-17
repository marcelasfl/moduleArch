<template>
  <Form @submit="handleSubmit" v-slot="{ errors }">
    <v-card elevation="10" rounded="md">
      <v-card-text class="pa-sm-6 pa-3 pb-sm-6 pb-6">
        <v-alert v-if="alertMessage" type="warning" class="mb-3" closable>
          {{ alertMessage }}
        </v-alert>

        <v-row>
          <v-col cols="6">
            <v-label class="font-weight-medium mb-2">Número da resolução *</v-label>
            <Field name="Numero" v-slot="{ field }" v-model.number="form.Numero">
              <VTextField type="number" placeholder="Ex: 123" v-bind="field" hide-details />
            </Field>
            <ErrorMessage name="Numero" class="text-danger" />
          </v-col>

          <v-col cols="6">
            <v-label class="font-weight-medium mb-2">Data de publicação *</v-label>
            <Field name="Data" v-slot="{ field }" v-model="form.Data">
              <VTextField placeholder="dd/mm/aaaa" type="date" v-bind="field" hide-details />
            </Field>
            <ErrorMessage name="Data" class="text-danger" />
          </v-col>

          <v-col cols="12">
            <v-label class="font-weight-medium mb-2">Ementa *</v-label>
            <Field name="Ementa" v-slot="{ field }" v-model="form.Ementa">
              <VTextarea auto-grow rows="2" color="primary" row-height="25" shaped v-bind="field" hide-details @input="atualizaContadorEmenta" />
            </Field>
            <v-label class="font-weight-small mt-1" :class="{ 'text-danger': contadorCaracteresEmenta > 500 }">
              {{ contadorCaracteresEmenta }}/500 caracteres
            </v-label>
            <ErrorMessage name="Ementa" class="text-danger" />
          </v-col>

          <v-col cols="12">
            <v-label class="font-weight-medium mb-2">Link da publicação *</v-label>
            <Field name="Link" v-slot="{ field }" v-model="form.Link">
              <VTextField type="text" placeholder="https://fapes.es.gov.br/..." v-bind="field" hide-details />
            </Field>
            <ErrorMessage name="Link" class="text-danger" />
          </v-col>

          <v-col cols="6">
            <v-label class="font-weight-medium mb-2">Número do E-Docs *</v-label>
            <Field name="NumRastreioEdocs" v-slot="{ field }" v-model="form.NumRastreioEdocs">
              <VTextField type="text" placeholder="EX: WTC-10192" v-bind="field" hide-details />
            </Field>
            <v-label class="font-weight-small mt-1">Registre o número do E-Docs da Resolução.</v-label>
            <ErrorMessage name="NumRastreioEdocs" class="text-danger" />
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
  </Form>
</template>

<script setup lang="ts">
import { ErrorMessage, Field, Form } from 'vee-validate';
import { defineEmits, defineProps, ref } from 'vue';
import { useResolucao } from '../composables/useCreateResolucaoPage';
import { useValidacaoResolucao } from '../composables/useValidacaoResolucao';

const { isPending, onSubmit } = useResolucao();
const resolucaoSchema = useValidacaoResolucao();

const form = ref({
  Numero: '',
  Data: '',
  Ementa: '',
  Link: '',
  NumRastreioEdocs: '',
});

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

const errors = ref<Record<string, string | undefined>>({});

const handleSubmit = async () => {
  errors.value = {};
  alertMessage.value = "";

  const result = resolucaoSchema.safeParse(form.value);

  if (!result.success) {
    const errorMessages: string[] = [];

    result.error.errors.forEach((err: any) => {
      const field = err.path[0];
      const message = err.message;

      errors.value[field] = message;
      errorMessages.push(`${field}: ${message}`);
    });

    alertMessage.value = errorMessages.join(" | ");
    return;
  }

  console.log("Formulário válido:", form.value);

  try {
    await onSubmit(form.value);
    emit("submitForm");
  } catch (error) {
    console.error("Erro ao salvar:", error);
    alertMessage.value = 'Erro ao salvar a resolução';
  }
};
</script>

<style scoped>
.text-danger {
  color: red;
}
</style>
