
export interface WorkerResponse {
        workerId: string;
        name:string,
        age: number;
        email: string;
        picture: string;
        phone: string;
}

export type Roles = "CEO" | "Captain" | "Worker";

export interface AssignWorkerForm {
        FarmId: string;
        WorkerId: string;
        Role: Roles;
        CertifiedUntil: string;
}

export interface FarmWorkerDetails {
        workerId: string
        workerName: string
        workerEmail: string
        role: Roles;
        certifiedUntil: string | null
}

export interface FarmWDetailsDto{
        farmId: string;
        farmName: string;
        role: Roles;
        certifiedUntil: string | null;
}
