import axios, { type AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({ 
  baseURL: import.meta.env.VITE_BASE_URL
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




export default api;




//Add interceptors in order to mock responses to enable fast frontend development. 
const DEVELOPMENT = true
//if(DEVELOPMENT){
 //  const mock  = new MockBuilder();
 //  mock.addMockPlanoMensal().addMockXYZ();
//}



