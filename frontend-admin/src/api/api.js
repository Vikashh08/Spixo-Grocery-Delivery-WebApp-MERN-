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

// Simple global state for loader since we're in a separate file from React context
let progressBarSetter = null;
export const setProgressBar = (setter) => { progressBarSetter = setter; };

// Use the adminToken specifically for this project
api.interceptors.request.use((config) => {
  if (progressBarSetter) progressBarSetter(30); // Start progress
  const token = localStorage.getItem("adminToken"); 
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