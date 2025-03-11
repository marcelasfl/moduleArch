<template>
    <!-- utiliza o store direto no select -->
    <label for="edital" class="text-gray-700">Edital</label>
    <v-autocomplete
      id="edital"
      v-model="store.selected.value"
      :items="store.items.value"
      variant="outlined"
      clearable
      item-title="Nome"
      item-value="Id"
      dense
      outlined
    />
  </template>
  
<script lang="ts" setup>
import AreaTecnicaController from "@/dashboard/controller/AreaTecnicaController";
import EditalController from "@/dashboard/controller/EditalController";
import { storeToRefs } from 'pinia';
import { onMounted, watch } from 'vue';
import { useAreaTecnicaSelectStore } from '../../controller/store/AreaTecnicaSelectStore';
import { useEditalSelectStore } from '../../controller/store/EditalSelectStore';
//store criado com o pinia, utilizando como referencia do vuejs
const store = storeToRefs(useEditalSelectStore())
const emit = defineEmits(['update:modelValue']);

const emitSelected = (selectedValue: string) => {
  store.selected.value = selectedValue; // Atualiza o store
  emit('update:modelValue', selectedValue); // Emite o evento para o componente pai
};

const areaTecnicaSelectStore = storeToRefs(useAreaTecnicaSelectStore());
onMounted(() => {
  buscarEdital()
})

watch(areaTecnicaSelectStore.selected, () => {
  store.selected.value = null
  buscarEdital();
});

const buscarEdital = async () => {
  const editalController = new EditalController();
  const data = await editalController.getAll(`EditalAreaTecnicaId eq ${areaTecnicaSelectStore.selected.value}`);
  store.items.value = data;
}


</script>