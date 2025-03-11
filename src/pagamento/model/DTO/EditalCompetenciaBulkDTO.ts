export interface IEditalCompetenciaBulkDTO { 
    "editais": {
      "editalCompetenciaId": string,
      "status": number,
      "justificativa"?: string
    } []
} 