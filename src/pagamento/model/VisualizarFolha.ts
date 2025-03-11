export interface IVisualizarFolha {
    AreaTecnica: string;
    EditaisInclusos: number;
    QuantidadeBolsas: number;
    ValorAPagar: number;
}

export default class VisualizarFolha implements IVisualizarFolha {
    constructor(public AreaTecnica: string, public EditaisInclusos: number, public QuantidadeBolsas: number, public ValorAPagar: number) {
        this.AreaTecnica = AreaTecnica;
        this.EditaisInclusos = EditaisInclusos;
        this.QuantidadeBolsas = QuantidadeBolsas;
        this.ValorAPagar = ValorAPagar;
    }
}