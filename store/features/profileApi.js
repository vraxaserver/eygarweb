// src/store/features/profileApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api",
    // This function will automatically add the auth token to headers
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        // DO NOT set content-type here.
        // For file uploads (FormData), the browser needs to set it automatically
        // with a unique boundary. For regular JSON, RTK Query sets it by default.
        return headers;
    },
});

export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery: baseQuery,
    tagTypes: ['BusinessProfile', 'Identity', 'Contact', 'SubmitReview', 'CurrentStatus', 'Profile'],
    endpoints: (builder) => ({
        // New query for fetching host status
        getCurrentStatus: builder.query({
            query: () => "/profiles/hosts/current_status",
            providesTags: ['CurrentStatus'], // For caching
        }),
        createBusinessProfile: builder.mutation({
            query: (data) => ({
                url: "/profiles/hosts/business_profile",
                method: "POST",
                body: data, // can be FormData or JSON
            }),
            invalidatesTags: ['BusinessProfile'],
        }),
        verifyIdentity: builder.mutation({
            query: (data) => ({
                url: "/profiles/hosts/identity_verification",
                method: "POST",
                body: data, // Body will be FormData
            }),
            invalidatesTags: ['Identity'],
        }),
        // New mutation for contact information
        verifyContact: builder.mutation({
            query: (data) => ({
                url: "/profiles/hosts/contact_details",
                method: "POST",
                body: data, // Body is a JSON object
            }),
            invalidatesTags: ['Contact'],
        }),
        // New mutation for submit review
        submitForReview: builder.mutation({
            query: (data) => ({
                url: "/profiles/hosts/submit_for_review",
                method: "POST",
                body: data, // Body is a JSON object with additional_notes, terms_accepted, privacy_policy_accepted
            }),
            invalidatesTags: ['SubmitReview'],
        }),

        updateProfile: builder.mutation({
            query: (data) => ({
                url: "/auth/me",
                method: "PATCH",
                body: data, // Body is a JSON object with additional_notes, terms_accepted, privacy_policy_accepted
            }),
            invalidatesTags: ['Profile'],
        })
    }),
});

// Named export for the hook
export const {
    useGetCurrentStatusQuery,
    useCreateBusinessProfileMutation, 
    useVerifyIdentityMutation, 
    useVerifyContactMutation,
    useSubmitForReviewMutation,
    useUpdateProfileMutation
} = profileApi;
