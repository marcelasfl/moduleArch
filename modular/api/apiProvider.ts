import axios, { AxiosError, type AxiosInstance } from 'axios';
import { provide } from 'vue';
import { AreaTecnicaService } from '../modules/Dashboard/api/services/dashboardService';
import { errorFactory } from './factory/ErrorFactory';

const api: AxiosInstance = axios.create({
  baseURL: (import.meta as any).env.VITE_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    Promise.reject(errorFactory(error.response?.status));
  }
);

export function provideServices() {
  provide('api', api);
  provide('areaTecnicaService', new AreaTecnicaService(api));  
}

export default api;
