import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT || 10000, // Optional timeout
});

// Add a request interceptor (optional, for adding auth tokens or logging)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor (optional, for error handling or transforming response)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle API errors globally
    if (error.response) {
      console.error("API Error:", error.response.data.message || error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
