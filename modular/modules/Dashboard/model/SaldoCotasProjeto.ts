
export interface ISaldoCotasProjeto  {
    projetoId: string;
    sigla: number;
    qtdPlanejada: string;
    qtdAlocada: number;
    qtdDisponivel: string;
    valorUnitario: string;
    versaoNivelId: string;
}


export default class SaldoCotasProjeto implements ISaldoCotasProjeto {

    constructor(
        public projetoId: string,
        public sigla: number,
        public qtdPlanejada: string,
        public qtdAlocada: number,
        public qtdDisponivel: string,
        public valorUnitario: string,
        public versaoNivelId: string,

    ) {
        this.projetoId = projetoId;
        this.sigla = sigla;
        this.qtdPlanejada = qtdPlanejada;
        this.qtdAlocada = qtdAlocada;
        this.qtdDisponivel = qtdDisponivel;
        this.valorUnitario = valorUnitario;
        this.versaoNivelId = versaoNivelId;
    }
  

}