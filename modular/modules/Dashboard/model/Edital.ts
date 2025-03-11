import type AlocacaoBolsista from "./AlocacaoBolsista";
import type Projeto from "./Projeto";
import type VersaoNivel from "@/services/requires/objects/modalidadebolsa/VersaoNivel";
import type { IEntity } from "./generic/IEntity";
import type NivelBolsa from "./NivelBolsa";

export interface IEdital extends IEntity {
      Nome: string,
      DataCriacao: string,
      AreaTecnica: string,
      EditalAreaTecnicaId: string,
      Status: string,
      Projetos?: Projeto[],
      [key: number]: any;
      AlocacaoBolsistas?: AlocacaoBolsista[],
      [key: string]: any;
      VersaoNivel?: VersaoNivel,
      NivelBolsas?: NivelBolsa
}



export default class Edital implements IEdital {

    constructor(
        public Id: string,
        public Nome: string,
        public DataCriacao: string,
        public AreaTecnica: string,
        public EditalAreaTecnicaId: string,
        public Status: string,
        public Projetos?: Projeto[],
        public AlocacaoBolsistas?: AlocacaoBolsista[],
        public VersaoNivel?: VersaoNivel,
        public NivelBolsas?: NivelBolsa


    ) {
        this.Id = Id;
        this.Nome = Nome;
        this.DataCriacao = DataCriacao;
        this.AreaTecnica = AreaTecnica;
        this.EditalAreaTecnicaId = EditalAreaTecnicaId,
        this.Status = Status,
        this.Projetos = Projetos,
        this.AlocacaoBolsistas = AlocacaoBolsistas,
        this.VersaoNivel = VersaoNivel,
        this.NivelBolsas = NivelBolsas
    }

}