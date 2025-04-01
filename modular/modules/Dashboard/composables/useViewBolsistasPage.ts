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
    const filteredBolsistas = ref<IBolsistasProjetoDashboard[]>([]);
    const loadBolsistas = async () => {
        try {
            const response = await bolsistasProjetoService.getBolsistasPorProjetoById('projetoId/c4aba34c-a8ed-4fce-df2a-08dd51b426c8');
            bolsistas.value = response;
            filteredBolsistas.value = response;
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
        if (key === 'status' || key === 'actions') {
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
        return [...filteredBolsistas.value].sort((a: any, b: any) => {
            let modifier = sortDirection.value === 'asc' ? 1 : -1;
            return a[sortKey.value] > b[sortKey.value] ? modifier : -modifier;
        }).filter((item) => {
            if (select.value.includes("Todas")) {
                return item.nome.toLowerCase().includes(searchQuery.value.toLowerCase());
            }
            return select.value.includes(getStatus(item.status));
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
        return Math.ceil(sortedData.value.length / pageSize.value);
    });

    //const bolsistaClicado = ref<IBolsistasProjetoDashboard | null>(null);
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

    const updateSelect = (newValues: string[]) => {
        if (newValues.length === 0) {
            select.value = ["Ativas"]; // Força a seleção de "Ativas" se nenhuma opção estiver marcada
        } else if (newValues.includes("Todas")) {
            select.value = ["Todas"];
        } else {
            select.value = newValues;
        }
        searchBolsistas();
    };

    const searchBolsistas = async () => {
        if (searchQuery.value){
            filterBolsistas();
        } else {
            updateTable()
        }
    };


    const filterBolsistas = async () => {
        filteredBolsistas.value = bolsistas.value.filter((item) => {
            if (select.value.includes("Todas")) {
                return item.nome.toLowerCase().includes(searchQuery.value.toLowerCase());
            }
            return item.nome.toLowerCase().includes(searchQuery.value.toLowerCase()) && select.value.includes(getStatus(item.status));
        });
    };

    const updateTable = () => {
        if (select.value.includes("Todas")) {
            filteredBolsistas.value = bolsistas.value;
        } else {
            // Filtra os itens com base nos valores selecionados
            filteredBolsistas.value = bolsistas.value.filter((item) =>
                select.value.includes(
                    getStatus(item.status)
                )
            );
        }
    }

    const searchQuery = ref('');

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
        currentPage, 
        pageSize,
        pageSizes,
        paginatedData,
        totalPages,
        updateSelect,
        searchBolsistas,
        searchQuery
    };

}
