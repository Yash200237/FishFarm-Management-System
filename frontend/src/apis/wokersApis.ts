import type { AssignSchema, WorkerSchema } from "../schemas/workerSchemas";
import type { AssignWorkerFormResponse, FarmWorkerDetails, WorkerResponse } from "../types/worker";
import { api } from "./apiClient";

export async function fetchWorkers(): Promise<WorkerResponse[]> {
    const response = await api.get<WorkerResponse[]>('/Worker');
    return response.data;
}

export async function fetchWorkersNotAssigned(farmId: string): Promise<WorkerResponse[]> {
    const response = await api.get<WorkerResponse[]>(`/FarmWorker/worker/unassigned/${farmId}`);
    return response.data;
}

export async function fetchWorkerById(id:string): Promise<WorkerResponse> {
    const response = await api.get<WorkerResponse>(`/Worker/${id}`);
    return response.data;
}

export async function CreateWorker(worker:WorkerSchema): Promise<WorkerResponse> {
    const response = await api.post<WorkerResponse>(`/Worker`, worker);
    return response.data;
}

export async function EditWorker({workerId,worker,}: {workerId: string;worker: WorkerSchema;}): Promise<WorkerResponse> {
    const response = await api.put<WorkerResponse>(`/Worker/${workerId}`, worker);
    return response.data;
}

export async function DeleteWorker(workerId: string){
    await api.delete(`/Worker/${workerId}`);
    return null;
}

export async function fetchWorkerToFarm(workerId:string, farmId:string): Promise<AssignWorkerFormResponse> {
  const response = await api.get<AssignWorkerFormResponse>(`/FarmWorker/${farmId}/${workerId}`);
  return response.data;
}

export async function assignWorkerToFarm(payload: AssignSchema): Promise<AssignWorkerFormResponse> {
  const response = await api.post<AssignWorkerFormResponse>("/FarmWorker", payload);
  return response.data;
}

export async function updateWorkerToFarm(payload: AssignSchema): Promise<AssignWorkerFormResponse> {
  const response = await api.patch<AssignWorkerFormResponse>("/FarmWorker", payload);
  return response.data;
}

export async function fetchWorkerByFarmId(farmId:string):Promise<FarmWorkerDetails[]>{
    const response = await api.get<FarmWorkerDetails[]>(`/FarmWorker/farm/${farmId}/workers`);
    return response.data;
}


export async function fetchUnassignedWorkers():Promise<WorkerResponse[]>{
    const response = await api.get<WorkerResponse[]>(`/FarmWorker/worker/unassigned`);
    return response.data;
}

export async function removeWorkerFromFarm(workerId:string, farmId:string){
    const response = await api.delete(`/FarmWorker/${farmId}/${workerId}`);
    return response.data;

}
