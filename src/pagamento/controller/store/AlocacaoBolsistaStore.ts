import type { IAlocacaoBolsista } from "@/pagamento/model/AlocacaoBolsista";
import Projeto from "@/pagamento/model/Projeto";
import VersaoNivel from "@/pagamento/model/VersaoNivel";
import Pessoa from "@/pagamento/model/Pessoa";
import NivelBolsa from "@/pagamento/model/NivelBolsa";
import Edital from "@/pagamento/model/Edital";
import AlocacaoBolsista from "@/pagamento/model/AlocacaoBolsista";
import AlocacaoBolsistaController from "../../../dashboard/controller/AlocacaoBolsistaController";
import { GenericStore } from "./generic/GenericStore";
import { defineStore } from 'pinia';


// const alocacaoBolsistaController = new AlocacaoBolsistaController();
// const genericStore = new GenericStore<IAlocacaoBolsista>('alocacaoBolsista');
// const alocacoesBolsistas: AlocacaoBolsista[] = [
//     new AlocacaoBolsista("1", '2024-01-10', '2025-01-10', 12, 2, 'Ativa', 
//         new Projeto("1", "Projeto1", '2024-01-01', '2025-12-31', new Edital("1", "Edital1", '2024-01-01', '2025-12-31', "1", "ATIVO")), 
//         new VersaoNivel("1", 1000.0, new NivelBolsa("1", "SIGLA")), 
//         new Pessoa("1", "Nome1")),
// ]

// if (import.meta.env.VITE_DEV_MOCK === "true") genericStore.enableMock(async () => alocacoesBolsistas)
// export const useAlocacaoBolsistaStore = genericStore.createStore(alocacaoBolsistaController);
export const useAlocacaoBolsistaStore = defineStore('alocacaoBolsista', {
    state: () => ({
      dados: [], // Array para armazenar os dados
    }),
    actions: {
      async fetchDados() {
        try {
          // Substitua pela chamada correta da API
          const response = await fetch('/api/alocacao');
          this.dados = await response.json();
        } catch (error) {
          console.error('Erro ao buscar dados:', error);
        }
      },
    },
  });