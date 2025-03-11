import type { IAtividade } from "@/pagamento/model/Atividade";

import AtividadeController from "../AtividadeController";
import { GenericStore } from "./generic/GenericStore";

const atividadeController = new AtividadeController();
const genericStore = new GenericStore<IAtividade>('atividade');

export const useAtividadeStore = genericStore.createStore(atividadeController);