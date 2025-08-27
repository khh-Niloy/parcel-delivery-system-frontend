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
import DeliveryAgentRegisterPage from "@/pages/auth/DeliveryAgentRegisterPage";
import { deliveryAgentRoutes } from "./deliveryAgentRoutes";
import UnauthorizedPage from "@/pages/Unauthorized";
import { receiverRoutes } from "./receiverRoutes";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import TrackParcelPage from "@/pages/TrackParcelPage";
  
export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: HomePage
      },
      {
        path: "/about",
        Component: AboutPage
      },
      {
        path: "/contact",
        Component: ContactPage
      },
      {
        path: "/track-parcel",
        Component: TrackParcelPage
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
    path: "/delivery-agent",
    Component: checkRole(DashboardLayout, Role.deliveryAgent as TRole),
    children: [
        {
            index: true,
            element: <Navigate to="/delivery-agent/all-parcel" />
        },
        ...generateRoutes(deliveryAgentRoutes)
    ]
  },
  {
    path: "/receiver",
    Component: checkRole(DashboardLayout, Role.receiver as TRole),
    children: [
        {
            index: true,
            element: <Navigate to="/receiver/incoming-parcel" />
        },
        ...generateRoutes(receiverRoutes)
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
  {
    path: "/delivery-agent-register",
    Component: DeliveryAgentRegisterPage,
  },
  {
    path: "/unauthorized",
    Component: UnauthorizedPage,
  }
]);