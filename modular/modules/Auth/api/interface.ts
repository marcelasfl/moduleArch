export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface AuthServiceInterface {
  login(data: LoginRequest): Promise<LoginResponse>;
  register(data: RegisterRequest): Promise<void>;
  logout(): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  
  // Métodos adicionais usados no store
  isAuthenticated(token?: string): boolean;
  clearAuthData(): void;
}