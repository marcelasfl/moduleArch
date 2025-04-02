<script setup lang="ts">
import { useBolsistasProjeto } from '../composables/useViewBolsistasPage';
import GenericSelect from '../../../components/GenericSelect.vue';
import StatusTag from './StatusTag.vue';
import { statusColor, status } from "../../../utils/statusUtils";
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiPageLast, mdiPageFirst, mdiChevronLeft, mdiChevronRight, mdiEye, mdiArrowUp, mdiArrowDown } from '@mdi/js';

const { 
  header, 
  items, 
  select, 
  bolsistas, 
  formatCurrency, 
  getStatus, 
  sortKey, 
  sortDirection, 
  sortTable, 
  currentPage, 
  pageSize,
  pageSizes,
  paginatedData,
  totalPages,
  updateSelect,
  searchBolsistas,
  searchQuery
} = useBolsistasProjeto();

const abrirDialogBolsista = (item: any) => {
    console.log('Abrir Dialog');
}
</script>

<template>
  <div class="d-flex align-center justify-end">
    <GenericSelect :itens="items" :updateSelect="updateSelect" :selected="select"/>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar..."
        @input="searchBolsistas"
      />
  </div>
  <div >
    <div>
      <table>
          <thead>
            <tr class="border-b border-gray-200 bg-gray-50">
              <th
                v-for="(header, index) in header"
                :key="index"
                @click="sortTable(header.key)"
                :class="{
                  'px-7 py-3 text-left text-sm font-semibold text-gray-600': true, 
                  'cursor-default': header.key === 'actions' || header.key === 'status', 
                  'hover:cursor-pointer': header.key !== 'actions' && header.key !== 'status',
                }"
              > 
                <div class="flex items-center">
                {{ header.title }}
                <span v-if="sortKey === header.key" class="ml-1">
                  <svg-icon class="me-2" :size='20' :path="mdiArrowUp" type="mdi" v-if="sortDirection === 'asc'"></svg-icon>
                  <svg-icon class="me-2" :size='20' :path="mdiArrowDown" type="mdi" v-else-if="sortDirection === 'desc'"></svg-icon>
                </span>
              </div>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in paginatedData" :key="item.nome" class="hover:bg-gray-50 border-b border-gray-200">
              <td class="px-7 py-3 text-sm text-gray-700 whitespace-nowrap ">
                <a href="#" @click.prevent="abrirDialogBolsista(item)" style="color: #2B3A8A;">
                      {{ item.nome }}
                  </a>
              </td>
              <td class="px-7 py-3 text-sm text-gray-700 whitespace-nowrap">
                <StatusTag :tag="status[item.status]" :color="statusColor[item.status]"/>
              </td>
              <td class="px-7 py-3 text-sm font-semibold text-gray-900 whitespace-nowrap">
                <span>{{ item.siglaBolsa }}</span>
              </td>
              <td class="px-7 py-3 text-sm text-gray-700 whitespace-nowrap">{{ item.cotasPagas }}</td>
              <td class="px-7 py-3 text-sm text-gray-700 whitespace-nowrap">{{ item.cotasAPagar }}</td>
              <td class="px-7 py-3 text-sm text-gray-700 whitespace-nowrap">{{ item.valorBolsa }}</td>
              <td class="px-7 py-3 text-sm text-gray-700 whitespace-nowrap">
                <svg-icon class="me-2" style="color: #2B3A8A" :size='22' :path="mdiEye" type="mdi" dark @click.prevent="abrirDialogBolsista(item)"></svg-icon>
              </td>
            </tr>
          </tbody>
      </table>
    </div>
    <div class="mt-4 text-right flex items-center justify-end">
      <span class="whitespace-nowrap text-sm">Itens por página</span>
      <select 
        v-model="pageSize"
        class="h-8 rounded border px-2 ml-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option v-for="size in pageSizes" :key="size" :value="size">
          {{ size }}
        </option>
      </select>

      <button 
        :disabled="currentPage === 1"
        @click="currentPage = 1"  
        class="h-8 w-8 rounded hover:bg-gray-100 disabled:opacity-50 ml-6"
      >
        <svg-icon class="mb-1" :path="mdiPageFirst" type="mdi"></svg-icon>
      </button>
      
      
      <button
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="h-8 w-8 rounded hover:bg-gray-100 disabled:opacity-50"
      >
        <svg-icon class="mb-1" :path="mdiChevronLeft" type="mdi"></svg-icon>
      </button>
      
      <span class="px-2 text-sm">Página {{ currentPage }} de {{ totalPages? totalPages : 1 }}</span>
      
      <button
        @click="currentPage++"
        :disabled="currentPage === totalPages"
        class="h-8 w-8 rounded hover:bg-gray-100 disabled:opacity-50"
      >
        
        <svg-icon class="mb-1" :path="mdiChevronRight" type="mdi"></svg-icon>
      </button>
      
      <button
        @click="currentPage = totalPages"
        :disabled="currentPage === totalPages"
        class="h-8 w-8 rounded hover:bg-gray-100 disabled:opacity-50"
      >
        <svg-icon class="mb-1" :path="mdiPageLast" type="mdi"></svg-icon>
      </button>
      
    </div>
  </div>

</template>

