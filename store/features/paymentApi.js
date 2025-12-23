import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Get API URL from environment variables or default to localhost
const BASE_URL =
    process.env.NEXT_PUBLIC_PYMENT_SERVICE_URL ||
    "http://localhost:8002/api/v1";

export const paymentApi = createApi({
    reducerPath: "paymentApi", // The key in the Redux store
    tagTypes: ["Payment"], // Used for cache invalidation

    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/payments`, // Matches your FastAPI router prefix

        // Automatically injects the JWT token from your Redux Auth state
        prepareHeaders: (headers, { getState }) => {
            // Adjust 'auth.token' to match where you store the token in your Redux store
            const token = getState().auth?.token;

            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),

    endpoints: (builder) => ({
        /**
         * @description Get payment history for the current logged-in user
         */
        getPaymentHistory: builder.query({
            query: () => "/my-history",
            // Smart Caching: Associate this list with the 'Payment' tag
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({ type: "Payment", id })),
                          { type: "Payment", id: "LIST" },
                      ]
                    : [{ type: "Payment", id: "LIST" }],
        }),

        /**
         * @description Get details of a specific payment
         * @param {number} id - The payment ID
         */
        getPaymentById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: "Payment", id }],
        }),

        /**
         * @description Create a new payment record (Initializes intent)
         * @param {Object} body - { booking_id, property_id, amount_total, currency, ... }
         */
        createPayment: builder.mutation({
            query: (body) => ({
                url: "/",
                method: "POST",
                body,
            }),
            // Invalidates the list so 'getPaymentHistory' refetches automatically
            invalidatesTags: [{ type: "Payment", id: "LIST" }],
        }),
    }),
});

// Export auto-generated hooks for React components
export const {
    useGetPaymentHistoryQuery,
    useGetPaymentByIdQuery,
    useCreatePaymentMutation,
} = paymentApi;
