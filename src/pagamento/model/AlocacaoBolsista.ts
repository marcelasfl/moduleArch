import type { IEntity } from "./generic/IEntity";
import type Pessoa from "./Pessoa";
import Projeto from "./Projeto";
import type VersaoNivel from "./VersaoNivel";

export interface IAlocacaoBolsista extends IEntity {
    Id: string;
    InicioAtividade?: string;
    DataPrevistaFimAtividade?: string;
    QtdeCotasAlocadas?: number;
    QtdeCotasPagasPreImportacao?: number;
    Status?: string;
    Projeto?: Projeto;
    VersaoNivel?: VersaoNivel;
    Pessoa?: Pessoa;
}


export default class AlocacaoBolsista implements IAlocacaoBolsista {

    constructor(
        public Id: string,
        public InicioAtividade?: string,
        public DataPrevistaFimAtividade?: string,
        public QtdeCotasAlocadas?: number,
        public QtdeCotasPagasPreImportacao?: number,
        public Status?: string,
        public Projeto?: Projeto,
        public VersaoNivel?: VersaoNivel,
        public Pessoa?: Pessoa
    ) {
        this.Id = Id;
        this.InicioAtividade = InicioAtividade;
        this.DataPrevistaFimAtividade = DataPrevistaFimAtividade;
        this.QtdeCotasAlocadas = QtdeCotasAlocadas;
        this.QtdeCotasPagasPreImportacao = QtdeCotasPagasPreImportacao;
        this.Status = Status;
        this.Projeto = Projeto;
        this.VersaoNivel = VersaoNivel;
        this.Pessoa = Pessoa;
    }

}