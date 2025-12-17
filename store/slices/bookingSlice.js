// store/slices/bookingSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    bookingDates: {
        checkInDate: null,
        checkOutDate: null,
    }, // ISO String
    guests: {
        adults: 1,
        children: 0,
        infants: 0,
        pets: 0,
    },
    fees: {
        total_amount: 0,
        subtotal: 0,
        price_per_night: 0,
        nights: 1,
        currency: "QAR",
        cleaning_fee: 0,
        service_fee: 0,
    },
    property_id: null,
};

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        setBookingDates: (state, action) => {
            // action.payload: { checkIn: string }
            state.bookingDates.checkInDate = action.payload.checkIn;
            state.bookingDates.checkOutDate = action.payload.checkOut;
        },
        setBookingGuests: (state, action) => {
            // action.payload: { adults, children, infants, pets }
            state.guests = action.payload;
        },
        setFees: (state, action) => {
            // action.payload: { total_amount, total_stay, currency, cleaning, service }
            state.fees = action.payload;
        },
        setPropertyId: (state, action) => {
            // action.payload: { id }
            state.property_id = action.payload;
        },

        resetBooking: (state) => {
            return initialState;
        },
    },
});

export const {
    setBookingDates,
    setBookingGuests,
    setFees,
    setPropertyId,
    resetBooking,
} = bookingSlice.actions;

// Selectors
export const selectBookingDates = (state) => state.booking.bookingDates;
export const selectBookingGuests = (state) => state.booking.guests;
export const selectBookingFees = (state) => state.booking.fees;

export const selectBooking = (state) => state.booking;

export default bookingSlice.reducer;
