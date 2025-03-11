<template>
    <v-btn @click.prevent="buscar" color="primary" class="custom-width mt-6" variant="flat" data-test="buttonBuscar">Buscar</v-btn>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useAreaTecnicaSelectStore } from '../../controller/store/AreaTecnicaSelectStore';
import { useEditalSelectStore } from '../../controller/store/EditalSelectStore';
import { useProjetoSelectStore } from '@/dashboard/controller/store/ProjetoSelectStore';
import { useBuscarSelectStore } from '@/dashboard/controller/store/BuscarStore';

const areaTecnicaSelectStore = storeToRefs(useAreaTecnicaSelectStore());
const editalSelectStore = storeToRefs(useEditalSelectStore());
const projetoSelectStore = storeToRefs(useProjetoSelectStore());

const store = storeToRefs(useBuscarSelectStore());

const buscar = () => {
    store.areaTecnica.value = areaTecnicaSelectStore.selected.value;
    store.edital.value = editalSelectStore.selected.value;
    store.projeto.value = projetoSelectStore.selected.value;
}

</script> 

<style scoped>

.custom-width {
  height: 56px;
  width: 100px
}

</style>