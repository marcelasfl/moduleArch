import { ref, onMounted, type Ref } from "vue";
import { usePlanoMensalStore } from '@/pagamento/controller/store/PlanoMensalStore';
import FolhaController from '@/pagamento/controller/FolhaController';
import PlanoMensalRoutes from '@/pagamento/model/repositories/apiRoutes/PlanoMensal';
import type { IPlanoMensal } from "@/pagamento/model/PlanoMensal";
import type { ApiError } from "@/ModularArch/api/entities/ApiError";
import snackbarStore from '@/ModularArch/store/SnackbarStore/index';

export function useCalendario(ano: Ref<number>) {
  const planosMensais = ref<IPlanoMensal[]>([]);
  const data = ref<any>(null);
  const isLoading = ref<boolean>(false);
  const folhaController = new FolhaController();
  const planoMensalRoutes = new PlanoMensalRoutes({});
  const { showSnackbar } = snackbarStore();

  async function historyFolha() {
    data.value = await folhaController.historyFolha();
  }

  function refreshPlanos() {
    planosMensais.value = usePlanoMensalStore.items.map(item => ({ ...item }));
  }

  async function filterByYear() {
    isLoading.value = true;
    try {
      await usePlanoMensalStore.filter(`${planoMensalRoutes.filterByYear}${ano.value}&$expand=*`);
      refreshPlanos();
    } catch (error) {
      showSnackbar('Erro ao buscar os planos do ano atual!', 'error');

      console.error(error)
    } finally {
      isLoading.value = false;
    }
  }

  //MÉTODOS NÃO CHAMADOS NO ONMOUNTED

  // Faz o update do calendario
async function updateCalendar() {
  try {
      const calendar = {"calendario": planosMensais.value};
      await usePlanoMensalStore.updateBulk(calendar);
      await filterByYear();
      refreshPlanos();

      console.log('alooooo')
      showSnackbar(`O calendário de ${ano.value} foi salvo.`);
  } catch (error: unknown) {
      console.error(error);
      showSnackbar('Corrija os campos destacados e tente novamente.', 'error');
  }
}

// Cria um calendario novo pro ano
async function createNewCalendar() {
  const calendar = calendarOfYear();

  try {
    await usePlanoMensalStore.saveBulk(calendar); 
  } catch (error: ApiError | any) { //não usar any - está aqui temporariamente
    showSnackbar(error.message, 'error');
  } finally {
    await filterByYear();
    refreshPlanos(); 
  }
}

// Cria o objeto que no formato que a rota do back recebe
function calendarOfYear() {
  const calendar: { calendario: IPlanoMensal[], ano: number } = {"calendario": [], "ano": ano.value};
  for (let i = 1; i <= 12; i++) {
      const monthNumber = String(i).padStart(2, '0');
      const month = { 
          Id: '',
          Mes: i,
          MarcoSolicitacaoBolsa: `${ano.value}-${monthNumber}-10`, 
          MarcoGeracaoFolha: `${ano.value}-${monthNumber}-22`, 
          MarcoPagamento: `${ano.value}-${monthNumber}-27`,
          EhAtual: false
      }
      calendar["calendario"].push(month)
  }
  return calendar
}

  onMounted(async () => {
    await filterByYear();
    refreshPlanos();
    await historyFolha();
  });

  return {
    planosMensais,
    isLoading,
    refreshPlanos,
    filterByYear,
    historyFolha,
    updateCalendar,
    createNewCalendar
  };
}
