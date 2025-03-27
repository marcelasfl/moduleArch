import { computed, onMounted, ref } from 'vue';
import type { IBolsistasProjetoDashboard, ApiPaginationResponse } from '../api/interfaces/BolsistasProjetoInterface';
import { bolsistasProjetoService, BolsistasProjetoServiceFactory } from '../api/factories/BolsistasProjetoFactory'; // modular\modules\Resolucao\api\factory.ts

export function useBolsistasProjeto() {

    const header = ref([
        { title: 'Bolsista', align: 'start', sortable: true, key: 'nome'},
        { title: 'Status', key: 'status', sortable: false, align: 'center' },
        { title: 'Sigla', key: 'siglaBolsa', sortable: true }, 
        { title: 'Cotas pagas', key: 'cotasPagas', sortable: true },
        { title: 'Cotas a pagar', key: 'cotasAPagar', sortable: true },
        { title: 'Valor da bolsa', key: 'valorBolsa', sortable: true },
        { title: 'Ações', key: 'actions', sortable: false }
    ]);
    const select = ref(["Ativas"])
    const items = ref(["Todas", "Ativas", "Canceladas", "Suspensas", "Em avaliação", "Finalizadas", "Em edição", "Documentação pendente", "Pendente de avaliação", "Aguardando aceites"]);
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const bolsistas = ref<IBolsistasProjetoDashboard[]>([]);

    const loadBolsistas = async () => {
        try {
            const response = await bolsistasProjetoService.getBolsistasPorProjetoById('projetoId/c4aba34c-a8ed-4fce-df2a-08dd51b426c8');
            console.log(response);
            bolsistas.value = response;
        } catch (error) {
            console.error('Erro ao buscar resoluções:', error);
        }
    }

    const getStatus = (status: number) => {
        switch (status) {
            case 0:
                return "Em edição";
            case 1:
                return "Documentação pendente";
            case 2:
                return "Aguardando aceites";
            case 3:
                return "Pendente de avaliação";
            case 4:
                return "Em avaliação";
            case 5:
                return "Ativas";
            case 6:
                return "Suspensas";
            case 7:
                return "Canceladas";
            case 8:
                return "Finalizadas";
            default:
                return "";
        }
    }
    const sortKey = ref('');
    const sortDirection = ref('asc');

    function sortTable(key: any) {
        if (sortKey.value === key) {
            sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
        } else {
            sortKey.value = key;
            sortDirection.value = 'asc';
        }
    }

    const sortedData = computed(() => {
        return [...bolsistas.value].sort((a: any, b: any) => {
            let modifier = sortDirection.value === 'asc' ? 1 : -1;
            return a[sortKey.value] > b[sortKey.value] ? modifier : -modifier;
        });
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
        return Math.ceil(bolsistas.value.length / pageSize.value);
    });

    // const bolsistaClicado = ref<IBolsistasProjetoDashboard | null>(null);
    // function abrirDialogBolsista(bolsista: IBolsistasProjetoDashboard) {
    //     bolsistaClicado.value = bolsista;
    //     getPessoa(bolsista.alocacaoBolsistaPessoaId);
    //     dialogBolsista.value = true;
    // }

    // const bolsista = ref<IPessoa | null>(null);
    // const getPessoa = async (id: string) => {
    //     try {
    //         bolsista.value = await pessoaStore.getById(id);
    //         if (bolsista.value.DataNascimento){
    //             bolsista.value.DataNascimento = dayjs(bolsista.value.DataNascimento).utc().format('YYYY-MM-DD')
    //         }
    //     } catch (error) {
    //         console.error("Erro ao buscar dados:", error);
    //     }
    // }
    onMounted(loadBolsistas);
    return {
        header, 
        items, 
        select, 
        bolsistas, 
        formatCurrency, 
        getStatus, 
        sortKey, 
        sortDirection, 
        sortTable, 
        sortedData,
        currentPage, 
        pageSize,
        pageSizes,
        paginatedData,
        totalPages,
    };

}
