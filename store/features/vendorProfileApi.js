import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const USER_SERVICE_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL;

export const vendorProfileApi = createApi({
    reducerPath: 'vendorProfileApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${USER_SERVICE_URL}/profiles/vendors`,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            console.log("token inside vendor status: ", token)
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['VendorProfile'],
    endpoints: (builder) => ({
        getVendorStatus: builder.query({
            query: () => '/current_status/',
            providesTags: ['VendorProfile'],
        }),
        updateCompanyDetails: builder.mutation({
            query: (data) => ({
                url: '/company_details/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['VendorProfile'],
        }),
        updateServiceArea: builder.mutation({
            query: (data) => ({
                url: '/service_area/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['VendorProfile'],
        }),
        updateContactDetails: builder.mutation({
            query: (data) => ({
                url: '/contact_details/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['VendorProfile'],
        }),
        submitForReview: builder.mutation({
            query: (data) => ({
                url: '/submit_for_review/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['VendorProfile'],
        }),
    }),
});

export const {
    useGetVendorStatusQuery,
    useUpdateCompanyDetailsMutation,
    useUpdateServiceAreaMutation,
    useUpdateContactDetailsMutation,
    useSubmitForReviewMutation,
} = vendorProfileApi;