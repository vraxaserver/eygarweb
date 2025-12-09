"use client";

import React, { useState, useEffect } from "react"; // Added useEffect
import { useRouter, useSearchParams } from "next/navigation"; // Use useSearchParams
import { useSelector } from "react-redux";
import { useLoginMutation } from "@/store/features/authApi";
import { selectAuthError } from "@/store/slices/authSlice";

const LoginForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    const [login, { isLoading }] = useLoginMutation();
    const authError = useSelector(selectAuthError);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // unwrap() throws an error if the promise is rejected
            await login(formData).unwrap();

            // Get return URL or default to dashboard
            const returnUrl = searchParams.get("returnUrl") || "/dashboard";

            // Use replace instead of push prevents user from going 'back' to login page
            router.replace(returnUrl);
        } catch (error) {
            console.error("Login failed:", error);
            // Error is displayed via useSelector(selectAuthError)
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

            {authError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                    {typeof authError === "string"
                        ? authError
                        : "Invalid email or password"}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Inputs remain the same as your code */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            {/* SVG Icons remain same */}
                            <span className="text-gray-500 text-xs">
                                {showPassword ? "Hide" : "Show"}
                            </span>
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Logging in..." : "Login"}
                </button>
            </form>
            {/* Links remain same */}
        </div>
    );
};

export default LoginForm;
