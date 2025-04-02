<script setup lang="ts">
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { useResolucoes } from '../composables/useViewResolucaoPage';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiPageFirst, mdiPageLast, mdiChevronLeft, mdiChevronRight, mdiArrowUp, mdiArrowDown, mdiEye } from '@mdi/js';

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
  <v-row>
    <v-col cols="2" class="d-flex justify-start">
      <v-btn
        class="custom-width-2"
        color="primary"
        variant="flat"
        dark
        @click="$router.push('/CreateResolucao')"
        data-test="buttonIncluirResolucao"
      >
        Criar Resolução
      </v-btn>
    </v-col>
  </v-row>

  <div class="flex items-center w-full mt-6 mb-10">
    <select v-model="filterType" class="h-12 rounded border px-2 ml-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800">
      <option v-for="option in filterTypes" :value="option">
        {{ option }}
      </option>
    </select>
    <input
      v-model="searchQuery"
      type="text"
      :placeholder="filterLabel"
    />
    <button
      class="border border-gray-300 flex justify-end"
      @click="buscar"
      >Buscar
    </button>
  </div>
  <div >
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
              <td class="px-7 py-3 text-sm font-semibold text-gray-900 whitespace-nowrap max-w-[800px]">
                <span>{{ item.Ementa }}</span>
              </td>
              <td class="px-7 py-3 text-sm text-gray-700 whitespace-nowrap">{{ dayjs.utc(item.Data).format('DD/MM/YYYY')  }}</td>
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

