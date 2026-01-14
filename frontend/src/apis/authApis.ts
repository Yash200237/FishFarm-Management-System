import type { User } from "../types/user"
import type { LoginResponse, LoginUserForm } from "../types/user"
import { api } from "./apiClient"

export async function loginUser(payload: LoginUserForm): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>("/Auth/login", payload)
  return res.data;
}

export async function GetCurrentUser(): Promise<User> {
    const res = await api.get<User>(`/auth/me`)
    return res.data;
}

export async function logoutUser(): Promise<boolean> {
  const res = await api.post("/Auth/logout")
  return res.data;
}

export async function refreshToken(): Promise<{ token: string }> {
  const res = await api.post("/Auth/RefreshToken");
  return res.data;
}
