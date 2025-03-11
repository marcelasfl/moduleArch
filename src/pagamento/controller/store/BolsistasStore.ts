import type { IBolsistas } from "@/pagamento/model/Bolsistas";

import BolsistasController from "../BolsistasController";
import { GenericStore } from "./generic/GenericStore";


const bolsistasController = new BolsistasController();
const genericStore = new GenericStore<IBolsistas>('bolsista');

export const useBolsistasStore = genericStore.createStore(bolsistasController);