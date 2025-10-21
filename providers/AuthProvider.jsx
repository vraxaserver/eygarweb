import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    initializeAuth,
    selectIsAuthenticated,
    selectCurrentToken,
    selectCurrentUser,
    logout
} from "@/store/slices/authSlice";
import { useGetProfileQuery } from "@/store/features/authApi";

const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const [isInitialized, setIsInitialized] = useState(false);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const token = useSelector(selectCurrentToken);
    

    // Initialize auth state from localStorage on app start
    useEffect(() => {
        console.log('🚀 AuthProvider: Initializing...');
        dispatch(initializeAuth());
        setIsInitialized(true);
    }, [dispatch]);

    // Fetch user profile if token exists but no user data
    const {
        data: profileData,
        isLoading: profileLoading,
        error: profileError,
        isSuccess: profileSuccess,
    } = useGetProfileQuery(undefined, {
        skip: !isAuthenticated || !token,
    });

    // Handle profile fetch errors (token might be invalid)
    useEffect(() => {
        if (profileError?.status === 401) {
            dispatch(logout());
        }
    }, [profileError, dispatch]);

    // Show loading spinner during initial auth check
    if (!isInitialized) {
        return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        );
    }

    return (
        <>
            {/* Global loading indicator for profile fetch */}
            {profileLoading && (
                <div className="fixed top-4 right-4 z-50">
                    <div className="bg-blue-100 border border-blue-300 text-blue-800 px-3 py-2 rounded-lg shadow-md flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm">Loading profile...</span>
                    </div>
                </div>
            )}
            
            {/* Your app content */}
            {children}
        </>
    );
};

export default AuthProvider;
