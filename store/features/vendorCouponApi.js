import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PROPERTIES_API_URL = process.env.NEXT_PUBLIC_PROPERTIES_API_URL;

export const vendorCouponApi = createApi({
    reducerPath: "vendorCouponApi",
    baseQuery: fetchBaseQuery({
        baseUrl: PROPERTIES_API_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Coupon"],
    endpoints: (builder) => ({
        // Fetch all coupons belonging to the logged-in vendor
        getMyCoupons: builder.query({
            query: () => "/vendors/coupons/my",
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({ type: "Coupon", id })),
                          { type: "Coupon", id: "MY_LIST" },
                      ]
                    : [{ type: "Coupon", id: "MY_LIST" }],
        }),

        // Fetch all coupons (admin / public listing)
        getCoupons: builder.query({
            query: () => "/vendors/coupons",
            transformResponse: (response) => response.results ?? response ?? [],
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({ type: "Coupon", id })),
                          { type: "Coupon", id: "LIST" },
                      ]
                    : [{ type: "Coupon", id: "LIST" }],
        }),

        // Create a new coupon
        addCoupon: builder.mutation({
            query: (newCoupon) => ({
                url: "/vendors/coupons",
                method: "POST",
                body: newCoupon,
            }),
            invalidatesTags: [
                { type: "Coupon", id: "LIST" },
                { type: "Coupon", id: "MY_LIST" },
            ],
        }),

        // Update an existing coupon
        updateCoupon: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/vendors/coupons/${id}`,
                method: "PUT",
                body: patch,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Coupon", id },
                { type: "Coupon", id: "LIST" },
                { type: "Coupon", id: "MY_LIST" },
            ],
        }),

        // Delete a coupon
        deleteCoupon: builder.mutation({
            query: (id) => ({
                url: `/vendors/coupons/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [
                { type: "Coupon", id },
                { type: "Coupon", id: "LIST" },
                { type: "Coupon", id: "MY_LIST" },
            ],
        }),
    }),
});

export const {
    useGetMyCouponsQuery,
    useGetCouponsQuery,
    useAddCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
} = vendorCouponApi;
