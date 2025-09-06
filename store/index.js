import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import searchReducer from './slices/searchSlice';


export const store = configureStore({
    reducer: {
        search: searchReducer,
    }
});

setupListeners(store.dispatch);