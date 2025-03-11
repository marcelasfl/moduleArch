import { ValidationError } from "./ValidationError";
import { type ValidationStrategy } from "./ValidationStrategy";

// Validação para permitir apenas letras e números
export class AlphanumericValidation implements ValidationStrategy {
    validate(value: string): void {
        if (!/^[a-zA-Z0-9]*$/.test(value)) {
            throw new ValidationError("Alphanumeric", "O valor deve conter apenas letras e números.");
        }
    }
}
