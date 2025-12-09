import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout, setError } from "@/store/slices/authSlice";

// This is your base query that can be shared across API slices
const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_USER_SERVICE_URL,
    // This function will automatically add the auth token to headers
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        headers.set("content-type", "application/json");
        return headers;
    },
});

// Enhanced base query with token refresh logic
const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result?.error?.status === 401) {
        // Try to get a new token
        const refreshToken = localStorage.getItem("refresh_token");

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
            if (refreshResult?.data) {
                // Store the new token

                api.dispatch(
                    setCredentials({
                        user: api.getState().auth.user,
                        access: refreshResult.data.access,
                        refresh: refreshToken,
                    })
                );

                // Retry the original query
                result = await baseQuery(args, api, extraOptions);
            } else {
                // Refresh failed, logout user
                api.dispatch(logout());
            }
        } else {
            // No refresh token, logout user
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
        // Login endpoint
        login: builder.mutation({
            query: (credentials) => ({
                url: "/auth/login/", // Your Django JWT login endpoint
                method: "POST",
                body: credentials,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    
                    dispatch(setCredentials(data));

                    // Redirect after successful login
                    const urlParams = new URLSearchParams(
                        window.location.search
                    );
                    const returnUrl =
                        urlParams.get("returnUrl") || "/dashboard";

                    // Small delay to ensure state is updated
                    setTimeout(() => {
                        window.location.href = returnUrl;
                    }, 100);
                } catch (error) {
                    dispatch(
                        setError(error.error?.data?.detail || "Login failed")
                    );
                }
            },
        }),

        // Signup endpoint
        signup: builder.mutation({
            query: (userData) => ({
                url: "/auth/register/", // Your Django user registration endpoint
                method: "POST",
                body: userData,
            })
        }),

        // Get current user profile
        getProfile: builder.query({
            query: () => "/auth/profile/",
            providesTags: ["User"],
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

        // Update user profile
        updateProfile: builder.mutation({
            query: (userData) => ({
                url: "/auth/profile/",
                method: "PATCH",
                body: userData,
            }),
            invalidatesTags: ["User"],
        }),

        // Logout endpoint (optional - for backend logout)
        // Logout endpoint (backend + frontend)
        logoutUser: builder.mutation({
            query: () => {
                const refreshToken = localStorage.getItem("refresh_token"); // get refresh token
                return {
                    url: "/auth/logout/",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        // optionally include access token if backend expects it
                        Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                        )}`,
                    },
                    body: {
                        refresh: refreshToken, // send refresh token for backend to blacklist
                    },
                };
            },
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled; // wait for backend to confirm logout
                } catch (err) {
                    console.error("Logout failed:", err);
                } finally {
                    // always clear local auth state
                    dispatch(logout());
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                }
            },
        }),

        // Forgot password
        forgotPassword: builder.mutation({
            query: (email) => ({
                url: "/auth/forgot-password/",
                method: "POST",
                body: { email },
            }),
        }),

        // Reset password
        resetPassword: builder.mutation({
            query: ({ token, password }) => ({
                url: "/auth/reset-password/",
                method: "POST",
                body: { token, password },
            }),
        }),

        // Change password
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
