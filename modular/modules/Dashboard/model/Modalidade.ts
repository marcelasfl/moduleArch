export interface IModalidade {
    sigla: string;
    quantidade: number;
}

export default class Modalidade implements IModalidade {

    constructor(
        public sigla: string,
        public quantidade: number,
    ) {
        this.sigla = sigla;
        this.quantidade = quantidade;
    }

}