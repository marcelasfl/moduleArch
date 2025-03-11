import type AlocacaoBolsista from "./AlocacaoBolsista";
import type Projeto from "./Projeto";
import type VersaoNivel from "@/services/requires/objects/modalidadebolsa/VersaoNivel";
import type { IEntity } from "./generic/IEntity";
import type NivelBolsa from "./NivelBolsa";
import type Atividade from "./Atividade";
import type { IProjeto } from "./Projeto";

export interface IEdital extends IEntity {
      Nome: string,
      DataCriacao: string,
      AreaTecnica: string,
      EditalAreaTecnicaId: string,
      IdSigFapes: number,
      Status: string,
      StatusImportacao: string,
      InscricaoGenerica: string,
      Processo: string,
      Atividade: string,
      EditalAtividadeId: string,
      Projetos?: IProjeto[],
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
        public IdSigFapes: number,
        public Status: string,
        public StatusImportacao: string,
        public InscricaoGenerica: string,
        public Processo: string,
        public Atividade: string,
        public EditalAtividadeId: string,
        public Projetos?: IProjeto[],
        public AlocacaoBolsistas?: AlocacaoBolsista[],
        public VersaoNivel?: VersaoNivel,
        public NivelBolsas?: NivelBolsa

        
    ) {
        this.Id = Id;
        this.Nome = Nome;
        this.DataCriacao = DataCriacao;
        this.AreaTecnica = AreaTecnica;
        this.EditalAreaTecnicaId = EditalAreaTecnicaId,
        this.IdSigFapes = IdSigFapes;
        this.Status = Status,
        this.Processo = Processo,
        this.Atividade = Atividade;
        this.EditalAtividadeId;
        this.Projetos = Projetos,
        this.AlocacaoBolsistas = AlocacaoBolsistas,
        this.VersaoNivel = VersaoNivel,
        this.NivelBolsas = NivelBolsas;
        this.StatusImportacao = StatusImportacao;
        this.InscricaoGenerica = InscricaoGenerica;
        this.Projetos = Projetos;
    }

}