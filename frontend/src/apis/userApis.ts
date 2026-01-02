import type { LoginResponse, LoginUserForm } from "../types/user"
import { api } from "./apiClient"

export async function loginUser(payload: LoginUserForm): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>("/User/login", payload)
  return res.data;
}