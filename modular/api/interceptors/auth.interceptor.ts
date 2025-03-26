

import type { AxiosRequestConfig } from 'axios';

export function authInterceptor(config: AxiosRequestConfig): AxiosRequestConfig {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
}