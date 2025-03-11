import InfosGeraisAreaTecnica from '../InfosGeraisAreaTecnica';
import type InfosGeraisEdital from '../InfosGeraisEdital';
import type InfosGeraisProjeto from '../InfosGeraisProjeto';

export default interface IInfosGeraisRepository {

  // Busca todos as areas tecnicas, com filtro opcional
  fetchAllInfosGeraisAreaTecnica(filter?: string): Promise<InfosGeraisAreaTecnica[]>;

  // Busca uma area tecnica específico pelo ID
  fetchInfosGeraisAreaTecnicaById(id: string | number): Promise<InfosGeraisAreaTecnica>;

  fetchAllInfosGeraisProjeto(filter?: string): Promise<InfosGeraisProjeto[]>;

  fetchInfosGeraisProjetoById(id: string | number): Promise<InfosGeraisProjeto>;
  
  fetchAllInfosGeraisEdital(filter?: string): Promise<InfosGeraisEdital[]>;

  fetchInfosGeraisEditalById(id: string | number): Promise<InfosGeraisEdital>;

  fetchInfosGeraisProjetoById(id: string | number): Promise<InfosGeraisProjeto>;
}
