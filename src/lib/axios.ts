
import axios from 'axios';

// Create an Axios instance
const getBaseURL = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined') return window.location.origin + '/api';
  return 'http://localhost:3000/api'; // Fallback for SSR
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add logic here to attach tokens from local storage or state if needed
    // Example: config.headers.Authorization = `Bearer ${token}`; 
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Global error handling, e.g., redirect to login on 401
    if (error.response && error.response.status === 401) {
        // Handle unauthorized access logic
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
