<template>
    <!-- utiliza o store direto no select -->
    <label for="projeto" class="text-gray-700">Projeto</label>
    <v-autocomplete
      id="projeto"
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
import ProjetoController from "@/dashboard/controller/ProjetoController";
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { useEditalSelectStore } from '../../controller/store/EditalSelectStore';
import { useProjetoSelectStore } from '../../controller/store/ProjetoSelectStore';
//store criado com o pinia, utilizando como referencia do vuejs
const store = storeToRefs(useProjetoSelectStore())
// const projeto = new Projeto("0", "Todos")
const editalSelectStore = storeToRefs(useEditalSelectStore());

watch(editalSelectStore.selected, () => {
  store.selected.value = null
  buscarProjeto();
});

const buscarProjeto = async () => {
  const projetoController = new ProjetoController();
  const data = await projetoController.getAll(`Edital/Id eq ${editalSelectStore.selected.value}`);
  store.items.value = data;
}



// const buscarProjeto = async () => {
//   const ProjetoObject = new ProjetoGenericObject({});
//   const { list: listProjeto } = services(ProjetoObject.entity);
//   const items = await listProjeto()
//   store.items.value = items.value
// }


</script>
