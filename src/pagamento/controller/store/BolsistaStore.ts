import type { IEntity } from "../../model/generic/IEntity";


interface DadosBolsista extends IEntity {
    Id: string;
    Nome: string;
    Status: string;
    Sigla: string;
    CotasPagas: number;
    CotasAPagar: number;
    ValorBolsa: number;
    ValorPago: number;
    ValorAPagar: number;
}

class Bolsista implements DadosBolsista {
    constructor(
        public Id: string,
        public Nome: string,
        public Status: string,
        public Sigla: string,
        public CotasPagas: number,
        public CotasAPagar: number,
        public ValorBolsa: number,
        public ValorPago: number,
        public ValorAPagar: number
    ){
        this.Id = Id;
        this.Nome = Nome;
        this.Status = Status;
        this.Sigla = Sigla;
        this.CotasPagas = CotasPagas;
        this.CotasAPagar = CotasAPagar;
        this.ValorBolsa = ValorBolsa;
        this.ValorPago = ValorPago;
        this.ValorAPagar = ValorAPagar;
    }
}

import type { IPessoa } from "@/pagamento/model/Pessoa";
import Pessoa from "@/pagamento/model/Pessoa";
import PessoaController from "../../../dashboard/controller/PessoaController";
import { GenericStore } from "./generic/GenericStore";

//const pessoaController = new PessoaController();
const genericStore = new GenericStore<DadosBolsista>('bolsistas');
const bolsistas: Bolsista[] = [
    new Bolsista("1", "Nome1", "Ativa", "SIGLA", 12, 2, 1000.0, 1000.0, 1000.0)
]

if (import.meta.env.VITE_DEV_MOCK === "true") genericStore.enableMock(async () => bolsistas)
//export const usePessoaStore = genericStore.createStore(pessoaController);