import { ValidationError } from "./ValidationError";
import { type ValidationStrategy } from "./ValidationStrategy";

// Validação para garantir que o valor seja booleano (representado como string "true" ou "false")
export class BooleanValidation implements ValidationStrategy {
    validate(value: string): void {
        if (value.toString() != 'true' && value.toString() != 'false') {
            throw new ValidationError("BooleanValidation", "O valor deve ser 'verdadeiro' ou 'falso'.");
        }
    }
}
