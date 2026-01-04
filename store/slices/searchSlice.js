import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    totalResults: 0,
    currentPage: 1,
    location: {
        name: "",
        country: "",
        city: "",
        lat: null,
        long: null,
    },
    filters: {
        checkIn: null,
        checkOut: null,
        guests: {
            adults: 1,
            children: 0,
            pets: 0,
        },
        priceRange: [0, 10000],
        propertyType: "",
        placeType: "",
        badges: [],
        amenities: [],
        categories: [],
    },
    sortBy: "price_low_high",
};

const toggleItem = (array, item) => {
    const index = array.indexOf(item);
    if (index === -1) {
        return [...array, item]; // add
    } else {
        return array.filter((i) => i !== item); // remove
    }
};

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setLocation: (state, action) => {
            state.filters.location = action.payload;
        },
        setCheckIn: (state, action) => {
            state.filters.checkIn = action.payload;
        },
        setCheckOut: (state, action) => {
            state.filters.checkOut = action.payload;
        },
        setGuests: (state, action) => {
            state.filters.guests = action.payload;
        },
        setPriceRange: (state, action) => {
            state.filters.priceRange = action.payload;
        },
        setPropertyType: (state, action) => {
            state.filters.propertyType = action.payload;
        },
        setPlaceType: (state, action) => {
            state.filters.placeType = action.payload;
        },
        setBadges: (state, action) => {
            // Merge or toggle badges
            const { payload } = action;
            if (Array.isArray(payload)) {
                state.filters.badges = [
                    ...new Set([...state.filters.badges, ...payload]),
                ];
            } else {
                state.filters.badges = toggleItem(
                    state.filters.badges,
                    payload
                );
            }
        },
        setAmenities: (state, action) => {
            const { payload } = action;
            if (Array.isArray(payload)) {
                state.filters.amenities = [
                    ...new Set([...state.filters.amenities, ...payload]),
                ];
            } else {
                state.filters.amenities = toggleItem(
                    state.filters.amenities,
                    payload
                );
            }
        },
        setCategories: (state, action) => {
            const { payload } = action;
            if (Array.isArray(payload)) {
                state.filters.categories = [
                    ...new Set([...state.filters.categories, ...payload]),
                ];
            } else {
                state.filters.categories = toggleItem(
                    state.filters.categories,
                    payload
                );
            }
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
        clearSearch: () => initialState,
    },
});

export const {
    setLocation,
    setCheckIn,
    setCheckOut,
    setGuests,
    setPriceRange,
    setPropertyType,
    setPlaceType,
    setBadges,
    setAmenities,
    setCategories,
    setLoading,
    setFilters,
    setSortBy,
    setCurrentPage,
    setTotalResults,
    clearSearch,
} = searchSlice.actions;

export default searchSlice.reducer;
