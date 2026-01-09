import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api", // Base points to root API
});

// Interceptor to attach the deliveryToken to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("deliveryToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;