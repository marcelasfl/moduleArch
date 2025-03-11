// stores/ModalidadesStore.ts
import AlocacaoBolsistaController from "@/dashboard/controller/AlocacaoBolsistaController";
import { defineStore } from "pinia";
import { ref } from "vue";

interface NivelCompletoVersaoModalidadeInterface {
  Sigla: string;
  Valor: string;
}

export const useModalidadesStore = defineStore("modalidades", () => {
  const niveis = ref<NivelCompletoVersaoModalidadeInterface[]>([]);
  const alocacaoBolsistaStore = new AlocacaoBolsistaController();

  const getPostsModalidadesOrcamento = async (editalId: string) => {
    try {
      const response = await alocacaoBolsistaStore.getAll(`Projeto/Edital/Id eq ${editalId}`);
      const data = response.alocacoes;

      if (!Array.isArray(data)) {
        throw new Error("Os dados recebidos não estão no formato esperado.");
      }

      const parsedData = data.map((item: any) => {
        const nivelBolsa = item?.VersaoNivel?.NivelBolsa || {};
        const versaoNivel = item?.VersaoNivel || {};

        return {
          Sigla: nivelBolsa.Sigla || "N/A",
          Valor: versaoNivel.Valor || "0",
        };
      });

      niveis.value = parsedData;
      console.log("niveis atualizado:", niveis.value);
    } catch (error) {
      console.error("Erro ao carregar dados das modalidades de orçamento:", error);
    }
  };

  return {
    niveis,
    getPostsModalidadesOrcamento,
  };
});
