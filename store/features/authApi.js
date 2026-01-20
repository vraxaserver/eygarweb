import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout, setError } from "@/store/slices/authSlice";

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_USER_SERVICE_URL,
    prepareHeaders: (headers, { getState }) => {
        // 1. Try to get token from Redux State
        let token = getState().auth.token;

        // 2. Fallback: If state is empty but we are in browser, check localStorage directly
        // This fixes the race condition on page reload where Redux isn't ready yet
        if (!token && typeof window !== "undefined") {
            token = localStorage.getItem("access_token");
        }

        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        headers.set("content-type", "application/json");
        return headers;
    },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 401) {
        // Normalize URL from args (args can be string or object)
        const requestUrl =
            typeof args === "string"
                ? args
                : typeof args === "object" && args !== null
                ? args.url
                : "";

        // Prevent infinite loop if we are already trying to logout or refresh
        if (
            typeof requestUrl === "string" &&
            (requestUrl.includes("logout") || requestUrl.includes("refresh"))
        ) {
            api.dispatch(logout());
            return result;
        }

        // Try to get a new token
        const refreshToken =
            typeof window !== "undefined"
                ? localStorage.getItem("refresh_token")
                : null;

        if (refreshToken) {
            const refreshResult = await baseQuery(
                {
                    url: "/auth/token/refresh/",
                    method: "POST",
                    body: { refresh: refreshToken },
                },
                api,
                extraOptions
            );

            if (refreshResult?.data?.access) {
                api.dispatch(
                    setCredentials({
                        user: api.getState().auth.user,
                        access: refreshResult.data.access,
                        refresh: refreshToken, // keep existing refresh unless backend returns a new one
                    })
                );

                // Retry the original query with the updated token
                result = await baseQuery(args, api, extraOptions);
            } else {
                api.dispatch(logout());
            }
        } else {
            api.dispatch(logout());
        }
    }

    return result;
};

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["User"],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "/auth/login/",
                method: "POST",
                body: credentials,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    console.log("Login returns: ", data);
                    dispatch(setCredentials(data));
                } catch (error) {
                    dispatch(
                        setError(error.error?.data?.detail || "Login failed")
                    );
                }
            },
        }),
        signup: builder.mutation({
            query: (userData) => ({
                url: "/auth/register/",
                method: "POST",
                body: userData,
            }),
        }),
        getProfile: builder.query({
            query: () => "/auth/profile/",
            providesTags: ["User"],
            // No need for complex logic here, if 401 happens baseQueryWithReauth handles it
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // Update user data in auth slice
                    dispatch(
                        setCredentials({
                            user: data,
                            access: localStorage.getItem("access_token"),
                            refresh: localStorage.getItem("refresh_token"),
                        })
                    );
                } catch (error) {
                    if (error.error?.status === 401) {
                        dispatch(logout());
                    }
                }
            },
        }),
        updateProfile: builder.mutation({
            query: (userData) => ({
                url: "/auth/profile/",
                method: "PATCH",
                body: userData,
            }),
            invalidatesTags: ["User"],
        }),
        logoutUser: builder.mutation({
            query: () => {
                const refreshToken = localStorage.getItem("refresh_token");
                return {
                    url: "/auth/logout/",
                    method: "POST",
                    body: { refresh: refreshToken },
                };
            },
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                } catch (err) {
                    console.error("Logout API failed", err);
                } finally {
                    dispatch(logout());
                }
            },
        }),
        forgotPassword: builder.mutation({
            query: (email) => ({
                url: "/auth/forgot-password/",
                method: "POST",
                body: { email },
            }),
        }),
        resetPassword: builder.mutation({
            query: ({ token, password }) => ({
                url: "/auth/reset-password/",
                method: "POST",
                body: { token, password },
            }),
        }),
        changePassword: builder.mutation({
            query: (passwordData) => ({
                url: "/auth/change-password/",
                method: "POST",
                body: passwordData,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useSignupMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useLogoutUserMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
} = authApi;
