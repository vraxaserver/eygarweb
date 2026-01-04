import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { authApi } from "@/store/features/authApi";
import { profileApi } from "@/store/features/hostProfileApi";
import { propertiesApi } from "@/store/features/propertiesApi";
import { categoryApi } from "@/store/features/categoryApi";
import { experiencesApi } from "@/store/features/experienceApi";
import { vendorProfileApi } from "@/store/features/vendorProfileApi";
import { vendorServiceApi } from "@/store/features/vendorServiceApi";
import { vendorCouponApi } from "@/store/features/vendorCouponApi";
import { stripeApi } from "@/store/features/stripeApi";
import { paymentApi } from "@/store/features/paymentApi";
import { bookingApi } from "@/store/features/bookingApi";
import { amenitiesApi } from "@/store/features/amenitiesApi";

import searchReducer from "@/store/slices/searchSlice";
import authReducer from "@/store/slices/authSlice";
import locationReducer from "@/store/slices/locationSlice";
import bookingReducer from "@/store/slices/bookingSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        search: searchReducer,
        location: locationReducer,
        booking: bookingReducer,
        [authApi.reducerPath]: authApi.reducer,
        [stripeApi.reducerPath]: stripeApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,
        [propertiesApi.reducerPath]: propertiesApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [experiencesApi.reducerPath]: experiencesApi.reducer,
        [vendorProfileApi.reducerPath]: vendorProfileApi.reducer,
        [vendorServiceApi.reducerPath]: vendorServiceApi.reducer,
        [vendorCouponApi.reducerPath]: vendorCouponApi.reducer,
        [paymentApi.reducerPath]: paymentApi.reducer,
        [bookingApi.reducerPath]: bookingApi.reducer,
        [amenitiesApi.reducerPath]: amenitiesApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
            },
        }).concat(
            propertiesApi.middleware,
            authApi.middleware,
            profileApi.middleware,
            categoryApi.middleware,
            experiencesApi.middleware,
            vendorProfileApi.middleware,
            vendorServiceApi.middleware,
            vendorCouponApi.middleware,
            stripeApi.middleware,
            paymentApi.middleware,
            bookingApi.middleware,
            amenitiesApi.middleware
        ),
    devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);
