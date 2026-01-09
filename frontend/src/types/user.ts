
export type UserRoles = "GlobalAdmin" | "OrgAdmin" | "OrgUser";

export interface LoginUserForm {
        EmailUsername:string,
        Password: string;
}

export interface LoginResponse {
        token: string;
        userId: string;
        name: string;
        email: string;
        userName: string;
        orgId: string;
        userRole: UserRoles;
}

export interface User {
        userId: string;
        name: string;
        email: string;
        userName: string;
        orgId: string;
        userRole: UserRoles;
}

export interface EditUserForm {
        Name: string,
        Email: string,
        PasswordHash?: string,
        UserName: string,
        UserRole: UserRoles,
}
