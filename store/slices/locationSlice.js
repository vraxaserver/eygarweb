// @/store/slices/locationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    latitude: null,
    longitude: null,
    cityName: null,           // Local/Arabic city name
    formattedAddress: null,   // Local/Arabic full formatted address
    cityNameEn: null,         // New field for the extracted city name (English)
    formattedAddressEn: null, // New field for the full formatted address (English)
    status: 'idle',           // 'idle' | 'loading' | 'success' | 'error'
    error: null,
};

const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        // Renaming to reflect that it's the start of the whole process
        fetchLocationStart: (state) => {
            state.status = 'loading';
            state.error = null;
        },
        // Action now expects full location data (coordinates + names for both languages)
        fetchLocationSuccess: (state, action) => {
            state.status = 'success';
            state.latitude = action.payload.latitude;
            state.longitude = action.payload.longitude;
            state.cityName = action.payload.cityName;
            state.formattedAddress = action.payload.formattedAddress;
            state.cityNameEn = action.payload.cityNameEn;       // Store English City Name
            state.formattedAddressEn = action.payload.formattedAddressEn; // Store English Formatted Address
        },
        // Action to store an error message
        fetchLocationFailure: (state, action) => {
            state.status = 'error';
            state.error = action.payload;
            state.latitude = null;
            state.longitude = null;
            state.cityName = null;
            state.formattedAddress = null;
            state.cityNameEn = null;        // Reset English fields on failure
            state.formattedAddressEn = null; // Reset English fields on failure
        },
    },
});

export const { 
    fetchLocationStart, 
    fetchLocationSuccess, 
    fetchLocationFailure 
} = locationSlice.actions;

export const selectLocation = (state) => state.location;

export default locationSlice.reducer;
