import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
export const vendorCouponApi = createApi({
  reducerPath: 'vendorCouponApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8001/api/v1/',
    // Prepare headers to include the authentication token
    prepareHeaders: (headers, { getState }) => {
      // Assumes the token is stored in an 'auth' slice of your Redux store
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // Define tags for caching and invalidation to automate re-fetching
  tagTypes: ['Coupon'],
  endpoints: (builder) => ({
    // Endpoint for listing all vendor coupons
    getCoupons: builder.query({
      query: () => 'vendors/coupons/',
      // Provides a 'Coupon' tag to the cached data.
      // This allows us to invalidate this cache when a new coupon is added.
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Coupon', id })),
              { type: 'Coupon', id: 'LIST' },
            ]
          : [{ type: 'Coupon', id: 'LIST' }],
    }),

    // Endpoint for adding a new vendor coupon
    addCoupon: builder.mutation({
      query: (newCoupon) => ({
        url: 'vendors/coupons/',
        method: 'POST',
        body: newCoupon,
      }),
      // Invalidates the 'Coupon' list tag upon successful mutation,
      // which triggers a refetch of the getCoupons query.
      invalidatesTags: [{ type: 'Coupon', id: 'LIST' }],
    }),
  }),
});

// Export hooks for usage in your React components.
// These are automatically generated based on the defined endpoints.
export const {
  useGetCouponsQuery,
  useAddCouponMutation,
} = vendorCouponApi;