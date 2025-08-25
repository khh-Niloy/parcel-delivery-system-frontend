import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import type { TRole } from "@/contant/Role";
import { Navigate } from "react-router";
import type { ComponentType } from "react";

export const checkRole = (Component: ComponentType, role: TRole) => {
    return function AuthWrapper() {
      
        const { data, isLoading } = useUserInfoQuery(undefined);
    
        if (!isLoading && !data?.data?.email) {
          return <Navigate to="/login" />;
        }
    
        if (role && !isLoading && role !== data?.data?.role) {
          return <Navigate to="/unauthorized" />;
        }
    
        return <Component />;
      };
};