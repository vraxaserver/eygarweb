import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout, setError, setPendingVerification } from "@/store/slices/authSlice";

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
                // Accepts { email_or_phone, password }
                body: credentials,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    console.log("Login returns: ", data);
                    // Backend shape: { tokens: { access, refresh }, user: { ... } }
                    dispatch(
                        setCredentials({
                            user: data.user,
                            access: data.tokens.access,
                            refresh: data.tokens.refresh,
                        })
                    );
                } catch (error) {
                    const errData = error?.error?.data;
                    const message =
                        errData?.detail ||
                        errData?.non_field_errors?.[0] ||
                        errData?.message ||
                        "Login failed";
                    dispatch(setError(message));
                }
            },
        }),
        signup: builder.mutation({
            query: (userData) => ({
                url: "/auth/register/",
                method: "POST",
                // Expected payload: { email_or_phone, password, confirm_password }
                body: userData,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // Response: { user_id, identifier_type, message }
                    // Also persist email_or_phone from the original arg so the
                    // activate page can send it to /auth/verify/
                    dispatch(
                        setPendingVerification({
                            user_id: data.user_id,
                            identifier_type: data.identifier_type,
                            email_or_phone: arg.email_or_phone,
                        })
                    );
                } catch (error) {
                    // Let the component handle the error
                    console.error("Signup error:", error);
                }
            },
        }),

        // Verify the OTP code received via SMS/Email after registration
        verifyRegistration: builder.mutation({
            query: ({ email_or_phone, code }) => ({
                url: "/auth/verify/",
                method: "POST",
                body: { email_or_phone, code },
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
                url: "/auth/me/",
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
            query: (data) => ({
                url: "/auth/password/forgot/",
                method: "POST",
                body: typeof data === "string" ? { email_or_phone: data } : data,
            }),
        }),
        resetPassword: builder.mutation({
            query: (resetData) => ({
                url: "/auth/password/reset/",
                method: "POST",
                body: resetData,
            }),
        }),
        changePassword: builder.mutation({
            query: (passwordData) => ({
                url: "/auth/password/change/",
                method: "POST",
                body: passwordData,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useSignupMutation,
    useVerifyRegistrationMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useLogoutUserMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
} = authApi;
