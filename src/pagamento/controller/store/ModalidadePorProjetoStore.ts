import type { IProjeto } from "@/pagamento/model/Projeto";
//import type { IEntity } from "../../model/generic/IEntity";

// interface Modalidade{
//     Sigla: string;
//     Quantidade: number;
// }



// interface ModalidadesProjeto extends IEntity {
//     Id: string;
//     Nome: string;
//     Modalidades: Modalidade[];
// }

// class ModalidadePorProjeto implements ModalidadesProjeto {
//     constructor(
//         public Id: string,
//         public Nome: string,
//         public Modalidades: Modalidade[]
//     ){
//         this.Id = Id;
//         this.Nome = Nome;
//         this.Modalidades = Modalidades;
//     }
// }

import ProjetoController from "../../../dashboard/controller/ProjetoController";
import { GenericStore } from "./generic/GenericStore";
import Projeto from "@/pagamento/model/Projeto";

const projetoController = new ProjetoController();
const genericStore = new GenericStore<IProjeto>('modalidadesProjeto');
const modalidadesProjeto: Projeto[] = [
    new Projeto("1", "Projeto1"),
]

if (import.meta.env.VITE_DEV_MOCK === "true") genericStore.enableMock(async () => modalidadesProjeto)
export const useProjetoStore = genericStore.createStore(projetoController);