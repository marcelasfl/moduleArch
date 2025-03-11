export interface IBolsistaTempo {
    id: string,
    projetoId: string,
    mesReferencia: string,
    qtdAtivos: number,
    qtdSairam: number,
    qtdEntraram: number
}


export default class BolsistaTempo implements IBolsistaTempo {

    constructor(
        public id: string,
        public projetoId: string,
        public mesReferencia: string,
        public qtdAtivos: number,
        public qtdSairam: number,
        public qtdEntraram: number
    ) {
        this.id = id;
        this.projetoId = projetoId;
        this.mesReferencia = mesReferencia;
        this.qtdAtivos = qtdAtivos;
        this.qtdSairam = qtdSairam;
        this.qtdEntraram = qtdEntraram;
    }

}