import axiosInstance from "./axiosInstance";
import { toast } from "react-toastify";

const apiService = {
  get: async (endpoint, params = {}) => {
    try {
      const response = await axiosInstance.get(endpoint, { params });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  post: async (endpoint, data) => {
    try {
      const response = await axiosInstance.post(endpoint, data);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  put: async (endpoint, data) => {
    try {
      const response = await axiosInstance.put(endpoint, data);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  delete: async (endpoint) => {
    try {
      const response = await axiosInstance.delete(endpoint);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};

// Helper function to handle API errors
const handleApiError = (error) => {
  const errorMessage =
    error.response?.data?.message ||
    error.response?.data?.error ||
    "An error occurred. Please try again.";
  toast.error(errorMessage, { position: "bottom-left" });
};

export default apiService;
