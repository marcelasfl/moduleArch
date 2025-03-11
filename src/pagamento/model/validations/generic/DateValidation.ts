import { ValidationError } from "./ValidationError";
import { type ValidationStrategy } from "./ValidationStrategy";

// Validação para garantir que o valor seja uma data válida
export class DateValidation implements ValidationStrategy {
    validate(value: string): void {
        const date = new Date(value);
        
        // Verifica se a data é válida
        if (isNaN(date.getTime())) {
            throw new ValidationError("DateValidation", "O valor deve ser uma data válida.");
        }
    }
}
