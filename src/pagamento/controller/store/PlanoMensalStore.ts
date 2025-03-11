//O store fornece um ponto central para o estado dos dados de "Plano Mensal" e permite a integração com a interface do usuário.
//
// stores/genericStore.ts

import type { IPlanoMensal } from '@/pagamento/model/PlanoMensal';
import PlanoMensal from '@/pagamento/model/PlanoMensal';
import PlanoMensalController from '../PlanoMensalController';
import { GenericStore } from './generic/GenericStore';


const planoMensalController = new PlanoMensalController(); //uma instância do controller que controla a lógica de "Plano Mensal".
const genericStore = new GenericStore<IPlanoMensal>('planoMensal'); //uma instância da GenericStore que mantém os dados de PlanoMensal no estado da aplicação
const planosMensais: PlanoMensal[] = [
  new PlanoMensal("1", '2025-01-10', "2025-01-10", "2025-01-16", "2025-01-20", false),
  new PlanoMensal("2", '2025-02-10', "2025-02-10", "2025-02-20", "2025-02-26", false),
  new PlanoMensal("3", '2025-03-10', "2025-03-10", "2025-03-20", "2025-03-26", false),
  new PlanoMensal("4", '2025-04-10', "2025-04-10", "2025-04-20", "2025-04-26", false),
  new PlanoMensal("5", '2025-05-10', "2025-05-10", "2025-05-20", "2025-05-26", false),
  new PlanoMensal("6", '2025-06-10', "2025-06-10", "2025-06-20", "2025-06-26", false),
  new PlanoMensal("7", '2025-07-10', "2025-07-10", "2025-07-20", "2025-07-26", false),
  new PlanoMensal("8", '2025-08-10', "2025-08-10", "2025-08-20", "2025-08-26", false),
  new PlanoMensal("9", '2025-09-10', "2025-09-10", "2025-09-20", "2025-09-26", false),
  new PlanoMensal("10", '2025-10-10', "2025-10-10", "2025-10-20", "2025-10-26", false),
  new PlanoMensal("11", '2025-11-10', "2025-11-10", "2025-11-20", "2025-11-26", false),
  new PlanoMensal("12", '2025-12-10', "2025-12-10", "2025-12-20", "2025-12-26", false),
];
if (import.meta.env.VITE_DEV_MOCK === "true") genericStore.enableMock(async () => planosMensais);
export const usePlanoMensalStore = genericStore.createStore(planoMensalController);

