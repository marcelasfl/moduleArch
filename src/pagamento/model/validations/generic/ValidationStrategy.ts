export interface ValidationStrategy {
    validate(...value: any): void;
}
