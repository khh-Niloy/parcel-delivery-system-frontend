import { baseApi } from "@/redux/baseApi";

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder)=> ({
        getAllUsers: builder.query({
            query: ()=> ({
                url: "/user/all-user",
                method: "GET",
            }),
            transformResponse: (response: any)=> {
                return response.data
            }
        }),
        updateUserAvailableStatus: builder.mutation({
            query: (userInfo)=>({
                url: `/user/update-available-status/${userInfo.id}`,
                method: "PATCH",
                data: userInfo
            }),
        }),
        
    })
})

export const {
    useGetAllUsersQuery,
    useUpdateUserAvailableStatusMutation,
} = userApi;