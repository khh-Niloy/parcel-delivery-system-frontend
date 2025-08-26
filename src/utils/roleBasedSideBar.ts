import { Role, type TRole } from "@/contant/Role";
import { adminRoutes } from "@/routes/adminRoutes";
import { senderRoutes } from "@/routes/senderRoutes";

export const roleBasedSidebar = (role: TRole)=>{
    // console.log(role)
    switch (role) {
        case Role.admin:
        return [...adminRoutes];

        case Role.sender:
        return [...senderRoutes]

        default:
        return [];
    }
}