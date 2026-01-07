import type { PropsWithChildren } from "react";
import type { UserRoles } from "../types/user.ts";
import { useAuth } from "../contexts/AuthProviderHook.ts";

type ProtectedRouteProps = PropsWithChildren & {
    allowedRoles: UserRoles[];
};

export function ProtectedWrapper ({allowedRoles, children}:ProtectedRouteProps) {
    const {userRole } = useAuth();
    if (!userRole || (allowedRoles && !allowedRoles.includes(userRole))) {
      return null;
    }
    return children;
};

