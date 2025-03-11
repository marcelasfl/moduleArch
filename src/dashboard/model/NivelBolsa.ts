import type { IEntity } from "./generic/IEntity";

export interface INivelBolsa extends IEntity {
    Id: string;
    Sigla: string;
}


export default class NivelBolsa implements INivelBolsa {

    constructor(
        public Id: string,
        public Sigla: string
    ) {
        this.Id = Id;
        this.Sigla = Sigla;
    }

}