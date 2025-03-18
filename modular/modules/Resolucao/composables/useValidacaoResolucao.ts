import { z } from "zod";

export const resolucaoSchema = z.object({
  Numero: z.number().positive('Número inválido'),
  Data: z.string().min(1, 'Data de publicação é obrigatória'),
  Ementa: z.string().min(1, 'Ementa deve ter entre 1 e 500 caracteres').max(500, 'Ementa deve ter entre 1 e 500 caracteres'),
  Link: z.string({
    required_error: 'O link é obrigatório',
  }).min(1, 'O link é obrigatório'),
  NumRastreioEdocs: z.string().min(1, 'O número do E-Docs é obrigatório'),
});


