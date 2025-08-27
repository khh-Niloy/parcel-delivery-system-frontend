import ReceiverIncomingParcel from "@/pages/receiver/ReceiverIncomingParcel";
import ReceiverDeliveredAndConfirmedParcel from "@/pages/receiver/ReceiverDeliveredAndConfirmedParcel";

export const receiverRoutes = [
  {
    title: "Parcel Management",
    items: [
      {
        title: "Delivered and Confirmed Parcel",
        url: "/receiver/parcel/delivered-parcels",
        component: ReceiverDeliveredAndConfirmedParcel,
      },
      {
        title: "Incoming Parcel",
        url: "/receiver/incoming-parcel",
        component: ReceiverIncomingParcel,
      },
    ],
  },
];


