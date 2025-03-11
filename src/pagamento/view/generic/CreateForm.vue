<template>
    <v-card class="pa-4">
      <v-form @submit.prevent="submitForm">
        <v-row>
          <v-col v-for="(field, index) in fields" :key="index" cols="12" md="6">
            <!-- 
            Para um create form generico, o tipo de campo deve modificar o componente utilizado,
            trocar apenas o type gera problemas de usabilidade

            ex: -->
            <v-checkbox v-if="field.type && field.type == 'checkbox'"
              v-model="formData[field.key]"
              :label="field.label"
              :required="field.required"
              :rules="[(v:any) => { if (field.validator?.validate(v)[0]?.message) { return field.validator.validate(v)[0]?.message} else return true }]"
              validate-on="blur"
              :data-testid="`checkbox-${field.key}`"
            ></v-checkbox>
            
            <v-text-field v-else
              v-model="formData[field.key]"
              :label="field.label"
              :required="field.required"
              :type="field.type || 'text'"
              :rules="[(v:any) => { if (field.validator?.validate(v)[0]?.message) { return field.validator.validate(v)[0]?.message} else return true }]"
              validate-on="blur"
              :data-testid="`input-${field.key}`"
            />
          </v-col>
        </v-row>
        <v-row class="error-messages pl-4">
          {{ erros }}
        </v-row>
  
        <v-row class="d-flex justify-end">
          <v-btn type="submit" color="primary" flat> Salvar </v-btn>
        </v-row>
      </v-form>
    </v-card>
  </template>
  
<script setup lang="ts">
import Swal from 'sweetalert2';
import { onMounted, ref, watch, type PropType } from 'vue';
import { useRouter } from 'vue-router';
import { ValidationError } from '@/pagamento/model/validations/generic/ValidationError';
import type { IField } from '@/pagamento/model/generic/IField';

const erros = ref('');

const props = defineProps({
  title: { type: String, required: true },
  fields: { type: Array as PropType<IField[]>, required: true },
  store: { type: Object, required: true },
  item: { type: Object, default: null },
  isEditMode: { type: Boolean, default: false },
  successRoute: { type: String, required: true }
});

const router = useRouter();
const formData = ref<Record<string, any>>({});

const initializeFormData = () => {
if (props.fields && Array.isArray(props.fields)) {
  props.fields.forEach((field: any) => {
    // Inicializa como false para checkbox, ou usa o valor do item ou o valor padrão
    formData.value[field.key] = field.type === 'checkbox' ? (props.item && props.item[field.key] !== undefined ? props.item[field.key] : false)
    : (props.item ? props.item[field.key] : field.default || '');
  });
  if (props.item?.Id) formData.value.Id = props.item.Id;
} else {
  console.error("props.fields não está definido ou não é um array.");
}
};


onMounted(() => {
  initializeFormData();
});

// Watch para atualizar o formData ao editar um item
watch(() => props.item, (newItem) => {
  if (newItem && props.isEditMode) {
    initializeFormData();
  }
}, { immediate: true });

const submitForm = async () => {
  try {
    erros.value = ''
    if (props.isEditMode) {
      await props.store.updateItem(props.item.Id, formData.value); // Chamada de atualização
      Swal.fire({
        title: "Atualizado com sucesso!",
        icon: "success",
        confirmButtonColor: "#D3D3D3",
      });
    } else {
      await props.store.save(formData.value); // Chamada de criação
      Swal.fire({
        title: "Criado com sucesso!",
        icon: "success",
        confirmButtonColor: "#D3D3D3",
      });
    }
    
    router.push(props.successRoute);
  } catch (error) {
    console.error("Erro ao salvar item:", error);
    if (error instanceof ValidationError) {
      erros.value = error.message
    }
  }
};
</script>

<style scoped>
.v-card {
  max-width: 600px;
  margin: auto;
}

.error-messages {
  color: #AE1212;
  font-size: small;
}
</style>