import type { InternalAxiosRequestConfig } from "axios";

export function authInterceptor(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
}
