import type { IEntity } from "./generic/IEntity";
import type Edital from "./Edital";

export interface IAreaTecnica extends IEntity {
    Id: string;
    Nome?: string;
    Descricao?: string;
    Editais?: Edital[];
    AreaTecnicaEditalId?: string;
}


export default class AreaTecnica implements IAreaTecnica {

    constructor(
        public Id: string,
        public Nome?: string,
        public Descricao?: string,
        public Editais?: Edital[],
        public AreaTecnicaEditalId?: string,
    ) {
        this.Id = Id;
        this.Nome = Nome;
        this.Descricao = Descricao;
        this.Editais = Editais;
        this.AreaTecnicaEditalId = AreaTecnicaEditalId;
    }

}