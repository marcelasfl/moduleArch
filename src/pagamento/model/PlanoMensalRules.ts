//Define regras de validação específicas para cada campo de PlanoMensal.
//rules: uma lista de regras para os campos como Mes, EhAtual, e marcos de datas, aplicando validações específicas.

import { BooleanValidation } from "./validations/generic/BooleanValidation";
import { DateValidation } from "./validations/generic/DateValidation";
import MaxValueValidation from "./validations/generic/MaxValueValidation";
import MinValueValidation from "./validations/generic/MinValueValidation";
import Validator from "./validations/generic/Validator";

export interface Rule {
    field: string;
    validator: Validator;
}

export class PlanoMensalRules {
    rules: Rule[] = [];

    constructor() {
        this.rules.push({ field: 'Mes', validator: new Validator(new DateValidation()) });
        this.rules.push({ field: 'EhAtual', validator: new Validator(new BooleanValidation()) });
        this.rules.push({ field: 'MarcoSolicitacaoBolsa', validator: new Validator(new DateValidation()) });
        this.rules.push({ field: 'MarcoGeracaoFolha', validator: new Validator(new DateValidation()) });
        this.rules.push({ field: 'MarcoPagamento', validator: new Validator(new DateValidation()) })
    }

    getRulesByFieldName(name: string) {
        return this.rules.find(rule => rule.field === name)?.validator || new Validator();
    }
}

export default PlanoMensalRules;
