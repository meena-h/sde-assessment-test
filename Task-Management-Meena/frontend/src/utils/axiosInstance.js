import axios from 'axios';
import { BASE_URL } from './apiPath';

// Create Axios instance
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// Request interceptor to attach token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle common errors
axiosInstance.interceptors.response.use(
    (response) => response, // Return response if success
    (error) => {
        if (error.code === 'ECONNABORTED') {
            // Handle timeout
            console.error('Request timeout. Please try again.');
            alert('Request timeout. Please try again.');
        } else if (!error.response) {
            // Network error
            console.error('Network error. Please check your connection.');
            alert('Network error. Please check your connection.');
        } else if (error.response.status === 401) {
            // Unauthorized → redirect to login
            console.error('Unauthorized. Redirecting to login...');
            localStorage.removeItem('token');
            window.location.href = '/login';
        } else if (error.response.status >= 500) {
            // Server error
            console.error('Server error. Please try later.');
            alert('Server error. Please try later.');
        } else {
            // Other errors
            console.error(error.response.data);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
