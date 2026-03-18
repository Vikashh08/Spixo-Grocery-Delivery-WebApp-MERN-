import axios from "axios";

const getBaseURL = () => {
  const url = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
  if (url && !url.endsWith("/api") && !url.endsWith("/api/")) {
    return url.replace(/\/$/, "") + "/api";
  }
  return url;
};

const api = axios.create({
  baseURL: getBaseURL()
});

console.log("🚀 API Base URL:", api.defaults.baseURL);

api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default api;
