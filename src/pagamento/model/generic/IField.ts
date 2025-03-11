import type Validator from '@/pagamento/model/validations/generic/Validator';

export interface IField {
  key: string;
  type?: 'checkbox' | 'text' | 'select' | 'date';
  label: string;
  required?: boolean;
  default?: string | boolean;
  validator?: Validator
}