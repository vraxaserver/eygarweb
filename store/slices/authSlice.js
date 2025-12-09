import { createSlice } from "@reduxjs/toolkit";

// Helper to safely get from storage
const getStoredRole = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("user_role") || "guest";
    }
    return "guest";
};

const initialState = {
    user: null,
    token: null, // Access Token
    role: "guest",
    isAuthenticated: false,
    isLoading: true,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, access, refresh } = action.payload;
            state.user = user;
            state.token = access;
            state.isAuthenticated = true;
            state.error = null;
            state.isLoading = false;

            // FIX: Prioritize the locally stored role (View Mode) over the backend default
            // unless the backend explicitly forces a specific role structure you want.
            if (typeof window !== "undefined") {
                const storedRole = localStorage.getItem("user_role");
                if (storedRole) {
                    state.role = storedRole;
                } else if (user?.role) {
                    state.role = user.role;
                } else {
                    state.role = "guest";
                }

                // Store tokens
                localStorage.setItem("access_token", access);
                if (refresh) localStorage.setItem("refresh_token", refresh);
            }
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            state.role = "guest";
            state.isAuthenticated = false;
            state.error = null;
            state.isLoading = false;

            if (typeof window !== "undefined") {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("user_role"); // Clear role on logout
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

        // Restored: Used by your Header.jsx to switch views
        updateRole: (state, action) => {
            state.role = action.payload;
            // FIX: Persist role change immediately
            if (typeof window !== "undefined") {
                localStorage.setItem("user_role", action.payload);
            }
        },

        // Initialize auth state from localStorage
        initializeAuth: (state) => {
            if (typeof window !== "undefined") {
                const token = localStorage.getItem("access_token");
                const savedRole = localStorage.getItem("user_role");

                if (token) {
                    state.token = token;
                    state.isAuthenticated = true;
                }

                if (savedRole) {
                    state.role = savedRole;
                }

                state.isLoading = false;
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
    updateRole, // Exported correctly now
    initializeAuth,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectCurrentRole = (state) => state.auth.role; // Exported correctly now
