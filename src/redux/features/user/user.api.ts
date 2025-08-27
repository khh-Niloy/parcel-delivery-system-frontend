import { baseApi } from "@/redux/baseApi";

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder)=> ({
        getAllUsers: builder.query({
            query: ()=> ({
                url: "/user/all-user",
                method: "GET",
            }),
        }),
        
    })
})

export const {
    useGetAllUsersQuery,
} = userApi;