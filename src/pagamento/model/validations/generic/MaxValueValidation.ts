import { ValidationError } from './ValidationError';
import type { ValidationStrategy } from './ValidationStrategy';

class MaxValueValidation implements ValidationStrategy {
    private max: number;
    
    constructor(max: number) {
        this.max = max;
    }
    
    validate(value: number): true | string {
        if (value <= this.max) {
            return true
        } else {
            throw new ValidationError("MaxValue", `O valor deve ser no máximo ${this.max}.`);
        }
    }
}

export default MaxValueValidation;
