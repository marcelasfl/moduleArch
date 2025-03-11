import { GenericStore } from './generic/GenericStore';
import VisualizarDetalhesAreaController from '../VisualizarDetalhesArea';
import type { IVisualizarDetalhesArea } from '@/pagamento/model/VisualizarDetalhesArea';


const detalhesAreaController = new VisualizarDetalhesAreaController();
const genericStore = new GenericStore<IVisualizarDetalhesArea>('detalhesArea');
export const useDetalhesAreaStore = genericStore.createStore(detalhesAreaController);

