import type { OrgResponse } from "../types/org.ts";
import type { OrgSchema } from "../schemas/orgSchemas.ts";
import { api } from "./apiClient";

export async function fetchOrgs(): Promise<OrgResponse[]> {
    const response  = await api.get<OrgResponse[]>("/Org")
    return response.data;
}

export async function fetchOrgById(id:string): Promise<OrgResponse> {
    const response = await api.get<OrgResponse>(`/Org/${id}`)
    return response.data;
}

export async function CreateOrg(org:OrgSchema): Promise<OrgResponse> {
    const response = await api.post<OrgResponse>(`/Org`, org);
    console.log("org response:", response.data)
    return response.data;
}

export async function EditOrg({orgId,org,}: {orgId: string;org: OrgSchema;}): Promise<OrgResponse> {
    const response = await api.put<OrgResponse>(`/Org/${orgId}`, org);
    return response.data;
}

export async function DeleteOrg(orgId: string){
    const response = await api.delete(`/Org/${orgId}`);
    return response.data;
}

