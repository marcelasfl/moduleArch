import type { ApiError } from "../entities/ApiError";

export const errorFactory = (statusCode: number = 500) => {
  let error:ApiError = {
    status: statusCode,
    message: ''
  }

  if (statusCode)
    switch (statusCode) {
    case 404:
      error.message = 'Ops! Página não encontrada!'
      break;
    
    default:
      error.message = 'Erro no servidor, tente novamente mais tarde'
      break;
  }

  //todo undefined retornará 500, será que é a melhor saída?
}