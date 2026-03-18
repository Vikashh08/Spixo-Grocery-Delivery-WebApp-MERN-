import axios from "axios";

const getBaseURL = () => {
  const url = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
  if (url && !url.endsWith("/api") && !url.endsWith("/api/")) {
    return url.replace(/\/$/, "") + "/api";
  }
  return url;
};

const api = axios.create({
  baseURL: getBaseURL(),
});

console.log("🚀 API Base URL:", api.defaults.baseURL);

// Interceptor to attach the deliveryToken to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("deliveryToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;