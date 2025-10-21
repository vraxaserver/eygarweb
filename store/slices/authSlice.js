import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null,
    role: 'guest',
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Action to set user credentials after login
        setCredentials: (state, action) => {
            const { user, access, refresh } = action.payload;
            state.user = user;
            state.token = access;
            state.role = 'guest'
            state.isAuthenticated = true;
            state.error = null;

            // Store tokens in localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('access_token', access);
                if (refresh) {
                    localStorage.setItem('refresh_token', refresh);
                }
            }
        },

        // Action to log out
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.role = "guest";
            state.isAuthenticated = false;
            state.error = null;
            
            // Clear tokens from localStorage
            if (typeof window !== 'undefined') {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
            }
        },

        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        
        setError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        
        clearError: (state) => {
            state.error = null;
        },
        
        updateRole: (state, action) => {
            console.log("Inside updateRole: action ",action)
            state.role = action.payload;
        },

        // Initialize auth state from localStorage
        initializeAuth: (state) => {
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('access_token');
                
                if (token) {
                    state.token = token;
                    state.isAuthenticated = true;
                    state.role = "guest"
                }
                console.log("State Initialized: ", state)
            }
        },
    },
});

export const {
  setCredentials,
  logout,
  setLoading,
  setError,
  clearError,
  updateRole,
  initializeAuth,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentRole = (state) => state.auth.role;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
