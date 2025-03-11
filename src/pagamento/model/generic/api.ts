import axios from 'axios';

const fileApi = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        "Content-Type": "multipart/form-data",
    },    
});

fileApi.interceptors.request.use(
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
export default fileApi;