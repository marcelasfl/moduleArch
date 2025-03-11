import ConfirmarGeracaoFolhaController from '../ConfirmarGeracaoFolhaController';
import { GenericStore } from './generic/GenericStore';
import type { IConfirmarGeracaoFolha } from '@/pagamento/model/ConfirmarGeracaoFolha';

const liberarEditaisController = new ConfirmarGeracaoFolhaController();
const genericStore = new GenericStore<IConfirmarGeracaoFolha>('confirmargeracaofolha');
  
// if (import.meta.env.VITE_DEV_MOCK === "true") genericStore.enableMock(async () => liberarEditaisPagamento);
export const useConfirmarGeracaoFolhaStore = genericStore.createStore(liberarEditaisController);
