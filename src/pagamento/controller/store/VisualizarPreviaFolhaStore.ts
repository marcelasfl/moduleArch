import type { IVisualizarPreviaFolha } from '@/pagamento/model/VisualizarPreviaFolha';
import VisualizarPreviaFolhaController from '../VisualizarPreviaFolhaController';
import { GenericStore } from './generic/GenericStore';

const visualizarPreviaFolhaController = new VisualizarPreviaFolhaController();
const genericStore = new GenericStore<IVisualizarPreviaFolha>('visualizarpreviafolha');
  
// if (import.meta.env.VITE_DEV_MOCK === "true") genericStore.enableMock(async () => liberarEditaisPagamento);
export const useVisualizarPreviaFolhaStore = genericStore.createStore(visualizarPreviaFolhaController);
