import MonitorarLiberacaoAreasController from '../MonitorarLiberacaoAreasController';
import { GenericStore } from './generic/GenericStore';
import type { IMonitorarLiberacaoEditais } from '@/pagamento/model/MonitorarLiberacaoEditais';

const monitorarLiberacaoAreasController = new MonitorarLiberacaoAreasController();
const genericStore = new GenericStore<IMonitorarLiberacaoEditais>('monitorarliberacaoareas');
  
// if (import.meta.env.VITE_DEV_MOCK === "true") genericStore.enableMock(async () => liberarEditaisPagamento);
export const useMonitorarLiberacaoAreasStore = genericStore.createStore(monitorarLiberacaoAreasController);
