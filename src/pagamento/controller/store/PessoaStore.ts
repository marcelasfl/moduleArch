import type { IPessoa } from "@/pagamento/model/Pessoa";
import Pessoa from "@/pagamento/model/Pessoa";
import PessoaController from "../../../dashboard/controller/PessoaController";
import { GenericStore } from "./generic/GenericStore";

const pessoaController = new PessoaController();
const genericStore = new GenericStore<IPessoa>('pessoa');
const pessoas: Pessoa[] = [
    new Pessoa("1", "Nome1", "123", "exemplo@gmail.com", "2004-05-10T00:00:00Z")
]

if (import.meta.env.VITE_DEV_MOCK === "true") genericStore.enableMock(async () => pessoas)
export const usePessoaStore = genericStore.createStore(pessoaController);