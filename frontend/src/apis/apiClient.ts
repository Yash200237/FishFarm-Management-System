import axios from "axios"

export const api = axios.create({
  baseURL: "https://localhost:7132/api",
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err?.config?.url ?? "";
    const isLoginCall = url.includes("/User/login");
    if (err?.response?.status === 401 && !isLoginCall && window.location.pathname !== "/login") {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);