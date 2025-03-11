import type { IFolha } from '@/pagamento/model/Folha';
import FolhaController from '../FolhaController';
import { GenericStore } from './generic/GenericStore';
import Folha from '@/pagamento/model/Folha';
import PlanoMensal from '@/pagamento/model/PlanoMensal';
import PagamentoBolsista from '@/pagamento/model/PagamentoBolsista';
import DecisaoFolha from '@/pagamento/model/DecisaoFolhas';
import RemessaPagamento from '@/pagamento/model/RemessaPagamento';
import ErroRemessa from '@/pagamento/model/ErroRemessa';
import ErroBanestes from '@/pagamento/model/ErroBanestes';

const folhaController = new FolhaController();
const genericStore = new GenericStore<IFolha>('folha');

const folha: IFolha[] = [new Folha('b7c0da6c-3997-41d2-30f5-08dd3491f2ff', 0, 
    'FOLHA-NORMAL-14/1/2025', '2025-01-31T00:00:00Z', 2900.00, 0.00, 'EM_AGENDAMENTO', '23c1b971-8731-4741-9d7f-f392915362a4', '2025-01-14T00:00:00Z',
    [new DecisaoFolha("595e3645-0b93-4c2b-958a-08dd3491f304", "2025-01-14T11:52:40.8159737Z", "GERAR", null), 
        new DecisaoFolha("3d9fd466-0a03-4ed6-958b-08dd3491f304", "2025-01-14T11:52:56.4407573Z", "AUTORIZAR", null),
        new DecisaoFolha("595e3645-0b93-4c2b-958a-08dd3491f304", "2025-01-14T11:52:40.8159737Z", "CANCELAR", null),
        new DecisaoFolha("595e3645-0b93-4c2b-958a-08dd3491f304", "2025-01-18T11:52:40.8159737Z", "GERAR", null)]
    , null, new PlanoMensal('23c1b971-8731-4741-9d7f-f392915362a4', '2025-01-01T00:00:00Z', '2025-01-13T00:00:00Z', '2025-01-14T00:00:00Z', '2025-01-31T00:00:00Z', true),
    [new PagamentoBolsista("7d24e222-0902-4507-bde8-7c621d7d7df3", 1, "2025-01-28T00:00:00Z", 2900.00, 
        "2025-01-01T00:00:00Z", "b7df7748-81b2-4fbe-a2d6-d56176a3e848", "EM_FOLHA")], 
        [new RemessaPagamento('29gradn-34we-tger-g4a3gsedgg', 1, '2025-01-15T00:00:00Z', null, 'aaaaaaaaaaaaaaaaaaa', 'aa', 'ENVIADA', 
            [new ErroRemessa('Isabela Oliveira', '123345568', [new ErroBanestes(123, 'ABCD')])])])];

if (import.meta.env.VITE_DEV_MOCK === "true") genericStore.enableMock(async () => folha);

export const useFolhaStore = genericStore.createStore(folhaController);