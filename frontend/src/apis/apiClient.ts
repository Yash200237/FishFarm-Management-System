import axios from "axios"
import { tokenStore } from "../utils/tokenStore";

export const api = axios.create({
  baseURL: "https://localhost:7132/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    try{
    const original = err.config;
    const status = err?.response?.status;
    const url = original?.url ?? "";

    const isLoginCall = url.includes("/Auth/Login");
    const isRefreshCall = url.includes("/Auth/RefreshToken");

    if (status !== 401 || !original) return Promise.reject(err);

    if (isLoginCall || isRefreshCall) return Promise.reject(err);

    if (original._retry) return Promise.reject(err);
    original._retry = true;

    const refreshRes = await api.post("/Auth/RefreshToken");
    const newToken = refreshRes.data.token as string;
    tokenStore.set(newToken);
    
    original.headers.Authorization = `Bearer ${newToken}`;
    return api(original);
    } 
    catch (refreshErr) {
      tokenStore.set(null);
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }

      return Promise.reject(refreshErr);
    }
  }
);
  
