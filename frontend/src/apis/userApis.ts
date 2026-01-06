import type { EditUserForm, User } from "../types/user"
import type { LoginResponse, LoginUserForm } from "../types/user"
import { api } from "./apiClient"
import type { UserSchema } from "../schemas/userSchemas.ts";

export async function loginUser(payload: LoginUserForm): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>("/User/login", payload)
  return res.data;
}

export async function GetUsersById(userId: string): Promise<User> {
    const response = await api.get<User>(`/User/${userId}`)
    return response.data;
}

export async function GetUsersByOrgId(id:string): Promise<User[]> {
    const response = await api.get<User[]>(`/User/${id}/users`)
    return response.data;
}

export async function GetAdminUsersByOrgId(id:string): Promise<User[]> {
    const response = await api.get<User[]>(`/User/${id}/adminusers`)
    return response.data;
}

export async function CreateAdminUser(user:UserSchema): Promise<User> {
    const response = await api.post<User>(`/User/RegisterOrgAdmin`, user);
    console.log("user response:", response.data)
    return response.data;
}

export async function CreateUser(user:UserSchema): Promise<User> {
    const response = await api.post<User>(`/User/RegisterOrgUser`, user);
    console.log("user response:", response.data)
    return response.data;
}

export async function EditUser({userId,user,}: {userId: string;user:EditUserForm;}): Promise<User> {
    const response = await api.put<User>(`/User/${userId}`, user);
    return response.data;
}


export async function DeleteUser(userId: string){
    const response = await api.delete(`/User/${userId}`);
    return response.data;
}

export async function GetCurrentUser(): Promise<User> {
    const response = await api.get<User>(`/auth/me`)
    return response.data;
}
