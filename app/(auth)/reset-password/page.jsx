"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    KeyRound,
    Lock,
    Eye,
    EyeOff,
    CheckCircle,
    AlertCircle,
    ArrowLeft,
    Clock,
    RefreshCw,
    ShieldCheck,
} from "lucide-react";
import {
    useResetPasswordMutation,
    useForgotPasswordMutation,
} from "@/store/features/authApi";

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const initialIdentifier = searchParams.get("email_or_phone") || searchParams.get("email") || "";
    const initialCode = searchParams.get("code") || "";

    const [emailOrPhone, setEmailOrPhone] = useState(initialIdentifier);
    const [code, setCode] = useState(initialCode);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [validationError, setValidationError] = useState("");
    const [apiError, setApiError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    // 15-minute Countdown Timer (900 seconds)
    const [timeLeft, setTimeLeft] = useState(900);
    const [timerActive, setTimerActive] = useState(true);

    const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();
    const [forgotPassword, { isLoading: isResending }] = useForgotPasswordMutation();
    const [resendSuccess, setResendSuccess] = useState("");

    // Sync searchParams if navigated with query string
    useEffect(() => {
        if (!emailOrPhone && initialIdentifier) {
            setEmailOrPhone(initialIdentifier);
        }
        if (!code && initialCode) {
            setCode(initialCode);
        }
    }, [initialIdentifier, initialCode]);

    // Timer Interval
    useEffect(() => {
        let timer;
        if (timerActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setTimerActive(false);
        }
        return () => clearInterval(timer);
    }, [timerActive, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // Password strength rules
    const validatePassword = (password) => ({
        minLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });

    const passwordRules = validatePassword(newPassword);

    const validateForm = () => {
        setValidationError("");
        setApiError("");

        if (!emailOrPhone.trim()) {
            setValidationError("Email or Phone number is required.");
            return false;
        }

        if (!code.trim()) {
            setValidationError("Verification code is required.");
            return false;
        }

        const cleanCode = code.trim();
        if (cleanCode.length !== 6 || !/^\d+$/.test(cleanCode)) {
            setValidationError("Verification code must be exactly 6 digits.");
            return false;
        }

        if (!newPassword) {
            setValidationError("New password is required.");
            return false;
        }

        if (newPassword.length < 8) {
            setValidationError("New password must be at least 8 characters long.");
            return false;
        }

        if (!confirmPassword) {
            setValidationError("Please confirm your new password.");
            return false;
        }

        if (newPassword !== confirmPassword) {
            setValidationError("Passwords do not match.");
            return false;
        }

        if (timeLeft === 0) {
            setValidationError("The verification code has expired. Please request a new code.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = {
            email_or_phone: emailOrPhone.trim(),
            code: code.trim(),
            new_password: newPassword,
            confirm_password: confirmPassword,
        };

        try {
            await resetPassword(payload).unwrap();
            setIsSuccess(true);
            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (error) {
            console.error("Reset password error:", error);
            if (error?.data?.detail) {
                setApiError(error.data.detail);
            } else if (error?.data?.message) {
                setApiError(error.data.message);
            } else if (error?.data?.non_field_errors?.[0]) {
                setApiError(error.data.non_field_errors[0]);
            } else if (error?.data?.code?.[0]) {
                setApiError(`Verification Code Error: ${error.data.code[0]}`);
            } else {
                setApiError("Failed to reset password. Please check your verification code and try again.");
            }
        }
    };

    const handleResendCode = async () => {
        if (!emailOrPhone.trim()) {
            setValidationError("Please provide your email or phone number to resend the code.");
            return;
        }

        setValidationError("");
        setApiError("");
        setResendSuccess("");

        try {
            await forgotPassword(emailOrPhone.trim()).unwrap();
            setResendSuccess("A new reset code has been sent!");
            setTimeLeft(900); // Reset 15 minute timer
            setTimerActive(true);
            setTimeout(() => setResendSuccess(""), 4000);
        } catch (error) {
            console.error("Resend code failed:", error);
            setApiError(
                error?.data?.detail ||
                error?.data?.message ||
                "Failed to resend reset code. Please try again."
            );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back Link */}
                <div className="mb-6">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Sign In
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <KeyRound className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Reset Password
                    </h1>
                    <p className="text-gray-600">
                        Enter your 6-digit code and set your new password.
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {isSuccess ? (
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <ShieldCheck className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Password Reset Complete!
                                </h2>
                                <p className="text-gray-600 text-sm">
                                    Your password has been successfully updated. You will be redirected to the sign-in page shortly.
                                </p>
                            </div>
                            <Link
                                href="/login"
                                className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all text-center"
                            >
                                Sign In Now
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                            {/* Error / Resend Alerts */}
                            {(validationError || apiError) && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                    <p className="text-red-700 text-sm">
                                        {validationError || apiError}
                                    </p>
                                </div>
                            )}

                            {resendSuccess && (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                    <p className="text-green-700 text-sm">{resendSuccess}</p>
                                </div>
                            )}

                            {/* Timer Notice */}
                            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-2 text-blue-700 text-sm">
                                    <Clock className="w-4 h-4" />
                                    <span>Code Expiration:</span>
                                </div>
                                <span
                                    className={`font-mono font-bold text-sm ${
                                        timeLeft < 180 ? "text-red-600 animate-pulse" : "text-blue-700"
                                    }`}
                                >
                                    {timeLeft > 0 ? formatTime(timeLeft) : "Expired"}
                                </span>
                            </div>

                            {/* Identifier Field */}
                            <div>
                                <label
                                    htmlFor="email_or_phone"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Email Address or Phone Number *
                                </label>
                                <input
                                    type="text"
                                    id="email_or_phone"
                                    name="email_or_phone"
                                    value={emailOrPhone}
                                    onChange={(e) => {
                                        setEmailOrPhone(e.target.value);
                                        if (validationError) setValidationError("");
                                        if (apiError) setApiError("");
                                    }}
                                    placeholder="Enter your registered email or phone number"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
                                />
                            </div>

                            {/* 6-Digit Code Field */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label
                                        htmlFor="code"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        6-Digit Reset Code *
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleResendCode}
                                        disabled={isResending}
                                        className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline flex items-center gap-1 transition-colors disabled:opacity-50"
                                    >
                                        <RefreshCw
                                            className={`w-3 h-3 ${
                                                isResending ? "animate-spin" : ""
                                            }`}
                                        />
                                        Resend Code
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    id="code"
                                    name="code"
                                    value={code}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                                        setCode(val);
                                        if (validationError) setValidationError("");
                                        if (apiError) setApiError("");
                                    }}
                                    maxLength={6}
                                    placeholder="123456"
                                    className="w-full tracking-widest text-center text-lg font-mono py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                            </div>

                            {/* New Password Field */}
                            <div>
                                <label
                                    htmlFor="newPassword"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    New Password *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        id="newPassword"
                                        name="newPassword"
                                        value={newPassword}
                                        onChange={(e) => {
                                            setNewPassword(e.target.value);
                                            if (validationError) setValidationError("");
                                            if (apiError) setApiError("");
                                        }}
                                        placeholder="Enter new password"
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>

                                {/* Password Strength Rules */}
                                {newPassword && (
                                    <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-1">
                                        <p className="text-xs font-medium text-gray-700 mb-1">
                                            Password Requirements:
                                        </p>
                                        {Object.entries({
                                            minLength: "At least 8 characters",
                                            hasUpperCase: "One uppercase letter",
                                            hasLowerCase: "One lowercase letter",
                                            hasNumber: "One number",
                                            hasSpecialChar: "One special character",
                                        }).map(([key, label]) => (
                                            <div key={key} className="flex items-center gap-2">
                                                {passwordRules[key] ? (
                                                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                                ) : (
                                                    <div className="w-3.5 h-3.5 rounded-full border border-gray-300" />
                                                )}
                                                <span
                                                    className={`text-xs ${
                                                        passwordRules[key]
                                                            ? "text-green-600 font-medium"
                                                            : "text-gray-500"
                                                    }`}
                                                >
                                                    {label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Confirm New Password *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            if (validationError) setValidationError("");
                                            if (apiError) setApiError("");
                                        }}
                                        placeholder="Confirm new password"
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isResetting}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isResetting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                        Resetting Password…
                                    </>
                                ) : (
                                    "Set New Password"
                                )}
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer Links */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        Remembered your password?{" "}
                        <Link
                            href="/login"
                            className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                        >
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
