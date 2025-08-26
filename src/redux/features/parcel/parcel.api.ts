import { baseApi } from "@/redux/baseApi";

export const parcelApi = baseApi.injectEndpoints({
    endpoints: (builder)=> ({
        createParcel: builder.mutation({
            query: (parcelInfo)=>({
                url: "/parcel/create-parcel",
                method: "POST",
                data: parcelInfo
            }),
        }),

        allSenderParcel: builder.query({
            query: ()=>({
                url: "/parcel/all-sender-parcel",
                method: "GET",
            }),
        }),

        updateParcel: builder.mutation({
            query: (parcelInfo)=>({
                url: `/parcel/${parcelInfo.trackingId}`,
                method: "PATCH",
                data: parcelInfo
            }),
        }),

        getParcelById: builder.query({
            query: (trackingId)=>({
                url: `parcel/single-parcel/${trackingId}`,
                method: "GET",
            }),
            transformResponse: (response: any)=> response.data,
        }),

        allParcelsAdmin: builder.query({
            query: ()=>({
                url: "/parcel/admin/all-parcels",
                method: "GET",
            }),
            transformResponse: (response: any)=> response.data,
        }),

        updateParcelStatus: builder.mutation({
            query: (parcelInfo)=>({
                url: `/parcel/status/${parcelInfo.trackingId}`,
                method: "PATCH",
                data: parcelInfo
            }),
        }),

        assignDeliveryAgent: builder.mutation({
            query: (parcelInfo)=>({
                url: `/parcel/assign-delivery-agent/${parcelInfo.trackingId}`,
                method: "PATCH",
                data: parcelInfo
            }),
        }),
        
    })
})

export const {
    useCreateParcelMutation,
    useAllSenderParcelQuery,
    useUpdateParcelMutation,
    useGetParcelByIdQuery,
    useAllParcelsAdminQuery,
    useUpdateParcelStatusMutation,
    useAssignDeliveryAgentMutation,
} = parcelApi;