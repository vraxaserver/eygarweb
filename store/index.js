import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { propertiesApi } from "@/store/features/propertiesApi";
import searchReducer from "@/store/slices/searchSlice";
import { authApi } from "@/store/features/authApi";
import authReducer from "@/store/slices/authSlice";
import locationReducer from "@/store/slices/locationSlice"; 
import { profileApi } from "@/store/features/profileApi";
import { categoryApi } from '@/store/features/categoryApi';
import { experiencesApi } from "@/store/features/experienceApi";
import { vendorProfileApi } from "@/store/features/vendorProfileApi";
import { vendorServiceApi } from "./features/vendorServiceApi";
import { vendorCouponApi } from "./features/vendorCouponApi";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        search: searchReducer,
        location: locationReducer,
        [authApi.reducerPath]: authApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,
        [propertiesApi.reducerPath]: propertiesApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [experiencesApi.reducerPath]: experiencesApi.reducer,
        [vendorProfileApi.reducerPath]: vendorProfileApi.reducer,
        [vendorServiceApi.reducerPath]: vendorServiceApi.reducer,
        [vendorCouponApi.reducerPath]: vendorCouponApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", 'persist/REHYDRATE',],
            },
        }).concat(
            propertiesApi.middleware, 
            authApi.middleware, 
            profileApi.middleware, 
            categoryApi.middleware,
            experiencesApi.middleware,
            vendorProfileApi.middleware,
            vendorServiceApi.middleware,
            vendorCouponApi.middleware
        ),
    devTools: process.env.NODE_ENV !== 'production',
});

setupListeners(store.dispatch);
