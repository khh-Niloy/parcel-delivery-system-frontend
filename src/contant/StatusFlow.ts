import { Role } from "./Role";
import { Status } from "./Status";

export const StatusFlow = {
  REQUESTED: {
    next: [Status.APPROVED, Status.BLOCKED, Status.CANCELLED],
    allowedRoles: [Role.admin, Role.superAdmin, Role.sender],
  },

  BLOCKED: {
    next: [Status.REQUESTED],
    allowedRoles: [Role.admin, Role.superAdmin],
  },

  CANCELLED: {
    next: [Status.REQUESTED],
    allowedRoles: [Role.admin, Role.sender, Role.superAdmin],
  },

  APPROVED: {
    next: [Status.CANCELLED, Status.PENDING, Status.ASSIGNED],
    allowedRoles: [Role.admin, Role.superAdmin, Role.sender],
  },

  PENDING: {
    next: [Status.ASSIGNED],
    allowedRoles: [Role.admin, Role.superAdmin],
  },

  ASSIGNED: {
    next: [Status.PICKEDUP],
    // allowedRoles: [Role.admin, Role.superAdmin, Role.deliveryAgent],  
    allowedRoles: [Role.deliveryAgent],  
  },

  PICKEDUP: {
    next: [Status.ON_THE_WAY],
    allowedRoles: [Role.deliveryAgent],
  },

  ON_THE_WAY: {
    next: [Status.DELIVERED],
    allowedRoles: [Role.deliveryAgent],
  },

  DELIVERED: {
    next: [Status.CONFIRMED, Status.RETURNED],
    allowedRoles: [Role.receiver],
  },

  CONFIRMED: {
    next: [],
    allowedRoles: [Role.receiver],
  },

  RETURNED: {
    next: [Status.REQUESTED],
    allowedRoles: [Role.admin, Role.superAdmin, Role.deliveryAgent],
  },
};