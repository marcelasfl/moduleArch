<template>
  <form @submit.prevent="handleSubmit">
    <v-card elevation="10" rounded="md">
      <v-card-text class="pa-sm-6 pa-3 pb-sm-6 pb-6">
        <!-- Alerta de validação -->
        <v-alert v-if="alertMessage" type="warning" class="mb-3" closable>
          {{ alertMessage }}
        </v-alert>

        <v-row>
          <v-col cols="6">
            <v-label class="font-weight-medium mb-2">Número da resolução *</v-label>
            <VTextField type="number" placeholder="Ex: 123" hide-details v-model.number="form.Numero"
            data-test="inputNumeroResolucao" />
          </v-col>

          <v-col cols="6">
            <v-label class="font-weight-medium mb-2">Data de publicação *</v-label>
            <VTextField placeholder="dd/mm/aaaa" type="date" hide-details v-model="form.Data"
              data-test="inputDataPublicacao" :error="!!errors.Data" :error-messages="errors.Data" />
          </v-col>

          <v-col cols="12">
            <v-label class="font-weight-medium mb-2">Ementa *</v-label>
            <VTextarea auto-grow rows="2" color="primary" row-height="25" shaped hide-details v-model="form.Ementa"
              @input="atualizaContadorEmenta" data-test="textareaEmenta" :error="!!errors.Ementa"
              :error-messages="errors.Ementa" />
            <v-label class="font-weight-small mt-1" :class="{ 'text-danger': contadorCaracteresEmenta > 500 }">
              {{ contadorCaracteresEmenta }}/500 caracteres
            </v-label>
          </v-col>

          <v-col cols="12">
            <v-label class="font-weight-medium mb-2">Link da publicação *</v-label>
            <VTextField type="text" placeholder="https://fapes.es.gov.br/..." hide-details v-model="form.Link"
              data-test="inputLinkPublicacao" :error="!!errors.Link" :error-messages="errors.Link" />
          </v-col>

          <v-col cols="6">
            <v-label class="font-weight-medium mb-2">Número do E-Docs *</v-label>
            <VTextField type="text" placeholder="EX: WTC-10192" hide-details v-model="form.NumRastreioEdocs"
              data-test="inputNumeroEDocs" :error="!!errors.NumRastreioEdocs"
              :error-messages="errors.NumRastreioEdocs" />
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
import { defineEmits, defineProps, ref } from "vue";
import { useResolucao } from "../composables/useCreateResolucaoPage";
import { useValidacaoResolucao } from "../composables/useValidacaoResolucao";

const { isPending, onSubmit } = useResolucao();
const resolucaoSchema = useValidacaoResolucao();

const props = defineProps({
  form: {
    type: Object,
    required: true,
  },
  submitButtonText: String,
});

const emit = defineEmits(["submitForm", "navigateBack"]);

const contadorCaracteresEmenta = ref(props.form?.Ementa.length || 0);

const atualizaContadorEmenta = () => {
  contadorCaracteresEmenta.value = props.form?.Ementa.length || 0;
};

const errors = ref<Record<string, string | undefined>>({});
const alertMessage = ref(""); // Estado para o alerta de erro

const handleSubmit = async () => {
  errors.value = {};
  alertMessage.value = "";

  const result = resolucaoSchema.safeParse(props.form);

  if (!result.success) {
    const errorMessages: string[] = [];

    result.error.errors.forEach((err) => {
      const field = err.path[0]; 
      const message = err.message;

      errors.value[field] = message;
      errorMessages.push(`${field}: ${message}`);
    });

    alertMessage.value = errorMessages.join(" | ");
    return;
  }

  console.log("Formulário válido:", props.form);

  try {
    await onSubmit(props.form);
    emit("submitForm");
  } catch (error) {
    console.error("Erro ao salvar:", error);
  }
};
</script>

<style scoped>
.text-danger {
  color: red;
}
</style>
