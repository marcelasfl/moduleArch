<template>
  <!-- utiliza o store direto no select -->
  <div>
    <label for="area-tecnica" class="text-gray-700">Área Técnica</label>
    <v-autocomplete
      id="area-tecnica"
      v-model="store.selected.value"
      :items="store.items.value"
      variant="outlined"
      clearable
      item-title="Nome"
      item-value="Id"
      dense
      outlined
    />
  </div>
</template>

<script lang="ts" setup>
import AreaTecnicaGenericObject from "@/services/requires/objects/importaredital/AreaTecnica";
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import services from '../../../services/requires/require';
import { useAreaTecnicaSelectStore } from '../../controller/store/AreaTecnicaSelectStore';
//store criado com o pinia, utilizando como referencia do vuejs
const store = storeToRefs(useAreaTecnicaSelectStore())

onMounted(() => {
  buscarAreaTecnica()
})

const buscarAreaTecnica = async () => {
  const AreaTecnicaObject = new AreaTecnicaGenericObject({});
  const { list: listAreaTecnica } = services(AreaTecnicaObject.entity);
  console.log(AreaTecnicaObject.entity)
  const items = await listAreaTecnica()
  store.items.value = items.value
}

</script>
