"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Eye, EyeOff, Phone, Lock, AlertCircle } from "lucide-react";
import { useLoginMutation } from "@/store/features/authApi";
import { selectAuthError, clearError } from "@/store/slices/authSlice";

const LoginForm = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const searchParams = useSearchParams();

    const [formData, setFormData] = useState({ email_or_phone: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    const [login, { isLoading }] = useLoginMutation();
    const authError = useSelector(selectAuthError);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (authError) dispatch(clearError());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send { email_or_phone, password } — backend accepts phone or email
            await login(formData).unwrap();

            // Redirect to the page the user came from, or dashboard
            const returnUrl = searchParams?.get("redirectTo") || "/dashboard";
            router.replace(returnUrl);
        } catch (error) {
            // Error is dispatched to Redux by onQueryStarted in authApi.js
            console.error("Login failed:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Global auth error */}
            {authError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-700 text-sm">
                        {typeof authError === "string" ? authError : "Invalid credentials. Please try again."}
                    </p>
                </div>
            )}

            {/* Email or Phone field */}
            <div>
                <label htmlFor="email_or_phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Email or Phone Number
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        id="email_or_phone"
                        name="email_or_phone"
                        value={formData.email_or_phone}
                        onChange={handleChange}
                        required
                        autoComplete="username"
                        placeholder="Email or phone (e.g. +97451235119)"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
                    />
                </div>
            </div>

            {/* Password field */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                    </button>
                </div>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Signing in…
                    </>
                ) : (
                    "Sign In"
                )}
            </button>
        </form>
    );
};

export default LoginForm;
