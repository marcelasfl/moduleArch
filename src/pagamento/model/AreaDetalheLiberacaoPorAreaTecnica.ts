export interface IAreaDetalheLiberacaoPorAreaTecnica {
    areaTecnica: string,
    editaisNaoLiberados: number,
    bolsasAPagar: number,
    valorAPagar: number
}

export default class AreaDetalheLiberacaoPorAreaTecnica implements IAreaDetalheLiberacaoPorAreaTecnica {

    constructor(public areaTecnica: string, public editaisNaoLiberados: number, public bolsasAPagar: number, public valorAPagar: number) {
        this.areaTecnica = areaTecnica;
        this.editaisNaoLiberados = editaisNaoLiberados;
        this.bolsasAPagar = bolsasAPagar;
        this.valorAPagar = valorAPagar;
    };
};