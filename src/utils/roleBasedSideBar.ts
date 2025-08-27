import { Role, type TRole } from "@/contant/Role";
import { adminRoutes } from "@/routes/adminRoutes";
import { senderRoutes } from "@/routes/senderRoutes";
import { deliveryAgentRoutes } from "@/routes/deliveryAgentRoutes";
import { receiverRoutes } from "@/routes/receiverRoutes";

export const roleBasedSidebar = (role: TRole)=>{
    // console.log(role)
    switch (role) {
        case Role.admin:
        return [...adminRoutes];

        case Role.sender:
        return [...senderRoutes]

        case Role.deliveryAgent:
        return [...deliveryAgentRoutes]

        case Role.receiver:
        return [...receiverRoutes]

        default:
        return [];
    }
}