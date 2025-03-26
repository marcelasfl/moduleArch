
export type AuthData = {
  email: string
  password: string
}

export type User = {
  unique_name: string,
  email: string,
  Cpf: string,
  role: string
}

export type AuthTokens = {
  authToken: string
}

export type RefreshTokenResponse = {
  refreshToken: string
  token: string
}
