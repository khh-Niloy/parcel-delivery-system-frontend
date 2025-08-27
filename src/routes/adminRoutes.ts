import AllDeliveryAgent from "@/pages/admin/AllDeliveryAgent";
import AllParcelsAdmin from "@/pages/admin/AllParcelsAdmin";
import AllSenderAndReceiver from "@/pages/admin/AllSenderAndReceiver";

export const adminRoutes = [
  {
    title: "User and Parcel Management",
    items: [
      {
        title: "All Sender and Receiver",
        url: "/admin/all-user",
        component: AllSenderAndReceiver,
      },
      {
        title: "All Delivery Agent",
        url: "/admin/all-delivery-agent",
        component: AllDeliveryAgent,
      },
      {
        title: "All Parcel",
        url: "/admin/all-parcel",
        component: AllParcelsAdmin,
      },
    ],  
  },
];