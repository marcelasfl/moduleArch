import { inject, onMounted, ref } from 'vue';
import type { IResolucao } from '../api/entities/Resolucao';
import { ResolucaoService } from '../api/services/ResolucaoService';

export function useResolucoes() {
  const resolucaoService = inject('resolucaoService') as ResolucaoService;

  const header = ref([
    { title: 'Numero', sortable: false, key: 'Numero' },
    { title: 'Data de Criação', sortable: false, key: 'Data' },
    { title: 'Ementa', sortable: false, key: 'Ementa' },
    { title: 'Link', sortable: false, key: 'Link' },
    { title: 'Número do E-Docs', sortable: false, key: 'NumRastreioEdocs' }
  ]);

  const filterType = ref('');
  const filterTypes = ref([
    { text: 'Todos', value: '' },
    { text: 'Ativos', value: 'ativo' },
    { text: 'Inativos', value: 'inativo' }
  ]);

  const resolucoes = ref<IResolucao[]>([]);

  const loadResolucoes = async () => {
    try {
      const response = await resolucaoService.getResolucao();
      console.log('Dados recebidos:', response);
      resolucoes.value = response?.data?.value || [];
    } catch (error) {
      console.error('Erro ao buscar resoluções:', error);
    }
  };

  onMounted(loadResolucoes);

  return { header, filterType, filterTypes, resolucoes };
}
