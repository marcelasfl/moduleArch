import { defineStore } from 'pinia'
import { authService } from '../api/factory'
import { AuthStorageService } from '../services/storage.service'
import type { User } from "../types/auth.types"

export const useAuthStore = defineStore('auth', {
  state: () => {
    const storageService = new AuthStorageService()
    return {
      user: storageService.getUser() || ({} as User),
      token: storageService.getAuthToken() || undefined,
      refreshToken: storageService.getRefreshToken() || undefined,
    }
  },
  
  getters: {
    isAuthenticated(): boolean {
      return authService.isAuthenticated(this.token)
    },
    
    getUser(): User {
      return this.user
    },
    
    getToken(): string | undefined {
      return this.token
    },
    
    getRefreshToken(): string | undefined {
      return this.refreshToken
    }
  },
  
  actions: {
    setUser(user: User) {
      const storageService = new AuthStorageService()
      storageService.saveUser(user)
      this.user = user
    },
    
    setToken(token: string) {
      const storageService = new AuthStorageService()
      storageService.saveAuthToken(token)
      this.token = token
    },
    
    setRefreshToken(refreshToken: string) {
      const storageService = new AuthStorageService()
      storageService.saveRefreshToken(refreshToken)
      this.refreshToken = refreshToken
    },
    
    async logout() {
      try {
        // Chama o endpoint de logout
        await authService.logout()
      } catch (error) {
        console.error('Erro ao fazer logout no servidor', error)
      } finally {
        // Limpa os dados mesmo se o logout remoto falhar
        authService.clearAuthData()
        this.user = {} as User
        this.token = undefined
        this.refreshToken = undefined
      }
    },
    
    async login(credentials: { email: string, password: string }) {
      try {
        const response = await authService.login(credentials)
        this.setUser(response.user)
        this.setToken(response.token)
        if (response.refreshToken) {
          this.setRefreshToken(response.refreshToken)
        }
        return response
      } catch (error) {
        console.error('Erro no login', error)
        throw error
      }
    }
  }
}) 