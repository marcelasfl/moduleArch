<script setup lang="ts">
import dayjs from 'dayjs';
import { useBolsistasProjeto } from '../composables/useViewBolsistasPage';
import GenericSelect from '../../../components/GenericSelect.vue';
import StatusTag from './StatusTag.vue';

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
  <!-- <v-row>
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
  </v-row> -->
  

  <div class="d-flex align-center justify-end">
    <!-- <select 
      v-model="select"
      multiple
      @change="updateSelect(select)"
      class="h-32 rounded border px-2 text-sm mr-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
      style="min-width: 120px;"
    >
      <option v-for="item in items" :key="item" :value="item">
        {{ item }}
      </option>
    </select> -->
    
    <GenericSelect :itens="items" :updateSelect="updateSelect" :selected="select"/>
    <!-- <v-select v-model="select" :items="items" label="Filtrar por Status" outlined dense multiple/> -->
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
                {{ header.title }}
                <span v-if="sortKey === header.key" class="ml-1">
                  <v-icon class="me-2" dark v-if="sortDirection === 'asc'">
                    mdi-arrow-up
                  </v-icon>
                  <v-icon class="me-2" dark v-else="sortDirection === 'desc'">
                    mdi-arrow-down
                  </v-icon>
                </span>
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
                <StatusTag tag="ATIVA" color="ativa" v-if="item.status==5" />
                <StatusTag tag="CANCELADA" color="cancelada" v-else-if="item.status==7" />
                <StatusTag tag="SUSPENSA" color="suspesa" v-else-if="item.status==6" />
                <StatusTag tag="EM AVALIAÇÃO" color="avaliacao" v-else-if="item.status==4" />
                <StatusTag tag="FINALIZADA" color="finalizada" v-else-if="item.status==8" />
                <StatusTag tag="PENDENTE DE AVALIAÇÃO" color="avaliacao" v-else-if="item.status==3" />
                <StatusTag tag="DOCUMENTAÇÃO PENDENTE" color="avaliacao" v-else-if="item.status==1" />
                <StatusTag tag="AGUARDANDO ACEITES" color="aguardando" v-else-if="item.status==2" />
                <StatusTag tag="EM EDIÇÃO" color="avaliacao" v-else-if="item.status==0" />
              </td>
              <td class="px-7 py-3 text-sm font-semibold text-gray-900 whitespace-nowrap">
                <span>{{ item.siglaBolsa }}</span>
              </td>
              <td class="px-7 py-3 text-sm text-gray-700 whitespace-nowrap">{{ item.cotasPagas }}</td>
              <td class="px-7 py-3 text-sm text-gray-700 whitespace-nowrap">{{ item.cotasAPagar }}</td>
              <td class="px-7 py-3 text-sm text-gray-700 whitespace-nowrap">{{ item.valorBolsa }}</td>
              <td class="px-7 py-3 text-sm text-gray-700 whitespace-nowrap">
                <v-icon class="me-2" color="primary" dark @click.prevent="abrirDialogBolsista(item)"
                  >mdi-eye</v-icon>
              </td>
            </tr>
          </tbody>
      </table>
    </div>
    <div class="mt-4 text-right">
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
        <v-icon small>
          mdi-page-first
        </v-icon>
      </button>
      
      
      <button
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="h-8 w-8 rounded hover:bg-gray-100 disabled:opacity-50"
      >
        <v-icon small>mdi-chevron-left</v-icon>
      </button>
      
      <span class="px-2 text-sm">Página {{ currentPage }} de {{ totalPages? totalPages : 1 }}</span>
      
      <button
        @click="currentPage++"
        :disabled="currentPage === totalPages"
        class="h-8 w-8 rounded hover:bg-gray-100 disabled:opacity-50"
      >
        <v-icon small>mdi-chevron-right</v-icon>
      </button>
      
      <button
        @click="currentPage = totalPages"
        :disabled="currentPage === totalPages"
        class="h-8 w-8 rounded hover:bg-gray-100 disabled:opacity-50"
      >
        <v-icon 
          small
        >
          mdi-page-last
        </v-icon>
      </button>
      
    </div>
  </div>

</template>

