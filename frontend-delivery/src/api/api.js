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

// Simple global state for loader
let progressBarSetter = null;
export const setProgressBar = (setter) => { progressBarSetter = setter; };

// Interceptor to attach the deliveryToken to every request
api.interceptors.request.use((config) => {
  if (progressBarSetter) progressBarSetter(30);
  const token = localStorage.getItem("deliveryToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (progressBarSetter) {
       progressBarSetter(100);
       setTimeout(() => progressBarSetter(0), 500);
    }
    return response;
  },
  (error) => {
    if (progressBarSetter) {
       progressBarSetter(100);
       setTimeout(() => progressBarSetter(0), 500);
    }
    return Promise.reject(error);
  }
);

export default api;