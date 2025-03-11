//O model representa a estrutura dos dados e as regras de validação para um plano mensal.
//Essa classe assegura que os dados do plano mensal estão corretos antes de serem persistidos ou usados.

import type { IEntity } from "./generic/IEntity";
import { ValidationError } from "./validations/generic/ValidationError";
import Validator from "./validations/generic/Validator";
import PlanoMensalRules from "./PlanoMensalRules";
import type { IFolha } from "./Folha";
export interface IPlanoMensal extends IEntity {
    Id: string;
    Mes: string | number;
    MarcoSolicitacaoBolsa: string;
    MarcoGeracaoFolha: string,  
    MarcoPagamento: string;
    EhAtual: boolean;
    Folhas?: IFolha[];
}

export default class PlanoMensal implements IPlanoMensal {

    private rules: PlanoMensalRules;
    private errors: ValidationError[][];

    constructor(
        public Id: string, 
        public Mes: string | number, 
        public MarcoSolicitacaoBolsa: string,  
        public MarcoGeracaoFolha: string,  
        public MarcoPagamento: string,  
        public EhAtual: boolean,
        public Folhas?: IFolha[]
    ) {
        this.Id = Id;
        this.Mes = Mes;
        this.MarcoSolicitacaoBolsa = MarcoSolicitacaoBolsa;
        this.MarcoGeracaoFolha = MarcoGeracaoFolha;
        this.MarcoPagamento = MarcoPagamento;
        this.EhAtual = EhAtual;
        this.Folhas = Folhas;

        // Inicializa as regras de validação
        this.rules = new PlanoMensalRules();
        this.errors = [];
        this.validateAll();
    }

    // Validação de um campo específico
    validateField(field: string, value:  any): void {
        const validator = this.rules.getRulesByFieldName(field as string);
        if (validator instanceof Validator) {
            const validacao = validator.validate(value);
            if (validacao.length > 0) this.errors.push(validator.validate(value));
        }
    }

    // Validação de todos os campos
    public validateAll(): void {
        ["Mes", "MarcoSolicitacaoBolsa", "MarcoGeracaoFolha", "MarcoPagamento", "EhAtual"].forEach(field => {
            this.validateField(field, this[field as keyof this]);
        });

        this.hasIndividualErrors();

        this.validateM1M2M3();
    }

    // Verifica se há erros nos campos
    hasIndividualErrors() {
        if (this.errors.length > 0) {
            this.errors.forEach(erro => {
                throw erro;
            });
        }
    }

    // Validação de regras de negócio
    validateM1M2M3(){
        const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        const mes = meses[new Date(this.Mes).getUTCMonth()];
        if (new Date(this.MarcoSolicitacaoBolsa) >= new Date(this.MarcoGeracaoFolha)) {
            throw new ValidationError("InvalidDateOrder", `O marco M1 deve ocorrer antes do marco M2 no mês de ${mes}.`);
        }

        if (new Date(this.MarcoGeracaoFolha) >= new Date(this.MarcoPagamento)) {
            throw new ValidationError("InvalidDateOrder", `O marco M2 deve ocorrer antes do marco M3 no mês de ${mes}.`);
        }
    }
}