
import type Pessoa from "./Pessoa";
import type VersaoNivel from "@/services/requires/objects/modalidadebolsa/VersaoNivel";
// import type VersaoNivel from "./VersaoNivel";
import type { IEntity } from "./generic/IEntity";
import type Projeto from "./Projeto";

export interface IBolsistas extends IEntity {
    Id: string,
    DataInicio: string,
    DataFimPrevistaAtividade: string,
    DataFimAtividade: string,
    QtdeCotasAlocadas: number,
    QtdeCotasPagasPreImportacao: number,
    Status: string,
    PossuiReducaoBolsa: number,
    Pessoa?: Pessoa,
    VersaoNivel?: VersaoNivel,
    Projeto?: Projeto
          
}

export default class Bolsistas implements IBolsistas {

    constructor(
        public Id: string,
        public DataInicio: string,
        public DataFimPrevistaAtividade: string,
        public DataFimAtividade: string,
        public QtdeCotasAlocadas: number,
        public QtdeCotasPagasPreImportacao: number,
        public Status: string,
        public PossuiReducaoBolsa: number,
        public Pessoa?: Pessoa,
        public VersaoNivel?: VersaoNivel,
        public Projeto?: Projeto
                
    ) {
        this.Id = Id,
        this.DataInicio = DataInicio,
        this.DataFimPrevistaAtividade = DataFimPrevistaAtividade,
        this.DataFimAtividade = DataFimAtividade,
        this.QtdeCotasAlocadas = QtdeCotasAlocadas,
        this.QtdeCotasPagasPreImportacao = QtdeCotasPagasPreImportacao,
        this.Status = Status,
        this.PossuiReducaoBolsa = PossuiReducaoBolsa
        this.Pessoa = Pessoa,
        this.VersaoNivel = VersaoNivel
        this.Projeto = Projeto

    }

}