import type { IAreaTecnica } from '../AreaTecnica';
import AreaTecnica from '../AreaTecnica';
import type { BaseConfig } from './apiRoutes/BaseConfig';

export default interface IAreaTecnicaRepository {
  // Busca todos as areas tecnicas, com filtro opcional
  fetchAllAreaTecnica(filter?: string): Promise<AreaTecnica[]>;

  // Busca uma area tecnica específico pelo ID
  fetchAreaTecnicaById(id: string | number): Promise<AreaTecnica>;

  // Cria um nova area tecnica
  createAreaTecnica(data: IAreaTecnica): Promise<IAreaTecnica>;

  // Atualiza uma area tecnica específica pelo ID
  updateAreaTecnica(id: string | number, data: Partial<IAreaTecnica>): Promise<IAreaTecnica>;

  // Deleta uma area tecnica específica pelo ID
  deleteAreaTecnica(id: string | number): Promise<boolean>;
  
  // Busca todas as areas tecnicas paginadas
  fetchPaginatedAreaTecnica(config: BaseConfig, filter?: string): Promise<AreaTecnica[]>;

  // Busca a quantidade de area tecnicas
  countAreaTecnica(): Promise<number>;
}
