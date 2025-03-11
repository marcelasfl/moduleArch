import type { IAreaTecnica } from '@/pagamento/model/AreaTecnica';
import AreaTecnica from '@/pagamento/model/AreaTecnica';
import AreaTecnicaController from '../AreaTecnicaController';
import { GenericStore } from './generic/GenericStore';


const areaTecnicaController = new AreaTecnicaController();
const genericStore = new GenericStore<IAreaTecnica>('areaTecnica');
const areasTecnicas: AreaTecnica[] = [
    new AreaTecnica('31773898-7570-43dd-85dd-39cfc88d6c2f', 'GEINOV')
];
if (import.meta.env.VITE_DEV_MOCK === "true") genericStore.enableMock(async () => areasTecnicas);
export const useAreaTecnicaStore = genericStore.createStore(areaTecnicaController);

