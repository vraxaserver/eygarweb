/**
 * Authentication utility functions
 */

// Check if user is authenticated
export const isAuthenticated = () => {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("access_token");
    return !!token;
};

// Get stored tokens
export const getTokens = () => {
    if (typeof window === "undefined")
        return { accessToken: null, refreshToken: null };

    return {
        accessToken: localStorage.getItem("access_token"),
        refreshToken: localStorage.getItem("refresh_token"),
    };
};

// Clear stored tokens
export const clearTokens = () => {
    if (typeof window === "undefined") return;

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
};

// Store tokens
export const storeTokens = (accessToken, refreshToken) => {
    if (typeof window === "undefined") return;

    localStorage.setItem("access_token", accessToken);
    if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken);
    }
};

// Decode JWT token (simple implementation, consider using a library like jwt-decode for production)
export const decodeToken = (token) => {
    if (!token) return null;

    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(
                    (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                )
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};

// Check if token is expired
export const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
};

// Get user role from token
export const getUserRole = (token) => {
    const decoded = decodeToken(token);
    return decoded?.role || decoded?.user_type || "user";
};

// Check if user has specific permission
export const hasPermission = (token, permission) => {
    const decoded = decodeToken(token);
    const permissions = decoded?.permissions || [];
    return permissions.includes(permission);
};

// Redirect to login with return URL
export const redirectToLogin = (returnUrl = null) => {
    if (typeof window === "undefined") return;

    const currentUrl =
        returnUrl || window.location.pathname + window.location.search;
    const loginUrl = `/login?returnUrl=${encodeURIComponent(currentUrl)}`;
    window.location.href = loginUrl;
};

// Auth middleware for API calls
export const withAuth = (apiCall) => {
    return async (...args) => {
        const { accessToken } = getTokens();

        if (!accessToken || isTokenExpired(accessToken)) {
            redirectToLogin();
            throw new Error("Authentication required");
        }

        return apiCall(...args);
    };
};

// Format user display name
export const getUserDisplayName = (user) => {
    if (!user) return "Guest";

    if (user.first_name && user.last_name) {
        return `${user.first_name} ${user.last_name}`;
    }

    if (user.first_name) {
        return user.first_name;
    }

    if (user.email) {
        return user.email.split("@")[0];
    }

    return "User";
};

// Get user initials for avatar
export const getUserInitials = (user) => {
    if (!user) return "G";

    if (user.first_name && user.last_name) {
        return `${user.first_name.charAt(0)}${user.last_name.charAt(
            0
        )}`.toUpperCase();
    }

    if (user.first_name) {
        return user.first_name.charAt(0).toUpperCase();
    }

    if (user.email) {
        return user.email.charAt(0).toUpperCase();
    }

    return "U";
};
