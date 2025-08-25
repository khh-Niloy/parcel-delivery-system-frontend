import CreateParcel from "@/pages/sender/CreateParcel";
import SenderAllParcel from "@/pages/sender/SenderAllParcel";

export const senderRoutes = [
  {
    title: "None",
    items: [
      {
        title: "Create Parcel",
        url: "create-parcel",
        component: CreateParcel,
      },
      {
        title: "Sender All Parcel",
        url: "all-parcel",
        component: SenderAllParcel,
      },
    ],
  },
];


