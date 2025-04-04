<script setup lang="ts">
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { useResolucoes } from '../composables/useViewResolucaoPage';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiPageFirst, mdiPageLast, mdiChevronLeft, mdiChevronRight, mdiArrowUp, mdiArrowDown, mdiLink, mdiUnfoldMoreHorizontal, mdiCloseCircle, mdiPencil, mdiDelete  } from '@mdi/js';
import GenericSelect from '../../../components/GenericSelect.vue';
import GenericInput from '../../../components/GenericInput.vue';

const { 
  header, 
  filterType, 
  filterTypes, 
  resolucoes, 
  sortTable, 
  sortKey, 
  sortDirection, 
  loadResolucoes, 
  paginatedData, 
  currentPage, 
  pageSize, 
  pageSizes, 
  totalPages, 
  searchQuery,
  buscar,
  filterLabel
  } = useResolucoes();
</script>

<template>
  <button
      class="h-13 rounded ring-1 ring-gray-400 bg-primary w-[203px] text-white"
      @click="$router.push('/CreateResolucao')"
      >Criar Resolução
  </button>
  <div class="flex items-center w-full mt-6 mb-10">
    <GenericSelect class="relative w-[317px]" :height="'h-14'" :options="filterTypes" v-model="filterType"/>
    <GenericInput class="relative w-[317px] mr-4" :height="'h-14'" v-model="searchQuery" :placeholder="filterLabel" />
    <button
      class="h-13 rounded ring-1 ring-gray-400 bg-primary w-[176px] text-white px-4 ml-4"
      @click="buscar"
      >Buscar
    </button>
  </div>
  <div class="border rounded pb-2">
    <div class="w-full">
      <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 bg-gray-50">
              <th
                v-for="(header, index) in header"
                :key="index"
                @click="sortTable(header.key)"
                :class="{
                  'px-7 py-3 text-left text-sm font-semibold text-gray-600': true, 
                  'cursor-default': header.key === 'actions' || header.key === 'ementa', 
                  'hover:cursor-pointer': header.key !== 'actions' && header.key !== 'ementa',
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
            <tr v-for="item in paginatedData" :key="item.Numero" class="hover:bg-gray-50 border-b border-gray-200">
              <td class="px-7 py-3 text-sm text-gray-700 whitespace-nowrap ">
                <a href="#" @click.prevent="abrirDialogBolsista(item)" style="color: #2B3A8A;">
                    {{ item.Numero }}
                </a>
              </td>
              <td class="px-7 py-3 text-sm font-semibold text-gray-900 max-w-[800px]">
                <span>{{ item.Ementa }}</span>
              </td>
              <td class="px-7 py-3 text-sm text-gray-700 whitespace-nowrap">{{ dayjs.utc(item.Data).format('DD/MM/YYYY')  }}</td>
              <td class="px-7 py-3 flex items-center">
                <svg-icon class="mr-2 cursor-pointer" style="color: #2B3A8A" :size='20' :path="mdiLink" type="mdi" dark></svg-icon>
                <svg-icon class="mr-2 cursor-pointer" style="color: #2B3A8A" :size='20' :path="mdiPencil" type="mdi" dark></svg-icon>
                <svg-icon class="cursor-pointer" style="color: #AE1212" :size='20' :path="mdiDelete" type="mdi" dark></svg-icon>
              </td>
            </tr>
          </tbody>
      </table>
    </div>
    <div class="mt-4 text-right flex items-center justify-end">
      <span class="whitespace-nowrap text-sm mr-2">Itens por página: </span>
      <GenericSelect class="relative w-[60px] mr-4" :height="'h-8'" :options="pageSizes" v-model="pageSize"/>
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

