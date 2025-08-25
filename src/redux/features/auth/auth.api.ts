import { baseApi } from "@/redux/baseApi";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder)=> ({
        login: builder.mutation({
            query: (userInfo)=>({
                url: "/auth/login",
                method: "POST",
                data: userInfo
            }),
        }),
        register: builder.mutation({
            query: (userInfo)=>({
                url: "/user/register",
                method: "POST",
                data: userInfo
            })
        }),



        sendOTP: builder.mutation({
            query: (email)=>({
                url: "/otp/send",
                method: "POST",
                data: email
            })
        }),
        verifyOTP: builder.mutation({
            query: (payload)=>({
                url: "/otp/verify",
                method: "POST",
                data: payload
            })
        }),
        userInfo: builder.query({
            query: ()=>({
                url: "/user/get-me",
                method: "GET",
            }),
            // providesTags: ["USER"]
        }),
        userLogout: builder.mutation({
            query: ()=>({
                url: "/auth/logout",
                method: "POST",
            }),
            // invalidatesTags: ["USER"],
        })
    })
})

export const {
    useLoginMutation,
    useRegisterMutation,
    useSendOTPMutation,
    useVerifyOTPMutation,
    useUserInfoQuery,
    useUserLogoutMutation
} = authApi;