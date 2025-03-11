import type { IEntity } from "./generic/IEntity";

// TODO: Fazer essas classes edital,planomensal pra colocar aqui, é case sensitive
export interface IEditalCompetencia extends IEntity {
    id: string,
    valorPrevisto: number,
    valorPago: number,
    bolsasVigentes: number,
    bolsasPendentes: number,
    mesCompetencia: string,
    status: string,
    filter?: boolean
    edital: {
        nome: string,
        dataCriacao: string,
        areaTecnica: {
            nome: string,
            descricao: string,
            id: string,
        },
        editalAreaTecnicaId: string,
        status: number,
        id: string,
    },
    // planoMensal: {
    //     mes: string,
    //     marcoSolicitacaoBolsa: string,
    //     marcoGeracaoFolha: string,
    //     marcoPagamento: string,
    //     ehAtual: true,
    //     id: string,
    // },
    decisaoLiberacoes: [
        {
            horario: string,
            ehLiberado: boolean,
            justificativa: string,
            decisaoLiberacaoUsuarioId: string,
            id: string,
        }
    ],
    // editalCompetenciaPlanoMensalId: string,
}

export default class EditalCompetencia implements IEditalCompetencia{
    
    constructor(public Id: string, public id: string, public valorPrevisto: number, public valorPago: number, 
        public bolsasVigentes: number, public bolsasPendentes: number, public mesCompetencia: string, public status: string,
        public edital: {
            nome: string,
            dataCriacao: string,
            areaTecnica: {
                nome: string,
                descricao: string,
                id: string,
            },
            editalAreaTecnicaId: string,
            status: number,
            id: string,
        }, 
        public decisaoLiberacoes: [
            {
                horario: string,
                ehLiberado: boolean,
                justificativa: string,
                decisaoLiberacaoUsuarioId: string,
                id: string,
            }
        ]) {
            this.Id = Id;
            this.id = id;
            this.valorPrevisto = valorPrevisto;
            this.valorPago = valorPago;
            this.bolsasVigentes = bolsasVigentes;
            this.bolsasPendentes = bolsasPendentes;
            this.mesCompetencia = mesCompetencia;
            this.status = status;
            this.edital = edital;
            this.decisaoLiberacoes = decisaoLiberacoes;
    }
}