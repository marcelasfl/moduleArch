import type { IEdital } from "@/pagamento/model/Edital";

import EditalController from "../../../pagamento/controller/EditalController";
import { GenericStore } from "./generic/GenericStore";
import Edital from "@/pagamento/model/Edital";

const editalController = new EditalController();
const genericStore = new GenericStore<IEdital>('edital');
// const editais: Edital[] = [
//     new Edital("1", "Edital1", "2021-09-01", "AreaTecnica1", "1", "Status1", "1", "ESD10000001", "2024-4NWGJ"),
// ]

// if (import.meta.env.VITE_DEV_MOCK === "true") genericStore.enableMock(async () => editais)
export const useEditalStore = genericStore.createStore(editalController);