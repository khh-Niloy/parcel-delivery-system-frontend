import DashboardLayout from "@/components/layout/DashboardLayout";
import MainLayout from "@/components/layout/MainLayout";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import HomePage from "@/pages/HomePage";
import { createBrowserRouter, Navigate } from "react-router";
import { checkRole } from "@/utils/checkRole";
import { Role, type TRole } from "@/contant/Role";
import { generateRoutes } from "@/utils/generateRoutes";
import { adminRoutes } from "./adminRoutes";
import { senderRoutes } from "./senderRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: HomePage
      }
    ]
  },
  {
    path: "/admin",
    Component: checkRole(DashboardLayout, Role.admin as TRole),
    children: [
        {
            index: true,
            element: <Navigate to="/admin/all-user" />
        },
        ...generateRoutes(adminRoutes)
    ]
  },
  {
    path: "/sender",
    Component: checkRole(DashboardLayout, Role.sender as TRole),
    children: [
        {
            index: true,
            element: <Navigate to="/sender/create-parcel" />
        },
        ...generateRoutes(senderRoutes)
    ]
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
]);