export interface IMesDetalhesLiberacaoPorMes {
    edital: string,
    status: number,
    bolsasVigentes: number,
    bolsasPendentes: number,
    bolsasAPagar: number,
    valorTotal: number
}

export default class MesDetalhesLiberacaoPorMes implements IMesDetalhesLiberacaoPorMes{
    
    constructor(public edital: string, public status: number, public bolsasVigentes: number, public bolsasPendentes: number, public bolsasAPagar: number, public valorTotal: number) {
        this.edital = edital;
        this.status = status;
        this.bolsasVigentes = bolsasVigentes;
        this.bolsasPendentes = bolsasPendentes;
        this.bolsasAPagar = bolsasAPagar;
        this.valorTotal = valorTotal;
    };
};