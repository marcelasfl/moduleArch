import { ValidationError } from './ValidationError';
import type { ValidationStrategy } from './ValidationStrategy';

class Validator {
    private strategies: ValidationStrategy[];
    public validationErrors: ValidationError[] = [];
    
    constructor(...strategies: ValidationStrategy[]) {
        this.strategies = strategies;
    }
    
    validate(value: any): ValidationError[] {
        this.validationErrors = [];
        if (value == undefined) return [];
        for (const strategy of this.strategies) {   
            try {
                strategy.validate(value);
            } catch (error: unknown) {
                if (error instanceof ValidationError) {
                    this.validationErrors.push(error);
                } else {
                    throw error; // Relança se não for um ValidationError
                }
            }
        }
        return this.validationErrors;
    }
}

export default Validator;
