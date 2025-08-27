export const StatusFlow: Record<string, { next: string[]; allowedRoles: string[] }> = {
    REQUESTED: {
        next: ["APPROVED", "CANCELLED"],
        allowedRoles: ["ADMIN", "SUPER_ADMIN", "SENDER"],
    },
    APPROVED: {
        next: ["DISPATCHED", "BLOCKED", "CANCELLED"],
        allowedRoles: ["ADMIN", "SENDER"],
    },
    // WAITING: {
    //   next: ["IN_TRANSIT"],
    //   allowedRoles: ["DELIVERY_AGENT"],
    // },
    DISPATCHED: {
        next: ["IN_TRANSIT"],
        allowedRoles: ["DELIVERY_AGENT"],
    },
    IN_TRANSIT: {
        next: ["DELIVERED", "RETURNED"],
        allowedRoles: ["DELIVERY_AGENT"],
    },
    RETURNED: {
        next: [],
        allowedRoles: ["ADMIN"],
    },
    DELIVERED: {
        next: ["CONFIRMED"],
        allowedRoles: ["RECEIVER"],
    },
    CANCELLED: {
        next: [],
        allowedRoles: ["ADMIN", "SENDER"],
    },
    BLOCKED: {
        next: [],
        allowedRoles: ["ADMIN"],
    },
}


