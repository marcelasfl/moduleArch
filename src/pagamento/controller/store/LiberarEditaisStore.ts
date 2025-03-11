import type { ILiberarEditaisPagamento } from '@/pagamento/model/LiberarEditaisPagamento';
import LiberarEditaisPagamento from '@/pagamento/model/LiberarEditaisPagamento';
import LiberarEditaisController from '../LiberarEditaisController';
import { GenericStore } from './generic/GenericStore';
import AreaTecnica from '@/pagamento/model/AreaTecnica';
import EditalCompetencia from '@/pagamento/model/EditalCompetencia';


const liberarEditaisController = new LiberarEditaisController(); //uma instância do controller que controla a lógica de "Plano Mensal".
const genericStore = new GenericStore<ILiberarEditaisPagamento>('liberareditaispagamento'); //uma instância da GenericStore que mantém os dados de PlanoMensal no estado da aplicação

// const liberarEditaisPagamento : LiberarEditaisPagamento[] = [
//     new LiberarEditaisPagamento('1', 'JANEIRO', [
//         new EditalCompetencia('2', '2', 20000, 0, 6, 0, '2025-02-20', 'SEM_DECISAO', 
//             {nome: 'a', dataCriacao: 'a', areaTecnica: {nome: 'a', descricao: 'a', id: 'a'}, status: 0, id: 'a', editalAreaTecnicaId: 'a'}, [])
//     ])
// ]

// if (import.meta.env.VITE_DEV_MOCK === "true") genericStore.enableMock(async () => liberarEditaisPagamento);
export const useLiberarEditaisPagamentoStore = genericStore.createStore(liberarEditaisController);
