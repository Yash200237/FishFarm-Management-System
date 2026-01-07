import type { PropsWithChildren } from "react";
import type { UserRoles } from "../types/user.ts";
import { useAuth } from "../contexts/AuthProviderHook.ts";
import { Alert } from "@mui/material";

type ProtectedRouteProps = PropsWithChildren & {
    allowedRoles: UserRoles[];
};

export function ProtectedRoute ({allowedRoles, children}:ProtectedRouteProps) {
    const {userRole } = useAuth();
    if (!userRole || (allowedRoles && !allowedRoles.includes(userRole))) {
      return <Alert severity="error">You do not have permission to view this page.</Alert>;
    }
    return children;
};

