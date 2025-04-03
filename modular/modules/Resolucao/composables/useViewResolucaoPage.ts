import { inject, onMounted, ref, computed } from 'vue';
import type { IResolucao } from '../api/interface';
import { resolucaoService } from '../api/factory'; // modular\modules\Resolucao\api\factory.ts

export function useResolucoes() {

  const header = ref([
    { title: 'Número', sortable: false, key: 'numero' },
    { title: 'Ementa', sortable: false, key: 'ementa' },
    { title: 'Publicação', sortable: false, key: 'publicacao' },
    { title: 'Ações', sortable: false, key: 'actions' }
  ]);

  const filterType = ref('Escolha o tipo de filtro');
  const filterTypes = ref(["Escolha o tipo de filtro", 'Número da Resolução', 'Ementa']);
  const searchQuery = ref('');
  const resolucoes = ref<IResolucao[]>([]);
  const filteredResolucoes = ref<IResolucao[]>([]);

  const loadResolucoes = async () => {
    try {
      const response = await resolucaoService.getResolucao();
      resolucoes.value = response?.value || [];
      filteredResolucoes.value = response?.value || [];
    } catch (error) {
      console.error('Erro ao buscar resoluções:', error);
    }
  };

  const sortKey = ref('');
  const sortDirection = ref('asc');

  const filterLabel = computed(() => {
    if (filterType.value === 'Ementa') {
      return 'Filtrar por Ementa';
    }
    if (filterType.value === 'Número da Resolução') {
      return 'Filtrar por Número da Resolução';
    }
    else {
      return 'Pesquise por palavra-chave';
    }
  });

  function sortTable(key: any) {
      if (key === 'ementa' || key === 'actions') {
          return
      }
      if (sortKey.value === key) {
          sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
      } else {
          sortKey.value = key;
          sortDirection.value = 'asc';
      }
  }

  const sortedData = computed(() => {
      return [...filteredResolucoes.value].sort((a: any, b: any) => {
          let modifier = sortDirection.value === 'asc' ? 1 : -1;
          return a[sortKey.value] > b[sortKey.value] ? modifier : -modifier;
      })
  });

  const currentPage = ref(1);
  const pageSize = ref(10);
  const pageSizes = ref([5, 10, 20, 50]);

  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return sortedData.value.slice(start, end);
  });

  const totalPages = computed(() => {
    return Math.ceil(sortedData.value.length / pageSize.value);
  });


  const buscar = () => {
    if (!searchQuery.value) {
      filteredResolucoes.value = resolucoes.value;
    } else {
      const query = searchQuery.value.toLowerCase();
      filteredResolucoes.value = resolucoes.value.filter((item) => {
          if (filterType.value === 'Número da Resolução') {
            return item.Numero == query;
          } else if (filterType.value === 'Ementa') {
            return item.Ementa.toLowerCase().includes(query);
          } else {
            return item.Ementa.toLowerCase().includes(query) || item.Numero == query;
          }
      });
    }
  }

  onMounted(loadResolucoes);

  return { 
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
  };
}
