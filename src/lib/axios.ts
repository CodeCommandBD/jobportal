
import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
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
