import type { IEntity } from "./generic/IEntity";
import type NivelBolsa from "./NivelBolsa";

export interface IVersaoNivel extends IEntity {
    Id: string;
    Valor: number;
    NivelBolsa: NivelBolsa;
    [key: string]: any;
}


export default class VersaoNivel implements IVersaoNivel {

    constructor(
        public Id: string,
        public Valor: number,
        public NivelBolsa: NivelBolsa
    ) {
        this.Id = Id;
        this.Valor = Valor;
        this.NivelBolsa = NivelBolsa;
    }

}