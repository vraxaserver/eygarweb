// @/store/slices/locationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    checkInDate: null,
    checkOutDate: null,
    Guests: {
        totalGuest: 1,
        infant: 0,
        pet: 0,
    },
    cleaningFee: 0,
    ServiceFee: 0,
    TotalBeforeTax: 0,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        // Renaming to reflect that it's the start of the whole process
        fetchLocationStart: (state) => {
            state.status = "loading";
            state.error = null;
        },
    },
});

export const { fetchLocationStart } = cartSlice.actions;

export const selectLocation = (state) => state.location;

export default cartSlice.reducer;
