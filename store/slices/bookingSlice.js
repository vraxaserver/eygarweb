// store/slices/bookingSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    checkInDate: null, // ISO String
    checkOutDate: null, // ISO String
    guests: {
        adults: 1,
        children: 0,
        infants: 0,
        pets: 0,
    },
};

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        setBookingDates: (state, action) => {
            // action.payload: { checkIn: string, checkOut: string }
            state.checkInDate = action.payload.checkIn;
            state.checkOutDate = action.payload.checkOut;
        },
        setBookingGuests: (state, action) => {
            // action.payload: { adults, children, infants, pets }
            state.guests = action.payload;
        },
        resetBooking: (state) => {
            return initialState;
        },
    },
});

export const { setBookingDates, setBookingGuests, resetBooking } =
    bookingSlice.actions;

// Selectors
export const selectBookingDates = (state) => ({
    checkIn: state.booking.checkInDate,
    checkOut: state.booking.checkOutDate,
});
export const selectBookingGuests = (state) => state.booking.guests;

export default bookingSlice.reducer;
