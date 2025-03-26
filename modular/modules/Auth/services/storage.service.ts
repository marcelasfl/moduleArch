import type { User } from "../types/auth.types"

// Serviço responsável por gerenciar o armazenamento local
export class AuthStorageService {
  getUser(): User | null {
    const userData = localStorage.getItem('user')
    return userData ? JSON.parse(userData) : null
  }

  saveUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user))
  }

  removeUser(): void {
    localStorage.removeItem('user')
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken')
  }

  saveAuthToken(token: string): void {
    localStorage.setItem('authToken', token)
  }

  removeAuthToken(): void {
    localStorage.removeItem('authToken')
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken')
  }

  saveRefreshToken(token: string): void {
    localStorage.setItem('refreshToken', token)
  }

  removeRefreshToken(): void {
    localStorage.removeItem('refreshToken')
  }
} 