import type { IPlanoMensal } from "../../../pagamento/model/PlanoMensal";
import PlanoMensal from '../../../pagamento/model/PlanoMensal';

export default interface IPlanoMensalRepository {
  // Busca todos os planos mensais, com filtro opcional
  fetchAllPlanoMensal(filter?: string): Promise<PlanoMensal[]>;

  // Busca um plano mensal específico pelo ID
  fetchPlanoMensalById(id: string | number): Promise<PlanoMensal>;

  // Cria um novo plano mensal
  createPlanoMensal(data: IPlanoMensal): Promise<IPlanoMensal>;

  // Atualiza um plano mensal específico pelo ID
  updatePlanoMensal(id: string | number, data: Partial<IPlanoMensal>): Promise<IPlanoMensal>;

  // Deleta um plano mensal específico pelo ID
  deletePlanoMensal(id: string | number): Promise<boolean>;
}
