import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

function getBookingIdFromResult(b) {
    const id = b?.id ?? b?._id ?? b?.booking_id ?? null;
    return typeof id === "string" || typeof id === "number" ? String(id) : null;
}

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
            if (token) headers.set("authorization", `Bearer ${token}`);

            return headers;
        },
    }),
    tagTypes: ["Booking"],
    endpoints: (builder) => ({
        createBooking: builder.mutation({
            query: (payload) => ({
                url: "/bookings",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: [{ type: "Booking", id: "LIST" }],
        }),

        getBookingById: builder.query({
            query: (id) => `/bookings/${id}`,
            providesTags: (result, error, id) => [
                { type: "Booking", id: String(id) },
            ],
        }),

        updateBookingPaymentSuccessful: builder.mutation({
            query: ({ bookingId, payment_details }) => ({
                url: `/bookings/${bookingId}/payment-success`,
                method: "POST",
                body: { payment_details },
            }),
            invalidatesTags: (result, error, { bookingId }) => [
                { type: "Booking", id: String(bookingId) },
                { type: "Booking", id: "LIST" },
            ],
        }),

        updateBookingCheckIn: builder.mutation({
            query: ({ bookingId }) => ({
                url: `/bookings/${bookingId}/checkin`,
                method: "POST",
            }),
            invalidatesTags: (result, error, { bookingId }) => [
                { type: "Booking", id: String(bookingId) },
                { type: "Booking", id: "LIST" },
            ],
        }),

        listBookings: builder.query({
            query: () => ({
                url: "/bookings/mine",
                method: "GET",
            }),
        }),

        cancelBooking: builder.mutation({
            query: ({ bookingId }) => ({
                url: `/bookings/${bookingId}/cancel`,
                method: "POST",
            }),
            invalidatesTags: (result, error, { bookingId }) => [
                { type: "Booking", id: String(bookingId) },
                { type: "Booking", id: "LIST" },
            ],
        }),

        listHostUpcomingBookings: builder.query({
            query: ({ limit, offset } = {}) => {
                const qs = new URLSearchParams();
                if (limit != null) qs.set("limit", String(limit));
                if (offset != null) qs.set("offset", String(offset));

                const q = qs.toString();
                return q
                    ? `/bookings/host/upcoming?${q}`
                    : "/bookings/host/upcoming";
            },
            transformResponse: (res) => {
                const items = Array.isArray(res) ? res : res?.items ?? [];
                return items.filter((x) => x && typeof x === "object");
            },
            providesTags: [{ type: "Booking", id: "LIST" }],
        }),

        hostApproveBooking: builder.mutation({
            query: ({ bookingId }) => ({
                url: `/bookings/${bookingId}/host-approve`,
                method: "POST",
            }),
            invalidatesTags: (result, error, { bookingId }) => [
                { type: "Booking", id: String(bookingId) },
                { type: "Booking", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useCreateBookingMutation,
    useGetBookingByIdQuery,
    useListBookingsQuery,
    useCancelBookingMutation,
    useUpdateBookingPaymentSuccessfulMutation,
    useUpdateBookingCheckInMutation,
    useListHostUpcomingBookingsQuery,
    useHostApproveBookingMutation,
} = bookingApi;
