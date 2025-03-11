export interface IBolsistaProjeto {
    id: string,
    nome: string,
    status: number, 
    siglaBolsa: string,
    cotasPagas: number,
    cotasAPagar: number,
    valorBolsa: number,
    valorAPagar: number,
    alocacaoBolsistaProjetoId: string,
    alocacaoBolsistaPessoaId: string,
    coordenadorAtual: boolean
}


export default class BolsistaProjeto implements IBolsistaProjeto {

    constructor(
        public id: string,
        public nome: string,
        public status: number,
        public siglaBolsa: string,
        public cotasPagas: number,
        public cotasAPagar: number,
        public valorBolsa: number,
        public valorAPagar: number,
        public alocacaoBolsistaProjetoId: string,
        public alocacaoBolsistaPessoaId: string,
        public coordenadorAtual: boolean
    ) {
        this.id = id;
        this.nome = nome;
        this.status = status;
        this.siglaBolsa = siglaBolsa;
        this.cotasPagas = cotasPagas;
        this.cotasAPagar = cotasAPagar;
        this.valorBolsa = valorBolsa;
        this.valorAPagar = valorAPagar;
        this.alocacaoBolsistaProjetoId = alocacaoBolsistaProjetoId;
        this.alocacaoBolsistaPessoaId = alocacaoBolsistaPessoaId;
        this.coordenadorAtual = coordenadorAtual;
    }

}