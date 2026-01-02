import type { FarmSchema } from "../schemas/farmSchemas";
import type {  FarmResponse } from "../types/farm";
import type { FarmWDetailsDto } from "../types/worker";
import { api } from "./apiClient";

export async function fetchFarms(): Promise<FarmResponse[]> {
    const response  = await api.get<FarmResponse[]>("/Farm")
    return response.data;
}

export async function fetchFarmById(id:string): Promise<FarmResponse> {
    const response = await api.get<FarmResponse>(`/Farm/${id}`)
    return response.data;
}

export async function CreateFarm(farm:FarmSchema): Promise<FarmResponse> {
    const response = await api.post<FarmResponse>(`/Farm`, farm);
    return response.data;
}

export async function EditFarm({farmId,farm,}: {farmId: string;farm: FarmSchema;}): Promise<FarmResponse> {
    const response = await api.put<FarmResponse>(`/Farm/${farmId}`, farm);
    return response.data;
}

export async function DeleteFarm(farmId: string){
    const response = await api.delete(`/Farm/${farmId}`);
    return response.data;
}

export async function fetchFarmByworkerId(workerId:string): Promise<FarmWDetailsDto[]>{
    const response = await api.get<FarmWDetailsDto[]>(`/FarmWorker/worker/${workerId}/farms`);
    console.log("farms response:", response.data)
    return response.data;
}

