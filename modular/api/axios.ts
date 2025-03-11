import axios, { AxiosError, type AxiosInstance } from 'axios';
import { errorFactory } from './factory/ErrorFactory';

const api: AxiosInstance = axios.create({ 
  baseURL: import.meta.env.VITE_BASE_URL
  // inserir timeout?
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    console.log('Token:', token); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error); 
    return Promise.reject(error);
  }
);

//SUGESTAO
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    Promise.reject(errorFactory(error.response?.status))

    // - Ideias
    // Ja que é obrigatório a autenticação pra acessar o sistema e se no erro 401 fizermos logout?
  }
);


export default api;