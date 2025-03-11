import { ValidationError } from "./ValidationError";
import { type ValidationStrategy } from "./ValidationStrategy";

export class MaxLengthValidation implements ValidationStrategy {
    private maxLength: number;

    constructor(maxLength: number) {
        this.maxLength = maxLength;
    }

    validate(value: string): void {
        if (value.length > this.maxLength) {
            throw new ValidationError("MaxLength", `O valor deve ter no máximo ${this.maxLength} caracteres.`);
        }
    }
}
