import { z } from "zod";

const resolucaoSchema = z.object({
  Numero: z.number().positive('Número inválido'),
  Data: z.string().min(1, 'Data de publicação é obrigatória'),
  Ementa: z.string().min(1, 'Ementa deve ter entre 1 e 500 caracteres').max(500, 'Ementa deve ter entre 1 e 500 caracteres'),
  Link: z.string().regex(/^https:\/\/fapes\.es\.gov\.br/, 'O link deve ser do domínio da Fapes'),
  NumRastreioEdocs: z.string().min(1, 'O número do E-Docs é obrigatório'),
});


export function useValidacaoResolucao() {
  return resolucaoSchema;
}