import AllParcelsAdmin from "@/pages/admin/AllParcelsAdmin";
import AllUser from "@/pages/admin/AllUser";

export const adminRoutes = [
  {
    title: "User and Parcel Management",
    items: [
      {
        title: "All User",
        url: "/admin/all-user",
        component: AllUser,
      },
      {
        title: "All Parcel",
        url: "/admin/all-parcel",
        component: AllParcelsAdmin,
      },
    ],  
  },
];