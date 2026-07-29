"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Phone, Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react";
import { useSignupMutation } from "@/store/features/authApi";
import { useSelector } from "react-redux";
import { selectPendingVerification } from "@/store/slices/authSlice";
import PhoneInputWithCountry from "@/components/ui/PhoneInputWithCountry";

const SignupPage = () => {
    const router = useRouter();
    const [signup, { isLoading }] = useSignupMutation();
    const pendingVerification = useSelector(selectPendingVerification);

    const [activeTab, setActiveTab] = useState("email"); // "email" | "phone"
    const [countryCode, setCountryCode] = useState("+974");
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        password: "",
        confirm_password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");

    // If verification is pending (user registered but not yet verified),
    // redirect to the activation page inside an effect to avoid calling
    // router.replace() during render (which triggers React's setState-in-render warning).
    useEffect(() => {
        if (pendingVerification?.user_id) {
            router.replace(
                `/activate?user_id=${pendingVerification.user_id}&identifier_type=${pendingVerification.identifier_type}&email_or_phone=${encodeURIComponent(pendingVerification.email_or_phone || "")}`
            );
        }
    }, [pendingVerification, router]);

    // Password validation rules
    const validatePassword = (password) => ({
        minLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });

    const passwordRules = validatePassword(formData.password);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
        if (apiError) setApiError("");
    };

    const validateForm = () => {
        const newErrors = {};
        const { email, phone, password, confirm_password } = formData;

        if (activeTab === "email") {
            if (!email.trim()) {
                newErrors.email = "Email address is required";
            } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
                newErrors.email = "Please enter a valid email address";
            }
        } else {
            if (!phone.trim()) {
                newErrors.phone = "Phone number is required";
            } else {
                const digits = phone.replace(/\D/g, "");
                if (digits.length < 7 || digits.length > 15) {
                    newErrors.phone = "Please enter a valid phone number (7 to 15 digits)";
                }
            }
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (!confirm_password) {
            newErrors.confirm_password = "Please confirm your password";
        } else if (password !== confirm_password) {
            newErrors.confirm_password = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setApiError("");

        const email_or_phone =
            activeTab === "email"
                ? formData.email.trim()
                : `${countryCode}${formData.phone.trim()}`;

        const payload = {
            email_or_phone,
            password: formData.password,
            confirm_password: formData.confirm_password,
        };

        try {
            const result = await signup(payload).unwrap();
            router.push(
                `/activate?user_id=${result.user_id}&identifier_type=${result.identifier_type}&email_or_phone=${encodeURIComponent(email_or_phone)}`
            );
        } catch (error) {
            console.log("Signup error:", error);
            if (error?.data?.errors) {
                setErrors(error.data.errors);
            } else if (error?.data?.detail) {
                setApiError(error.data.detail);
            } else if (error?.data?.message) {
                setApiError(error.data.message);
            } else if (error?.data?.email_or_phone?.[0]) {
                setApiError(error.data.email_or_phone[0]);
            } else if (error?.message) {
                setApiError(error.message);
            } else {
                setApiError("An error occurred during signup. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <User className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-600">Join us today and get started</p>
                </div>

                {/* Signup Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {/* API Error Alert */}
                    {apiError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <p className="text-red-700 text-sm">{apiError}</p>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 mb-6">
                        <button
                            type="button"
                            onClick={() => {
                                setActiveTab("email");
                                setErrors({});
                                setApiError("");
                            }}
                            className={`flex-1 py-2.5 text-center font-medium text-sm border-b-2 transition-colors ${
                                activeTab === "email"
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Email Signup
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setActiveTab("phone");
                                setErrors({});
                                setApiError("");
                            }}
                            className={`flex-1 py-2.5 text-center font-medium text-sm border-b-2 transition-colors ${
                                activeTab === "phone"
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Phone Signup
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Email or Phone Tab Fields */}
                        {activeTab === "email" ? (
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                            errors.email
                                                ? "border-red-300 bg-red-50"
                                                : "border-gray-300 hover:border-gray-400"
                                        }`}
                                        placeholder="Enter Email Address (e.g. name@domain.com - max 100 chars)"
                                        maxLength={100}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                    GCC Phone Number *
                                </label>
                                <PhoneInputWithCountry
                                    countryCode={countryCode}
                                    onCountryCodeChange={setCountryCode}
                                    value={formData.phone}
                                    onChange={(e) => {
                                        setFormData((prev) => ({ ...prev, phone: e.target.value }));
                                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                                        if (apiError) setApiError("");
                                    }}
                                    placeholder="Enter Mobile Number (e.g. 55123456 - max 15 digits)"
                                />
                                {errors.phone && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.phone}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Password Field */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
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
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        errors.password
                                            ? "border-red-300 bg-red-50"
                                            : "border-gray-300 hover:border-gray-400"
                                    }`}
                                    placeholder="Create a strong password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.password}
                                </p>
                            )}

                            {/* Password Requirements */}
                            {formData.password && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs font-medium text-gray-700 mb-2">Password Requirements:</p>
                                    <div className="space-y-1">
                                        {Object.entries({
                                            minLength: "At least 8 characters",
                                            hasUpperCase: "One uppercase letter",
                                            hasLowerCase: "One lowercase letter",
                                            hasNumber: "One number",
                                            hasSpecialChar: "One special character",
                                        }).map(([key, label]) => (
                                            <div key={key} className="flex items-center gap-2">
                                                {passwordRules[key] ? (
                                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                                ) : (
                                                    <div className="w-3 h-3 rounded-full border border-gray-300" />
                                                )}
                                                <span className={`text-xs ${passwordRules[key] ? "text-green-600" : "text-gray-500"}`}>
                                                    {label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirm_password"
                                    name="confirm_password"
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        errors.confirm_password
                                            ? "border-red-300 bg-red-50"
                                            : "border-gray-300 hover:border-gray-400"
                                    }`}
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            {errors.confirm_password && (
                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.confirm_password}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Creating Account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </div>

                    {/* Login & Forgot Password Links */}
                    <div className="mt-6 text-center space-y-2">
                        <p className="text-gray-600 text-sm">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                            >
                                Sign in here
                            </Link>
                        </p>
                        <p className="text-gray-600 text-sm">
                            Forgot your password?{" "}
                            <Link
                                href="/forgot-password"
                                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                            >
                                Reset it here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-xs text-gray-500">
                        By creating an account, you agree to our{" "}
                        <Link href="/terms" className="text-blue-600 hover:underline">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-blue-600 hover:underline">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;