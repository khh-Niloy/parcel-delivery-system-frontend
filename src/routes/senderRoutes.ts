import CreateParcel from "@/pages/sender/CreateParcel";
import SenderAllParcel from "@/pages/sender/SenderAllParcel";
import UpdateParcel from "@/pages/sender/UpdateParcel";

export const senderRoutes = [
  {
    title: "Parcel Management",
    items: [
      {
        title: "Create Parcel",
        url: "create-parcel",
        component: CreateParcel,
      },
      {
        title: "All Parcel",
        url: "all-parcel",
        component: SenderAllParcel,
      },
      {
        // title: "Update Parcel",
        url: "update-parcel/:trackingId",
        component: UpdateParcel,
      },
    ],
  },
];


