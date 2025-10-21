import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    searchResults: [],
    searchQuery: '',
    loading: false,
    totalResults: 0,
    currentPage: 1,
    location: {
        name: "",
        country: "",
        city: "",
        lat: null,
        lon: null
    },
    filters: {
        checkIn: null,
        checkOut: null,
        guests: {
            adults: 1,
            children: 0,
            pets: 0
        },
        priceRange: [0, 1000],
        propertyType: '',
        placeType: '',
        badges: [],
        amenities: [],
        categories: [],
    },
    sortBy: 'price_low_high',
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setLocation: (state, action) => {
            state.location = action.payload;
        },
        setDates: (state, action) => {
            state.filters.checkIn = action.payload.checkIn;
            state.filters.checkOut = action.payload.checkOut;
        },
        setGuests: (state, action) => {
            state.filters.guests = action.payload;
        },
        setSearchResults: (state, action) => {
            state.searchResults = action.payload;
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        setSortBy: (state, action) => {
            state.sortBy = action.payload;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        setTotalResults: (state, action) => {
            state.totalResults = action.payload;
        },
        clearSearch: (state) => {
            state.searchResults = [];
            state.searchQuery = '';
            state.totalResults = 0;
            state.currentPage = 1;
        },
    },
});

export const {
    setLocation,
    setDates,
    setGuests,
    setSearchResults,
    setSearchQuery,
    setLoading,
    setFilters,
    setSortBy,
    setCurrentPage,
    setTotalResults,
    clearSearch,
} = searchSlice.actions;

export default searchSlice.reducer;
