// store/features/stripeApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * IMPORTANT:
 * - These endpoints must be backed by your server (Node/FastAPI/Django).
 * - Never call Stripe secret-key APIs directly from the browser.
 *
 * Suggested base URL:
 * - Next.js route handlers: /api
 * - Or a gateway: process.env.NEXT_PUBLIC_API_BASE_URL
 */
export const stripeApi = createApi({
    reducerPath: "stripeApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api", // change if you have a gateway domain
        prepareHeaders: (headers, { getState }) => {
            // If you use auth tokens, attach them here
            const token = getState()?.auth?.accessToken;
            if (token) headers.set("authorization", `Bearer ${token}`);
            headers.set("content-type", "application/json");
            return headers;
        },
    }),
    tagTypes: [
        "StripeCustomer",
        "StripePaymentMethods",
        "StripeTransactions",
        "StripePayment",
    ],
    endpoints: (builder) => ({
        /**
         * 1) Create customer
         * POST /stripe/customers
         * body: { email, name, phone, metadata? }
         */
        createCustomer: builder.mutation({
            query: (payload) => ({
                url: "/stripe/customers",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["StripeCustomer"],
        }),

        /**
         * 2) Get customer by email or id
         * Option A: GET /stripe/customers/:id
         * Option B: GET /stripe/customers?email=...
         *
         * usage:
         *   getCustomer({ id: "cus_..." })
         *   getCustomer({ email: "a@b.com" })
         */
        getCustomer: builder.query({
            query: ({ id, email }) => {
                if (id) return `/stripe/customers/${encodeURIComponent(id)}`;
                if (email)
                    return `/stripe/customers?email=${encodeURIComponent(
                        email
                    )}`;
                // Keep deterministic: backend can decide default behavior
                return "/stripe/customers";
            },
            providesTags: (result) =>
                result?.id
                    ? [{ type: "StripeCustomer", id: result.id }]
                    : ["StripeCustomer"],
        }),

        /**
         * 3) Get all transactions for a customer
         * GET /stripe/customers/:customerId/transactions?limit=&starting_after=&ending_before=
         * (Typically backed by Stripe Charges or PaymentIntents list filtered by customer)
         */
        getCustomerTransactions: builder.query({
            query: ({
                customerId,
                limit = 20,
                starting_after,
                ending_before,
            }) => {
                const params = new URLSearchParams();
                if (limit) params.set("limit", String(limit));
                if (starting_after)
                    params.set("starting_after", starting_after);
                if (ending_before) params.set("ending_before", ending_before);

                return `/stripe/customers/${encodeURIComponent(
                    customerId
                )}/transactions?${params.toString()}`;
            },
            providesTags: (result, error, arg) => [
                { type: "StripeTransactions", id: arg.customerId },
            ],
        }),

        /**
         * 4) Get payment methods for a customer
         * GET /stripe/customers/:customerId/payment-methods?type=card
         */
        getPaymentMethods: builder.query({
            query: ({ customerId, type = "card" }) =>
                `/stripe/customers/${encodeURIComponent(
                    customerId
                )}/payment-methods?type=${encodeURIComponent(type)}`,
            providesTags: (result, error, arg) => [
                { type: "StripePaymentMethods", id: arg.customerId },
            ],
        }),

        /**
         * 5) Add payment methods for a customer
         * Best practice: you do NOT "send card details" to your server.
         * You either:
         *  - Create a SetupIntent and confirm it on client with Stripe.js, then attach PM
         *  - Or redirect to Stripe Customer Portal
         *
         * This mutation supports both patterns via server:
         * POST /stripe/customers/:customerId/payment-methods
         * body could be:
         *  A) { flow: "setup_intent" } -> returns { client_secret }
         *  B) { flow: "attach", payment_method_id: "pm_..." }
         *  C) { flow: "customer_portal", return_url }
         */
        addPaymentMethod: builder.mutation({
            query: ({ customerId, ...body }) => ({
                url: `/stripe/customers/${encodeURIComponent(
                    customerId
                )}/payment-methods`,
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "StripePaymentMethods", id: arg.customerId },
            ],
        }),

        /**
         * 6) Make a payment for a customer
         * POST /stripe/customers/:customerId/payments
         * body examples (server decides actual implementation):
         *  - { amount, currency, payment_method_id, description, metadata }
         *  - { booking_id } (recommended: payment derived server-side)
         *
         * response could be:
         *  - Checkout: { url }
         *  - PaymentIntent: { payment_intent_id, client_secret, status }
         */
        makePayment: builder.mutation({
            query: (body) => ({
                url: `/stripe/customers/payments`,
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "StripeTransactions", id: arg.customerId },
                { type: "StripePayment", id: arg.customerId },
            ],
        }),

        /**
         * 7) Get a payment details for a customer
         * GET /stripe/customers/:customerId/payments/:paymentId
         * paymentId can be: PaymentIntent id, Charge id, or your internal payment id.
         */
        getPaymentDetails: builder.query({
            query: ({ customerId, paymentId }) =>
                `/stripe/customers/${encodeURIComponent(
                    customerId
                )}/payments/${encodeURIComponent(paymentId)}`,
            providesTags: (result, error, arg) => [
                {
                    type: "StripePayment",
                    id: `${arg.customerId}:${arg.paymentId}`,
                },
            ],
        }),
    }),
});

export const {
    useCreateCustomerMutation,
    useGetCustomerQuery,
    useLazyGetCustomerQuery,
    useGetCustomerTransactionsQuery,
    useGetPaymentMethodsQuery,
    useLazyGetPaymentMethodsQuery,
    useAddPaymentMethodMutation,
    useMakePaymentMutation,
    useGetPaymentDetailsQuery,
    useLazyGetPaymentDetailsQuery,
} = stripeApi;
