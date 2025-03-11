import { ValidationError } from './ValidationError';
import type { ValidationStrategy } from './ValidationStrategy';

class MinValueValidation implements ValidationStrategy {
    private min: number;
    
    constructor(min: number) {
        this.min = min;
    }
    
    validate(value: number): true | string {
        if (value >= this.min) {
            return true
        } else {
            throw new ValidationError("MinValue", `O valor deve ser no mínimo ${this.min}.`);
        }
    }
}

export default MinValueValidation;
