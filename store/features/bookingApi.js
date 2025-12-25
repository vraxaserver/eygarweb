import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bookingApi = createApi({
    reducerPath: "bookingApi",
    baseQuery: fetchBaseQuery({
        baseUrl:
            process.env.NEXT_PUBLIC_BOOKING_API_URL ||
            "http://localhost:3007/api/v1",
        prepareHeaders: (headers, { getState }) => {
            headers.set("Content-Type", "application/json");
            headers.set("Accept", "application/json");

            const token = getState().auth?.token;

            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }

            return headers;
        },
    }),
    tagTypes: ["Booking"],
    endpoints: (builder) => ({
        /** Create booking */
        createBooking: builder.mutation({
            query: (payload) => ({
                url: "/bookings",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["Booking"],
        }),

        /** Get booking by ID */
        getBookingById: builder.query({
            query: (id) => `/bookings/${id}`,
            providesTags: (result, error, id) => [{ type: "Booking", id }],
        }),

        /** Get booking by ID */
        updateBookingPaymentSuccessful: builder.mutation({
            query: ({ bookingId, payment_details }) => ({
                url: `/bookings/${bookingId}/payment-success`,
                method: "POST",
                body: { payment_details },
            }),
        }),

        /** List bookings */
        listBookings: builder.query({
            query: () => "/bookings/mine",
            transformResponse: (res) =>
                Array.isArray(res) ? res : res.items ?? [],
            providesTags: ["Booking"],
        }),

        /** Cancel booking */
        cancelBooking: builder.mutation({
            query: ({ bookingId }) => ({
                url: `/bookings/${bookingId}/cancel`,
                method: "POST",
            }),
            invalidatesTags: ["Booking"],
        }),
    }),
});

export const {
    useCreateBookingMutation,
    useGetBookingByIdQuery,
    useListBookingsQuery,
    useCancelBookingMutation,
    useUpdateBookingPaymentSuccessfulMutation,
} = bookingApi;
